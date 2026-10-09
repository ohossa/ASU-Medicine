import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  HeartHandshake,
  Database,
  Globe,
  Server,
  ShieldCheck,
  Stethoscope,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { SUPPORT, refundUrl } from "./config";
import { RUNNING_COSTS, COST_CONVERSION, MONTHLY_TOTAL_USD, costAmount } from "./costs";
import { ThemeToggle } from "../../app/components/ThemeToggle";
import { LanguageToggle } from "../../app/components/LanguageToggle";
import "./support.css";
type Method = "instapay" | "vodafone" | "card";
const FAQs = [
  [
    "Is supporting optional?",
    "Yes. Every question and feature stays available to everyone, whether they contribute or not.",
    "هل الدعم اختياري؟",
    "نعم، كل الأسئلة والمميزات متاحة للجميع سواء ساهمت بالدعم أو لم تساهم.",
  ],
  [
    "Is this an official university service?",
    "ASUCodes is an independent student project. It is not an official university service.",
    "هل الموقع تابع للجامعة؟",
    "ASUCodes مشروع طلابي مستقل، وليس خدمة رسمية تابعة للجامعة.",
  ],
  [
    "Will this page confirm my transfer?",
    "Your payment app provides the transfer confirmation. ASUCodes does not automatically track local transfers.",
    "هل الصفحة تؤكد وصول التحويل؟",
    "تطبيق الدفع يؤكد عملية التحويل. الموقع لا يتتبع التحويلات المحلية تلقائياً.",
  ],
  [
    "Will my name be made public?",
    "No. There is no public donor list. Any future acknowledgement would require your permission.",
    "هل سيظهر اسمي للآخرين؟",
    "لا توجد قائمة عامة بأسماء الداعمين. نشر أي اسم مستقبلاً يحتاج موافقة صاحبه.",
  ],
  [
    "How do mistaken payments get returned?",
    "Message Omar with the method, amount, date and reference. After the original payment is identified, a return can be arranged. Timing and any fees depend on the payment provider.",
    "كيف أسترد تحويلاً بالخطأ؟",
    "تواصل مع عمر بالطريقة والمبلغ والتاريخ ورقم العملية. بعد التأكد من التحويل الأصلي يمكن ترتيب استرجاعه. الوقت والرسوم المحتملة يعتمدان على مقدم خدمة الدفع.",
  ],
];
export default function SupportPage() {
  const [ar, setAr] = useState(false),
    [method, setMethod] = useState<Method>("instapay"),
    [amount, setAmount] = useState<number | "custom" | null>(null),
    [custom, setCustom] = useState(""),
    [status, setStatus] = useState("");
  const t = (en: string, arabic: string) => (ar ? arabic : en);
  async function copy(value: string, label: string) {
    try {
      if (!navigator.clipboard?.writeText) throw Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus(t(`Copied ${label}`, "تم النسخ"));
    } catch {
      setStatus(
        t(
          "Copy wasn’t available. Select the address or number above and copy it manually.",
          "تعذر النسخ التلقائي. حدد العنوان أو الرقم وانسخه يدوياً.",
        ),
      );
    }
  }
  const methods: [Method, string, string][] = [
    ["instapay", "InstaPay", t("Local bank transfer", "تحويل بنكي محلي")],
    [
      "vodafone",
      "Vodafone Cash",
      t("Mobile wallet transfer", "تحويل إلى محفظة"),
    ],
    [
      "card",
      t("Card & Apple Pay", "البطاقات وApple Pay"),
      t("Not available yet", "غير متاح حالياً"),
    ],
  ];
  return (
    <main
      className="support-page"
      dir={ar ? "rtl" : "ltr"}
      lang={ar ? "ar" : "en"}
    >
      <a className="support-skip" href="#support-payment">
        {t("Skip to payment options", "انتقل لطرق الدعم")}
      </a>
      <header className="support-nav">
        <div className="support-wrap support-nav-inner">
          <a
            href="/"
            className="support-brand"
            aria-label={t("ASUCodes home", "الصفحة الرئيسية")}
          >
            <span>{t("Support the project", "دعم المشروع")}</span>
          </a>
          <span className="support-nav-note">
            {t("Free for everyone", "مجاني للجميع")}
          </span>
          <div className="support-nav-actions">
            <LanguageToggle value={ar ? 'ar' : 'en'} onToggle={() => {setAr(!ar);setStatus('');}} />
            <ThemeToggle />
            <a
              href="/"
              aria-label={t("Back to studying", "العودة للمذاكرة")}
              className="support-icon-button"
            >
              <ArrowLeft size={20} />
            </a>
          </div>
        </div>
      </header>
      <div className="support-wrap">
        <section className="support-hero" aria-labelledby="support-title">
          <div>
            <p className="support-promise">
              <HeartHandshake size={17} />
              {t(
                "Support is optional. Everything stays free for everyone.",
                "الدعم اختياري. كل المميزات تفضل مجانية للجميع.",
              )}
            </p>
            <h1 id="support-title">
              {t("A little support.", "دعم بسيط.")}
              <br />
              {t("A lot more learning.", "وفرصة أكبر للتعلم.")}
            </h1>
            <p className="support-intro">
              {t(
                "ASUCodes is built by a medical student, for medical students. If it helps you study, you can help keep it running. Every question stays free for everyone.",
                "ASUCodes من طالب طب لطلاب الطب. لو الموقع بيساعدك في المذاكرة، تقدر تساهم في استمرار تشغيله. كل الأسئلة تفضل مجانية للجميع.",
              )}
            </p>
            <div className="support-hero-actions">
              <a href="#support-payment" className="support-primary">
                {t("Choose how to support", "اختر طريقة الدعم")}
                <ArrowDown size={17} />
              </a>
              <a href="#support-transparency" className="support-secondary">
                {t("Where it goes", "أين يذهب الدعم؟")}
              </a>
            </div>
          </div>
          <div className="support-art" aria-hidden="true">
            <div className="support-book support-book-back" />
            <div className="support-book support-book-middle" />
            <div className="support-book support-book-front">
              <div className="support-book-top">
                <Stethoscope size={32} />
                <span>•••</span>
              </div>
              <div className="support-study-line" />
              <div className="support-study-line" />
              <div className="support-study-line" />
              <div className="support-study-line" />
              <div className="support-book-bottom">
                <span>{t("Learning, together.", "نتعلم معاً.")}</span>
                <HeartHandshake size={19} />
              </div>
            </div>
          </div>
        </section>
        <section
          className="support-note"
          aria-label={t("A note from Omar", "رسالة من عمر")}
        >
          <span className="support-quote" aria-hidden="true">
            “
          </span>
          <blockquote>
            <p>
              {t(
                "During IGCSE, we had plenty of practice questions organized by topic, and that made revision much easier. I wished I had something like that in my first years of university, so I built ASUCodes to help us spend more time learning and less time searching for questions. I keep it free and work on it alongside medical school. Your support helps keep it online and improve it for everyone.",
                "أيام الـIGCSE كان عندنا أسئلة كتير متقسمة حسب كل موضوع، وده كان بيسهّل المراجعة. كنت أتمنى ألاقي حاجة زي كده في أول سنين الجامعة، فعملت ASUCodes علشان وقتنا يروح للمذاكرة بدل ما يضيع في تجميع الأسئلة. الموقع مجاني، وبطوره جنب دراسة الطب. دعمك بيساعد في تشغيله وتطويره لينا كلنا.",
              )}
            </p>
            <footer>
              <span className="support-owner-avatar">O</span>
              <div>
                <strong>{t("Omar", "عمر")}</strong>
                <span>
                  {t(
                    "Medical student. Creator of ASUCodes.",
                    "طالب طب، ومطور ASUCodes.",
                  )}
                </span>
              </div>
            </footer>
          </blockquote>
        </section>
        <section
          id="support-payment"
          className="support-payment-section"
          aria-labelledby="support-payment-title"
        >
          <div className="support-section-heading">
            <h2 id="support-payment-title">
              {t("Support, your way.", "دعمك، بطريقتك.")}
            </h2>
            <p>
              {t(
                "Choose whichever method is easiest for you. Support helps cover the costs of running ASUCodes.",
                "اختر الطريقة الأنسب لك. الدعم يساعد في تغطية تكاليف تشغيل ASUCodes.",
              )}
            </p>
          </div>
          <div className="support-payment-panel">
            <div
              className="support-methods"
              role="group"
              aria-label={t("Payment method", "طريقة الدعم")}
            >
              {methods.map(([id, name, detail]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={method === id}
                  onClick={() => {
                    setMethod(id);
                    setStatus("");
                  }}
                  className={`support-method ${method === id ? "is-selected" : ""}`}
                >
                  {id === "instapay" ? (
                    <ArrowUpRight size={23} />
                  ) : id === "vodafone" ? (
                    <Wallet size={23} />
                  ) : (
                    <CreditCard size={23} />
                  )}
                  <span>
                    <strong>{name}</strong>
                    <small>{detail}</small>
                  </span>
                  {method === id && (
                    <Check size={18} className="support-method-check" />
                  )}
                </button>
              ))}
            </div>
            <div className="support-payment-content">
              {method !== "card" && (
                <>
                  <fieldset className="support-amounts">
                    <legend>
                      {t(
                        "Suggested contribution (EGP)",
                        "مبلغ مقترح (بالجنيه المصري)",
                      )}
                    </legend>
                    <div>
                      {[25, 50, 100].map((n) => (
                        <button
                          type="button"
                          key={n}
                          aria-label={`${n} EGP`}
                          aria-pressed={amount === n}
                          onClick={() => setAmount(n)}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        aria-pressed={amount === "custom"}
                        onClick={() => setAmount("custom")}
                      >
                        {t("Other amount", "مبلغ آخر")}
                      </button>
                    </div>
                    {amount === "custom" && (
                      <label className="support-custom-label">
                        {t("Suggested amount in EGP", "المبلغ المقترح بالجنيه")}
                        <input
                          type="number"
                          inputMode="decimal"
                          min="1"
                          step="1"
                          value={custom}
                          onChange={(e) => setCustom(e.target.value)}
                          placeholder="75"
                        />
                      </label>
                    )}
                    <p>
                      {t(
                        "These are suggestions only. Enter your chosen amount in the payment app.",
                        "هذه اقتراحات فقط. أدخل المبلغ الذي تختاره في تطبيق الدفع.",
                      )}
                    </p>
                  </fieldset>
                  <div className="support-recipient">
                    <span>{t("Recipient", "المستفيد")}</span>
                    <strong>{SUPPORT.recipient}</strong>
                  </div>
                  <div className="support-transfer-row">
                    <div>
                      <span>
                        {method === "instapay"
                          ? t("InstaPay address", "عنوان InstaPay")
                          : t("Vodafone Cash wallet", "محفظة Vodafone Cash")}
                      </span>
                      <p dir="ltr">
                        {method === "instapay" ? SUPPORT.ipa : SUPPORT.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="support-copy"
                      aria-label={
                        method === "instapay"
                          ? t("Copy InstaPay address", "نسخ عنوان InstaPay")
                          : t(
                              "Copy Vodafone Cash number",
                              "نسخ رقم Vodafone Cash",
                            )
                      }
                      onClick={() =>
                        void copy(
                          method === "instapay" ? SUPPORT.ipa : SUPPORT.phone,
                          method === "instapay"
                            ? "InstaPay address"
                            : "Vodafone Cash number",
                        )
                      }
                    >
                      <Copy size={19} />
                      <span>{t("Copy", "نسخ")}</span>
                    </button>
                  </div>
                  <p className="support-transfer-note">
                    <ShieldCheck size={18} />
                    {t(
                      "Check the recipient name and amount in your payment app before confirming. ASUCodes will never ask for a PIN or OTP.",
                      "تأكد من اسم المستفيد والمبلغ في تطبيق الدفع قبل التأكيد. الموقع لن يطلب الرقم السري أو رمز OTP.",
                    )}
                  </p>
                  {method === "instapay" ? (
                    <a
                      className="support-primary support-payment-open"
                      href={SUPPORT.instapayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Open InstaPay", "افتح InstaPay")}
                      <ArrowUpRight size={18} />
                    </a>
                  ) : (
                    <p className="support-wallet-instructions">
                      {t(
                        "Use the number above in your Vodafone Cash app or wallet service to complete the transfer. This page does not submit payments.",
                        "استخدم الرقم أعلاه في تطبيق Vodafone Cash أو خدمة المحفظة لإتمام التحويل. هذه الصفحة لا تنفذ عمليات الدفع.",
                      )}
                    </p>
                  )}
                  <p className="support-no-tracking">
                    {t(
                      "Your payment app confirms the transfer. This page does not confirm receipt automatically.",
                      "تطبيق الدفع يؤكد التحويل. هذه الصفحة لا تؤكد استلامه تلقائياً.",
                    )}
                  </p>
                </>
              )}
              {method === "card" && (
                <div className="support-card-unavailable">
                  <CreditCard size={42} />
                  <h3>
                    {t(
                      "Card checkout is not available yet",
                      "الدفع بالبطاقات غير متاح حالياً",
                    )}
                  </h3>
                  <p>
                    {t(
                      "Card and Apple Pay payments have not been set up. You can use InstaPay or Vodafone Cash for now.",
                      "لم يتم تفعيل الدفع بالبطاقات أو Apple Pay. يمكنك استخدام InstaPay أو Vodafone Cash حالياً.",
                    )}
                  </p>
                  <button
                    type="button"
                    className="support-secondary"
                    onClick={() => setMethod("instapay")}
                  >
                    {t("Use InstaPay instead", "استخدم InstaPay")}
                  </button>
                </div>
              )}
              <p
                className="support-copy-status"
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
              <a className="support-small-link" href="#support-refunds">
                {t("Paid by mistake? Get help", "حولت بالخطأ؟ تواصل للمساعدة")}
              </a>
            </div>
          </div>
        </section>
        <section
          id="support-transparency"
          className="support-transparency"
          aria-labelledby="support-costs-title"
        >
          <div>
            <h2 id="support-costs-title">
              {t("What keeps it running", "ما الذي يحافظ على تشغيله؟")}
            </h2>
            <p>
              {t(
                "Support helps with the services behind the website. Everyone keeps the same access, whether they contribute or not.",
                "الدعم يساعد في الخدمات التي تشغل الموقع. الجميع يحصل على نفس المميزات سواء ساهموا أو لا.",
              )}
            </p>
            <ul>
              {[
                [
                  Server,
                  t("Hosting & services", "الاستضافة والخدمات"),
                  t(
                    "Keeping the website available for students.",
                    "الحفاظ على إتاحة الموقع للطلاب.",
                  ),
                ],
                [
                  Database,
                  t("Database & study tools", "قاعدة البيانات وأدوات الدراسة"),
                  t(
                    "Questions, saved progress and the tools behind them.",
                    "الأسئلة والتقدم المحفوظ والأدوات التي تدعمها.",
                  ),
                ],
                [
                  Globe,
                  t("Domain & protecting data", "النطاق وحماية البيانات"),
                  t(
                    "Domain renewal and protecting the project’s data.",
                    "تجديد النطاق وحماية بيانات المشروع.",
                  ),
                ],
              ].map(([Icon, title, detail]) => {
                const I = Icon as typeof Server;
                return (
                  <li key={String(title)}>
                    <I size={22} />
                    <div>
                      <h3>{String(title)}</h3>
                      <p>{String(detail)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <aside className="support-transparency-note">
            <ShieldCheck size={28} />
            <h3>
              {t(
                "Clear costs. Honest updates.",
                "تكاليف واضحة. تحديثات صادقة.",
              )}
            </h3>
            <p>{t("Estimated monthly running cost", "تكلفة التشغيل الشهرية التقديرية")}</p>
            <table className="support-cost-table" aria-label={t("Monthly running costs", "تكاليف التشغيل الشهرية")}>
              <thead><tr><th scope="col">{t("Service", "الخدمة")}</th><th scope="col">USD</th><th scope="col">{t("EGP ≈", "ج.م ≈")}</th></tr></thead>
              <tbody>{RUNNING_COSTS.map(item => <tr key={item.en}>
                <th scope="row">{ar ? item.ar : item.en}</th>
                <td dir="ltr">${costAmount(item.monthlyUsd)}</td>
                <td dir="ltr">{costAmount(item.monthlyUsd * COST_CONVERSION.egpPerUsd)}</td>
              </tr>)}</tbody>
              <tfoot><tr><th scope="row">{t("Monthly total", "الإجمالي الشهري")}</th><td dir="ltr">${costAmount(MONTHLY_TOTAL_USD)}</td><td dir="ltr">{costAmount(MONTHLY_TOTAL_USD * COST_CONVERSION.egpPerUsd)}</td></tr></tfoot>
            </table>
            <p className="support-cost-footnote">{t(
              "Domain is billed at $70 per year; $5.83 is its monthly average. These are current running-cost estimates and may change with usage.",
              "تجديد النطاق يُدفع سنوياً بمبلغ 70 دولاراً؛ 5.83 دولار هو المتوسط الشهري. هذه تقديرات تكاليف التشغيل الحالية وقد تتغير حسب الاستخدام.",
            )}</p>
            <p className="support-cost-footnote">{t("EGP estimates use", "التقديرات بالجنيه تستخدم")} <bdi>1 USD ≈ 52.46 EGP</bdi>. {t("Checked 9 October 2026.", "تم التحقق في 9 أكتوبر 2026.")} <a href={COST_CONVERSION.sourceUrl} target="_blank" rel="noopener noreferrer">{t("Exchange-rate reference", "مرجع سعر الصرف")}</a>. {t("Your bank’s rate and fees may differ.", "قد يختلف سعر البنك ورسومه.")}</p>
          </aside>
        </section>
        <section className="support-bottom">
          <aside id="support-refunds" className="support-refunds">
            <MessageCircle size={29} />
            <h2>{t("Paid by mistake?", "حولت بالخطأ؟")}</h2>
            <p>
              {t(
                "Message me on WhatsApp with the payment method, amount, date and transaction reference. Once I identify the original payment, I can help arrange its return.",
                "ابعتلي على WhatsApp طريقة الدفع والمبلغ والتاريخ ورقم العملية. بعد التأكد من التحويل الأصلي أقدر أساعدك في استرجاعه.",
              )}
            </p>
            <p className="support-refund-details">
              {t(
                "Never send your PIN or OTP. Timing and any fees depend on the payment provider.",
                "لا ترسل الرقم السري أو OTP. الوقت والرسوم المحتملة يعتمدان على مقدم خدمة الدفع.",
              )}
            </p>
            <a
              href={refundUrl(ar)}
              target="_blank"
              rel="noopener noreferrer"
              className="support-secondary"
            >
              {t("Message on WhatsApp", "راسلني على WhatsApp")}
              <ArrowUpRight size={17} />
            </a>
            <span className="support-contact-number" dir="ltr">
              {SUPPORT.phone}
            </span>
          </aside>
          <div className="support-faq">
            <h2>{t("A few useful answers", "إجابات مفيدة")}</h2>
            {FAQs.map(([q, a, aq, aa]) => (
              <details key={q}>
                <summary>{ar ? aq : q}</summary>
                <p>{ar ? aa : a}</p>
              </details>
            ))}
          </div>
        </section>
        <footer className="support-footer">
          <p>
            {t(
              "ASUCodes is an independent student project. Free to use, always.",
              "ASUCodes مشروع طلابي مستقل. الاستخدام مجاني دائماً.",
            )}
          </p>
          <a href="/">
            {t("Back to studying", "العودة للمذاكرة")}
            <ArrowLeft size={16} />
          </a>
        </footer>
      </div>
    </main>
  );
}
