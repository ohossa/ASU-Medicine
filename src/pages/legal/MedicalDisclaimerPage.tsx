import LegalLayout from "./LegalLayout";
import { AlertOctagon, HeartPulse, Stethoscope, UserX } from "lucide-react";
import { useLanguage } from "../../app/hooks/useLanguage";

export default function MedicalDisclaimerPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);

  return (
    <LegalLayout currentTab="disclaimer" arabic={ar}>
      <div className="legal-badge legal-badge-amber">
        <AlertOctagon size={14} />
        <span>{t("Crucial Health Notice", "تنبيه صحي هام")}</span>
      </div>

      <h1 className="legal-title">{t("Medical Educational Disclaimer", "إخلاء المسؤولية الطبية")}</h1>
      <p className="legal-subtitle">
        {t("For Educational & Examination Study Purposes Only · Not Clinical Advice", "لأغراض المذاكرة والامتحانات الأكاديمية فقط · ليس استشارة طبية")}
      </p>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <Stethoscope size={20} className="text-amber-500" />
          <span>{t("1. Strictly an Educational Study Aid", "1. منصة تعليمية للمذاكرة فقط")}</span>
        </h2>
        <p className="legal-paragraph" style={{ fontWeight: 600 }}>
          {t(
            "The information, clinical cases, drug dosages, diagnostic algorithms, and explanations provided on ASUCodes are intended exclusively for academic exam preparation and medical education for students of Ain Shams University Faculty of Medicine.",
            "إن المعلومات، والحالات السريرية، وجرعات الأدوية، وخوارزميات التشخيص، والشروحات المقدمة على المنصة مخصصة حصرياً للتحضير الأكاديمي للامتحانات والتعليم الطبي لطلاب كلية الطب بجامعة عين شمس."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <UserX size={20} className="text-red-500" />
          <span>{t("2. Not Medical Advice for Real Patients", "2. ليست استشارة أو نصيحة طبية لمرضى حقيقيين")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "Nothing on this platform should be construed as medical advice, clinical diagnosis, prognosis, or treatment recommendations for any individual patient or condition. Clinical practice requires comprehensive in-person evaluation, patient history, physical examination, and consultation with licensed healthcare providers.",
            "لا يجوز بأي حال من الأحوال اعتبار أي محتوى على هذه المنصة استشارة طبية أو تشخيصاً أو توصية علاجية لأي مريض. ممارسة الطب تتطلب فحصاً سريرياً مباشراً وتقييماً شاملاً من قبل أطباء مرخصين."
          )}
        </p>
        <p className="legal-paragraph">
          {t(
            "If you are experiencing a medical emergency or health condition, immediately contact emergency services or consult a qualified physician.",
            "إذا كنت تواجه حالة طوارئ طبية أو وعكة صحية، يرجى التوجه فوراً إلى أقرب مستشفى أو استشارة طبيب مختص."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <HeartPulse size={20} className="text-blue-500" />
          <span>{t("3. Continuous Evolution of Medical Science", "3. التطور المستمر للعلوم الطبية")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "Medicine is an ever-evolving science. Clinical guidelines, pharmacologic regimens, and diagnostic criteria are updated continuously by international bodies. While our contributors strive to reflect the latest Ain Shams university curriculum objectives, students must verify drug dosages, contraindications, and protocol guidelines against official pharmacopeias and current clinical references.",
            "العلوم الطبية في تطور مستمر. يتم تحديث البروتوكولات العلاجية وجرعات الأدوية بانتظام. وعلى الرغم من حرصنا على مطابقة أحدث أهداف مناهج الكلية، يجب على الطلاب دائماً التحقق من الجرعات وموانع الاستعمال من المراجع الصيدلانية الرسمية."
          )}
        </p>
      </section>
    </LegalLayout>
  );
}
