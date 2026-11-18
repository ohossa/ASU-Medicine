import { d1Query, d1Execute } from '../server/d1-client.js';

async function reconcileAllXP() {
  console.log('🔄 Running Self-Healing XP Reconciliation across all 308 students in Cloudflare D1...');

  const profiles = await d1Query<any>('SELECT user_id, xp, competitive_xp, level, alias FROM learning_profiles');
  const allEntries = await d1Query<any>('SELECT user_id, question_id, correct, ever_correct FROM learning_entries WHERE correct = 1 OR ever_correct = 1');

  // Group correct answers by user
  const userCorrectMap = new Map<string, Set<string>>();
  for (const entry of allEntries) {
    if (!userCorrectMap.has(entry.user_id)) {
      userCorrectMap.set(entry.user_id, new Set());
    }
    userCorrectMap.get(entry.user_id)!.add(entry.question_id);
  }

  let healedCount = 0;
  let totalXpAdded = 0;

  for (const profile of profiles) {
    const userId = profile.user_id;
    const uniqueCorrectCount = userCorrectMap.get(userId)?.size ?? 0;
    const earnedXpFromEntries = uniqueCorrectCount * 10;

    if (earnedXpFromEntries > (profile.xp || 0)) {
      const newXp = Math.max(profile.xp || 0, earnedXpFromEntries);
      const newCompXp = Math.max(profile.competitive_xp || 0, earnedXpFromEntries);
      const newLevel = Math.floor(newXp / 500) + 1;

      await d1Execute(
        'UPDATE learning_profiles SET xp = ?, competitive_xp = ?, level = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [newXp, newCompXp, newLevel, userId]
      );

      healedCount++;
      totalXpAdded += newXp - (profile.xp || 0);
      console.log(`  ⭐ Healed ${profile.alias || userId}: ${profile.xp} XP -> ${newXp} XP (Level ${newLevel}, +${uniqueCorrectCount} verified questions)`);
    }
  }

  const finalStats = await d1Query<any>(
    'SELECT COUNT(*) as count, SUM(xp) as total_xp, MAX(xp) as max_xp, AVG(xp) as avg_xp FROM learning_profiles'
  );

  console.log('\n🎉 Self-Healing XP Audit Complete:');
  console.log(`  • Accounts audited: ${profiles.length}`);
  console.log(`  • Accounts healed / restored: ${healedCount}`);
  console.log(`  • Additional XP recovered: +${totalXpAdded} XP`);
  console.log(`  • Total Active XP in Platform: ${Number(finalStats[0].total_xp).toLocaleString()} XP`);
  console.log(`  • Highest Leaderboard Score: ${Number(finalStats[0].max_xp).toLocaleString()} XP`);
}

reconcileAllXP().catch(console.error);
