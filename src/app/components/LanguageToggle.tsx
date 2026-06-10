import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      title={language === 'en' ? 'تغيير اللغة إلى العربية' : 'Switch to English'}
      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold font-archivo shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Globe size={14} className="text-gray-400 dark:text-gray-500" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
