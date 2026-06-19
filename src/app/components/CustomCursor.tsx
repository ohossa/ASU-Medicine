import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const hoverIn = () => cursor.classList.add('cursor-hover');
    const hoverOut = () => cursor.classList.remove('cursor-hover');

    window.addEventListener('mousemove', move);
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', hoverIn);
      el.addEventListener('mouseleave', hoverOut);
    });

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = '';
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}