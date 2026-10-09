import { useEffect, useLayoutEffect, useState } from 'react';
import { triggerCloudSync } from '../hooks/useCloudSync';
export { ThemeContext } from './ThemeContextValue';
import { ThemeContext } from './ThemeContextValue';

function readTheme() {
  try { return localStorage.getItem('theme') !== 'light'; }
  catch { return true; }
}
function applyTheme(dark:boolean) {
  document.documentElement.classList.toggle('dark',dark);
  document.documentElement.style.colorScheme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0c0e16':'#f8f9fc');
}
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark,setIsDark]=useState(()=>{const dark=readTheme();applyTheme(dark);return dark;});
  useLayoutEffect(()=>{
    applyTheme(isDark);
    try {
      const previous=localStorage.getItem('theme'),next=isDark?'dark':'light';
      localStorage.setItem('theme',next);
      if(previous!==next)triggerCloudSync();
    } catch { /* Private/storage-restricted browsers can still change appearance. */ }
  },[isDark]);
  useEffect(()=>{
    const update=(event:StorageEvent)=>{if(event.key==='theme'||event.key===null)setIsDark(readTheme());};
    window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update);
  },[]);
  return <ThemeContext.Provider value={{isDark,theme:isDark?'dark':'light',toggleTheme:()=>setIsDark(d=>!d)}}>{children}</ThemeContext.Provider>;
}
