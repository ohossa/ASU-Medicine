import LegalLayout from "./LegalLayout";
import { BookOpen, CheckCircle, GraduationCap, Scale, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../app/hooks/useLanguage";

export default function TermsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);

  return (
    <LegalLayout currentTab="terms" arabic={ar}>
      <div className="legal-badge legal-badge-blue">
        <Scale size={14} />
        <span>{t("Legal Agreement", "اتفاقية قانونية")}</span>
      </div>

      <h1 className="legal-title">{t("Terms of Service", "شروط الاستخدام")}</h1>
      <p className="legal-subtitle">
        {t("Last updated: October 2026 · Ain Shams University Faculty of Medicine Community", "آخر تحديث: أكتوبر 2026 · مجتمع طب عين شمس")}
      </p>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <GraduationCap size={20} className="text-blue-500" />
          <span>{t("1. Educational Mission & Scope", "1. الرسالة التعليمية والنطاق")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "ASUCodes (ASU Medical Portal) is an independent, non-commercial, peer-maintained educational study platform engineered exclusively to assist undergraduate medical students at Ain Shams University Faculty of Medicine throughout their modular curriculum (Years 1 to 5).",
            "منصة ASUCodes (بوابة طب عين شمس) هي منصة دراسية تعليمية مستقلة وغير تجارية، طُوّرت خصيصاً لمساعدة طلاب كلية الطب بجامعة عين شمس في دراستهم للمناهج الموديلية (السنوات من الأولى إلى الخامسة)."
          )}
        </p>
        <p className="legal-paragraph">
          {t(
            "By accessing or using this website, you confirm that you are using this platform strictly for personal educational preparation, self-assessment, and academic revision.",
            "باستخدامك لهذا الموقع، فإنك تؤكد أن استخدامك مقتصر تماماً على المذاكرة الشخصية، والتقييم الذاتي، والمراجعة الأكاديمية."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <BookOpen size={20} className="text-blue-500" />
          <span>{t("2. Academic Integrity & Curriculum Content", "2. النزاهة الأكاديمية والمحتوى الدراسي")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "The question banks, clinical vignettes, and study questions organized within this portal reflect historical examination topics, lecture objectives, and public curriculum benchmarks. All curriculum rights and teaching materials belong to their respective faculty departments and professors.",
            "تعكس بنوك الأسئلة والحالات السريرية المنظمة في هذه المنصة موضوعات الامتحانات السابقة وأهداف المحاضرات المعتمدة. تعود كافة حقوق المناهج والمواد التعليمية للأقسام وأعضاء هيئة التدريس المعنيين."
          )}
        </p>
        <ul className="legal-list">
          <li>{t("Do not redistribute, scrape, or commercially exploit question bank contents.", "يُمنع إعادة نشر أو كشط أو استغلال محتويات بنوك الأسئلة لأغراض تجارية.")}</li>
          <li>{t("Use this portal as a study aid alongside, not as a replacement for, official university lectures and accredited textbooks.", "استخدم هذه المنصة كأداة مساعدة جنباً إلى جنب مع المحاضرات الرسمية والكتب المعتمدة.")}</li>
          <li>{t("Submit typo corrections or ambiguity notices in good faith via the built-in report system.", "قدّم تصحيحات الأخطاء المطبعية بنية حسنة عبر نظام الإبلاغ المدمج بالموقع.")}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <CheckCircle size={20} className="text-emerald-500" />
          <span>{t("3. Free Access Guarantee", "3. ضمان الوصول المجاني الدائم")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "Every question bank, quiz mode, diagnostic tool, and search feature on ASUCodes is 100% free for all students. There are no paywalls, hidden subscriptions, or locked modules. Voluntary student support contributions help offset server hosting and domain fees but grant no preferential examination standing.",
            "كل بنوك الأسئلة، وأوضاع الاختبارات، وأدوات البحث على المنصة مجانية 100% لجميع الطلاب دون أي رسوم أو اشتراكات. أي مساهمة تطوعية هي فقط لتغطية تكاليف الاستضافة وتجديد النطاق."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <ShieldAlert size={20} className="text-amber-500" />
          <span>{t("4. Limitation of Liability", "4. حدود المسؤولية")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "While every effort is made to maintain rigorous medical and typographical accuracy across all 42 modules, question keys and explanations are provided 'as is'. Platform maintainers are not responsible for individual exam results, faculty curriculum revisions, or discrepancies with official university examination keys.",
            "على الرغم من بذل أقصى جهد لضمان الدقة العلمية والمطبعية عبر جميع الموديولات الـ 42، فإن الأسئلة والشروحات تُقدّم 'كما هي'. لا يتحمل القائمون على المنصة مسؤولية أي نتائج امتحانية فردية أو تعديلات تطرأ على المناهج الجامعية."
          )}
        </p>
      </section>
    </LegalLayout>
  );
}
