import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

/** Optional controlled mode for a bilingual standalone page. */
export function LanguageToggle({value,onToggle}:{value?:'en'|'ar';onToggle?:()=>void}={}) {
  const context=useLanguage();
  const language=value??context.language;
  const label=language==='ar'?'English':'العربية';
  return <button type="button" onClick={onToggle??context.toggleLanguage}
    className="portal-language-toggle" aria-label={label} title={label}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,minWidth:44,minHeight:44,borderRadius:12}}>
    <Globe size={19} aria-hidden="true"/>
  </button>;
}
