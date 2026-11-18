import { d1Query, d1QueryFirst } from '../server/d1-client.js';

async function main() {
  const optIns = await d1Query('SELECT opt_in, COUNT(*) as count FROM learning_profiles GROUP BY opt_in');
  console.log('opt_in counts:', optIns);
  const byYear = await d1Query('SELECT year, COUNT(*) as count, SUM(xp) as total_xp FROM learning_profiles GROUP BY year');
  console.log('by year:', byYear);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
