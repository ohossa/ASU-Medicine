import json,hashlib
from pathlib import Path
p=Path(__file__).resolve().parent.parent
bank=json.loads((p/'duplicate-review-candidate.json').read_text());qs={};position={}
for c in bank['chapters']:
 for s in c['subjects']:
  for q in s['questions']:position[q['id']]=len(position);qs[q['id']]=q
H=lambda q:hashlib.sha256(json.dumps(q,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
files=['duplicate-candidates-proteins.json','duplicate-candidates-enzymes_genes.json','duplicate-variants-carbs_lipids.json']
merge={files[0]:{0,2,3,5,7,8,9,10,11,12,13,14,15},files[1]:{4,5,6,7,8,9,10},files[2]:{0,1,3,4,5}}
why={
(files[0],0):'Same twenty-common-amino-acid completion and identical 10/18/20/22 alternatives; only number of underscore characters differs.',
(files[0],2):'Same nitrogen-containing-compound question. Alanine is the same answer and all five molecules are identical; option order and grammar differ.',
(files[0],3):'Both request the aromatic amino acids with the identical three named residues and identical three required points; wording is a paraphrase.',
(files[0],5):'Both identify the nonpolar aliphatic R-group set; all four amino-acid groups and the glycine/alanine/leucine answer agree.',
(files[0],7):'Both identify proline as the nonpolar residue among the same five amino acids; singular/plural wording and option order differ.',
(files[0],8):'Both ask the cyclic nonpolar amino acid among the same five choices; tryptophan is the answer. More explicit aromatic wording adds no competing alternative or new task.',
(files[0],9):'Same leucine24/phenylalanine125 folded-protein interaction scenario, same five interaction types and hydrophobic answer; disulfide bridge/bond are synonyms.',
(files[0],10):'Both enumerate exactly three tertiary-structure stabilizing forces. Required concepts are hydrophobic, hydrogen-bond and ionic interactions; specifying charged side chains only explains the same ionic interaction.',
(files[0],11):'Same folded-subunit homo/heterodimer question with all four alternatives and quaternary-structure answer identical. Added opening clause describes proteins and creates no distinct assessment.',
(files[0],12):'Identical glycine backbone-flexibility question. All alternatives are semantically identical, including singular/plural hydrophobic-amino-acid distractor; glycine answer agrees.',
(files[0],13):'Same protein-misfolding clinical-disease question and same four diseases; Alzheimer versus Alzheimer disease names the same answer.',
(files[0],14):'Same alkaptonuria cause-and-manifestations prompt. Both rubrics require homogentisate dioxygenase deficiency, dark urine on exposure and ochronosis/arthritis; phrasing alone differs.',
(files[0],15):'Same albinism cause-and-manifestations prompt; both answers qualify tyrosinase deficiency as one form and include hypopigmentation, photosensitivity and skin-cancer risk. Four versus three rubric entries only splits the same content.',
(files[1],4):'Same enzyme-activation-energy completion, same stopping/raising/lowering/bonding alternatives and lowering answer; punctuation of the completion gap differs.',
(files[1],5):'Same four coenzyme properties plus all-of-the-above alternative and answer; tightly bounded/bound is grammatical variation without biochemical difference.',
(files[1],6):'Same initial enzyme-reaction velocity definition and five alternatives; before product accumulation is the identical answer.',
(files[1],7):'Same permanent aspirin/cyclooxygenase inhibition trigger and all five Vmax/Km alternatives; decreased Vmax answer agrees.',
(files[1],8):'Same constitutive-expression definition and all four alternative enzyme categories; wording and singular/plural agreement differ.',
(files[1],9):'Same cAMP-producing-enzyme question with PKA/PDE/adenylate cyclase/phosphatase choices and adenylate cyclase answer.',
(files[1],10):'Same adenylyl-cyclase cAMP substrate completion and 5-prime AMP/3-prime AMP/ADP/ATP alternatives. Typographic prime/spacing differs; ATP answer agrees.',
(files[2],0):'Both request exactly two choline-containing phospholipids; phosphatidylcholine and sphingomyelin model answer and required points are identical.',
(files[2],1):'Same depot-versus-tissue fat comparison with the identical three composition/site/function dimensions and exactly identical model answer and three-point rubric. General versus three-difference phrasing has no actual rubric breadth difference.',
(files[2],3):'Same glycerophospholipid-precursor question and all four cholesterol/sphingosine/arachidonate/phosphatidate options; phosphatidate answer agrees.',
(files[2],4):'Same membrane-suitability question; all five alternatives are equivalent including long-chain fatty acids, charge, molecular weight, phosphorus and amphipathicity. Same amphipathic answer; options are permuted.',
(files[2],5):'Same false signal-transduction statement among the identical five propositions. Both key the phosphorylated-glycogen-synthase-active assertion; options permuted.',
(files[1],1):'Preserve: coenzyme alternative sets differ (nonprotein/needed-for-activity versus heat stability/NAD loose attachment); identical all-of-the-above labels do not make full questions equivalent.',
(files[1],2):'Preserve: correct alternatives explicitly differ—hypoxanthine to uric acid versus hypoxanthine to xanthine. These assess the overall oxidation versus its first step.',
(files[1],3):'Preserve: one assesses diagnostic importance among five properties; the other assesses LDH example plus diagnostic use and a combined C/D key. Full alternatives and keyed content differ.',
(files[1],11):'Preserve: distractor a substrate needed for enzyme action versus a substance needed for enzyme action has materially different biochemical scope. Same zymogen answer alone is insufficient to discard distinct alternatives.',
(files[2],6):'Preserve: the answer option is pyruvate kinase in one record and phosphoglycerate kinase in the other; these are distinct valid substrate-level phosphorylation reactions.'}
rows=[];dispositions=[];done=set()
def add(ids,reason):
 ids=sorted(ids,key=lambda x:position[x]);canonical=ids[0]
 for id in ids[1:]:
  if id in done:continue
  done.add(id);rows.append({'module':'IBM-1','id':id,'canonicalModule':'IBM-1','canonicalId':canonical,'question_hash':H(qs[id]),'canonical_hash':H(qs[canonical]),'reason':reason,'method':'Nonblind semantic comparison of complete candidate stems, every alternative and keyed answer, or full essay model answer and required-point rubric. Exact candidate hashes include existing contentVersion.'})
 return canonical
for f in files:
 for i,g in enumerate(json.loads((p/f).read_text())):
  ids=g['ids'];absent=[id for id in ids if id not in qs]
  if absent:status='already_absent_after_exclusion_or_automatic_dedup';reason='No new deletion: at least one candidate ID is absent from the post-correction review snapshot.';canonical=None
  elif i in merge[f]:status='merge_semantically_equivalent';reason=why[(f,i)];canonical=add(ids,reason)
  else:status='retain_distinct_full_questions';reason=why[(f,i)];canonical=None
  dispositions.append({'module':'IBM-1','candidateFile':f,'groupIndex':i,'ids':ids,'disposition':status,'canonicalId':canonical,'reason':reason,'absentIds':absent,'reviewedPayloads':[{**{k:qs[id].get(k) for k in ['id','type','text','options','correctIndex','modelAnswer','requiredPoints','explanation']},'hash':H(qs[id])} for id in ids if id in qs]})
extra={19:'Same explain-uncharged-polar-side-chain prompt: electronegative O/N and hydrogen bonding to water without net ionization are the same two required concepts; hydroxyl/amide examples explain rather than change the rubric.',25:why[(files[0],10)],43:'Same causes of vitamin A deficiency; both three-point rubrics require inadequate dietary vitamin A/carotenoids, pancreatic fat malabsorption and gastrointestinal malabsorption. All three causes match semantically.',128:'Both enumerate four mutation causes: replication errors, spontaneous base damage, radiation and chemical mutagens. Cytosine deamination/benzopyrene are examples of the same categories, not additional required topics.',130:'Same prokaryotic/eukaryotic translation comparison: identical three rubric dimensions (70S/80S ribosomes, fMet/Met initiator, Shine-Dalgarno versus cap/scanning). General comparison and exactly-three wording have the same actual expected answer breadth.'}
essay=[]
for i,g in enumerate(json.loads((p/'essay-similar-stem-candidates.json').read_text())):
 ids=[g['a']['id'],g['b']['id']];absent=[id for id in ids if id not in qs];canon=None
 if absent:status='already_consolidated_or_absent';reason='Matching fragments were already combined or an ID is absent after prior authorized processing; no duplicate removal is introduced.'
 elif i in extra:status='merge_semantically_equivalent';reason=extra[i];canon=add(ids,reason)
 else:
  a,b=[qs[id] for id in ids];status='retain_distinct_tasks_or_rubric';reason=f"Preserve the different tested task or required answer breadth: {a['text']} versus {b['text']}. The complete model answers and required-point rubrics were compared; similarity of stem vocabulary is insufficient."
 essay.append({'module':'IBM-1','pairIndex':i,'ids':ids,'disposition':status,'reason':reason,'canonicalId':canon,'absentIds':absent,'reviewedPayloads':[{k:qs[id].get(k) for k in ['id','type','text','modelAnswer','requiredPoints']} for id in ids if id in qs]})
same=[]
sameWhy={0:'Generic choose-correct-answer stems hide different amino-acid/protein alternative sets and different keyed propositions; preserve all.',1:why[(files[0],12)],2:'Different full alternatives and different sugar-alcohol answers: mannitol versus ribitol.',3:'Different full alternatives and different pentose answers: ribulose versus ribose.',4:why[(files[1],2)],5:'One has both pyruvate and alpha-ketoglutarate dehydrogenases and a combined key; the other has only alpha-ketoglutarate as its keyed alternative. Preserve.',6:'The three isoenzyme questions assess separate definition, diagnostic role and LDH-example-plus-diagnostic propositions through distinct alternatives.',7:why[(files[2],6)],8:'Distinct false claims and keys: low glucokinase Vmax versus glucokinase glucose-6-phosphate inhibition. Preserve.'}
for i,g in enumerate(json.loads((p/'same-stem-groups.json').read_text())):
 ids=[x['question']['id'] for x in g];same.append({'module':'IBM-1','groupIndex':i,'ids':ids,'disposition':'merge_semantically_equivalent' if i==1 else 'retain_distinct_full_questions','reason':sameWhy[i],'reviewedPayloads':[{k:qs[id].get(k) for k in ['id','type','text','options','correctIndex','modelAnswer','requiredPoints']} for id in ids if id in qs]})
assert len(essay)==161 and len(same)==9 and len(dispositions)==35
removed={r['id'] for r in rows};assert not removed.intersection(r['canonicalId'] for r in rows),'chained target'
for r in rows:assert r['question_hash']==H(qs[r['id']]) and r['canonical_hash']==H(qs[r['canonicalId']])
for name,data in [('reviewed-duplicates.json',rows),('duplicate-candidate-dispositions.json',dispositions),('essay-similar-stem-dispositions.json',essay),('same-stem-dispositions.json',same)]: (p/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('removals',len(rows),'candidateGroups',len(dispositions),'essayPairs',len(essay),'sameStemGroups',len(same));print('duplicate IDs',[r['id'] for r in rows])
