import syncHandler from '../api/sync.js';
import learningHandler from '../api/learning.js';
import reportsHandler from '../api/question-reports.js';
import adminAnalyticsHandler from '../api/admin-analytics.js';

class MockResponse {
  statusCode = 200;
  headers: Record<string, string> = {};
  data: any = null;

  setHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(value: unknown) {
    this.data = value;
    return this;
  }

  end() {
    return this;
  }
}

// Generate test JWT for Omar
function makeToken(sub: string, email: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ sub, email, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64');
  return `${header}.${payload}.signature`;
}

async function testAll() {
  const omarToken = makeToken('user_3F58BCV7wXpNBuZ2jkfQNVrl5Jj', 'omarhmaged@gmail.com');

  console.log('1. Testing /api/sync GET for Omar:');
  const resSync = new MockResponse();
  await syncHandler({
    method: 'GET',
    headers: { authorization: `Bearer ${omarToken}` },
    url: '/api/sync'
  } as any, resSync as any);
  console.log('Sync status:', resSync.statusCode);
  console.log('Sync keys returned:', Object.keys(resSync.data?.data || {}));
  console.log('Omar academic year in sync:', resSync.data?.data?.asu_portal_year);

  console.log('\n2. Testing /api/learning GET for Omar:');
  const resLearning = new MockResponse();
  await learningHandler({
    method: 'GET',
    headers: { authorization: `Bearer ${omarToken}` },
    query: { period: 'weekly' }
  } as any, resLearning as any);
  console.log('Learning status:', resLearning.statusCode);
  console.log('Omar profile XP:', resLearning.data?.profile?.xp);
  console.log('Omar level:', resLearning.data?.profile?.level);
  console.log('Omar entries count:', resLearning.data?.entries?.length);
  console.log('Leaderboard entries count:', resLearning.data?.leaderboard?.length);
  if (resLearning.data?.leaderboard?.length > 0) {
    console.log('Leaderboard sample #1:', resLearning.data.leaderboard[0]);
  }

  console.log('\n3. Testing /api/question-reports GET (overview & list):');
  const resReports = new MockResponse();
  await reportsHandler({
    method: 'GET',
    headers: { authorization: `Bearer ${omarToken}` },
    query: { offset: '0', limit: '10' }
  } as any, resReports as any);
  console.log('Reports status:', resReports.statusCode);
  console.log('Total reports:', resReports.data?.total);
  console.log('Counts:', resReports.data?.counts);
  console.log('Sample report:', resReports.data?.reports?.[0]?.id, resReports.data?.reports?.[0]?.category);

  console.log('\n4. Testing /api/admin-analytics GET:');
  const resAdmin = new MockResponse();
  await adminAnalyticsHandler({
    method: 'GET',
    headers: { authorization: `Bearer ${omarToken}` }
  } as any, resAdmin as any);
  console.log('Admin analytics status:', resAdmin.statusCode);
  console.log('Admin summary:', resAdmin.data?.summary);
  console.log('Admin total students:', resAdmin.data?.students?.length);
}

testAll().catch(console.error);
