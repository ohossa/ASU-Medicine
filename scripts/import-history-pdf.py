"""Extract History MCQ.pdf into BLS-HE-1, preserving printed answer mappings.
Usage: python3 scripts/import-history-pdf.py SOURCE.pdf. Requires PyMuPDF.
Inspect all rendered pages before using this importer on a different revision.
"""
import fitz,hashlib,json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1];p=Path(sys.argv[1]);doc=fitz.open(p);assert len(doc)==4
rows=[];q=None
for pn,page in enumerate(doc,1):
 for line in page.get_text(sort=True).splitlines():
  m=re.match(r'^\s*(\d+)-\s+(.+?)\s+([a-pA-P])\s*$',line)
  if m:q={'number':int(m[1]),'text':m[2].strip(),'answerLabel':m[3].lower(),'pages':[pn],'options':[]};rows.append(q);continue
  m=re.match(r'^\s*([a-p])[-)]\s*(.+?)\s*$',line)
  if m:
   assert q;q['options'].append({'label':m[1],'text':m[2]})
   if pn not in q['pages']:q['pages'].append(pn)
assert [q['number'] for q in rows]==list(range(1,26))
for q in rows:
 labels=[o['label'] for o in q['options']];assert len(labels) in [3,4] and len(labels)==len(set(labels));assert q['answerLabel'] in labels;q['correctIndex']=labels.index(q['answerLabel'])
sha=hashlib.sha256(p.read_bytes()).hexdigest();target=root/'src/imports/year-1/semester-2/BLS-HE-1.json';bank=json.loads(target.read_text());chapters={c['id']:c for c in bank['chapters']}
for cid in [2,3]:
 if not chapters[cid]['subjects']:chapters[cid]['subjects']=[{'id':'clinical','name':'Clinical','iconName':'Stethoscope','lectures':'','lectureCount':0,'lectureNames':[],'questions':[]}]
def signature(text,options):return json.dumps([text.casefold().strip(),[o.casefold().strip() for o in options]])
signatures={signature(q['text'],q['options']):q for c in bank['chapters'] for s in c['subjects'] for q in s['questions'] if q['type']=='mcq'}
report={'sourceFile':p.name,'sourceSha256':sha,'pagesReviewed':[1,2,3,4],'sourceOccurrences':25,'newQuestions':0,'duplicates':[],'sourceMapping':[],'normalizations':[]}
for row in rows:
 n=row['number'];options=[o['text'] for o in row['options']]
 if n==11:
  assert options[1]=='B- two fingers';options[1]='two fingers';report['normalizations'].append({'number':11,'original':'B- two fingers','display':'two fingers','reason':'Repeated option label removed; meaning unchanged.'})
 cid=2 if n in [1,2,3,4,10,13,14,15,16,17,18,19,20,21] else 3
 topic='History Sheet Components' if n in [1,2,3,4] else 'Personal History' if n in [10,13,14,15,16,17,21] else 'Past History' if n in [18,19] else 'Family History' if n==20 else 'Lymph Node Examination' if n in [9,24,25] else 'Pulse Examination' if n in [11,12] else 'General Examination Components'
 occurrence={'sourceFile':p.name,'sourceSha256':sha,'sourceQuestionNumber':n,'sourcePages':row['pages'],'optionLabels':[o['label'] for o in row['options']],'printedAnswerLabel':row['answerLabel'],'answerProvenance':'Printed PDF answer column; verified visually against the rendered page.'}
 sig=signature(row['text'],options);existing=signatures.get(sig)
 if existing:
  assert existing['correctIndex']==row['correctIndex'],'Conflicting duplicate key'
  occurrences=existing.setdefault('sourceOccurrences',[])
  if occurrence not in occurrences:occurrences.append(occurrence)
  report['duplicates'].append({'sourceQuestionNumber':n,'keptId':existing['id']});q=existing
 else:
  s=next(s for s in chapters[cid]['subjects'] if s['id']=='clinical')
  if topic not in s['lectureNames']:s['lectureNames'].append(topic)
  q={'id':f'BLS-HE-1-HISTORY-{n:03d}','type':'mcq','lecture':s['lectureNames'].index(topic)+1,'text':row['text'],'options':options,'correctIndex':row['correctIndex'],'explanation':'','sourceOccurrences':[occurrence]};s['questions'].append(q);signatures[sig]=q;report['newQuestions']+=1
 report['sourceMapping'].append({'sourceQuestionNumber':n,'id':q['id'],'chapterId':cid,'correctIndex':row['correctIndex'],'sourcePages':row['pages']})
for cid in [2,3]:
 for s in chapters[cid]['subjects']:s['lectureCount']=len(s['lectureNames']);s['lectures']=', '.join(s['lectureNames'])
 chapters[cid]['lectureRange']=f"Topics 1–{max(s['lectureCount'] for s in chapters[cid]['subjects'])}"
bank['comingSoon']=False;bank['meta'].update(moduleName='Basic Life Support + History Taking & Clinical Examination',creditPoints=1.5,totalMarks=30)
out=root/'docs/verification/history-import-2026-10-08';out.mkdir(parents=True,exist_ok=True)
for name,data in [('source-extraction',rows),('import-report',report)]: (out/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
target.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='sourceMapping'},indent=2))
