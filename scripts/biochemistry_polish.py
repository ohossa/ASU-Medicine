"""Replay the versioned explanation/medical recheck over an immutable bank."""
import copy,hashlib,json,argparse
from pathlib import Path

def digest(q):return hashlib.sha256(json.dumps(q,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
def questions(bank):return [q for c in bank['chapters'] for s in c['subjects'] for q in s['questions']]
def apply(bank,rows):
 ids=[r['id'] for r in rows];qs=questions(bank)
 if len(ids)!=len(set(ids)) or set(ids)!={q['id'] for q in qs}:raise ValueError('Exact unique question coverage required')
 lookup={r['id']:r for r in rows};out=copy.deepcopy(bank)
 for c in out['chapters']:
  for s in c['subjects']:
   kept=[]
   for q in s['questions']:
    r=lookup[q['id']]
    if r['question_hash']!=digest(q):raise ValueError('Stale question hash: '+q['id'])
    if r['status'] not in ('unchanged','polished','correct','exclude') or not r.get('reason'):raise ValueError('Invalid disposition')
    changes=r.get('changes',{})
    if set(changes)-{'text','options','correctIndex','modelAnswer','requiredPoints','explanation'}:raise ValueError('Illegal changed field')
    if changes and r['status']!='correct':raise ValueError('Substantive changes require correction disposition')
    if r['status'] in ('correct','exclude'):
     if not any(e.get('url') and e.get('locator') and e.get('claim') for e in r.get('evidence',[])):raise ValueError('Grounded evidence required')
    if r['status']=='exclude':continue
    q.update(changes)
    if 'explanation' in r:q['explanation']=r['explanation']
    if not q.get('explanation','').strip() or 'see above' in q['explanation'].lower():raise ValueError('Missing explanation')
    if q['type']=='mcq':
     opts=q['options'];norm=[v.casefold().strip() for v in opts]
     if len(opts)<2 or len(norm)!=len(set(norm)) or not 0<=q['correctIndex']<len(opts):raise ValueError('Invalid options/key')
    elif not q.get('modelAnswer','').strip() or not all(str(p).strip() for p in q.get('requiredPoints',[])) or not q.get('requiredPoints'):raise ValueError('Incomplete essay')
    kept.append(q)
   s['questions']=kept
 return out

def main():
 p=argparse.ArgumentParser();p.add_argument('bank');p.add_argument('decisions',nargs='+');p.add_argument('--output',required=True);a=p.parse_args()
 rows=[json.loads(l) for f in a.decisions for l in Path(f).read_text().splitlines() if l.strip()]
 out=apply(json.loads(Path(a.bank).read_text()),rows);Path(a.output).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'reviewed':len(rows),'retained':len(questions(out))}))
if __name__=='__main__':main()
