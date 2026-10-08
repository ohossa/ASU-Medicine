"""Lossless structural conversion of the four designated Year 1 source banks.
Usage: python3 scripts/import-year1-release.py SOURCE_SEMESTER_DIRECTORY
Validates every source row before writing any bank. No answer inference is used.
"""
import collections, hashlib, json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
 'MBMG-1': ('Genetics Q\'s/MBMG1_FULLY_POLISHED_FINAL_2026-07-31.json', 'biochem', 'Biochemistry / Medical Genetics', 'FlaskConical', '🧬', 3, 60),
 'IAE-1': ('Introduction to Anatomy Q\'s/IAE-1_anatomy_MASTER_ULTRA_FINAL_RECHECKED.json', 'anatomy', 'Anatomy', 'Bone', '🦴', 5, 100),
 'IPHY-1': ('Introduction to Physiology Q\'s/IPHY-1_FINAL_MASTER.json', 'physiology', 'Physiology', 'Activity', '⚡', 4, 80),
 'P1-1': ('ICT Q\'s/ASU_P1-1_ICT_batch_v2.json', 'clinical', 'Clinical', 'Stethoscope', '💻', 1.5, 30),
}
def nonempty(v, label):
 assert isinstance(v,str) and v.strip(),label
 return v

def convert(q, qid):
 t=q['type']; t='essay' if t=='short_answer' else t
 text=nonempty(q.get('text',q.get('question')), f'{qid}: stem')
 exp=q.get('explanation','')
 if isinstance(exp,dict): exp=exp.get('whyCorrect','')
 out={'id':qid,'type':t,'lecture':1,'text':text,'explanation':exp}
 for key in ['keyConcept','pairs','blanks','acceptedAnswers','provenance','quality','examTip']:
  if key in q: out[key]=q[key]
 if isinstance(q.get('explanation'),dict):
  out['keyConcept']='; '.join(q['explanation'].get('keyConcepts',[]))
  out['examTip']=q['explanation'].get('examTip','')
 if t in ['mcq','truefalse']:
  opts=q['options']; assert len(opts)>=2,f'{qid}: options'
  out['options']=[nonempty(o['text'] if isinstance(o,dict) else o,f'{qid}: option') for o in opts]
  if 'correctIndex' in q: idx=q['correctIndex']
  else:
   key=q.get('correctAnswer',q.get('answer',{}).get('optionId'))
   labels=[o['id'] if isinstance(o,dict) else chr(65+i) for i,o in enumerate(opts)]
   assert key in labels,f'{qid}: unmapped answer {key}'
   idx=labels.index(key)
  assert type(idx)==int and 0<=idx<len(opts),f'{qid}: answer bounds'
  out['correctIndex']=idx
  if isinstance(q.get('answer'),dict) and q['answer'].get('text'):
   assert q['answer']['text']==out['options'][idx],f'{qid}: answer text mismatch'
  if t=='truefalse': assert [o.lower().strip() for o in out['options']]==['true','false'],f'{qid}: true/false order'
 elif t=='essay':
  ans=q.get('modelAnswer') or q.get('answer',{}).get('modelAnswer')
  out['modelAnswer']=nonempty(ans,f'{qid}: model answer')
 elif t=='case':
  assert q.get('subQuestions'),f'{qid}: missing case children'
  out['subQuestions']=[convert(dict(child,type=child.get('type','essay'),modelAnswer=child.get('modelAnswer',child.get('answer'))),f'{qid}-PART-{i+1}') for i,child in enumerate(q['subQuestions'])]
 elif t=='matching':
  assert out.get('pairs'),f'{qid}: pairs'
  for p in out['pairs']: nonempty(p['premise'],qid);nonempty(p['target'],qid)
 elif t=='fillblank':
  assert out.get('blanks') and len(re.findall(r'_{3,}',text))==len(out['blanks']),f'{qid}: blank count'
  for a in out['blanks']:nonempty(a,qid)
 else:raise AssertionError(f'{qid}: unsupported type {t}')
 return out

def main(source):
 outputs={};report={}
 for code,(rel,sid,sname,icon,emoji,cp,marks) in SOURCES.items():
  p=source/rel;src=json.loads(p.read_text()); rows=src.get('questions',src.get('records'))
  target=ROOT/'src/imports/year-1/semester-1'/f'{code}.json';old=json.loads(target.read_text())
  oldqs=[q for ch in old['chapters'] for s in ch['subjects'] for q in s['questions']]
  oldids={(q['text'],q['type'],tuple(q.get('options',[]))):q['id'] for q in oldqs}
  chapters={}; ids=set();mapping=[]
  for i,q in enumerate(rows):
   ch=q.get('chapter',{});cid=q.get('chapterId',ch.get('id'));title=q.get('chapterTitle',ch.get('title'))
   assert isinstance(cid,int) and cid>0;nonempty(title,code+' chapter')
   text=q.get('text',q.get('question'));qid=q.get('id') or oldids.get((text,q['type'],tuple(q.get('options') or []))) or f'{code}-SRC-{i+1:04d}'
   assert qid not in ids,f'{code}: duplicate ID {qid}';ids.add(qid)
   converted=convert(q,qid)
   if cid not in chapters:
    chapters[cid]={'id':cid,'title':title,'subtitle':'','emoji':emoji,'page':cid,'lectureRange':'','subjects':[{'id':sid,'name':sname,'iconName':icon,'lectures':'','lectureCount':0,'lectureNames':[],'questions':[]}]}
   assert chapters[cid]['title']==title,f'{code}: chapter title conflict'
   subj=chapters[cid]['subjects'][0];topic=q.get('topic') or title
   if topic not in subj['lectureNames']:subj['lectureNames'].append(topic)
   converted['lecture']=subj['lectureNames'].index(topic)+1
   subj['questions'].append(converted);mapping.append({'sourceIndex':i,'id':qid,'chapterId':cid,'lecture':converted['lecture']})
  for ch in chapters.values():
   s=ch['subjects'][0];s['lectureCount']=len(s['lectureNames']);s['lectures']=', '.join(s['lectureNames']);ch['lectureRange']=f"Topics 1–{s['lectureCount']}"
  meta=dict(old['meta'],creditPoints=cp,totalMarks=marks)
  bank={'schemaVersion':1,'comingSoon':False,'meta':meta,'chapters':list(sorted(chapters.values(),key=lambda c:c['id']))}
  outputs[target]=bank
  report[code]={'sourceFile':p.name,'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceRows':len(rows),'importedRows':len(mapping),'sourceTypes':dict(collections.Counter(q['type'] for q in rows)),'chapters':len(chapters),'mapping':mapping,'answerReview':'Source keys preserved; no new medical adjudication.'}
 for target,bank in outputs.items():target.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 rp=ROOT/'docs/verification/year1-import-2026-10-08';rp.mkdir(parents=True,exist_ok=True)
 (rp/'source-mapping.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({k:{a:b for a,b in v.items() if a!='mapping'} for k,v in report.items()},indent=2))
if __name__=='__main__':main(Path(sys.argv[1]))
