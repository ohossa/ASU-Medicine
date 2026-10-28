# High-yield medical explanations for Clinical CA-2 (Chapter 209)
# All explanations strictly <= 65 words per Vitest rule

clinical_explanations = {
    "MGL3-CH9-CLIN-0001": (
        "Therapeutic use of paracetamol (acetaminophen) is a weak peripheral cyclooxygenase inhibitor and does "
        "not impair gastric mucosal prostaglandin synthesis or platelet function, making it gastroprotective "
        "compared to traditional NSAIDs. Major PUD risk factors include Helicobacter pylori infection, prolonged "
        "NSAID usage, heavy cigarette smoking, and severe physiologic stress."
    ),
    "MGL3-CH9-CLIN-0002": (
        "Upper gastrointestinal endoscopy (esophagogastroduodenoscopy, EGD) is the definitive investigation of "
        "choice for peptic ulcer disease. It provides direct mucosal visualization, permits multiple biopsies to "
        "exclude gastric malignancy, allows rapid urease testing for H. pylori, and enables immediate therapeutic "
        "hemostasis for bleeding lesions."
    ),
    "MGL3-CH9-CLIN-0003": (
        "Long-standing GERD can cause reflux erosive esophagitis, peptic strictures, Barrett esophagus (specialized "
        "intestinal metaplasia), and esophageal adenocarcinoma. It does not cause gastric adenocarcinoma, which "
        "develops in the stomach primarily from chronic Helicobacter pylori gastritis, autoimmune gastritis, and "
        "dietary nitroso compounds."
    ),
}
print(f"Loaded {len(clinical_explanations)} Clinical explanations.")
