import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from '../hooks/useTheme';
import { isUserStarlightEligible } from '../config/secretThemes';
import { triggerStarlightBurst } from './StarlightCelebration';

interface Props {
  className?: string;
  showText?: boolean;
}

/**
 * StarlightToggle
 * Exclusive secret theme switch, visible ONLY to authorized accounts (sarahrateb@gmail.com, omarhmaged@gmail.com).
 * Adheres strictly to Apple HIG: min 44px touch target, visible focus ring, reduced motion.
 */
export function StarlightToggle({ className = '', showText = true }: Props) {
  const { user, isLoaded } = useUser();
  const { isStarlight, toggleStarlight } = useTheme();
  const reducedMotion = useReducedMotion();

  // If user is not signed in or not in the allowlist, render nothing
  if (!isLoaded || !user || !isUserStarlightEligible(user)) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isStarlight;
    toggleStarlight();
    if (next) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      triggerStarlightBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isStarlight}
      aria-label="Toggle secret Starlight theme"
      onClick={handleToggle}
      whileHover={reducedMotion ? {} : { scale: 1.04 }}
      whileTap={reducedMotion ? {} : { scale: 0.96 }}
      className={`starlight-toggle-btn ${isStarlight ? 'active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        minHeight: '44px',
        padding: '0 14px',
        borderRadius: '9999px',
        border: isStarlight
          ? '1px solid rgba(255, 255, 255, 0.45)'
          : '1px solid rgba(217, 70, 239, 0.35)',
        background: isStarlight
          ? 'linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #8b5cf6 100%)'
          : 'rgba(30, 15, 58, 0.7)',
        color: '#fdf4ff',
        cursor: 'pointer',
        boxShadow: isStarlight
          ? '0 0 20px rgba(217, 70, 239, 0.4)'
          : '0 0 10px rgba(217, 70, 239, 0.15)',
        outline: 'none',
      }}
    >
      <Sparkles
        size={16}
        className={isStarlight ? 'text-amber-200 animate-pulse' : 'text-pink-400'}
        aria-hidden="true"
      />
      {showText && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textShadow: isStarlight ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {isStarlight ? '✨ Starlight On' : '✨ Starlight'}
        </span>
      )}
    </motion.button>
  );
}
