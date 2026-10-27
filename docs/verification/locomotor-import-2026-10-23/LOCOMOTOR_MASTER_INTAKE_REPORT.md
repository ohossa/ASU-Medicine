# Master Locomotor (MLS-1) Multi-Source Intake & Medical Verification Report
**Ain Shams University Faculty of Medicine — Year 1 Semester 2**  
*Release Date: October 23, 2026 · Module: Locomotor (MLS-1) · Schema Version: 1*

---

## 1. Executive Summary & Verification Gates

An exhaustive, forensic medical intake and cryptographic cross-deduplication was executed across **all 122 files** located in:
`/Users/omarhossa/Documents/Pulse Questions/Year 1 (57CP 1020 Marks)/Semester 2 (30CP 540 Marks)/Locomotor Q's`

All individual departmental collections, revision quizzes, clinical scenario banks, official essay exams, and the master merged volumes (`Part1.pdf` and `part2.pdf`) have been thoroughly cataloged, OCR-verified, deduplicated via SHA-256 fingerprints, and structured into [`src/imports/year-1/semester-2/MLS-1.json`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/src/imports/year-1/semester-2/MLS-1.json).

### Quality & Semantic Verification Gates
- **Total Questions in Canonical Bank (`MLS-1.json`)**: **2,134 Questions** (2,019 MCQs + 115 Clinical & Written Essay Problems)
- **Total Deduplicated Occurrences Mapped**: **617 duplicate instances** in [`duplicates.json`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/docs/verification/locomotor-import-2026-10-23/duplicates.json)
- **Total Excluded Artifacts**: **263 items** (diagrams without standalone stems, OCR noise) in [`exclusions.json`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/docs/verification/locomotor-import-2026-10-23/exclusions.json)
- **Schema Validation (`validate-banks.ts`)**: **Passed 100% across all 42 module banks**
- **TypeScript Typecheck (`npm run typecheck`)**: **0 errors (App, Node, API configs)**
- **Vitest Test Suite (`npm test -- --run`)**: **129/129 test files, 739/739 tests passed (100%)**
- **Bank Manifest (`scripts/generate-bank-manifest.mjs`)**: Synchronized for 42 banks

---

## 2. Canonical Bank Architecture (`MLS-1.json`)

The module is structured into the official 3 integrated Ain Shams Locomotor chapters:

### Chapter 1: Upper Limb Anatomy & Injuries (1,241 Questions)
- **Anatomy** (166 questions): Pectoral region, axilla, brachial plexus, shoulder, arm, cubital fossa, forearm, wrist, hand, joints of upper limb, clinical cases.
- **Biochemistry** (143 questions): Collagen synthesis, vitamin C, copper, calcium homeostasis, purine synthesis & catabolism, muscle energetics.
- **Histology** (515 questions): Cartilage (hyaline, elastic, fibrocartilage), bone (compact, cancellous, osteoblasts, osteoclasts, epiphyseal plate), muscle tissue, sarcomere.
- **Pharmacology** (28 questions): Neuromuscular blockers (succinylcholine, tubocurarine, atracurium, rocuronium), spasmolytics.
- **Physiology** (389 questions): Excitation-contraction coupling, sliding filament theory, motor units, muscle mechanics, true/false definitions.

### Chapter 2: Lower Limb Anatomy & Injuries (410 Questions)
- **Anatomy** (28 questions): Thigh compartments, gluteal region, femoral triangle, popliteal fossa, leg & foot compartments, hip & knee joints, femoral neck fractures.
- **Biochemistry** (37 questions): Fatty acid oxidation, carnitine shuttle, beta-oxidation, muscle energetics.
- **Histology** (102 questions): Neuronal cytology, myelinated/unmyelinated axons, peripheral nerve histology, Schwann cells, nodes of Ranvier.
- **Parasitology** (44 questions): *Trichinella spiralis*, encysted larvae, muscle trichinellosis.
- **Pathology** (67 questions): Soft tissue tumors (lipoma, liposarcoma, rhabdomyosarcoma, synovial sarcoma), myopathies (DMD, BMD, LEMS).
- **Pharmacology** (132 questions): NSAIDs, aspirin, paracetamol, celecoxib, indomethacin, acute & chronic gout pharmacotherapy (colchicine, allopurinol, febuxostat, probenecid, pegloticase).

### Chapter 3: Spine & Musculoskeletal Pathologies (483 Questions)
- **Histology** (92 questions): Thick and thin skin histology, epidermal layers (stratum basale to corneum), melanocytes, Langerhans cells, Merkel cells.
- **Microbiology** (104 questions): Pyogenic osteomyelitis (Staphylococcus aureus, Salmonella, MRSA), septic arthritis, reactive arthritis, soft tissue infections (erysipelas, cellulitis, impetigo, gas gangrene, SSSS, scarlet fever, TSS, actinomycosis, anthrax, leprosy).
- **Parasitology** (189 questions): Medical arthropods and vectors (fleas, ticks, mites, lice, bugs, flies, myiasis, scabies).
- **Pathology** (63 questions): Bone & joint infections (involucrum, sequestrum, Brodie abscess), bone neoplasms (osteosarcoma, Ewing sarcoma, giant cell tumor, chondrosarcoma, multiple myeloma), skin pathology (psoriasis, lichen planus, pemphigus, dermatitis herpetiformis, seborrheic keratosis, actinic keratosis, Bowen disease).
- **Pharmacology** (35 questions): Antifungal pharmacotherapy (polyenes, azoles, echinocandins, terbinafine, griseofulvin, flucytosine).

---

## 3. Complete File-by-File Accounting Ledger (All 122 Files)

| # | Source File Path | Classification | Verification Status & Mapping |
| :---: | :--- | :--- | :--- |
| 1 | `Biochemistry Locomotor MCQs - CA1.pdf` | Duplicate of OMAR MCQ 2022 | Identical 14-page CA1 exam scan (Merged in Part 2 p.141) |
| 2 | `Biochemistry MCQs - Locomotor Part 1.pdf` | Standalone Core Bank | Independently ingested, cross-deduplicated, verified |
| 3 | `Essay and Cases of Locomotor Module.pdf` | Reference Clinical Cases | Dr. Ahmed Farid Anatomy Review Volume 2 (119 pages) |
| 4 | `iNerd Locomotor Essay.pdf` | Reference Joints Q&A Atlas | 60-page upper/lower limb joints flashcard study guide |
| 5 | `Locomotor 1 Biochemistry MCQs.pdf` | Standalone Core Bank | Independently ingested, cross-deduplicated, verified |
| 6 | `Locomotor Histology MCQs - Dr. Suzi & Dr. Nevert.pdf` | Standalone Core Bank | Independently ingested, cross-deduplicated, verified |
| 7 | `Mcq 2/HEGAZY bone pathology Q 2021.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 84) |
| 8 | `Mcq 2/KHALIFA ANSWER_.jpg` | Merged in Part 1 | OCR verified in Part 1 (Page 91) |
| 9 | `Mcq 2/KHALIFA MCQ bone.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 92) |
| 10 | `Mcq 2/KHALIFA mcq skin patho.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 97) |
| 11 | `Mcq 2/nerve & muscle pathology Q 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 101) |
| 12 | `Mcq 2/null.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 105) |
| 13 | `Mcq 2/skin dr.Khalifa-10-11.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 107) |
| 14 | `Mcq 2/TAREK bone-dep mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 109) |
| 15 | `Mcq 2/TAREK bone-mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 122) |
| 16 | `Mcq 2/TAREK mcq patho.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 129) |
| 17 | `Mcq 2/TAREK MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 140) |
| 18 | `Mcq 2/TAREK Skin mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 145) |
| 19 | `Mcq 2/tutorial skin.pptx.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 149) |
| 20 | `MCQ 3/ALAA loco para mcq 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 192) |
| 21 | `MCQ 3/ALAA MCQ parasitology 1.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 213) |
| 22 | `MCQ 3/ALAA mites mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 233) |
| 23 | `MCQ 3/AYMAN Loco mcq(2) 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 244) |
| 24 | `MCQ 3/AYMAN MCQ-Para-Locomotor.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 252) |
| 25 | `MCQ 3/AYMAN para MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 281) |
| 26 | `MCQ 4/ALAA Essay questions 1.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 308) |
| 27 | `MCQ 4/ALAA Loco mcq 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 324) |
| 28 | `MCQ 4/ALAA loco MCQ 3 (2022).pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 310) |
| 29 | `MCQ 4/ALAA MCQ  Osteomyelitis.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 342) |
| 30 | `MCQ 4/ASHRAF MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 346) |
| 31 | `MCQ 4/AYMAN Bone MCQs.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 349) |
| 32 | `MCQ 4/Bacterial skin infection MCQs 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 351) |
| 33 | `MCQ 4/Dr Ashraf_Locomotor Essay - 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 357) |
| 34 | `MCQ 4/LOCO MCQ 2-Solved.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 361) |
| 35 | `MCQ 4/LOCO MCQ 2.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 366) |
| 36 | `MCQ 4/NOHA MCQs.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 371) |
| 37 | `MCQ 4/NOHA micro MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 380) |
| 38 | `mcq/ALAA GOUT MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 1) |
| 39 | `mcq/ALAA MCQ 2022.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 7) |
| 40 | `mcq/ALAA MCQ SKMR & Antifungals.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 22) |
| 41 | `mcq/ALAA PGS & NSAIDS MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 40) |
| 42 | `mcq/ALAA SKMR & Antifungal drugs MCQ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 58) |
| 43 | `mcq/ELSHAAEIR mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 62) |
| 44 | `mcq/ELSHAEER Fungi + SMR (TRIAL Qs and As 2021).pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 65) |
| 45 | `mcq/ELSHAEER GOUT QUIZ.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 67) |
| 46 | `mcq/ELSHAEER LOCOMOTOR PHARMA MCQs.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 70) |
| 47 | `mcq/ELSHAEER pharma mcq.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 73) |
| 48 | `mcq/ELSHAEER SMR & antifungi MCQs.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 77) |
| 49 | `mcq/GOUT MODEL ANSWER.pdf` | Merged in Part 1 | OCR verified in Part 1 (Page 81) |
| 50 | `McQs 2/essay questions part 2.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 79) |
| 51 | `McQs 2/essay questions.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 88) |
| 52 | `McQs 2/marwa answers_.jpg` | Merged in Part 2 | OCR verified in Part 2 (Page 95) |
| 53 | `McQs 2/MARWA MCQs 1.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 96) |
| 54 | `McQs 2/mcq bio loco dr.marwa.pdf.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 103) |
| 55 | `McQs 2/MCQs FA oxidation and skin.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 109) |
| 56 | `McQs 2/OMAR bio mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 114) |
| 57 | `McQs 2/OMAR Loco mcq 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 126) |
| 58 | `McQs 2/OMAR loco p1 mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 133) |
| 59 | `McQs 2/OMAR MCQ 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 141) |
| 60 | `McQs 2/OMAR MCQs 2.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 155) |
| 61 | `MCQs 3/department mcqs.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 164) |
| 62 | `MCQs 3/essay histo loco2.jpg` | Merged in Part 2 | OCR verified in Part 2 (Page 210) |
| 63 | `MCQs 3/HEGAZY bone mcq2021.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 211) |
| 64 | `MCQs 3/HEGAZY cartilage MCQ 2021.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 218) |
| 65 | `MCQs 3/HEGAZY Loco mcq 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 227) |
| 66 | `MCQs 3/HEGAZY muscle mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 256) |
| 67 | `MCQs 3/HEGAZY nervous mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 259) |
| 68 | `MCQs 3/HEGAZY skin mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 274) |
| 69 | `MCQs 3/HISTO LOCOMOTOR MCQ.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 287) |
| 70 | `MCQs 3/Locomotor Part 1 ASU (1).pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 333) |
| 71 | `MCQs 3/nervous tissue histology MCQ.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 334) |
| 72 | `MCQs 3/ZAHRA bone mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 349) |
| 73 | `MCQs 3/ZAHRA cartilage & bone mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 363) |
| 74 | `MCQs 3/ZAHRA cartilage mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 382) |
| 75 | `MCQs 3/ZAHRA cartilage&bone 2022 .pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 388) |
| 76 | `MCQs 3/ZAHRA mcq SKIN.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 402) |
| 77 | `MCQs 3/ZAHRA muscle mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 418) |
| 78 | `MCQs 3/ZAHRA Muscle MCQs.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 423) |
| 79 | `MCQs 3/ZAHRA muscle-nerve-skin  2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 428) |
| 80 | `MCQs 3/ZAHRA Skin + nerve MCQs.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 475) |
| 81 | `McQs 4/4_5875477319186910626.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 491) |
| 82 | `McQs 4/4_5875477319186910627.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 497) |
| 83 | `McQs 4/4_5875477319186910628.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 501) |
| 84 | `McQs 4/Ashraf Ramzy .pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 505) |
| 85 | `McQs 4/Ashraf Ramzy mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 741) |
| 86 | `McQs 4/Atlas of Human  Anatomy.pdf` | Reference Atlas | Anatomical textbook (Netter 791 pages), reference only |
| 87 | `McQs 4/CamScanner 07-31-2021 18.06.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1768) |
| 88 | `McQs 4/JOINT QUIZ 2-1.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1789) |
| 89 | `McQs 4/JOINT QUIZ 2.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1790) |
| 90 | `McQs 4/locomotor revision 1 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1791) |
| 91 | `McQs 4/LOCOMOTOR UPPER LIMB CASES.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1812) |
| 92 | `McQs 4/LOWER LIMB MCQ (BY DR. YOUSSEF).pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1818) |
| 93 | `McQs 4/M.ADEL ANSWERS.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1822) |
| 94 | `McQs 4/M.ADEL mcq 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1828) |
| 95 | `McQs 4/M.ADEL mcq anatomy-merged.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1840) |
| 96 | `McQs 4/MCQs anatomy locomotor.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1861) |
| 97 | `McQs 4/YOUSSEF answers.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1869) |
| 98 | `McQs 4/YOUSSEF JOINT QUIZ 2.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1881) |
| 99 | `McQs 4/YOUSSEF LL mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1882) |
| 100 | `McQs 4/YOUSSEF lower limb .pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1899) |
| 101 | `McQs 4/YOUSSEF mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1916) |
| 102 | `McQs 4/YOUSSEF quiz 3,4.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1928) |
| 103 | `McQs 4/YOUSSEF UL mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1934) |
| 104 | `McQs 4/YOUSSEF upper quiz 1 ANSWERED.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1955) |
| 105 | `McQs/ABDELHAMID Locomotor Physiology MCQs.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 1) |
| 106 | `McQs/Locomotor Physiology. 2022. MCQs.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 17) |
| 107 | `McQs/M.HASSAN skeletal muscle mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 36) |
| 108 | `McQs/OSAMA locomotor 1 2022.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 40) |
| 109 | `McQs/OSAMA locomotor mcq.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 47) |
| 110 | `McQs/physiology easy questions.pdf` | Merged in Part 2 | OCR verified in Part 2 (Page 75) |
| 111 | `MLS-1_v4_strict_checkpoint_881.json` | Historical Baseline Checkpoint | 865 core questions baseline checkpoint |
| 112 | `Parasitology MCQs 1.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 113 | `Parasitology MCQs 2.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 114 | `Parasitology MCQs 3.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 115 | `Parasitology MCQs 4.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 116 | `Parasitology MCQs 5.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 117 | `Parasitology MCQs 6.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 118 | `Parasitology MCQs 7.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 119 | `Parasitology MCQs 8.pdf` | MCQ 3/ Duplicate Scan | Identical scan to MCQ 3/ parasitology collection (Merged in Part 1) |
| 120 | `Part1.pdf` | Master Merged Volume | Master OCR compilation volume (387 pages) |
| 121 | `part2.pdf` | Master Merged Volume | Master OCR compilation volume (1955 pages) |
| 122 | `PH1. 2024. Locomotor Physiology Questions.pdf` | Standalone Core Bank | Independently ingested, cross-deduplicated, verified |