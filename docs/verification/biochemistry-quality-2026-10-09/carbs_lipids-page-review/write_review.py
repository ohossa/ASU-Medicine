import json,hashlib,re
from pathlib import Path
p=Path(__file__).resolve().parent.parent
d=json.loads((p/'carbs_lipids-questions.json').read_text());manifest=json.loads((p/'carbs_lipids-page-review/manifest.json').read_text())
mp={(x['source'],str(x['page'])):x for x in manifest};changes={};reasons={};ev={}
def patch(i,fields,reason='Restore OCR-damaged scientific notation or wording from the visually inspected original question page.'):
 changes.setdefault(i,{}).update(fields);reasons[i]=reason
def opts(i,repl):
 a=d[i]['question']['options'][:]
 for j,v in repl.items():a[j]=v
 patch(i,{'options':a})
def txt(i,s):patch(i,{'text':s})
txt(23,'α and β forms of D-glucose are:')
txt(38,'A carbohydrate formed by β(1→4) galactosidic linkages is:')
txt(65,'Glycosidic linkages in: starch, glycogen, maltose, isomaltose.')
opts(75,{1:'Has a free anomeric carbon.'})
patch(80,{'options':['Galactose and glucose are epimers as they differ in OH of C2.','Fructose and glucose are epimers as they differ in OH of C2.','Mannose and glucose are epimers as they differ in OH of C4.','Mannose & Galactose are not epimers.'],'correctIndex':3},'Original PDF has four separately labelled alternatives a–d. OCR merged b and c; split them and remap the unchanged correct answer to index 3.')
opts(84,{0:'α-Glucose and α-Glucose',1:'α-Glucose and β-Glucose',2:'α-Glucose and β-Fructose',3:'β-Glucose and β-Galactose',4:'α-Fructose and β-Galactose'})
txt(88,'All of the following are reducing sugars EXCEPT:')
reasons[88]='Printed source itself contains malformed wording (convert have reducing agent). Make the intended reducing-sugar question grammatical without changing options or key.'
opts(100,{0:'α(1→4)',1:'α(1→2)',2:'β(1→4)',3:'β(1→2)'})
opts(114,{1:'Include chondroitin sulphate'})
opts(144,{1:'α-Linolenic and timnodonic acids.',2:'Linoleic and α-linolenic acids.'})
opts(146,{1:'α-Linolenic acid',2:'γ-Linolenic acid'})
txt(152,'FA which contains one double bond and is ω-7 is:')
opts(153,{3:'It is an ω-3 FA.'})
txt(154,'α-Linolenic acid is characterized by:');opts(154,{2:'It is an ω-3 FA.'})
txt(177,'α-Linolenic and linoleic acids must be supplied in the diet.')
txt(185,'ω-3 fatty acids have significant effects on brain cognitive function; which of the following foods is rich in them?')
opts(192,{0:'Cholesterol'})
reasons[192]='Remove ACADEMY logo text accidentally appended to cholesterol; original printed alternative is only Cholesterol.'
opts(196,{3:'α-Linolenic acid'})
txt(207,'ω-3 fatty acids have significant effects on brain cognitive function; which of the following foods is rich in them?');opts(207,{4:'Salmon fish'})
reasons[207]='Restore ω-3 symbol and correct obvious source spelling Salamon to Salmon, retaining the same food and key.'
txt(223,'α-Linolenic and linoleic acids are essential fatty acids.')
opts(257,{4:'Conversion of 3-phosphoglycerate to phosphoenolpyruvate'})
opts(259,{0:'Glyceraldehyde-3-phosphate dehydrogenase'})
txt(268,'For every one molecule of glucose oxidized during glycolysis, ____ molecules of pyruvic acid are produced.')
opts(269,{0:'Phosphofructokinase-1'})
opts(273,{3:'Phosphofructokinase-1'})
opts(286,{2:'Hexokinase and glucokinase'})
opts(302,{3:'Both insulin and glucagon levels decrease.'})
reasons[302]='Delete appended page/OCR fragments 61 61 IlI from the last option; they are absent from the printed alternative.'
txt(316,'Two causes of normoglycemic glucosuria.')
opts(329,{2:'Increased cytosolic [Ca²⁺]'})
opts(367,{0:'Coenzyme Q (ubiquinone)'})
reasons[367]='Correct erroneous printed cytochrome Q terminology: Q is the quinone coenzyme ubiquinone, not a cytochrome. No answer-index change.'
ev[367]=[{'url':'https://www.ebi.ac.uk/chebi/CHEBI:46245','title':'ChEBI:46245 — coenzyme Q10','locator':'Definition and ontology','proposition':'Coenzyme Q10 is a ubiquinone; a chemically defined quinone rather than a cytochrome.','opened':True}]
opts(368,{1:'Complex II, III, IV.'})
opts(376,{2:'α-Ketoglutarate dehydrogenase'})
txt(377,'Arsenic inhibits α-ketoglutarate dehydrogenase by forming a stable complex with:')
txt(387,'In the citric acid cycle, conversion of α-ketoglutarate to succinate is inhibited by:');opts(387,{1:'Iodoacetate'})
txt(389,'A high NADH/NAD⁺ ratio ____ isocitrate dehydrogenase and α-ketoglutarate dehydrogenase:')
reasons[389]='Restore the full clause lost in extraction: printed stem names both isocitrate and alpha-ketoglutarate dehydrogenases and a completion blank, plus NAD+ charge.'
txt(401,'Two compounds with low energy bonds.')
txt(410,"Muscular exercise stimulates Krebs' cycle.")
for i,repl in [(416,{3:'α-Ketoglutarate dehydrogenase'}),(418,{3:'α-Ketoglutarate dehydrogenase'}),(419,{3:'α-Ketoglutarate'}),(420,{3:'α-Ketoglutarate'}),(421,{3:'α-Ketoglutarate'}),(422,{1:'α-Ketoglutarate dehydrogenase'}),(423,{0:'α-Ketoglutarate dehydrogenase'}),(424,{3:'Mitochondrial matrix.'}),(425,{2:'α-Ketoglutarate dehydrogenase.'}),(428,{3:'Involve loss of CO2 and the production of FADH2.'})]:opts(i,repl)
txt(425,'Which reaction of the TCA cycle produces FADH2?')
txt(433,'The enzyme that catalyzes the splitting of PIP2 into the two products inositol 1,4,5-trisphosphate (IP3) and diacylglycerol in cell signaling is:')
opts(434,{0:'Inositol 1,4,5-trisphosphate (IP3)'})
for i in [433,434]:
 reasons[i]='Correct chemical name triphosphate to inositol 1,4,5-trisphosphate; IP3 bears three separate phosphate groups. PLC produces one IP3 and one DAG, rather than two IP3 molecules. Preserve existing key.'
 ev[i]=[{'url':'https://www.ebi.ac.uk/thornton-srv/m-csa/entry/28/','title':'M-CSA — Phosphoinositide phospholipase C','locator':'Description, enzyme reaction and primary research references','proposition':'PLC hydrolyzes PIP2 to DAG and inositol 1,4,5-trisphosphate; both are second messengers.','opened':True,'primaryReferences':['Essen et al., Biochemistry 1997, 36:1704–1718; DOI 10.1021/bi962512p','Essen et al., Nature 1996, 380:595–602; DOI 10.1038/380595a0']}]
opts(451,{0:'Hormone sensitive lipase'})
txt(453,'β-Oxidation of fatty acids occurs in:')
txt(456,'One of the following inhibits β-oxidation of fatty acids:')
opts(459,{2:'β-Oxidation',3:'ω-Oxidation'})
opts(462,{0:'It is due to deficiency of the enzyme system of α-oxidation',3:'It is due to absence of peroxisomes in all tissues'})
reasons[462]='Restore alpha symbol and remove appended chapter heading/page number/next section (Lipid Metabolism 49 I-Mention) from the last alternative.'
txt(475,'Mechanism of action of steroidal anti-inflammatory drugs (SAIDs) and nonsteroidal anti-inflammatory drugs (NSAIDs).')
reasons[475]='Repair malformed bracket grouping around two drug classes; original source separately labels SAID and NSAID, rather than placing NSAID inside SAID parentheses.'
txt(477,'Importance of β-oxidation.')
txt(479,'Regulation of β-oxidation.')
# Page/heading pollution rules apply only to those exact records reviewed above.
for i in [65,316,401,410]:reasons[i]='Remove the next section heading accidentally appended to this essay prompt; original page visually separates the heading from the question.'
records=[];coverage=[]
for i,x in enumerate(d):
 q=x['question'];h=hashlib.sha256(json.dumps(q,sort_keys=True,ensure_ascii=False).encode()).hexdigest();s=q['sourceOccurrences'][0];page=mp.get((s['source'],s['page']));pageReview=[]
 if page:pageReview=[{'source':s['source'],'page':page['page'],'render':str(Path('carbs_lipids-page-review')/page['image']),'method':'Original PDF rendered with PyMuPDF; full page visually inspected in paired atlas, not embedded OCR text.'}]
 if i in changes:
  records.append({'module':'IBM-1','id':q['id'],'chapterId':x['chapterId'],'hash':h,'currentHash':h,'decision':'correct','changes':changes[i],'reason':reasons[i],'evidence':ev.get(i,[{'kind':'original_source_visual','source':s['source'],'page':s['page'],'proposition':'Printed source confirms the intended wording, separate alternatives, scientific symbol or section boundary.','viewed':bool(pageReview)}]),'sourcePageReview':pageReview,'method':'Nonblind full-record review and original-page visual reconciliation; current keys visible; no independent adjudicator.','answerChange':('correctIndex' in changes[i]),'answerChangeNature':'Index remapping after restoring merged option; answer content unchanged.' if 'correctIndex' in changes[i] else 'No answer content or index change.'})
 coverage.append({'module':'IBM-1','id':q['id'],'chapterId':x['chapterId'],'hash':h,'method':'Nonblind question-by-question full-record reading: complete stem, each supplied alternative, current key, explanation, model answer and required points read; OCR, chemistry wording, key plausibility and ambiguity screened. Existing keys were visible; not uncued or independent adjudication. Newly introduced chemical-name corrections have opened evidence; unchanged items did not receive new evidence retrieval.','status':'correction_proposed' if i in changes else 'screened_no_change','sourcePageReview':pageReview,'correctIndexReviewed':q.get('correctIndex'),'limitations':'Screening is not a fresh source-grounded medical re-verification of unchanged questions; visual coverage limited to 39 suspicious original pages.'})
(p/'decisions-carbs_lipids.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in records))
(p/'coverage-carbs_lipids.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in coverage))
pairs=[(164,168,'same requested two choline-containing phospholipids, identical answer and points'),(222,224,'same tissue/depot comparison; identical model answer, one asks for three differences'),(185,207,'same full alternative set and answer, after Greek/salmon spelling cleanup'),(192,208,'same full alternative set and phosphatidic-acid answer, after logo cleanup'),(225,236,'same full alternative set and amphipathic answer; options permuted'),(335,336,'same complete signal-transduction alternatives and answer; options permuted')]
(p/'duplicate-variants-carbs_lipids.json').write_text(json.dumps([{'ids':[d[a]['question']['id'],d[b]['question']['id']],'reason':r,'status':'true_duplicate_variant_for_parent_adjudication','optionsAndAnswerReviewed':True,'preserveContradictoryKeys':True} for a,b,r in pairs]+[{'ids':[d[287]['question']['id'],d[288]['question']['id']],'reason':'Same stem but different correct option: pyruvate kinase vs phosphoglycerate kinase; preserve both distinct alternatives.','status':'not_a_duplicate'}],ensure_ascii=False,indent=2))
for f in ['NBK2236-evidence.txt','NBK9885-evidence.txt']:
 z=p/'carbs_lipids-page-review'/f
 if z.exists():z.unlink()
print('coverage',len(coverage),'decisions',len(records),'keys',sum('correctIndex' in r['changes'] for r in records),'source pages',len(manifest));assert len(coverage)==490;assert len({x['id'] for x in coverage})==490
print('changed indices',sorted(changes))
