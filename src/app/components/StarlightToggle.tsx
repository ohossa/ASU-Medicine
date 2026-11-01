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

function useSafeUser() {
  try {
    return useUser();
  } catch {
    return { user: null, isLoaded: true };
  }
}

/**
 * StarlightToggle
 * Exclusive secret theme switch, visible ONLY to authorized accounts (sarahrateb@gmail.com, omarhmaged@gmail.com).
 * Adheres strictly to Apple HIG: min 44px touch target, visible focus ring, reduced motion.
 */
export function StarlightToggle({ className = '', showText = true }: Props) {
  const { user, isLoaded } = useSafeUser();
  const { isStarlight, toggleStarlight } = useTheme();
  const reducedMotion = useReducedMotion();
  const isIconOnly = !showText;

  // If user is not signed in or not in the allowlist, render nothing
  if (!isLoaded || !user || !isUserStarlightEligible(user)) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const next = !isStarlight;
    toggleStarlight();
    if (next && typeof window !== 'undefined') {
      const target = (e.currentTarget as HTMLElement);
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        triggerStarlightBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
  };

  const label = isStarlight ? 'Disable Starlight theme' : 'Enable Starlight theme';

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isStarlight}
      aria-label={label}
      title={label}
      onClick={handleToggle}
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      className={`starlight-toggle-btn ${isIconOnly ? 'icon-only' : ''} ${isStarlight ? 'active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isIconOnly ? 0 : '6px',
        minHeight: isIconOnly ? '36px' : '44px',
        minWidth: isIconOnly ? '36px' : 'auto',
        width: isIconOnly ? '36px' : 'auto',
        height: isIconOnly ? '36px' : 'auto',
        padding: isIconOnly ? 0 : '0 14px',
        borderRadius: isIconOnly ? '50%' : '9999px',
        border: isStarlight
          ? '1px solid rgba(255, 255, 255, 0.45)'
          : '1px solid rgba(217, 70, 239, 0.35)',
        background: isStarlight
          ? 'linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #8b5cf6 100%)'
          : 'rgba(30, 15, 58, 0.7)',
        color: '#fdf4ff',
        cursor: 'pointer',
        boxShadow: isStarlight
          ? '0 0 20px rgba(217, 70, 239, 0.45)'
          : '0 0 10px rgba(217, 70, 239, 0.15)',
        outline: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Sparkles
        size={isIconOnly ? 17 : 16}
        className={isStarlight ? 'text-amber-200 animate-pulse' : 'text-pink-400'}
        aria-hidden="true"
      />
      {!isIconOnly && (
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
