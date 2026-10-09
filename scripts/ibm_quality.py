"""Replay the dedicated IBM-1 OCR/content audit without changing any other bank.

python3 scripts/ibm_quality.py --prepare
python3 scripts/ibm_quality.py --apply
Original question and source-PDF hashes bind corrections to the reviewed data.
"""
import argparse,copy,json,hashlib
from pathlib import Path
from year1_quality import ROOT,digest,apply_decisions,deduplicate,reviewed_deduplicate,version_questions,iter_questions,issues,write_json
REPORT=ROOT/'docs/verification/biochemistry-quality-2026-10-09'
TARGET=ROOT/'src/imports/year-1/semester-1/IBM-1.json'

def prepare():
 before=json.loads((REPORT/'before.json').read_text())
 rows=[json.loads(line) for path in sorted(REPORT.glob('decisions-*.jsonl')) for line in path.read_text().splitlines() if line.strip()]
 banks=apply_decisions({'IBM-1':before},rows);banks,duplicates=deduplicate(banks)
 write_json(REPORT/'review-candidate.json',banks['IBM-1'])
 consolidated=[]
 consolidation=REPORT/'reviewed-consolidations.json'
 if consolidation.exists():banks,consolidated=reviewed_deduplicate(banks,json.loads(consolidation.read_text()))
 write_json(REPORT/'duplicate-review-candidate.json',banks['IBM-1'])
 review=REPORT/'reviewed-duplicates.json'
 if review.exists():
  banks,extra=reviewed_deduplicate(banks,json.loads(review.read_text()));duplicates+=extra
 version_questions(banks);candidate=banks['IBM-1']
 errors=[dict(id=q['id'],issues=issues(q)) for m,c,s,q in iter_questions(banks,True) if issues(q)]
 original={q['id']:q for m,c,s,q in iter_questions({'IBM-1':before},True)}
 exclusions=[dict(r,original=copy.deepcopy(original[r['id']])) for r in rows if r['decision']=='exclude']
 write_json(REPORT/'consolidations.json',consolidated);write_json(REPORT/'candidate.json',candidate);write_json(REPORT/'duplicates.json',duplicates);write_json(REPORT/'exclusions.json',exclusions);write_json(REPORT/'release-errors.json',errors)
 summary=dict(module='IBM-1',before=len(list(iter_questions({'IBM-1':before}))),after=len(list(iter_questions(banks))),beforeHash=digest(before),afterHash=digest(candidate),correctionRecords=sum(r['decision']=='correct' for r in rows),exclusions=len(exclusions),duplicatesRemoved=len(duplicates),fragmentsConsolidated=len(consolidated),types=dict(__import__('collections').Counter(q['type'] for m,c,s,q in iter_questions(banks))),errors=len(errors),publication='Prepared locally; not published.')
 write_json(REPORT/'summary.json',summary)
 return before,candidate,summary

def coverage_errors(before):
 expected={q['id']:digest(q) for m,c,s,q in iter_questions({'IBM-1':before},True)}
 rows=[json.loads(line) for path in sorted(REPORT.glob('coverage-*.jsonl')) for line in path.read_text().splitlines() if line.strip()]
 errors=[];seen=set()
 for r in rows:
  id=r['id']
  if id in seen or id not in expected:errors.append('Duplicate/unknown coverage: '+id)
  seen.add(id)
  if r.get('question_hash')!=expected.get(id):errors.append('Stale coverage: '+id)
  if r.get('review_completed') is not True:errors.append('Unconfirmed review: '+id)
 errors+=['Missing review: '+id for id in expected.keys()-seen]
 return errors

def source_errors(rows):
 errors=[]
 for source in rows:
  for entry in source.get('matches',[]):
   path=Path(entry['path'])
   if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=entry['sha256']:errors.append('Missing/changed source PDF: '+str(path))
 return errors

def main():
 parser=argparse.ArgumentParser();group=parser.add_mutually_exclusive_group(required=True);group.add_argument('--prepare',action='store_true');group.add_argument('--apply',action='store_true');args=parser.parse_args()
 before,candidate,summary=prepare()
 if args.apply:
  errors=coverage_errors(before)+source_errors(json.loads((REPORT/'source-map.json').read_text()))
  if summary['errors'] or errors:raise ValueError(f'Release blocked: {summary["errors"]} content errors; {errors[:10]}')
  live=json.loads(TARGET.read_text());previous=REPORT/'applied-hash.json';known=json.loads(previous.read_text()) if previous.exists() else None
  if digest(live) not in (digest(before),digest(candidate),known):raise ValueError('IBM-1 changed outside this reviewed release')
  # The single-bank write is atomic, and no unrelated canonical files are opened for writing.
  if digest(live)!=digest(candidate):
   temporary=TARGET.with_suffix('.json.ibm-quality-tmp');write_json(temporary,candidate);temporary.replace(TARGET)
  write_json(previous,digest(candidate))
 print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
