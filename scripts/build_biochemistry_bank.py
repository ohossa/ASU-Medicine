"""Build IBM-1 from the immutable intake and exact-content medical decisions.
No source answers are defaulted. Does not copy into canonical imports or publish.
"""
import argparse,collections,hashlib,json,re
from pathlib import Path
from biochemistry_txt_intake import release_errors,reviewed_options
BASEFILES=['decisions-protein.jsonl','decisions-enzymes_carbohydrates.jsonl','decisions-lipids_molecular.jsonl','decisions-mixed-0-148.jsonl','decisions-mixed-149-217.jsonl','decisions-mixed-218-310.jsonl','decisions-mixed-311-402.jsonl']
SUPPLEMENTS=['decisions-protein-enzyme-resolution.jsonl','decisions-mixed-root-resolution.jsonl','decisions-mixed-268-resolution.jsonl','decisions-protein-lipid-resolution.jsonl','decisions-protein-clinical-resolution.jsonl','decisions-canonical-cleanup.jsonl','decisions-enzymes-label-resolution.jsonl','decisions-protein-final-resolution.jsonl']
def load(p):return [json.loads(s) for s in p.read_text().splitlines() if s.strip()]
def norm(s):return re.sub(r'\s+',' ',s.casefold()).strip(' .;,')
def topic(d):
 t=d.get('topic','').lower()
 if t in ['aa','beta','protein structure','chemical bonds','protein interactions','amyloid','prion'] or any(s in t for s in ['amino acid chemistry','amino acids and protein structure','protein nutritional']):return 1,'Amino acids and protein structure'
 if t=='hb' or any(s in t for s in ['hemoglobin','heme']):return 1,'Hemoglobin and heme'
 if 'iron' in t:return 1,'Iron metabolism'
 if 'vitamin' in t:return 1,'Vitamins and coenzymes'
 if any(s in t for s in ['lipid chemistry','fatty acid chemistry','membrane','lung surfactant']) or t in ['lipid','mem','surf']:return 1,'Lipid chemistry and membranes'
 if any(s in t for s in ['carbohydrate chemistry','glycosaminoglycan','fiber']):return 1,'Carbohydrate chemistry'
 if any(s in t for s in ['replication','transcription','translation','gene expression','molecular genetics','nucleotide']):return 1,{'dna replication':'DNA replication','transcription':'Transcription','translation':'Translation','regulation of gene expression':'Regulation of gene expression'}.get(t,'Nucleotides and nucleic acids')
 if 'amino acid and nitrogen' in t:return 2,'Amino acid and nitrogen metabolism'
 if 'lipid metabolism' in t:return 2,'Lipid metabolism'
 if 'pentose' in t:return 2,'Pentose phosphate pathway'
 if 'glycogen' in t:return 2,'Glycogen metabolism'
 if any(s in t for s in ['citric','tca']) or t=='tca':return 2,'TCA cycle and bioenergetics'
 if 'bioenergetics' in t:return 2,'TCA cycle and bioenergetics'
 if 'glycolysis' in t:return 2,'Glycolysis and pyruvate metabolism'
 if 'clinical enzyme' in t:return 2,'Clinical enzyme markers'
 if any(s in t for s in ['enzyme','regulation']) or t in ['reg','alp']:return 2,'Enzymes and regulation'
 if any(s in t for s in ['metab','glucose','carbohydrate digestion','functional plasma']):return 2,'Carbohydrate metabolism and glucose homeostasis'
 raise ValueError('Unmapped reviewed topic: '+repr(d.get('topic')))

def build(job,template,out):
 source=load(job/'EXTRACTION/records.jsonl');byid={r['id']:r for r in source};decisions={};origins={}
 for f in BASEFILES:
  for d in load(job/'REVIEW'/f):
   if d['id'] in decisions:raise ValueError('Duplicate base review '+d['id'])
   if d['id'] not in byid:raise ValueError('Unknown review '+d['id'])
   decisions[d['id']]=d;origins[d['id']]=[f]
 if set(decisions)!=set(byid):raise ValueError('Review coverage does not match source IDs')
 for f in SUPPLEMENTS:
  if (job/'REVIEW'/f).exists():
   for d in load(job/'REVIEW'/f):
    if d['id'] not in decisions or d['content_hash']!=byid[d['id']]['content_hash']:raise ValueError('Invalid supplemental review')
    decisions[d['id']]=d;origins[d['id']].append(f)
 accepted=[];account=[];blocked=[]
 for r in source:
  d=decisions[r['id']]
  if d['content_hash']!=r['content_hash']:raise ValueError('Stale review '+r['id'])
  state=d['decision'];errs=release_errors(r,d) if state in ['accept','correct'] else []
  if errs:blocked.append({'id':r['id'],'errors':errs})
  if state in ['accept','correct'] and not errs:accepted.append((r,d))
  account.append({'sourceId':r['id'],'source':r['source'],'page':r['page'],'line':r['line'],'contentHash':r['content_hash'],'reviewFiles':origins[r['id']],'decision':state,'reason':d.get('reason') or d.get('rationale'),'releaseErrors':errs,'canonicalId':None})
 out.mkdir(parents=True,exist_ok=True)
 (out/'gate-errors.json').write_text(json.dumps(blocked,indent=2)+'\n')
 if blocked:raise ValueError(f'{len(blocked)} review candidates failed release gate; see gate-errors.json')
 bank=json.loads(template.read_text());groups={};conflicts=[]
 for r,d in accepted:
  typ=d['type'];opts=reviewed_options(r,d);text=d.get('final_text',r['text']).strip()
  # Never merge questions by stem alone: preserve altered alternatives, negations and essay tasks.
  signature=(typ,norm(text),tuple(sorted(norm(o) for o in opts))) if typ=='mcq' else (typ,norm(text),norm(d['model_answer']))
  answer=norm(opts[d['correct_index']]) if typ=='mcq' else norm(d['model_answer'])
  if signature in groups:
   old=groups[signature]
   if old['answer']!=answer:conflicts.append([old['rows'][0][0]['id'],r['id']]);continue
   old['rows'].append((r,d));continue
  groups[signature]={'rows':[(r,d)],'answer':answer}
 if conflicts:raise ValueError('Conflicting duplicate keys: '+repr(conflicts))
 topicorder=['Amino acids and protein structure','Hemoglobin and heme','Iron metabolism','Carbohydrate chemistry','Lipid chemistry and membranes','Vitamins and coenzymes','Nucleotides and nucleic acids','DNA replication','Transcription','Translation','Regulation of gene expression','Enzymes and regulation','Clinical enzyme markers','Glycolysis and pyruvate metabolism','Carbohydrate metabolism and glucose homeostasis','Glycogen metabolism','Pentose phosphate pathway','TCA cycle and bioenergetics','Amino acid and nitrogen metabolism','Lipid metabolism']
 mapped={1:[],2:[]};amap={x['sourceId']:x for x in account}
 for group in groups.values():
  r,d=group['rows'][0];ch,t=topic(d);cid='IBM1-'+r['id'];typ=d['type'];q={'id':cid,'type':typ,'text':d.get('final_text',r['text']).strip(),'lecture':0,'explanation':d['explanation'].strip(),'reviewStatus':'source_grounded_nonblind_ai_review','sourceOccurrences':[{'sourceId':rr['id'],'source':rr['source'],'page':rr['page'],'sourceQuestionNumber':rr['source_question_number']} for rr,dd in group['rows']]}
  if typ=='mcq':q.update(options=reviewed_options(r,d),correctIndex=d['correct_index'])
  else:q.update(modelAnswer=d['model_answer'],requiredPoints=d['required_points'])
  mapped[ch].append((t,q))
  for rr,dd in group['rows']:amap[rr['id']]['canonicalId']=cid
 for chapter in bank['chapters']:
  ch=chapter['id'];sub=chapter['subjects'][0];names=[t for t in topicorder if any(t==n for n,q in mapped[ch])]
  sub.update(lectureNames=names,lectureCount=len(names),lectures=', '.join(names),questions=[])
  chapter['lectureRange']=f'{len(names)} topics'
  if ch==2:chapter['title']=chapter['subtitle']='Enzymes, Bioenergetics & Metabolism'
  for t,q in sorted(mapped[ch],key=lambda x:topicorder.index(x[0])):q['lecture']=names.index(t)+1;sub['questions'].append(q)
 bank['comingSoon']=False
 data=json.dumps(bank,ensure_ascii=False,indent=2)+'\n';(out/'IBM-1.json').write_text(data)
 (out/'source-accounting.json').write_text(json.dumps(account,ensure_ascii=False,indent=2)+'\n')
 (out/'medical-decisions.json').write_text(json.dumps(list(decisions.values()),ensure_ascii=False,indent=2)+'\n')
 (out/'medical-decisions.jsonl').write_text(''.join(json.dumps(decisions[r['id']],ensure_ascii=False)+'\n' for r in source))
 metrics={'sourceRecords':len(source),'sourceQuestions':sum(r['answer_status']!='unlinked_answer' for r in source),'unlinkedHistoricalAnswers':sum(r['answer_status']=='unlinked_answer' for r in source),'decisionCounts':{k:sum(d['decision']==k for d in decisions.values()) for k in ['accept','correct','exclude','needs_review']},'recordedKeyMismatches':sum(d.get('historical_comparison')=='MISMATCH' and d['decision'] in ['accept','correct'] for d in decisions.values()),'derivedMissingAnswerOccurrences':sum((r['answer_status']=='not_supplied' or (r['historical_answer'] or '').startswith('Not supplied')) and d['decision'] in ['accept','correct'] for r,d in accepted),'releasedOccurrences':len(accepted),'uniqueQuestions':len(groups),'duplicatesConsolidated':len(accepted)-len(groups),'questionTypes':dict(collections.Counter(q['type'] for c in bank['chapters'] for q in c['subjects'][0]['questions'])),'chapterTopics':[{'chapter':c['title'],'topics':[{'topic':t,'questions':sum(q['lecture']==i+1 for q in c['subjects'][0]['questions'])} for i,t in enumerate(c['subjects'][0]['lectureNames'])]} for c in bank['chapters']],'bankSha256':hashlib.sha256(data.encode()).hexdigest(),'limitations':['Nonblind AI review using opened sources; no independent clinician certification.','Original PDFs were not inspected; repairs use the designated TXT and its page transcripts.','No current course textbook was designated, so complete source scope is retained, including advanced metabolism.'],'publication':'Local candidate; no push or deployment.'}
 (out/'import-report.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2)+'\n');print(json.dumps(metrics,ensure_ascii=False,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('job',type=Path);p.add_argument('template',type=Path);p.add_argument('out',type=Path);a=p.parse_args();build(a.job,a.template,a.out)
