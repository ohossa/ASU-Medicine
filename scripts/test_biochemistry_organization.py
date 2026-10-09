import copy, unittest
from biochemistry_organization import reorganize

class OrganizationTests(unittest.TestCase):
 def setUp(self):
  self.bank={'chapters':[{'subjects':[{'questions':[{'id':'a','lecture':2,'text':'A','correctIndex':0},{'id':'b','lecture':1,'text':'B','modelAnswer':'B'}]}]}]}
  self.topics=[{'key':'one','id':101,'title':'One','subtitle':'Book chapter 1','page':1},{'key':'two','id':201,'title':'Two','subtitle':'Additional topic','page':0}]
  self.rows=[{'id':'a','section':'two'},{'id':'b','section':'one'}]
 def test_preserves_payload_and_original(self):
  original=copy.deepcopy(self.bank);out=reorganize(self.bank,self.rows,self.topics)
  self.assertEqual(self.bank,original)
  self.assertEqual([c['id'] for c in out['chapters']],[101,201])
  qs=[q for c in out['chapters'] for s in c['subjects'] for q in s['questions']]
  self.assertEqual({q['id'] for q in qs},{'a','b'})
  self.assertTrue(all(q['lecture']==1 for q in qs))
  self.assertEqual(next(q for q in qs if q['id']=='a')['correctIndex'],0)
 def test_missing_rejected(self):
  with self.assertRaises(ValueError):reorganize(self.bank,self.rows[:1],self.topics)
 def test_duplicate_rejected(self):
  with self.assertRaises(ValueError):reorganize(self.bank,self.rows+[self.rows[0]],self.topics)
 def test_unknown_id_rejected(self):
  with self.assertRaises(ValueError):reorganize(self.bank,self.rows+[{'id':'x','section':'one'}],self.topics)
 def test_unknown_topic_rejected(self):
  self.rows[0]['section']='missing'
  with self.assertRaises(ValueError):reorganize(self.bank,self.rows,self.topics)
if __name__=='__main__':unittest.main()
