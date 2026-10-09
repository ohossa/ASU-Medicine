import unittest
from biochemistry_polish import apply, digest
class PolishTests(unittest.TestCase):
 def setUp(self):
  self.q={'id':'x','type':'mcq','text':'Stem','options':['A','B'],'correctIndex':0,'explanation':'Because mechanism.'}
  self.bank={'chapters':[{'subjects':[{'questions':[self.q]}]}]}
 def row(self,**kw):
  return dict(id='x',question_hash=digest(self.q),status='polished',reason='Clarifies mechanism',explanation='A binds the substrate site and prevents conversion.',**kw)
 def test_preserves_answer_and_source(self):
  out=apply(self.bank,[self.row()]);self.assertEqual(out['chapters'][0]['subjects'][0]['questions'][0]['correctIndex'],0);self.assertEqual(self.q['explanation'],'Because mechanism.')
 def test_stale_hash_rejected(self):
  r=self.row();r['question_hash']='stale'
  with self.assertRaises(ValueError):apply(self.bank,[r])
 def test_missing_duplicate_extra_ids_rejected(self):
  for rows in ([],[self.row(),self.row()],[dict(self.row(),id='extra')]):
   with self.assertRaises(ValueError):apply(self.bank,rows)
 def test_ungrounded_key_change_rejected(self):
  r=self.row();r.update(status='correct',changes={'correctIndex':1})
  with self.assertRaises(ValueError):apply(self.bank,[r])
 def test_illegal_field_rejected(self):
  r=self.row();r.update(changes={'id':'new'})
  with self.assertRaises(ValueError):apply(self.bank,[r])
 def test_exclusion_requires_evidence(self):
  r=self.row();r.update(status='exclude')
  with self.assertRaises(ValueError):apply(self.bank,[r])
if __name__=='__main__':unittest.main()
