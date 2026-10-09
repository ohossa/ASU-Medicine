import { Sparkles } from 'lucide-react';
import './xp-award.css';
export function XPAwardBubble({ amount }: { amount: number }) {
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  return <div className="xp-award-bubble" role="status" aria-live="polite" aria-atomic="true">
    <Sparkles size={15} aria-hidden="true" /><span dir="ltr">+{amount} XP</span>
  </div>;
}
