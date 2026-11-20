import { d1Query } from '../server/d1-client.js';

async function check() {
  const profiles = await d1Query('SELECT COUNT(*) as count, MAX(xp) as max_xp, MAX(level) as max_level FROM learning_profiles');
  console.log('Profiles in D1:', profiles);
  const top10 = await d1Query('SELECT user_id, alias, xp, level, streak FROM learning_profiles ORDER BY xp DESC LIMIT 10');
  console.log('Top 10 profiles in D1:', top10);
  const omar = await d1Query('SELECT * FROM learning_profiles WHERE user_id = ?', ['user_3F58BCV7wXpNBuZ2jkfQNVrl5Jj']);
  console.log('Omar in D1:', omar);
  const entriesCount = await d1Query('SELECT COUNT(*) as count FROM learning_entries');
  console.log('Entries in D1:', entriesCount);
}
check().catch(console.error);
