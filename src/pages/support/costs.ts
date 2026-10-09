/** Owner-supplied recurring budget. EGP is an indicative, dated conversion, not an invoice. */
export const RUNNING_COSTS = [
  { en: 'Hosting', ar: 'الاستضافة', monthlyUsd: 20 },
  { en: 'AI & API services', ar: 'خدمات الذكاء الاصطناعي وAPI', monthlyUsd: 20 },
  { en: 'Database', ar: 'قاعدة البيانات', monthlyUsd: 5 },
  { en: 'Domain (monthly average)', ar: 'النطاق (متوسط شهري)', monthlyUsd: 70 / 12 },
] as const;
export const COST_CONVERSION = {
  egpPerUsd: 52.46,
  checkedOn: '2026-10-09',
  sourceUrl: 'https://egrates.com/en/banks/13',
} as const;
export const MONTHLY_TOTAL_USD = RUNNING_COSTS.reduce((total, item) => total + item.monthlyUsd, 0);
export function costAmount(amount: number) {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
