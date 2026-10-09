"""Behavioral tests for reversible Year 1 quality releases."""
import copy,unittest
from year1_quality import normalize, duplicate_key, apply_decisions, digest, deduplicate, issues, reviewed_deduplicate, version_questions

def q(id='one',**kw):return dict(id=id,type='mcq',lecture=1,text='Which bond is formed?',options=['Ionic','Covalent'],correctIndex=0,explanation='Opposite electrical charges attract.',**kw)
def bank(qs):return {'meta':{'moduleCode':'TEST'},'chapters':[{'id':1,'subjects':[{'id':'biochem','questions':qs}]}]}
class QualityTests(unittest.TestCase):
 def test_charge_decimal_and_negation_survive(self):
  self.assertNotEqual(normalize('net +ve'),normalize('net -ve'));self.assertNotEqual(normalize('2.5 mg'),normalize('25 mg'));self.assertNotEqual(normalize('is correct'),normalize('is NOT correct'))
 def test_shuffled_choices_same_answer_deduplicate(self):
  a=q();b=q('two');b.update(options=['Covalent.','Ionic.'],correctIndex=1)
  self.assertEqual(duplicate_key(a),duplicate_key(b))
 def test_conflicting_keys_do_not_merge(self):
  a=q();b=q('two');b['correctIndex']=1;self.assertNotEqual(duplicate_key(a),duplicate_key(b))
 def test_letter_references_are_not_treated_as_order_independent(self):
  a=q();a.update(options=['Ionic','Covalent','Both A and B'],correctIndex=2)
  b=copy.deepcopy(a);b['options']=['Covalent','Ionic','Both A and B']
  self.assertNotEqual(duplicate_key(a),duplicate_key(b))
 def test_different_essay_answers_and_case_children_do_not_merge(self):
  a=dict(id='a',type='essay',text='Explain X',modelAnswer='one');b=dict(a,id='b',modelAnswer='two');self.assertNotEqual(duplicate_key(a),duplicate_key(b))
  a=dict(id='a',type='case',text='A patient',subQuestions=[q()]);b=copy.deepcopy(a);b['subQuestions'][0]['correctIndex']=1;self.assertNotEqual(duplicate_key(a),duplicate_key(b))
 def test_replay_rejects_stale_or_unknown_decisions(self):
  b=bank([q()]);row={'module':'TEST','id':'one','question_hash':digest(q()),'decision':'correct','changes':{'text':'Corrected stem'},'reason':'Restore OCR'}
  self.assertEqual(apply_decisions({'TEST':b},[row])['TEST']['chapters'][0]['subjects'][0]['questions'][0]['text'],'Corrected stem')
  row['question_hash']='stale'
  with self.assertRaises(ValueError):apply_decisions({'TEST':b},[row])
  row['id']='absent'
  with self.assertRaises(ValueError):apply_decisions({'TEST':b},[row])
 def test_dedup_keeps_originals_and_provenance(self):
  a=q();a['sourceOccurrences']=[{'sourceId':'source-one'}];b=q('two');b['sourceOccurrences']=[{'sourceId':'source-two'}]
  out,ledger=deduplicate({'TEST':bank([a,b])});kept=out['TEST']['chapters'][0]['subjects'][0]['questions']
  self.assertEqual(len(kept),1);self.assertEqual(kept[0]['id'],'one');self.assertEqual(kept[0]['sourceOccurrences'],[{'sourceId':'source-one'},{'sourceId':'source-two'}]);self.assertEqual(ledger[0]['original'],b);self.assertEqual(ledger[0]['canonicalId'],'one')
  again,second=deduplicate(out);self.assertEqual(again,out);self.assertEqual(second,[])
 def test_reviewed_duplicates_fail_closed_and_archive(self):
  a=q();b=q('two');b['text']='Which chemical bond is formed?'
  banks={'TEST':bank([a,b])};row={'module':'TEST','id':'two','canonicalModule':'TEST','canonicalId':'one','question_hash':digest(b),'canonical_hash':digest(a),'reason':'Reviewed equivalent wording and identical answer choices'}
  out,ledger=reviewed_deduplicate(banks,[row]);self.assertEqual(len(out['TEST']['chapters'][0]['subjects'][0]['questions']),1);self.assertEqual(ledger[0]['original'],b)
  row['question_hash']='stale'
  with self.assertRaises(ValueError):reviewed_deduplicate(banks,[row])
 def test_content_version_changes_with_answer_and_is_idempotent(self):
  banks={'TEST':bank([q()])};version_questions(banks);item=banks['TEST']['chapters'][0]['subjects'][0]['questions'][0];first=item['contentVersion'];version_questions(banks);self.assertEqual(item['contentVersion'],first);item['correctIndex']=1;version_questions(banks);self.assertNotEqual(first,item['contentVersion'])
 def test_case_versions_ignore_nested_version_metadata(self):
  banks={'TEST':bank([dict(id='case',type='case',text='Patient case',subQuestions=[q()])])};version_questions(banks);first=copy.deepcopy(banks);version_questions(banks);self.assertEqual(first,banks)
 def test_restores_source_matching_format_without_essay_artifacts(self):
  original={'id':'m','type':'essay','text':'Match collagen','lecture':1,'modelAnswer':'Fibrous protein','requiredPoints':['Fibrous'],'explanation':'Collagen is fibrous.'}
  row={'module':'TEST','id':'m','question_hash':digest(original),'decision':'correct','changes':{'type':'matching','pairs':[{'premise':'Collagen','target':'Fibrous protein'}]},'removeFields':['modelAnswer','requiredPoints'],'reason':'Restore the visually checked original source table'}
  item=apply_decisions({'TEST':bank([original])},[row])['TEST']['chapters'][0]['subjects'][0]['questions'][0]
  self.assertEqual(item['type'],'matching');self.assertNotIn('modelAnswer',item);self.assertNotIn('requiredPoints',item)
 def test_corruption_and_invalid_options_are_blocked(self):
  a=q();a['options'][1]='Covalent PULSE Dr Marwa Hamdy';self.assertTrue(issues(a))
  a=q();a['options'][1]='Covalent BIOCHEM ACADEMY';self.assertTrue(issues(a))
  a=q();a['correctIndex']=.5;self.assertTrue(issues(a))
  a=q();a['options']=['Ionic','Ionic.'];self.assertTrue(issues(a))
  a=q();a['text']='Broken \u202e question';self.assertTrue(issues(a))
  a=q();a['text']='5-fluorouracil at 2.5 mg; net -ve; β structure?';self.assertEqual(issues(a),[])
if __name__=='__main__':unittest.main()
