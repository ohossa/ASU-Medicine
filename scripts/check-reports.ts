import { d1Query } from '../server/d1-client.js';

async function checkReports() {
  const reports = await d1Query('SELECT id, status, category, module_code, question_id, reporter_id FROM reports LIMIT 5');
  console.log('Sample reports from Cloudflare D1:');
  console.log(reports);

  const replies = await d1Query('SELECT id, report_id, subject, state FROM report_replies LIMIT 5');
  console.log('\nSample replies from Cloudflare D1:');
  console.log(replies);

  const counts = await d1Query('SELECT status, count(*) as count FROM reports GROUP BY status');
  console.log('\nReports grouped by status in D1:');
  console.log(counts);
}

checkReports().catch(console.error);
