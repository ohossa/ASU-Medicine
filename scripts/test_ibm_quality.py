import hashlib,json,tempfile,unittest,io,contextlib
import ibm_quality
from pathlib import Path
from unittest.mock import patch
from ibm_quality import coverage_errors,source_errors
from year1_quality import digest
class BiochemistryReplayTests(unittest.TestCase):
 def test_source_pdf_drift_blocks_release(self):
  with tempfile.TemporaryDirectory() as folder:
   path=Path(folder)/'question-source.pdf';path.write_bytes(b'original question source');rows=[{'matches':[{'path':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}]}]
   self.assertEqual(source_errors(rows),[]);path.write_bytes(b'changed question source');self.assertTrue(source_errors(rows));path.unlink();self.assertTrue(source_errors(rows))
 def test_coverage_requires_all_ids_fresh_hashes_and_explicit_completion(self):
  q={'id':'test','type':'essay','text':'State the function','modelAnswer':'A grounded answer'};bank={'chapters':[{'id':1,'subjects':[{'questions':[q]}]}]}
  with tempfile.TemporaryDirectory() as folder,patch('ibm_quality.REPORT',Path(folder)):
   self.assertTrue(coverage_errors(bank));path=Path(folder)/'coverage-test.jsonl';row={'id':'test','question_hash':digest(q),'review_completed':True};path.write_text(json.dumps(row)+'\n');self.assertEqual(coverage_errors(bank),[])
   row['question_hash']='stale';path.write_text(json.dumps(row)+'\n');self.assertTrue(coverage_errors(bank));row['question_hash']=digest(q);row['review_completed']=False;path.write_text(json.dumps(row)+'\n');self.assertTrue(coverage_errors(bank));row['review_completed']=True;path.write_text((json.dumps(row)+'\n')*2);self.assertTrue(coverage_errors(bank))
 def test_recovers_when_bank_write_succeeds_but_receipt_write_fails(self):
  q={'id':'test','type':'essay','text':'State the function','lecture':1,'modelAnswer':'A grounded answer','explanation':'A clear explanation'};bank={'chapters':[{'id':1,'subjects':[{'questions':[q]}]}]}
  with tempfile.TemporaryDirectory() as folder:
   base=Path(folder);target=base/'IBM-1.json';target.write_text(json.dumps(bank));(base/'before.json').write_text(json.dumps(bank));(base/'source-map.json').write_text('[]');(base/'coverage-test.jsonl').write_text(json.dumps({'id':'test','question_hash':digest(q),'review_completed':True})+'\n')
   real_write=ibm_quality.write_json
   def fail_receipt(path,value):
    if path.name=='applied-hash.json':raise OSError('Receipt write failed')
    real_write(path,value)
   with patch('ibm_quality.REPORT',base),patch('ibm_quality.TARGET',target),patch('sys.argv',['ibm_quality.py','--apply']),contextlib.redirect_stdout(io.StringIO()):
    with patch('ibm_quality.write_json',side_effect=fail_receipt):
     with self.assertRaises(OSError):ibm_quality.main()
    written=target.read_bytes();self.assertFalse((base/'applied-hash.json').exists());ibm_quality.main();self.assertEqual(target.read_bytes(),written);self.assertTrue((base/'applied-hash.json').exists())
if __name__=='__main__':unittest.main()
