"""Run the production reward Lua in a Redis-compatible emulator with Lua support.
Install test-only dependencies with: python3 -m pip install 'fakeredis[lua]'
This script never connects to hosted Redis or reads credentials.
"""
import json,re,unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import fakeredis
SCRIPT=re.search(r'export const AWARD_LUA\s*=\s*`(.*?)`;',Path('server/learning-store.ts').read_text(),re.S).group(1)
class LedgerTests(unittest.TestCase):
 def setUp(self):
  self.r=fakeredis.FakeRedis();self.keys=['profile','entries','awarded','daily','year-rank','week-rank','week-score','year-score']
  self.profile=dict(xp=0,competitiveXp=0,level=1,streak=0,bestStreak=0,lastDay='',year=3,alias='Student',optIn=True,banner='default',title='student')
 def award(self,identity='q',personal=10,competitive=10,day='2026-10-08',yesterday='2026-10-07'):
  row=dict(identity=identity,personal=personal,competitive=competitive,correct=personal>0,moduleCode='MGL-3',chapterId=1,questionId=identity,topic='Oral',subject='Anatomy',type='essay' if competitive==0 else 'mcq')
  return json.loads(self.r.eval(SCRIPT,8,*self.keys,json.dumps([row]),day+'T10:00:00Z',day,json.dumps(self.profile),yesterday,'3','student'))
 def test_retries_never_duplicate_rewards(self):
  self.assertEqual(self.award(),{'personal':10,'competitive':10});self.assertEqual(self.award(),{'personal':0,'competitive':0});self.assertEqual(json.loads(self.r.get('profile'))['xp'],10)
 def test_phone_and_computer_race_awards_once(self):
  with ThreadPoolExecutor(max_workers=8) as pool:
   results=list(pool.map(lambda _:self.award('same-account-question'),range(16)))
  self.assertEqual(sum(r['personal'] for r in results),10)
  self.assertEqual(sum(r['competitive'] for r in results),10)
  self.assertEqual(json.loads(self.r.get('profile'))['xp'],10)
  self.assertEqual(self.r.scard('awarded'),1)
  self.assertEqual(self.r.hlen('entries'),1)
 def test_essays_only_personal(self):
  self.award('essay',15,0);self.assertEqual(self.r.zscore('year-rank','student'),0);self.assertEqual(json.loads(self.r.get('profile'))['xp'],15)
 def test_wrong_then_correct_receives_reward_once(self):
  self.award('q',0,0);self.assertEqual(self.award(),{'personal':10,'competitive':10});self.assertTrue(json.loads(self.r.hget('entries','MGL-3:q'))['everCorrect'])
 def test_daily_competitive_cap_preserves_personal_xp(self):
  self.r.set('daily',495);self.assertEqual(self.award(),{'personal':10,'competitive':5});self.assertEqual(json.loads(self.r.get('profile'))['xp'],10)
 def test_private_profile_never_enters_rankings(self):
  self.profile['optIn']=False;self.award();self.assertEqual(self.r.zcard('year-rank'),0)
 def test_streak_and_level_are_derived(self):
  self.profile.update(xp=495,streak=2,lastDay='2026-10-07');self.award();p=json.loads(self.r.get('profile'));self.assertEqual((p['level'],p['streak']),(2,3))
if __name__=='__main__':unittest.main()
