import { useId } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { isIPhoneSafari } from '../lib/audioPolicy';

export function SoundToggle({muted,onToggle}:{muted:boolean;onToggle:()=>void}) {
  const {language}=useLanguage();
  const ar=language==='ar', helpId=useId();
  const label=muted ? (ar?'تشغيل الأصوات':'Unmute sounds') : (ar?'كتم الأصوات':'Mute sounds');
  const help=isIPhoneSafari()
    ? (ar?'الأصوات مكتومة افتراضياً للحفاظ على تشغيل الموسيقى. يمكنك تشغيلها؛ إذا توقفت الموسيقى، اكتم الأصوات مجدداً.':'Sounds start off on iPhone Safari to keep your music playing. You can turn them on; if music pauses, turn sounds off again.')
    : (ar?'يتم حفظ اختيار الصوت في هذا المتصفح.':'Your sound choice is saved in this browser.');
  const Icon=muted?VolumeX:Volume2;
  return <>
    <button type="button" onClick={onToggle} aria-label={label} aria-pressed={!muted} aria-describedby={helpId} title={help}
      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-secondary px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <Icon size={16} aria-hidden="true"/>
      <span>{muted?(ar?'الصوت مكتوم':'Sound off'):(ar?'الصوت يعمل':'Sound on')}</span>
    </button>
    <span id={helpId} className="sr-only">{help}</span>
  </>;
}
