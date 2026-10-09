"""Conservative, reproducible quality audit and hash-bound correction replay.

Usage: python3 scripts/year1_quality.py --audit
       python3 scripts/year1_quality.py --prepare  (snapshots + decision files)
       python3 scripts/year1_quality.py --apply    (all-bank preflight + rollback)
Never infer a medical answer. Every substantive patch is a reviewed decision.
"""
import argparse,collections,copy,hashlib,json,re,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'docs/verification/year1-quality-2026-10-09'

def digest(value):return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
def normalize(text):
 # Canonical equivalence only: preserve numeric precision, charges, negatives,
 # Greek chemistry and clinical punctuation. Never strip all non-alphanumerics.
 text=unicodedata.normalize('NFC',text).casefold().translate(str.maketrans({'–':'-','−':'-','’':"'",'“':'"','”':'"'}))
 text=re.sub(r'\s+',' ',text).strip();text=re.sub(r'[.?:;,]+$','',text).strip()
 return text

def duplicate_key(q):
 t=q['type'];stem=normalize(q['text']);opts=q.get('options',[])
 if t in ('mcq','truefalse'):
  idx=q.get('correctIndex')
  if type(idx)!=int or not 0<=idx<len(opts):return ('invalid',q['id'])
  values=list(map(normalize,opts));dependent=any(re.search(r'\b(?:both|either|neither|only|options?|choices?|statements?)\s*(?:\(?[a-e]\)?|[1-5])\b|\b[a-e]\s*(?:and|&|\+)\s*[a-e]\b|\b(?:above|below|preceding)\b',v,re.I) for v in opts)
  return (t,stem,tuple(values if dependent else sorted(values)),values[idx])
 if t=='essay':return (t,stem,normalize(q.get('modelAnswer','')))
 if t=='matching':return (t,stem,tuple(sorted((normalize(p['premise']),normalize(p['target'])) for p in q.get('pairs',[]))))
 if t=='fillblank':return (t,stem,tuple(map(normalize,q.get('blanks',[]))),json.dumps(q.get('acceptedAnswers',[]),sort_keys=True))
 if t=='case':return (t,stem,tuple(duplicate_key(s) for s in q.get('subQuestions',[])))
 return (t,stem,q['id'])

def iter_questions(banks,children=False):
 for mod,b in banks.items():
  for c in b['chapters']:
   for s in c['subjects']:
    for q in s['questions']:
     yield mod,c,s,q
     if children:
      for child in q.get('subQuestions',[]):yield mod,c,s,child

def display_strings(q):
 for k in ['text','explanation','modelAnswer','keyConcept']:
  if isinstance(q.get(k),str):yield k,q[k]
 for k in ['options','blanks','requiredPoints']:
  for i,v in enumerate(q.get(k,[]) or []):yield f'{k}.{i}',v
 for i,p in enumerate(q.get('pairs',[]) or []):
  for k in ['premise','target']:yield f'pairs.{i}.{k}',p.get(k,'')

def issues(q):
 errors=[]
 if q.get('type') not in {'mcq','truefalse','essay','matching','fillblank','case'}:errors.append('unsupported question type')
 if q.get('type')=='matching':
  pairs=q.get('pairs',[])
  if not pairs or any(not p.get('premise','').strip() or not p.get('target','').strip() for p in pairs):errors.append('invalid matching pairs')
  if len({normalize(p.get('premise','')) for p in pairs})!=len(pairs):errors.append('duplicated matching premise')
 for field,text in display_strings(q):
  if not isinstance(text,str):errors.append(field+': nontext');continue
  if re.search(r'[\u0400-\u04ff\u0e00-\u0eff\u202a-\u202e\ufffd]|\bPULSE\b(?=\s+[A-Z0-9])|Dr\s+Marw[ae]\s+Hamdy|Scanned (?:by|with)|\s[¢¥]\)\s|CamScann|sessss|Ssssuueu|sssusse|BIOCHEMIST[A-Z]{2,}|BIOCHEM(?:ISTRY)?\s+ACADEMY',text):errors.append(field+': OCR/footer/script corruption')
  if '\x00' in text:errors.append(field+': control character')
 if not q.get('text','').strip():errors.append('missing stem')
 if q['type'] in ('mcq','truefalse'):
  opts=q.get('options',[]);idx=q.get('correctIndex')
  if len(opts)<2 or any(not isinstance(v,str) or not v.strip() for v in opts):errors.append('invalid options')
  if type(idx)!=int or not 0<=idx<len(opts):errors.append('invalid answer index')
  if len(set(map(normalize,opts)))!=len(opts):errors.append('duplicated option')
  if q['type']=='truefalse' and list(map(normalize,opts))!=['true','false']:errors.append('true/false order')
 if q['type']=='essay' and not (q.get('modelAnswer') or '').strip():errors.append('missing model answer')
 if q['type']=='fillblank' and len(re.findall(r'_{3,}',q['text']))!=len(q.get('blanks',[])):errors.append('blank count')
 if q['type']=='case' and not q.get('subQuestions'):errors.append('missing case children')
 return errors

def apply_decisions(banks,rows):
 out=copy.deepcopy(banks);lookup={(m,q['id']):q for m,c,s,q in iter_questions(out,True)};seen=set();excluded=set()
 allowed={'type','text','options','correctIndex','explanation','keyConcept','modelAnswer','requiredPoints','pairs','blanks','acceptedAnswers','subQuestions'}
 for r in rows:
  key=(r['module'],r['id'])
  if key in seen or key not in lookup:raise ValueError(f'Duplicate/unknown decision: {key}')
  seen.add(key);q=lookup[key]
  if r['question_hash']!=digest(q):raise ValueError(f'Stale decision: {key}')
  if r['decision'] not in ('correct','exclude') or not r.get('reason'):raise ValueError(f'Invalid disposition: {key}')
  if r['decision']=='exclude':excluded.add(key);continue
  changes=r.get('changes',{})
  remove=r.get('removeFields',[])
  if (not changes and not remove) or set(changes)-allowed or set(remove)-{'examTip','keyConcept','modelAnswer','requiredPoints','options','correctIndex'}:raise ValueError(f'Invalid patch: {key}')
  q.update(changes)
  for field in remove:q.pop(field,None)
 for m,b in out.items():
  for c in b['chapters']:
   for s in c['subjects']:
    s['questions']=[q for q in s['questions'] if (m,q['id']) not in excluded]
    for q in s['questions']:
     if 'subQuestions' in q:q['subQuestions']=[sq for sq in q['subQuestions'] if (m,sq['id']) not in excluded]
 return out

def deduplicate(banks):
 out=copy.deepcopy(banks);seen={};ledger=[]
 for m,b in out.items():
  for c in b['chapters']:
   for s in c['subjects']:
    kept=[]
    for q in s['questions']:
     key=duplicate_key(q)
     if key not in seen:seen[key]=(m,c['id'],q);kept.append(q);continue
     cm,cc,canonical=seen[key]
     ledger.append({'module':m,'chapterId':c['id'],'id':q['id'],'canonicalModule':cm,'canonicalChapterId':cc,'canonicalId':canonical['id'],'reason':'Equivalent complete stem, alternatives and answer (or special-format payload).','original':copy.deepcopy(q)})
     for field in ['sourceOccurrences','duplicateAliases']:
      vals=canonical.setdefault(field,[]) if q.get(field) else canonical.get(field,[])
      for item in q.get(field,[]):
       if item not in vals:vals.append(copy.deepcopy(item))
     alias={'module':m,'chapterId':c['id'],'id':q['id']}
     if alias not in canonical.setdefault('duplicateAliases',[]):canonical['duplicateAliases'].append(alias)
    s['questions']=kept
 return out,ledger

def reviewed_deduplicate(banks,rows):
 out=copy.deepcopy(banks);lookup={(m,q['id']):(c,q) for m,c,s,q in iter_questions(out)};removed=set();ledger=[]
 # Validate every review against the unmodified candidate before merging provenance.
 for r in rows:
  key=(r['module'],r['id']);target=(r['canonicalModule'],r['canonicalId'])
  if key==target or key in removed or key not in lookup or target not in lookup:raise ValueError(f'Invalid reviewed duplicate: {key}')
  if digest(lookup[key][1])!=r['question_hash'] or digest(lookup[target][1])!=r['canonical_hash']:raise ValueError(f'Stale duplicate review: {key}')
  if not r.get('reason'):raise ValueError(f'Missing duplicate reason: {key}')
  removed.add(key)
 for r in rows:
  target=(r['canonicalModule'],r['canonicalId'])
  if target in removed:raise ValueError('Duplicate canonical must be retained')
  c,q=lookup[(r['module'],r['id'])];cc,canonical=lookup[target]
  ledger.append(dict(r,chapterId=c['id'],canonicalChapterId=cc['id'],original=copy.deepcopy(q)))
  for field in ('sourceOccurrences','duplicateAliases'):
   for value in q.get(field,[]):
    if value not in canonical.setdefault(field,[]):canonical[field].append(copy.deepcopy(value))
  canonical.setdefault('duplicateAliases',[]).append({'module':r['module'],'chapterId':c['id'],'id':q['id']})
 for m,b in out.items():
  for c in b['chapters']:
   for subject in c['subjects']:subject['questions']=[q for q in subject['questions'] if (m,q['id']) not in removed]
 return out,ledger

def version_questions(banks):
 def content(value):
  if isinstance(value,dict):return {k:content(v) for k,v in value.items() if k not in ('contentVersion','sourceOccurrences','duplicateAliases')}
  if isinstance(value,list):return [content(v) for v in value]
  return value
 for m,c,s,q in iter_questions(banks,True):q['contentVersion']=digest(content(q))

def load_banks(base):
 return {p.stem:json.loads(p.read_text()) for p in sorted(base.rglob('*.json'))}, {p.stem:p for p in sorted(base.rglob('*.json'))}

def write_json(path,value):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def main():
 p=argparse.ArgumentParser();g=p.add_mutually_exclusive_group(required=True);g.add_argument('--audit',action='store_true');g.add_argument('--prepare',action='store_true');g.add_argument('--apply',action='store_true');a=p.parse_args();REPORT.mkdir(parents=True,exist_ok=True)
 live,paths=load_banks(ROOT/'src/imports/year-1/semester-1')
 if a.audit:
  flags=[{'module':m,'id':q['id'],'issues':issues(q)} for m,c,s,q in iter_questions(live,True) if issues(q)]
  _,dups=deduplicate(live);write_json(REPORT/'audit-current.json',{'parents':len(list(iter_questions(live))),'parentsAndChildren':len(list(iter_questions(live,True))),'flags':flags,'duplicates':dups});print(json.dumps({'flags':len(flags),'duplicates':len(dups)}));return
 snapshot=REPORT/'before'
 if not snapshot.exists():
  for m,b in live.items():write_json(snapshot/f'{m}.json',b)
 before,_=load_banks(snapshot)
 before={m:b for m,b in before.items() if m in live}
 rows=[json.loads(l) for f in sorted(REPORT.glob('decisions-*.jsonl')) for l in f.read_text().splitlines() if l.strip() and json.loads(l)['module'] in live]
 candidate=apply_decisions(before,rows);candidate,dups=deduplicate(candidate)
 reviewed=REPORT/'reviewed-duplicates.json'
 if reviewed.exists():
  candidate,extra=reviewed_deduplicate(candidate,json.loads(reviewed.read_text()));dups+=extra
 version_questions(candidate)
 errors=[{'module':m,'id':q['id'],'issues':issues(q)} for m,c,s,q in iter_questions(candidate,True) if issues(q)]
 for m,b in candidate.items():write_json(REPORT/'candidate'/f'{m}.json',b)
 exclusions=[dict(r,original=next(q for mod,c,s,q in iter_questions(before,True) if mod==r['module'] and q['id']==r['id'])) for r in rows if r['decision']=='exclude']
 write_json(REPORT/'duplicates.json',dups);write_json(REPORT/'exclusions.json',exclusions);write_json(REPORT/'release-errors.json',errors)
 summary={'scope':'Year 1 Semester 1 only','modules':{},'corrections':sum(r['decision']=='correct' for r in rows),'exclusions':len(exclusions),'duplicatesRemoved':len(dups),'errors':len(errors),'publication':'Prepared locally; not published.'}
 for m,b in before.items():
  old=[q for mod,c,s,q in iter_questions({m:b})];new=[q for mod,c,s,q in iter_questions({m:candidate[m]})]
  summary['modules'][m]={'before':len(old),'after':len(new),'beforeHash':digest(b),'afterHash':digest(candidate[m]),'types':dict(collections.Counter(q['type'] for q in new))}
 write_json(REPORT/'summary.json',summary)
 if a.apply:
  if errors:raise ValueError(f'{len(errors)} release errors; inspect release-errors.json')
  previous=REPORT/'applied-hashes.json';known=json.loads(previous.read_text()) if previous.exists() else {}
  for m,b in live.items():
   if digest(b) not in (digest(before[m]),known.get(m)):raise ValueError(f'Canonical bank changed outside this release: {m}')
  # All candidates validated before any live file changes; restore exact bytes if an IO failure occurs.
  originals={m:path.read_bytes() for m,path in paths.items()}
  try:
   for m,b in candidate.items():
    if digest(live[m])!=digest(b):write_json(paths[m],b)
  except BaseException:
   for m,path in paths.items():path.write_bytes(originals[m])
   raise
  write_json(previous,{m:digest(b) for m,b in candidate.items()})
 print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
