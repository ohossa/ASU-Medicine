"""Exercise the production reply Lua in isolated fakeredis. Never uses credentials."""
import json,re,unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import fakeredis
source=Path('server/report-reply-store.ts').read_text()
reserve=re.search(r'export const RESERVE_REPLY_LUA\s*=\s*`(.*?)`;',source,re.S).group(1)
draft=re.search(r'export const SAVE_REPLY_DRAFT_LUA\s*=\s*`(.*?)`;',source,re.S).group(1)
finish=re.search(r'export const FINISH_REPLY_LUA\s*=\s*`(.*?)`;',source,re.S).group(1)
class ReplyTests(unittest.TestCase):
 def setUp(self):self.r=fakeredis.FakeRedis()
 def reserve(self,i):
  row={'id':str(i),'reportId':'report','subject':'Review','body':'Same response','to':'student@example.com','state':'pending'}
  return self.r.eval(reserve,3,'record:'+str(i),'report:index','content:same',json.dumps(row),'1',str(i),'record:')
 def test_same_request_is_saved_once(self):
  self.assertEqual(self.reserve(1)[0],1);self.assertEqual(self.reserve(1)[0],0);self.assertEqual(self.r.zcard('report:index'),1)
 def test_different_devices_cannot_duplicate_identical_reply(self):
  with ThreadPoolExecutor(max_workers=8) as pool:rows=list(pool.map(self.reserve,range(16)))
  self.assertEqual(sum(row[0] for row in rows),1);self.assertEqual(self.r.zcard('report:index'),1)
 def test_accepted_reply_clears_only_its_matching_draft(self):
  row={'state':'accepted','body':'message','subject':'Review','createdBy':'owner','createdAt':'now'}
  self.r.set('draft',json.dumps({'revision':2,'body':' message ','subject':'Review'}))
  self.r.eval(finish,3,'record','lock','draft',json.dumps(row))
  saved=json.loads(self.r.get('draft'));self.assertEqual(saved['body'],'');self.assertEqual(saved['revision'],3)
 def test_other_device_draft_is_not_cleared(self):
  row={'state':'accepted','body':'message','subject':'Review','createdBy':'owner','createdAt':'now'}
  self.r.set('draft',json.dumps({'revision':2,'body':'New follow-up','subject':'Review'}))
  self.r.eval(finish,3,'record','lock','draft',json.dumps(row))
  self.assertEqual(json.loads(self.r.get('draft'))['body'],'New follow-up')
 def test_uncertain_send_preserves_draft(self):
  self.r.set('draft',json.dumps({'revision':2,'body':'message','subject':'Review'}))
  self.r.eval(finish,3,'record','lock','draft',json.dumps({'state':'uncertain','body':'message','subject':'Review'}))
  self.assertEqual(json.loads(self.r.get('draft'))['body'],'message')
 def test_draft_revision_prevents_lost_edits(self):
  first=self.r.eval(draft,1,'draft','0',json.dumps({'revision':0,'body':'first'}));self.assertEqual(first[0],200)
  second=self.r.eval(draft,1,'draft','0',json.dumps({'revision':0,'body':'stale'}));self.assertEqual(second[0],409)
  self.assertEqual(json.loads(self.r.get('draft'))['body'],'first')
if __name__=='__main__':unittest.main()
