import LegalLayout from "./LegalLayout";
import { Database, EyeOff, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { useLanguage } from "../../app/hooks/useLanguage";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const t = (en: string, arabic: string) => (ar ? arabic : en);

  return (
    <LegalLayout currentTab="privacy" arabic={ar}>
      <div className="legal-badge legal-badge-emerald">
        <ShieldCheck size={14} />
        <span>{t("Data Protection & Privacy", "حماية البيانات والخصوصية")}</span>
      </div>

      <h1 className="legal-title">{t("Privacy Policy", "سياسة الخصوصية")}</h1>
      <p className="legal-subtitle">
        {t("Zero-Tracking · Local-First Architecture · Strict Student Privacy", "بدون تتبع تجاري · بنية محلية أولاً · خصوصية طلابية تامة")}
      </p>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <EyeOff size={20} className="text-emerald-500" />
          <span>{t("1. Our Privacy Philosophy: No Commercial Tracking", "1. فلسفتنا في الخصوصية: لا تتبع تجاري")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "We believe student learning data is sacred. ASUCodes does not sell, rent, monetize, or broker any student data or quiz answers to third parties, advertisers, or academic institutions.",
            "نؤمن بأن بيانات تعلم الطلاب مقدسة. لا تقوم المنصة ببيع أو تأجير أو مشاركة أي بيانات أو إجابات اختبارات مع أطراف ثالثة أو معلنين أو جهات أكاديمية."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <Database size={20} className="text-blue-500" />
          <span>{t("2. Local-First Client Storage", "2. التخزين المحلي على جهازك")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "The vast majority of your study data lives entirely on your own device using web browser LocalStorage and IndexedDB:",
            "الجزء الأكبر من بيانات مذاكرتك يُخزّن محلياً بالكامل على جهازك باستخدام LocalStorage و IndexedDB في المتصفح:"
          )}
        </p>
        <ul className="legal-list">
          <li><strong>{t("Quiz Progress & Scores:", "تقدم الاختبارات والنتائج:")}</strong> {t("Recorded locally so you can resume unfinished sessions without a cloud connection.", "تُحفظ محلياً لتتمكن من استئناف الجلسات غير المكتملة دون اتصال.")}</li>
          <li><strong>{t("Bookmarked & Flagged Questions:", "الأسئلة المعلمة والمحفوظة:")}</strong> {t("Stored securely in client memory.", "مخزنة بأمان في ذاكرة المتصفح.")}</li>
          <li><strong>{t("Display Preferences:", "تفضيلات العرض:")}</strong> {t("Theme (dark/light), sound toggle, and font scaling.", "الوضع الليلي/النهاري، تفعيل الصوت، وحجم الخط.")}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <Lock size={20} className="text-purple-500" />
          <span>{t("3. Authentication & Account Data", "3. تسجيل الدخول وحساب المستخدم")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "When you log in, authentication is managed securely by Clerk (industry-standard SOC-2 compliant authentication). We only store your email address and basic profile identifier to enable optional cross-device progress synchronization. Passwords are never stored or seen by our servers.",
            "عند تسجيل الدخول، تتم إدارة الحسابات بأمان عبر منصة Clerk المتوافقة مع معايير الأمان الدولية SOC-2. لا نقوم بالاطلاع على كلمات المرور أو تخزينها على خوادمنا نهائياً."
          )}
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section-title">
          <UserCheck size={20} className="text-amber-500" />
          <span>{t("4. Question Reporting & Telemetry", "4. الإبلاغ عن الأسئلة والتقارير")}</span>
        </h2>
        <p className="legal-paragraph">
          {t(
            "When you submit a question typo report or feedback via the portal, only the specific question ID, your optional comment, and timestamp are transmitted to our secure Upstash Redis inbox for administrator triage. No sensitive personal medical or academic records are collected.",
            "عند إرسال تقرير عن خطأ مطبعي في سؤال، يتم إرسال معرف السؤال وملاحظتك وتوقيت الإرسال فقط إلى صندوق المراجعة الآمن لمراجعة المحتوى."
          )}
        </p>
      </section>
    </LegalLayout>
  );
}
