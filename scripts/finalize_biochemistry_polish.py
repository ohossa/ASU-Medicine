"""Finalize/replay the local IBM-1 polish layer and preserve its pre-polish audit."""
import argparse,collections,hashlib,json,shutil
from pathlib import Path
from biochemistry_polish import apply,questions

def main():
 p=argparse.ArgumentParser();p.add_argument('job');p.add_argument('repo');a=p.parse_args();job=Path(a.job);repo=Path(a.repo);phase=job/'POLISH';docs=repo/'docs/verification/biochemistry-import-2026-10-09';audit=docs/'polish';audit.mkdir(exist_ok=True)
 for name in ['medical-decisions.json','source-accounting.json','import-report.json','README.md']:
  dest=audit/('before-'+name)
  if not dest.exists():shutil.copyfile(docs/name,dest)
 before=json.loads((phase/'bank-before.json').read_text());rows=[json.loads(l) for f in sorted(phase.glob('decisions-*.jsonl')) for l in f.read_text().splitlines() if l.strip()];bank=apply(before,rows);qs=questions(bank);old={q['id']:q for q in questions(before)}
 decisions=json.loads((audit/'before-medical-decisions.json').read_text());account=json.loads((audit/'before-source-accounting.json').read_text());report=json.loads((audit/'before-import-report.json').read_text());dm={d['id']:d for d in decisions};am={r['sourceId']:r for r in account}
 for r in rows:
  if r['status']=='unchanged':continue
  for occ in old[r['id']]['sourceOccurrences']:
   d=dm[occ['sourceId']];ar=am[occ['sourceId']];d['polish_review']=r
   if r['status']=='exclude':d['decision']='exclude';d['reason']=r['reason'];ar.update(decision='exclude',reason=r['reason'],canonicalId=None)
   elif r['status']=='correct':d['decision']='correct';ar.update(decision='correct',reason=r['reason'])
   if r.get('explanation'):d['explanation']=r['explanation']
   mapping={'text':'final_text','options':'final_options','correctIndex':'correct_index','modelAnswer':'model_answer','requiredPoints':'required_points','explanation':'explanation'}
   for k,v in r.get('changes',{}).items():d[mapping[k]]=v
   d['evidence']+=r.get('evidence',[]);ar['reviewFiles'].append('polish/decisions.jsonl')
 for d in decisions:
  for e in d.get('polish_review',{}).get('evidence',[]):
   if 'opened_full_text' not in e and 'opened' in e.get('access_method','').lower():e['opened_full_text']=True
 source={r['id']:r for l in (job/'EXTRACTION/records.jsonl').read_text().splitlines() if (r:=json.loads(l))}
 active=[r for r in account if r['canonicalId']];report['decisionCounts']=dict(collections.Counter(d['decision'] for d in decisions));report['decisionCounts']['needs_review']=0
 report['uniqueQuestions']=len(qs);report['questionTypes']=dict(collections.Counter(q['type'] for q in qs));report['releasedOccurrences']=len(active);report['duplicatesConsolidated']=len(active)-len(qs)
 report['recordedKeyMismatches']=sum(d.get('historical_comparison')=='MISMATCH' and d['decision'] in ['accept','correct'] for d in decisions)
 report['derivedMissingAnswerOccurrences']=sum(source[r['sourceId']]['answer_status']=='not_supplied' or (source[r['sourceId']].get('historical_answer') or '').startswith('Not supplied') for r in active)
 report['chapterTopics']=[{'chapter':c['title'],'topics':[{'topic':t,'questions':sum(q['lecture']==i+1 for q in s['questions'])} for i,t in enumerate(s['lectureNames'])]} for c in bank['chapters'] for s in c['subjects']]
 data=json.dumps(bank,ensure_ascii=False,indent=2)+'\n';report['bankSha256']=hashlib.sha256(data.encode()).hexdigest()
 counts=dict(collections.Counter(r['status'] for r in rows));changed=[r for r in rows if r.get('explanation') and r['status']!='exclude']
 summary={'reviewed':len(rows),'counts':counts,'explanationsChanged':len(changed),'explanationsChangedByType':dict(collections.Counter(old[r['id']]['type'] for r in changed)),'finalQuestions':len(qs),'finalTypes':report['questionTypes'],'excludedIds':[r['id'] for r in rows if r['status']=='exclude'],'correctedIds':[r['id'] for r in rows if r['status']=='correct'],'beforeSha256':hashlib.sha256((phase/'bank-before.json').read_bytes()).hexdigest(),'afterSha256':report['bankSha256'],'method':'Read every released stem, alternatives, explanation and model answer for a focused nonblind consistency recheck; reused prior opened evidence and opened targeted sources for uncertainty. Not a new independent clinical review.','publication':'Local only; no push or deployment.'}
 report['polish']=summary
 for name,obj in [('medical-decisions.json',decisions),('source-accounting.json',account),('import-report.json',report)]: (docs/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
 (audit/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');(audit/'decisions.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows));shutil.copyfile(phase/'bank-before.json',audit/'bank-before.json')
 (phase/'bank-after.json').write_text(data);(repo/'src/imports/year-1/semester-1/IBM-1.json').write_text(data)
 print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
