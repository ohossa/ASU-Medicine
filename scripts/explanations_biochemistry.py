# High-yield medical explanations for Biochemistry CA-2 (Chapter 204)
# All explanations strictly <= 65 words per Vitest rule

biochemistry_explanations = {
    "MGL3-CH4-BIOC-0525": (
        "Cholesterol 7-alpha-hydroxylase (CYP7A1), an endoplasmic reticulum cytochrome P450 enzyme, catalyzes "
        "the initial and rate-limiting step in bile acid synthesis from cholesterol. It is feedback-inhibited "
        "by bile acids returning via the enterohepatic circulation through the nuclear FXR receptor."
    ),
    "MGL3-CH4-BIOC-0526": (
        "Bile acid sequestrants (such as cholestyramine and colestipol) are positively charged resins that "
        "bind negatively charged bile acids in the intestinal lumen, preventing reabsorption. This depletes "
        "the bile acid pool, upregulating hepatic LDL receptors and lowering plasma cholesterol."
    ),
    "MGL3-CH4-BIOC-0528": (
        "In obstructive (post-hepatic) jaundice, mechanical blockage of the biliary tree prevents bile excretion. "
        "Conjugated (direct, water-soluble) bilirubin regurgitates into hepatic sinusoids and the systemic circulation, "
        "leading to dark urine (bilirubinuria) and pale, acholic stools."
    ),
    "MGL3-CH4-BIOC-0529": (
        "Complete common bile duct obstruction by an impacted gallstone prevents conjugated bilirubin from "
        "reaching the intestines. Direct bilirubin accumulates in plasma, yielding high serum direct bilirubin "
        "and elevated alkaline phosphatase (ALP) and GGT."
    ),
    "MGL3-CH4-BIOC-0530": (
        "In acute viral hepatitis, diffuse hepatocellular damage causes mixed jaundice: impaired bilirubin "
        "excretion leads to regurgitation of conjugated bilirubin, while impaired uptake and conjugation "
        "elevate unconjugated bilirubin, with prominent serum AST/ALT elevation."
    ),
    "MGL3-CH4-BIOC-0531": (
        "6-Mercaptopurine (6-MP) is a purine antimetabolite prodrug converted intracellularly by HGPRT into "
        "thioinosine monophosphate (TIMP). TIMP pseudofeedback-inhibits glutamine-PRPP amidotransferase, "
        "blocking de novo purine nucleotide synthesis."
    ),
    "MGL3-CH4-BIOC-0532": (
        "Crigler-Najjar syndrome is a rare genetic disorder caused by mutations in the UGT1A1 gene encoding "
        "UDP-glucuronosyltransferase. Type I has complete absence of enzyme activity, causing severe unconjugated "
        "hyperbilirubinemia, kernicterus, and death unless treated with liver transplantation."
    ),
    "MGL3-CH4-BIOC-0533": (
        "Hydroxyurea inhibits ribonucleotide reductase, the enzyme that reduces ribonucleoside diphosphates "
        "(NDPs) into deoxyribonucleoside diphosphates (dNDPs). This halts de novo DNA synthesis by depleting "
        "dNTP precursors, arresting cells in S-phase."
    ),
    "MGL3-CH4-BIOC-0534": (
        "Hydroxyurea specifically inactivates the tyrosyl free radical at the catalytic site of ribonucleotide "
        "reductase, halting the conversion of ribonucleotides to deoxyribonucleotides required for DNA replication."
    ),
    "MGL3-CH4-BIOC-0535": (
        "Enzymes ending in reductase (such as HMG-CoA reductase or ribonucleotide reductase) belong to Enzyme "
        "Commission Class 1 (Oxidoreductases). They catalyze oxidation-reduction reactions involving the transfer "
        "of electrons or hydrides between substrate and cofactor."
    ),
    "MGL3-CH4-BIOC-0536": (
        "Hereditary orotic aciduria results from deficiency of the bifunctional enzyme UMP synthase (orotate "
        "phosphoribosyltransferase and OMP decarboxylase). It presents in infants with megaloblastic anemia "
        "unresponsive to B12/folate, failure to thrive, and massive urinary orotic acid excretion."
    ),
    "MGL3-CH4-BIOC-0537": (
        "Direct (conjugated) hyperbilirubinemia reflects impaired canalicular excretion into the biliary tree "
        "or mechanical ductal obstruction (such as choledocholithiasis, cholangiocarcinoma, or pancreatic cancer), "
        "contrasting with hemolysis or Gilbert syndrome (unconjugated)."
    ),
    "MGL3-CH4-BIOC-0538": (
        "Molybdenum is an essential trace metal cofactor incorporated into molybdopterin in xanthine oxidase. "
        "Xanthine oxidase oxidizes hypoxanthine to xanthine, and xanthine to uric acid in purine degradation."
    ),
    "MGL3-CH4-BIOC-0539": (
        "Glutamine-PRPP amidotransferase catalyzes the commitment and rate-limiting step of de novo purine "
        "synthesis, transferring an amino group from glutamine to 5-phosphoribosyl-1-pyrophosphate (PRPP) to form "
        "5-phosphoribosylamine. It is allosterically inhibited by AMP, GMP, and IMP."
    ),
    "MGL3-CH4-BIOC-0540": (
        "Ethanol oxidation by alcohol dehydrogenase generates excess NADH, driving the equilibrium of glycerol-3-phosphate "
        "dehydrogenase toward increased conversion of DHAP to glycerol-3-phosphate. Excess glycerol-3-phosphate "
        "supplies the essential backbone for hepatic triglyceride synthesis, producing steatosis."
    ),
    "MGL3-CH4-BIOC-0541": (
        "Methionine is an essential amino acid that forms S-adenosylmethionine (SAMe). SAMe donates methyl "
        "groups to synthesize phosphatidylcholine (lecithin), which is indispensable for VLDL assembly and "
        "lipid export from the liver, preventing fatty liver (lipotropic action)."
    ),
    "MGL3-CH4-BIOC-0542": (
        "Metabolism of ethanol by alcohol dehydrogenase and aldehyde dehydrogenase generates high amounts of "
        "NADH, markedly increasing the intracellular NADH/NAD+ ratio. This inhibits fatty acid beta-oxidation, "
        "diverts acetyl-CoA into ketogenesis and lipogenesis, and induces hepatic steatosis."
    ),
    "MGL3-CH4-BIOC-0543": (
        "Methionine acts as a lipotropic agent because it provides the active methyl groups required for the "
        "endogenous synthesis of choline and phosphatidylcholine, which are critical for hepatic packaging and "
        "secretion of VLDL."
    ),
    "MGL3-CH4-BIOC-0544": (
        "Non-alcoholic fatty liver disease (NAFLD) develops when intrahepatic triglyceride synthesis exceeds "
        "the liver's capacity to package and secrete triglycerides into very-low-density lipoproteins (VLDL), "
        "leading to progressive lipid accumulation in hepatocytes."
    ),
}
print(f"Loaded {len(biochemistry_explanations)} Biochemistry explanations.")
