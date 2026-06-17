import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ThemeToggle } from './ThemeToggle';

export function ClerkThemeTogglePortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainer = () => {
      const previews = document.querySelectorAll('.cl-userPreview');
      let preview: Element | null = null;
      for (let i = 0; i < previews.length; i++) {
        const p = previews[i];
        if (p.closest('.cl-userProfile-root')) {
          continue;
        }
        preview = p;
        break;
      }

      if (preview) {
        let existing = preview.querySelector('#clerk-custom-toggle-container');
        if (!existing) {
          existing = document.createElement('div');
          existing.id = 'clerk-custom-toggle-container';
          existing.className = 'ms-auto flex items-center justify-end pl-2 shrink-0 scale-85 origin-right';
          preview.appendChild(existing);
        }
        setContainer(existing);
      } else {
        setContainer(null);
      }
    };

    findContainer();

    const observer = new MutationObserver(() => {
      findContainer();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!container) return null;

  return createPortal(<ThemeToggle />, container);
}
