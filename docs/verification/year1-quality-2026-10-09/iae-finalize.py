import json,re
from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent
m=SourceFileLoader('iae',str(p/'iae-decisions-builder.py')).load_module()
add,ex,qs=m.add,m.ex,m.qs
cart='https://openstax.org/books/anatomy-and-physiology-2e/pages/4-3-connective-tissue-supports-and-protects'
emb='https://openstax.org/books/anatomy-and-physiology-2e/pages/28-2-embryonic-development'
fert='https://www.eshre.eu/-/media/sitecore-files/SIGs/GSCA/IRHEC/Leaflets/ESHRE---How-to-get-pregnant.pdf'
prog='https://www.ncbi.nlm.nih.gov/sites/books/NBK278962/'
def q(n):return qs[f'IAE-1-SRC-{n:04d}']
def expl(n,s,reason,url=None,loc='',claim=''):add(n,{'explanation':s},reason,url,loc,claim)
exclusions={
189:'Both coronary and cerebral arteries can be described as functional end arteries; the choices do not support a unique key.',
559:'Unqualified renal-hilum vertebral level varies by side and individual; the stem does not specify the kidney or reference convention.',
578:'The absolute assertion that tendons never occur in superficial fascial tissue is unreliable; no anatomical region or fascial convention is specified.',
579:'Deep fascia is not categorically absent throughout the face: regional investing fascia is present. The broad face alternative is misleading.',
630:'The unrestricted renal-artery alternative can include its anatomical end-arterial branches, alongside central retinal artery; the explanation wrongly generalizes rich renal collaterals.',
632:'Both coronary and cerebral arteries can be classified as functional end arteries; the single-answer alternatives are not unique.',
643:'Functional end-artery status does not establish absolute absence of arteriovenous connections in the heart; the keyed explanation is unreliable.',
658:'The model categorically denies deep fascia across the face, scalp and anterior abdominal wall without distinguishing regional fascia or muscle-investing layers.',
673:'The historical no-lymphatics list broadly includes organs with regional lymphatics and makes an unsafe categorical claim that their tumors cannot spread lymphatically.',
687:'The no-lymphatics classification treats entire organs as devoid of lymphatics rather than distinguishing parenchymal and regional drainage.',
726:'Veins also possess elastic tissue in their walls, as well as valves; the unqualified choices permit more than one correct property.',
742:'Skin initiates vitamin D synthesis; physiological activation requires subsequent hydroxylation, so the skin activation claim is misleading alongside the incision generalization.',
756:'The renal-artery alternative is insufficiently qualified to exclude renal end-arterial branches, making the end-artery key ambiguous.',
771:'Primary cartilaginous articulation also occurs at the xiphisternal joint, so parts-of-sternum and no-movement alternatives are both defensible.',
797:'Inversion and eversion are also described as rotary movements; the question does not distinguish this classification from its intended alternative.',
812:'Skeletal muscle is generally voluntary and receives sensory innervation; both statements are true.',
839:'The unrestricted example blanks allow many valid sesamoid and pneumatic bones; the exact keyed examples are not uniquely determined.',
846:'The absolute statement that tendons never lie in superficial fascia is not defensible without a region or defined fascial convention.',
848:'Renal end-arterial circulation is a defensible reading of the renal-artery alternative, alongside the central retinal artery.',
877:'Unqualified exact spermatogenesis duration depends on the definition of the cycle and whether epididymal transit is included; competing approximate values are offered.',
888:'The keyed fourth-month placental takeover is too late; none of the offered alternatives captures the luteal-placental transition around gestational weeks7–9.',
893:'The case diagnoses oligospermia and teratospermia from outdated unqualified count and morphology thresholds; infertility cannot be established from those findings alone.',
894:'Marriage and a delayed period do not establish pregnancy or elevated hCG; the case lacks confirmation and treats an assumption as a diagnosis.',
896:'The exact completion day is ambiguous between burial, surface closure and completed implantation; the explanation insists day11 is too late despite standard middle-second-week timing.',
925:'The morphology threshold and automatic infertility conclusion are unsupported; abnormalities alone do not establish infertility.',
943:'A bare total count without units, sample volume or repeat evaluation cannot substantiate the categorical infertility diagnosis.',
947:'Several statements conflate capacitation with acrosomal reaction, membrane fusion and enzyme release, leaving multiple incorrect alternatives.',
964:'The number of somites must specify pairs and developmental endpoint; a fixed single total ignores the usual42–44-pair range and regression.',
968:'Lateral plate somatic mesoderm forms limb connective tissue and skeletal elements, whereas limb muscles arise from somite myotomes; no offered answer is reliably correct.',
974:'Submandibular/sublingual gland epithelium has endodermal origin, and endocrine glands other than pituitary are not uniformly endodermal; more than one alternative is problematic.',
975:'Dental tissues apart from enamel are predominantly neural crest-derived ectomesenchyme, not mesoderm proper; the offered grouping is unreliable.',
1004:'Normal amniotic-fluid volume spans a range and depends on gestational age; an isolated exact1000ml value and a universal over1000ml hydramnios threshold are unreliable.',
1014:'A precise somite count assigned to a single day varies by developmental stage; adjacent offered counts can be compatible with normal variation.',
1024:'The blanket teratogenic classification of broad medication categories is not sufficiently specific to dose, timing or agent; the single clean exception is unreliable.',
1025:'A single exact day-to-somite count is presented without stage or approximation; normal staging ranges overlap the offered counts.',
1027:'Cardiac abnormalities can be associated with polyhydramnios; the broad heart-anomaly alternative is not a categorical false statement.',
1033:'Neural anomalies such as anencephaly can cause polyhydramnios; treating nervous-system anomalies as categorically excluded is incorrect.',
1038:'Meningeal embryological origins vary by cranial region; dura is not uniformly mesodermal, so the unrestricted derivative classification is unreliable.',
1041:'Epiblast and axial mesoderm are both valid developmental-level answers for notochord origin; explanation additionally mislabels notochord ectodermal.',
1042:'Embryonic folding participates in heart-tube formation and gut formation; the loose wording does not provide a single exclusive consequence.',
1054:'The exact somite count for a calendar day overlaps normal stage variation, and adjacent offered counts are not uniquely distinguishable.',
1056:'Cranial dura has regional neural crest contribution, alongside dorsal root ganglia; the unrestricted dura alternative makes the exception unreliable.',
1060:'Autonomic pathways include neural-tube-derived preganglionic neurons and neural-crest-derived peripheral components; the whole-system alternative makes the key ambiguous.',
1069:'The notochord is an axial mesodermal derivative, not the source of all mesoderm; the question confuses developmental source with derivative.',
1070:'The notochord is itself mesodermal, and prechordal mesoderm also exists; an unrestricted claim of no mesoderm is false.',
1079:'A vitelline duct or yolk-sac remnant can persist within the primitive cord; the whole definitive yolk sac is not routinely a cord content as stated.',
1085:'Dermis of the limb/body wall can also arise from somatic lateral plate mesoderm, so the broad dermis alternative competes with supportive body-wall elements.',
1089:'Dura has region-dependent neural crest contribution; the broad statement that all dura is mesodermal and all pia/arachnoid neural crest is unreliable.'}
for n,r in exclusions.items():
 if n==888:ex(n,r,prog,'Corpus Luteum Progesterone; Figure4; Placental Progesterone','Progesterone production shifts toward placenta during weeks7–9; placenta is major definitive source beyond10 weeks.')
 else:ex(n,r)
ex(587,'Nasal cartilage and epiphyseal growth plates are both hyaline cartilage; both alternatives are correct.',cart,'Cartilage','Hyaline cartilage occurs in the nose and epiphyseal growth plates.')
expl(614,'Primary cartilaginous joints unite bones through hyaline cartilage. Some, such as epiphyseal plates, are temporary; others, such as costochondral joints, normally persist. Secondary cartilaginous joints contain fibrocartilage.','The explanation incorrectly called costochondral joints temporary.')
expl(634,'Epiphyseal cartilage is avascular and receives nutrients by diffusion. Epiphyseal arterial branches supply the adjacent bony epiphysis; they do not form ordinary capillaries within the cartilage matrix.','The explanation incorrectly places blood vessels within epiphyseal cartilage.',cart,'Cartilage','Cartilage is avascular and nutrients diffuse through its matrix.')
add(645,{'options':[s.replace('Central nervous system','Central nervous system parenchyma').replace('CNS','CNS parenchyma') for s in q(645)['options']], 'keyConcept':'Conventional lymphatic vessels are absent from CNS parenchyma and avascular tissues; meninges have lymphatic vessels.', 'explanation':'The relevant exception concerns conventional lymphatic vessels within central nervous system parenchyma. Meningeal lymphatic vessels are present, so the whole cranial compartment cannot be described as lacking lymphatic drainage.'},'Qualifies the historical CNS no-lymphatics claim to parenchyma.')
add(662,{'modelAnswer':q(662)['modelAnswer'].replace('contains yellow marrow','contains marrow whose red/yellow composition changes with age, with red marrow predominant in young children')},'A growing bone does not invariably contain adult-pattern yellow marrow.')
add(666,{'modelAnswer':q(666)['modelAnswer'].replace('inelastic','mostly resistant to stretch, although some ligaments contain abundant elastic fibers'), 'explanation':'Joint stability depends on articular shape, ligaments and muscle tone. Most ligaments contain dense collagen and resist excessive movement, but some, such as vertebral elastic ligaments, can stretch and recoil. Healing and vascularity vary by ligament.', 'keyConcept':'Stability depends on bony fit, ligaments and muscle tone; most ligaments resist stretch, while some are elastic.'},'The universal inelastic-ligament assertion is false.',cart,'Dense Connective Tissue','Some ligaments contain abundant elastic fibers and stretch and recoil.')
add(668,{'modelAnswer':q(668)['modelAnswer'].replace(', or triangular as the temporalis', '. Convergent muscles have fan-shaped fibres, as in the temporalis')},'Temporalis is convergent/fan-shaped, not a parallel strap-muscle example.')
add(679,{'text':'In a typical chemical connection between neurons, ___ of one neuron communicate with ___ of the next neuron at a site called ___.'},'Qualifies the synapse to chemical transmission; electrical synapses may transmit bidirectionally.')
expl(680,'Cerebrospinal fluid is in the subarachnoid space between arachnoid and pia. The cranial epidural space is normally potential, whereas the spinal epidural space is a real space containing fat and a venous plexus.','The explanation incorrectly describes the spinal epidural space as potential.')
add(681,{'text':'Preganglionic neurons in spinal cord segments T1–L2 give rise to ___, while those in S2–S4 give rise to ___.'},'Spinal grey-matter neurons are the origin of autonomic outflow; ventral rami themselves are mixed peripheral nerves.')
add(816,{'text':'Which function of the skeleton is performed by providing a system of levers for skeletal muscles?'},'Specifies the intended locomotion mechanism; the skeleton also supports respiratory movements.')
add(819,{'text':'Which synovial joint type allows a wide range of flexion, extension, abduction, adduction, and medial and lateral rotation?'},'Defines full multiaxial ball-and-socket movement rather than unrestricted rotation alone.')
a=q(820)['options'].copy();a[1]='Joints between adjacent vertebral bodies through intervertebral discs';add(820,{'options':a},'Intervertebral joints also include synovial facets; qualifies the intended symphysis.')
add(826,{'text':'Which statement correctly gives the number of pairs of spinal nerves in a region?','options':[s.replace('nerves','pairs of nerves') for s in q(826)['options']], 'keyConcept':'There are8 pairs of cervical spinal nerves.'},'The counts refer to pairs, not individual nerves.')
add(849,{'options':[s.replace('Brain','Brain parenchyma') for s in q(849)['options']]},'Distinguishes parenchyma from meninges with lymphatic vessels.')
add(860,{'text':'Sperm can retain fertilizing capacity in the female reproductive tract for up to approximately:','correctIndex':3,'explanation':'Under favorable conditions sperm can remain capable of fertilization for up to about5 days. An oocyte is generally fertilizable for about24 hours after ovulation, producing a fertile window that includes the five preceding days.','keyConcept':'Sperm can remain fertile for up to about5 days; an oocyte for about24 hours.'},'The48-hour limit understates the fertile window.',fert,'Page1: How many days a month are you fertile?','Sperm can be viable up to5 days and the egg survives about24 hours.')
add(863,{'text':'Until approximately when is the corpus luteum the predominant progesterone source before placental production takes over?','correctIndex':3,'explanation':'The corpus luteum is predominant in very early pregnancy. Production shifts toward the placenta around gestational weeks7–9, and the placenta is the major definitive source beyond10 weeks; this corresponds approximately to the2–3-month option.','keyConcept':'Luteal-placental progesterone transition occurs in the first trimester, around weeks7–9.'},'The fourth-month takeover is too late; distinguishes predominant source from residual corpus-luteum secretion.',prog,'Figure4; Placental Progesterone','Shift occurs approximately7th–9th gestational week; placenta major definitive source beyond10 weeks.')
add(884,{'text':'In a regular28-day menstrual cycle, which statement best describes ovulation?','explanation':'Ovulation may cause mittelschmerz in some women. The LH surge triggers ovulation; it is expected around day14 in a regular28-day cycle, but timing varies in other cycles. The sustained basal-temperature rise follows ovulation. MeiosisII is completed upon fertilization.','keyConcept':'Ovulation timing depends on cycle length; LH surge triggers it and some women experience pain.'},'Avoids assuming that day21 is false for all cycle lengths.',fert,'Page1: Fertility window','Ovulation varies between days10 and26 in healthy cycles.')
expl(889,'Both corpus luteum and placenta produce progesterone during pregnancy. The corpus luteum predominates early; production shifts toward the placenta around gestational weeks7–9, and placenta is the major definitive source beyond10 weeks. The pituitary secretes gonadotrophins, not progesterone.','The explanation places the shift too late.',prog,'Figure4; Placental Progesterone','Shift around weeks7–9; placenta major definitive source beyond10 weeks.')
m.rows[q(889)['id']]['changes']['keyConcept']='Corpus luteum supplies progesterone early; placenta predominates after the first-trimester luteal-placental shift.'
a=json.loads(json.dumps(q(892)['subQuestions']));a[0]['modelAnswer']='Approximately four weeks after fertilization, assuming a regular28-day cycle: fertilization occurs about two weeks before the expected period, which is now two weeks overdue.';a[4]['modelAnswer']='hCG supports the corpus luteum in early pregnancy. Progesterone production shifts toward the placenta around gestational weeks7–9, with placenta the major definitive source beyond10 weeks.'
add(892,{'subQuestions':a,'explanation':'With a regular28-day cycle and a period two weeks overdue, fertilization was approximately four weeks earlier. hCG from syncytiotrophoblast maintains the early corpus luteum; placental progesterone production becomes predominant during the first trimester.','keyConcept':'Two weeks overdue implies about four weeks since fertilization in a regular28-day cycle; hCG maintains early corpus luteum.'},'Corrects the case age arithmetic and late placental-takeover claim.',prog,'Figure4; Placental Progesterone','Progesterone production shifts in weeks7–9 and placenta predominates beyond10 weeks.')
for n in [895,899]:
 stem='A placenta covering the internal cervical os results from implantation in which part of the uterus?' if n==895 else 'A placenta implanted in the lower uterine segment and covering the internal cervical os is called placenta:'
 add(n,{'text':stem,'explanation':'Placenta praevia is a placenta covering the internal cervical os. Low implantation can produce this condition, but a merely low-lying placenta does not necessarily cover the os. Accreta and percreta instead describe abnormal depth of placental attachment.','keyConcept':'Placenta praevia covers the internal cervical os.'},'Low implantation alone is not synonymous with placenta praevia.',emb,'Implantation','Lower uterine implantation can potentially cover the internal os and cause placenta previa.')
expl(905,'The acrosomal reaction releases enzymes and alters sperm membranes to facilitate penetration of the oocyte investments. In normal reproduction this process occurs in association with the cumulus–oocyte complex in the uterine tube; it should not be defined as invariably beginning at first zona-pellucida contact.','Removes an overprecise exclusive zona-contact trigger.')
expl(906,'Sperm acquire motility and functional maturation during epididymal passage. Further capacitation in the female tract or suitable culture conditions is required before fertilization. Sperm leaving the testis have not yet undergone epididymal maturation.','The explanation wrongly describes sperm leaving testis as already motile.')
expl(915,'Implantation begins around day6–7 after fertilization and is completed by the middle of the second week. Different intermediate stages include attachment, burial and closure of the endometrial surface.','Corrects the overearly exact completion claim.',emb,'Implantation','Implantation is complete by middle of second week.')
add(916,{'text':'Which listed site is the usual implantation site on the posterior wall of the upper uterine body?'},'Anterior uterine-body implantation can also be normal; specifies the intended usual posterior site.')
expl(917,'Tubal implantation is ectopic. Implantation in the lower uterine cavity is intrauterine; it can produce a low-lying placenta or placenta praevia if the placenta covers the internal cervical os.','Not every low uterine implantation is placenta praevia.',emb,'Implantation','Low implantation potentially covers internal os.')
a=json.loads(json.dumps(q(920)['subQuestions']));a[0]['text']='Why can a tubal pregnancy not normally reach full term?';a[4]['modelAnswer']='Implantation is completed by the middle of the second week after fertilization.';a[5]['modelAnswer']='No. It is within the uterine cavity. It may produce a low-lying placenta or placenta praevia if the placenta covers the internal cervical os.'
add(920,{'text':q(920)['text'].replace('27-old','27-year-old'),'subQuestions':a,'explanation':'A zona-free blastocyst implants in the endometrium, normally in the upper uterine body. Implantation is completed by the middle of the second week. A tubal pregnancy cannot normally accommodate the growing conceptus and may rupture; low intrauterine implantation is not ectopic and is praevia only when placenta covers the internal os.','keyConcept':'Implantation finishes in the middle of week2; tubal implantation is ectopic; praevia covers internal os.'},'Corrects implantation completion, the broad ectopic claim and low-implantation classification.',emb,'Implantation','Implantation completes by middle of second week; tubal pregnancy can rupture and low implantation can cover os.')
expl(930,'The oocyte is generally fertilizable for about24 hours after ovulation. Under favorable conditions sperm can retain fertilizing capacity for up to5 days, so intercourse before ovulation can lead to pregnancy.','Corrects the48-hour sperm limit.',fert,'Page1 fertile window','Sperm viable up to5 days and egg about24 hours.')
# The essay contains a misleading late takeover rather than an ambiguous tested key.
z=q(931);ch={}
for field in ['modelAnswer','explanation','keyConcept']:
 if field in z:ch[field]=re.sub(r'(?:3\s*(?:[-–]|to)\s*4 months|fourth month|4th month)','first trimester, with progesterone production shifting toward the placenta around gestational weeks7–9',z[field],flags=re.I)
ch['modelAnswer']='Human chorionic gonadotrophin (hCG) is secreted by syncytiotrophoblast and is detected in standard pregnancy tests. It supports the corpus luteum in early pregnancy. Progesterone production shifts toward the placenta around gestational weeks7–9, and the placenta becomes the major definitive source beyond10 weeks.'
ch['keyConcept']='hCG supports the early corpus luteum; the progesterone shift to placenta occurs in the first trimester.'
add(931,ch,'Corrects the fourth-month luteal-placental takeover.',prog,'Figure4; Placental Progesterone','Shift around gestational weeks7–9 and placenta predominates beyond10 weeks.')
add(933,{'text':'Production of mature sperm by meiotic spermatogenesis normally begins at:','explanation':'Meiotic spermatogenesis leading to mature sperm normally begins at puberty. Earlier primordial germ-cell differentiation and establishment of the male germ-cell lineage occur during fetal development, so these are not equivalent milestones.','keyConcept':'Mature sperm production begins at puberty; germ-cell lineage differentiation starts earlier.'},'Original wording incorrectly says primordial germ-cell differentiation begins only at puberty.')
a=q(939)['options'].copy();a[1]='It includes mitotic and meiotic divisions';a[3]='One primary spermatocyte gives rise to four spermatids';add(939,{'options':a,'explanation':'Spermatogenesis occurs in seminiferous tubules and includes mitosis, meiosis and spermiogenesis. One primary spermatocyte yields four spermatids. It begins at puberty and can continue into old age; menopause is a female reproductive event.'},'Avoids a disputed exact cycle duration and incorrectly treating one spermatogonium as a single primary spermatocyte.')
ex(951,'Tubal ectopic implantation is commonly associated with impaired tubal transit or damage, not a universal premature zona-hatching mechanism.',emb,'Implantation','Scar tissue can impede tubal progress, enabling ectopic implantation.')
add(957,{'text':'Which layer of the bilaminar embryonic disc forms the floor of the amniotic cavity?'},'Both epiblast and amniogenic epithelium face the cavity; the disc/floor qualifier makes epiblast unique.')
expl(960,'The notochordal canal communicates caudally with the primitive pit. Cranially, the notochordal process extends toward the prechordal plate.','The explanation incorrectly places the primitive pit at the cranial end of the canal.')
expl(969,'The splanchnic layer of lateral plate mesoderm forms connective tissue and smooth muscle of the gut wall. Limb and trunk skeletal muscles arise from somite myotomes; somatic lateral plate forms limb connective tissue and skeletal elements.','The explanation wrongly attributes limb skeletal muscle to somatic lateral plate mesoderm.',emb,'Organogenesis','Somites form skeletal muscles; mesoderm forms connective tissue and smooth muscle.')
add(981,{'text':q(981)['text'].replace('lateral','medial').replace('Lateral','Medial'),'explanation':'The medial umbilical ligaments are obliterated distal umbilical arteries. The median umbilical ligament is the urachus remnant. Lateral umbilical folds contain inferior epigastric vessels.','keyConcept':'Medial umbilical ligaments are umbilical-artery remnants; median ligament is urachus.'},'Lateral folds and medial ligaments were confused.')
expl(983,'The distal umbilical arteries become the paired medial umbilical ligaments. The urachus becomes the median umbilical ligament. Lateral umbilical folds contain inferior epigastric vessels.','Corrects lateral to medial in the arterial-remnant explanation.')
expl(986,'The umbilical vein carries relatively oxygenated blood from placenta to fetus. Umbilical arteries return relatively deoxygenated blood to placenta. It is incorrect to call the umbilical vein the only oxygenated vein in the body, since pulmonary veins also carry oxygenated blood.','Removes the false only-oxygenated-vein assertion.',emb,'Placenta','Umbilical vein carries oxygenated blood to fetus; umbilical arteries return deoxygenated blood.')
a=q(988)['options'].copy();a[0]='An extra X chromosome in a male, usually47,XXY';add(988,{'options':a},'TrisomyX ordinarily means47,XXX; the intended Klinefelter option must explicitly specify male47,XXY.')
for n in [992,1073]:expl(n,'The notochord is an axial mesodermal structure derived from migrating epiblast cells. Its remnant contributes to the nucleus pulposus of intervertebral discs.','Corrects the ectodermal misclassification of notochord.',emb,'Organogenesis','The notochord is mesoderm-derived and contributes nucleus pulposus.')
expl(995,'A positive hCG test with no intrauterine pregnancy seen raises concern for an ectopic pregnancy, but can also represent an early intrauterine pregnancy. Confirmation requires clinical assessment and appropriate ultrasound and serial hCG evaluation; an adnexal gestational sac supports the ectopic diagnosis.','An empty uterus plus positive hCG alone does not confirm ectopic pregnancy.')
add(1001,{'text':q(1001)['text'].replace('44 XXY','47,XXY').replace('44XXY','47,XXY')},'Distinguishes44 autosomes plusXXY from a total of47 chromosomes.')
add(1010,{'text':'The epithelial lining of the lower respiratory tract (larynx, trachea, bronchi and alveoli) develops principally from:'},'The unrestricted respiratory-passages wording includes ectodermal nasal epithelium.')
a=q(1013)['options'].copy();a=[s.replace('Dermis of skin','Dermis of the back').replace('Dermis of the skin','Dermis of the back').replace('dermis of skin','dermis of the back') for s in a];add(1013,{'options':a},'Qualifies dermis to trunk/back, avoiding cranial neural-crest contributions.')
for n in [1017,1021]:
 add(n,{'text':q(n)['text'].replace('axial skeleton','vertebrae and ribs').replace('Axial skeleton','Vertebrae and ribs')},'The whole axial skeleton includes cranial contributions; vertebrae/ribs specify the somite-derived structures.')
 m.rows[q(n)['id']]['changes']['explanation']='Somites arise from paraxial mesoderm; their sclerotomes form vertebrae and ribs. The entire axial skeleton is not uniformly somite-derived: skull regions have other cranial mesoderm and neural crest contributions.'
 m.rows[q(n)['id']]['changes']['keyConcept']='Paraxial mesoderm forms somites, whose sclerotomes contribute vertebrae and ribs.'
add(1035,{'text':'Which germ layer forms most of the epithelial lining of the gastrointestinal tract, excluding the oral and distal anal ectodermal regions?'},'The whole gut has mesodermal components; the epithelial qualifier makes endoderm appropriate.')
expl(1044,'Most epithelial lining of the gut tube is endodermal, with ectodermal exceptions at the oral and distal anal regions. Gut connective tissue and smooth muscle are largely mesodermal.','Corrects the throughout-endodermal gut lining assertion.',emb,'Embryonic folding','Gut tube is endoderm-lined; mesoderm contributes non-epithelial components.')
expl(1053,'The oropharyngeal and cloacal membranes have apposed ectoderm and endoderm without intervening mesoderm. The notochord is itself axial mesoderm and must not be described as a site devoid of mesoderm.','Corrects the notochord/no-mesoderm explanation.',emb,'Organogenesis','Notochord is mesoderm-derived.')
a=q(1061)['options'].copy();a[0]='It appears during the3rd week after fertilization';add(1061,{'options':a},'The third post-fertilization week is approximately fifth gestational week; original age convention supplies an additional incorrect choice.')
add(1068,{'text':'Somites form by segmentation of which subdivision of intraembryonic mesoderm?'},'Intermediate mesoderm also exhibits cervical nephrotome segmentation; specifies the intended somite process.')
expl(1077,'Most of the gastrointestinal epithelial lining is endodermal. Oral and distal anal epithelial regions are ectodermal exceptions. The other listed structures are surface ectoderm, neuroectoderm or neural-crest derivatives.','Corrects the absolute throughout-endodermal gut assertion.',emb,'Organogenesis','Gut tube lining principally endodermal.')
add(1101,{'text':'Which listed layers are markedly reduced as the placental barrier thins during the second half of pregnancy?'},'Villous connective tissue is reduced rather than disappearing altogether; explanation already distinguishes reduction from persistence.')
# Recoverable spelling only; preserve anatomical meaning and option order.
replacements={
'Pancrease':'Pancreas','pancrease':'pancreas','Dudenum':'Duodenum','retroperitonal':'retroperitoneal','Mesentry':'Mesentery','lamborum':'lumborum','Obterator':'Obturator','obterator':'obturator','Cutenous':'Cutaneous','cutenous':'cutaneous','corachobrachialis':'coracobrachialis','Corachobrachialis':'Coracobrachialis','Rhomboides':'Rhomboid','Triquetrium':'Triquetrum','Trapizeus':'Trapezius','latismuss':'latissimus','Supra spinatous':'Supraspinatus','Infra spinatous':'Infraspinatus','Extonsor':'Extensor','Ulner':'Ulnar','interosseii':'interossei','retinaculae':'retinacula','Cartilagenous':'Cartilaginous','planter':'plantar','erector pilli':'arrector pili','Metacarpophalyngeal':'Metacarpophalangeal','intra-embrtonic':'intra-embryonic','Amion':'Amnion','Heusser':'Heuser','Coloacal':'Cloacal','dicidua':'decidua','Dicidua':'Decidua','Decidua parietals':'Decidua parietalis','Rate testes':'Rete testis','seminephrous':'seminiferous','graffian':'Graafian','Azospermia':'Azoospermia','corona radiate':'corona radiata','Cummulus oophorus':'Cumulus oophorus','fetilization':'fertilization','zone pellucida':'zona pellucida','Zone pellucida':'Zona pellucida','zone reaction':'zona reaction','Triasomy':'Trisomy','Kleinfelter':'Klinefelter','Klinefleter':'Klinefelter','Membrancea':'Membranacea','Acreta':'Accreta','agensis':'agenesis','Pelural':'Pleural','Hydroamnios':'Hydramnios','Oligohydraminos':'Oligohydramnios','extraembryonic ceolem':'extraembryonic coelom','extraembryonic coelem':'extraembryonic coelom','intraembyonic':'intraembryonic','coelon':'coelom','Sterna angle':'Sternal angle','Symphesis pupis':'Symphysis pubis','Sarco iliac':'Sacroiliac'}
def fix(v):
 if isinstance(v,str):
  for a,b in replacements.items():v=v.replace(a,b)
  v=re.sub(r'\b([Pp]ia|[Dd]ura|[Aa]rachnoid) matter\b',r'\1 mater',v)
  v=re.sub(r'\binterosseus\b','interosseous',v,flags=re.I)
  v=re.sub(r'(?<=\w)(?=[0-9]+(?: days| weeks| months| pairs|ml))',' ',v)
  v=re.sub(r'\b(weeks|days|about|beyond|the|week)(?=[0-9])',r'\1 ',v)
  v=re.sub(r'([0-9])(ml|cm|mm)\b',r'\1 \2',v)
  return v
 if isinstance(v,list):return [fix(x) for x in v]
 if isinstance(v,dict):return {k:fix(x) if k not in ['id','type'] else x for k,x in v.items()}
 return v
for z in m.ql:
 old=m.rows.get(z['id'])
 if old and old['decision']=='exclude':continue
 ch={}
 for field in ['text','options','pairs','blanks','explanation','keyConcept','modelAnswer','subQuestions']:
  if field in z:
   before=old['changes'].get(field,z[field]) if old else z[field];after=fix(before)
   if after!=before:ch[field]=after
 if ch:
  if old:old['changes'].update(ch);old['reason']+=' Recoverable spelling/spacing normalized.'
  else:add(int(z['id'].split('-')[-1]),ch,'Corrects recoverable spelling/spacing; semantic answer unchanged.')
# Remove unchanged fields so each correction represents an actual mutation.
for id,row in list(m.rows.items()):
 if row['decision']=='correct':
  row['changes']={k:v for k,v in row['changes'].items() if v!=qs[id].get(k)}
  if not row['changes']:del m.rows[id]
m.save(1107)
children=[]
for parent in m.ql:
 for child in parent.get('subQuestions',[]):
  children.append({'module':'IAE-1','parent_id':parent['id'],'id':child['id'],'question_hash':m.hashlib.sha256(json.dumps(child,sort_keys=True,ensure_ascii=False).encode()).hexdigest(),'semantic_review_completed':True,'review_method':'Model self-review of the full child stem and model answer within its complete parent case; selective evidence, not independent adjudication.','parent_decision':m.rows.get(parent['id'],{}).get('decision','no_change_proposed')})
(p/'coverage-IAE-1-children.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in children))
print('rows',len(m.rows),'exclude',sum(r['decision']=='exclude' for r in m.rows.values()),'correct',sum(r['decision']=='correct' for r in m.rows.values()))
