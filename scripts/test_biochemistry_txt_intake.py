"""Regression checks for source preservation and release gates."""
import importlib.util
from pathlib import Path
import unittest
SCRIPT=Path(__file__).with_name('biochemistry_txt_intake.py')
MODULE=None
if SCRIPT.exists():
 spec=importlib.util.spec_from_file_location('intake',SCRIPT);MODULE=importlib.util.module_from_spec(spec);spec.loader.exec_module(MODULE)
FIXTURE='''PART I — CONSOLIDATED QUESTIONS AND ANSWERS
RECORD: TEST-1
SOURCE: exam.pdf
PAGE: 2
SECTION: Enzymes
SOURCE QUESTION NUMBER: 42
QUESTION: A 42-year-old takes 5-fluorouracil. Which statement is NOT correct?
  e. First choice
  f. Second choice
  g. Third choice
  h. Fourth choice
SOURCE-SUPPLIED ANSWER: g — Third choice
ANSWER STATUS: explicit
------------------------------------------------------------------------------
RECORD: TEST-2
SOURCE: exam.pdf
PAGE: 3
SECTION: Enzymes
SOURCE QUESTION NUMBER: 43
QUESTION: An unresolved question?
  A. First
  B. Second
SOURCE-SUPPLIED ANSWER: Not supplied in source.
ANSWER STATUS: not_supplied
------------------------------------------------------------------------------
APPENDIX A — COMPLETE PAGE-BY-PAGE SOURCE TRANSCRIPT
RECORD: MUST-NOT-BE-IMPORTED
'''
class IntakeTests(unittest.TestCase):
 def setUp(self):self.assertIsNotNone(MODULE,'The source-preserving intake adapter is not implemented')
 def test_source_labels_are_mapped_without_clamping(self):
  rows=MODULE.parse_text(FIXTURE);self.assertEqual(len(rows),2);self.assertEqual(MODULE.historical_index(rows[0]),2)
  self.assertEqual(rows[0]['options'][0]['label'],'E');self.assertIn('42-year-old',rows[0]['text']);self.assertIn('5-fluorouracil',rows[0]['text']);self.assertIn('NOT',rows[0]['text'])
 def test_missing_answer_is_never_defaulted(self):
  row=MODULE.parse_text(FIXTURE)[1];self.assertIsNone(MODULE.historical_index(row))
 def test_out_of_range_key_is_not_clamped(self):
  row=MODULE.parse_text(FIXTURE)[0];row['historical_answer']='Z — unknown';self.assertIsNone(MODULE.historical_index(row))
 def test_duplicate_labels_are_a_structural_hold(self):
  row=MODULE.parse_text(FIXTURE)[0];row['options'][1]['label']='E';self.assertIn('duplicate_option_labels',MODULE.structural_flags(row))
 def test_review_must_match_exact_content_and_be_substantive(self):
  row=MODULE.parse_text(FIXTURE)[0]
  valid={'content_hash':row['content_hash'],'decision':'accept','correct_index':2,'explanation':'A substantive distinction explains this illustrative choice.','evidence':[{'url':'https://example.org/reference','locator':'Mechanism','claim':'Illustrative support','opened_full_text':True}]}
  self.assertEqual(MODULE.release_errors(row,valid),[])
  wrong=dict(valid,content_hash='stale');self.assertIn('stale_review',MODULE.release_errors(row,wrong))
  wrong=dict(valid,correct_index=9);self.assertIn('invalid_correct_index',MODULE.release_errors(row,wrong))
  wrong=dict(valid,explanation='Review the related lecture material for the rationale.');self.assertIn('fallback_explanation',MODULE.release_errors(row,wrong))
  wrong=dict(valid,evidence=[]);self.assertIn('missing_opened_evidence',MODULE.release_errors(row,wrong))
 def test_essay_requires_a_real_answer_and_rubric(self):
  row=MODULE.parse_text(FIXTURE)[1];row['options']=[]
  d={'content_hash':row['content_hash'],'decision':'accept','type':'essay','model_answer':'A defined answer.','required_points':['A distinct required fact'],'explanation':'This explains the tested mechanism.','evidence':[{'url':'https://example.org','locator':'Definition','claim':'Support','opened_full_text':True}]}
  self.assertEqual(MODULE.release_errors(row,d),[])
  self.assertIn('invalid_essay_rubric',MODULE.release_errors(row,dict(d,required_points=[''])))
  self.assertIn('empty_model_answer',MODULE.release_errors(row,dict(d,model_answer='')))
 def test_repaired_options_require_traceability_and_unique_choices(self):
  row=MODULE.parse_text(FIXTURE)[0]
  d={'content_hash':row['content_hash'],'decision':'correct','correct_index':1,'final_options':['one','two'],'explanation':'A distinction.','evidence':[{'url':'https://example.org','locator':'Definition','claim':'Support','opened_full_text':True}]}
  self.assertIn('untraceable_patch',MODULE.release_errors(row,d))
  d['patch_reason']='Exact source transcript restores option boundary';self.assertEqual(MODULE.release_errors(row,d),[])
  self.assertIn('duplicate_option_text',MODULE.release_errors(row,dict(d,final_options=['one','ONE.'])))
 def test_polarity_and_decimal_values_are_not_normalized_away(self):
  row=MODULE.parse_text(FIXTURE)[0]
  d={'content_hash':row['content_hash'],'decision':'correct','correct_index':0,'final_options':['Net -ve charge','Net +ve charge','2.5 mg','25 mg'],'patch_reason':'Preserve source options','explanation':'Charge sign determines migration.','evidence':[{'url':'https://example.org','locator':'Definition','claim':'Support','opened_full_text':True}]}
  self.assertEqual(MODULE.release_errors(row,d),[])
 def test_repeated_ids_fail_instead_of_overwriting(self):
  with self.assertRaises(ValueError):MODULE.parse_text(FIXTURE.replace('TEST-2','TEST-1'))
if __name__=='__main__':unittest.main()
