"""Source-preserving parser and release gate for the designated Biochemistry TXT.

Does not medically adjudicate questions, default keys, or write website banks.
Use reviewed content-versioned decisions separately; the source remains immutable.
"""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import re

def content_hash(text, options):
 return hashlib.sha256(json.dumps({'text':text,'options':options},sort_keys=True,ensure_ascii=False).encode()).hexdigest()

def parse_text(text):
 part=text.split('APPENDIX A')[0];rows=[]
 for m in re.finditer(r'^RECORD: (.*?)\n(.*?)(?=^RECORD: |\Z)',part,re.M|re.S):
  block=m.group(2)
  def field(name):
   match=re.search(r'^'+re.escape(name)+r': (.*)',block,re.M)
   return match.group(1) if match else None
  q=re.search(r'^QUESTION: (.*?)(?=^SOURCE-SUPPLIED ANSWER:)',block,re.M|re.S)
  if not q:raise ValueError(f'Missing question/answer boundary: {m.group(1)}')
  body=q.group(1).strip()
  matches=list(re.finditer(r'^  ([A-Za-z])[.)] (.*?)(?=^  [A-Za-z][.)] |\Z)',body,re.M|re.S))
  stem=body[:matches[0].start()].strip() if matches else body
  options=[{'label':o.group(1).upper(),'text':o.group(2).strip()} for o in matches]
  row={'id':m.group(1),'source':field('SOURCE'),'page':field('PAGE'),'section':field('SECTION'),'source_question_number':field('SOURCE QUESTION NUMBER'),'line':part[:m.start()].count('\n')+1,'text':stem,'options':options,'historical_answer':field('SOURCE-SUPPLIED ANSWER'),'answer_status':field('ANSWER STATUS'),'raw_block':m.group(0).strip(),'content_hash':content_hash(stem,options)}
  rows.append(row)
 if len({r['id'] for r in rows})!=len(rows):raise ValueError('Duplicate source IDs')
 return rows

def historical_index(row):
 answer=row.get('historical_answer') or ''
 match=re.match(r'^([A-Za-z])(?:\s*[—–:.)-]|\s*$)',answer)
 if not match:return None
 labels=[o['label'] for o in row['options']]
 key=match.group(1).upper()
 return labels.index(key) if labels.count(key)==1 else None

def structural_flags(row):
 flags=[];opts=row['options'];labels=[o['label'] for o in opts]
 if row['answer_status']=='unlinked_answer':flags.append('unlinked_answer_record')
 if not row['text'].strip():flags.append('empty_stem')
 if len(set(labels))!=len(labels):flags.append('duplicate_option_labels')
 if any(not o['text'].strip() for o in opts):flags.append('empty_option')
 if len(opts)==1:flags.append('only_one_option')
 if len(opts)>6:flags.append('possible_merged_questions_or_special_format')
 if not opts:flags.append('no_options_requires_type_review')
 if re.search(r'picture|diagram|structure shown|figure|image|illustrat|shown below|shown above',row['text'],re.I):flags.append('possible_image_dependence')
 if row['answer_status']=='needs_review':flags.append('source_extraction_needs_review')
 return flags

def reviewed_options(row,review):
 opts=review.get("final_options",row["options"])
 return [o.get("text") if isinstance(o,dict) else o for o in opts] if isinstance(opts,list) else None

def release_errors(row,review):
 errors=[]
 if review.get('content_hash')!=row['content_hash']:errors.append('stale_review')
 if review.get('decision') not in ('accept','correct'):errors.append('not_accepted')
 patched='final_options' in review or 'final_text' in review
 trace=any(review.get(k) for k in ['patch_reason','patch_rationale','patch_source','source_context','source_reconciliation','text_edit_reason'])
 if patched and not trace:errors.append('untraceable_patch')
 kind=review.get('type','mcq')
 options=reviewed_options(row,review)
 if not isinstance(options,list) or any(not isinstance(o,str) or not o.strip() for o in options):errors.append('invalid_options');options=[]
 if kind=='mcq':
  idx=review.get('correct_index')
  if isinstance(idx,bool) or not isinstance(idx,int) or not 0<=idx<len(options):errors.append('invalid_correct_index')
  if not 2<=len(options)<=6:errors.append('invalid_option_count')
  normalized=[re.sub(r'\s+',' ',o.casefold()).strip(' .;,') for o in options]
  if len(set(normalized))!=len(normalized):errors.append('duplicate_option_text')
 elif kind=='essay':
  if not isinstance(review.get('model_answer'),str) or not review['model_answer'].strip():errors.append('empty_model_answer')
  points=review.get('required_points')
  if not isinstance(points,list) or not points or any(not isinstance(s,str) or not s.strip() for s in points):errors.append('invalid_essay_rubric')
 else:errors.append('unsupported_type')
 explanation=review.get('explanation','').strip()
 if not explanation:errors.append('empty_explanation')
 if 'review the related lecture' in explanation.lower() or explanation.lower() in ['see above','see above.']:errors.append('fallback_explanation')
 if not any(e.get('opened_full_text') is True and e.get('url') and e.get('locator') and e.get('claim') for e in review.get('evidence',[])):errors.append('missing_opened_evidence')
 if row.get('answer_status')=='unlinked_answer':errors.append('unresolved_structure')
 if not review.get('final_text',row['text']).strip():errors.append('empty_stem')
 if kind=='mcq' and 'final_options' not in review and any(f in structural_flags(row) for f in ['duplicate_option_labels','empty_option','only_one_option']):errors.append('unresolved_structure')
 return errors

def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('source',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
 rows=parse_text(args.source.read_text());args.output.mkdir(parents=True,exist_ok=True)
 (args.output/'records.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows))
 for r in rows:r['flags']=structural_flags(r);r['historical_index']=historical_index(r)
 summary={'records':len(rows),'source_sha256':hashlib.sha256(args.source.read_bytes()).hexdigest(),'answer_status':dict(collections.Counter(r['answer_status'] for r in rows)),'option_counts':dict(collections.Counter(len(r['options']) for r in rows)),'flag_counts':dict(collections.Counter(f for r in rows for f in r['flags'])),'review_status':'pending; this parser performs no medical verification'}
 (args.output/'structural-preflight.json').write_text(json.dumps(summary,indent=2)+'\n')
 (args.output/'review-queue.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows))
 print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
