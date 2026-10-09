"""Apply a complete, reviewed stable-ID topic ledger; never change question content."""
import argparse, copy, hashlib, json
from pathlib import Path

def questions(bank):
 return [q for c in bank['chapters'] for s in c['subjects'] for q in s['questions']]

def reorganize(bank, rows, topics):
 qs=questions(bank);ids=[q['id'] for q in qs];mapped=[r['id'] for r in rows]
 if len(set(ids))!=len(ids) or len(set(mapped))!=len(mapped) or set(ids)!=set(mapped):
  raise ValueError('Mapping must cover every unique question exactly once')
 keys=[t['key'] for t in topics]
 if len(set(keys))!=len(keys) or len({t['id'] for t in topics})!=len(topics):raise ValueError('Duplicate topic keys or IDs')
 mapping={r['id']:r['section'] for r in rows}
 if not set(mapping.values())<=set(keys):raise ValueError('Unknown topic')
 out=copy.deepcopy(bank);out['chapters']=[]
 for t in topics:
  selected=[dict(copy.deepcopy(q),lecture=1) for q in qs if mapping[q['id']]==t['key']]
  if not selected:continue
  out['chapters'].append({'id':t['id'],'title':t['title'],'subtitle':t['subtitle'],'emoji':'🧪' if t['id']<200 else '📚','page':t['page'],'lectureRange':'1 topic','subjects':[{'id':'biochem','name':'Biochemistry','iconName':'FlaskConical','lectures':t['title'],'lectureCount':1,'lectureNames':[t['title']],'questions':selected}]})
 old={q['id']:{k:v for k,v in q.items() if k!='lecture'} for q in qs}
 new={q['id']:{k:v for k,v in q.items() if k!='lecture'} for q in questions(out)}
 if old!=new:raise ValueError('Protected question content changed')
 return out

def main():
 p=argparse.ArgumentParser();p.add_argument('baseline');p.add_argument('ledger');p.add_argument('topics');p.add_argument('output');p.add_argument('--expected-sha256',required=True);a=p.parse_args()
 data=Path(a.baseline).read_bytes()
 if hashlib.sha256(data).hexdigest()!=a.expected_sha256:raise ValueError('Baseline checksum mismatch')
 bank=reorganize(json.loads(data),[json.loads(l) for l in Path(a.ledger).read_text().splitlines() if l.strip()],json.loads(Path(a.topics).read_text()))
 Path(a.output).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 print(f"Organized {len(questions(bank))} questions in {len(bank['chapters'])} sections")
if __name__=='__main__':main()
