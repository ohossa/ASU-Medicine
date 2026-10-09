import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export function LanguageProfilePage() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="profile-settings p-6 text-foreground font-manrope">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center text-physiology shrink-0">
          <Globe size={22} />
        </div>
        <div className="text-left rtl:text-right">
          <h3 className="font-archivo text-lg font-bold tracking-tight text-foreground">
            {language === 'en' ? "Language Settings" : "إعدادات اللغة"}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            {language === 'en' ? "Select your preferred language for the layout and content." : "اختر لغتك المفضلة للواجهة والمحتوى."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="profile-language" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {language === 'en' ? "Language" : "اللغة"}
          </label>
          <div className="relative">
            <select
              id="profile-language"
              value={language}
              onChange={(e) => {
                if (e.target.value !== language) {
                  toggleLanguage();
                }
              }}
              className="w-full p-4 pr-10 rounded-xl bg-gray-50 border border-gray-100 hover:border-physiology/20 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-physiology/50 transition-all duration-200 cursor-pointer appearance-none text-left rtl:text-right"
            >
              <option value="en">English (US)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
              <Globe size={18} />
            </div>
          </div>
        </div>

        <p className="text-[13px] text-muted-foreground font-medium mt-2 leading-relaxed">
          {language === 'en'
            ? "Note: Changing language will translate the interface layout and module topic names."
            : "ملاحظة: تغيير اللغة سيقوم بترجمة واجهة المستخدم وأسماء مواضيع الموديلات الدراسي."}
        </p>
      </div>
    </div>
  );
}
