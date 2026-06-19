import { GraduationCap, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import safeStorage from '../../utils/safeStorage';
import type { Screen } from '../../types';
import type { ModuleInfo } from '../../data';
import type { ChapterData } from '../../types';

interface AcademicYearProfilePageProps {
  studentYear: number | null;
  setStudentYear: (y: number | null) => void;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedSemester: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedModule: React.Dispatch<React.SetStateAction<ModuleInfo | null>>;
  setStudyMode: React.Dispatch<React.SetStateAction<'mcq' | 'essay' | 'mixed' | null>>;
  setSelectedChapter: React.Dispatch<React.SetStateAction<ChapterData | null>>;
}

export function AcademicYearProfilePage({
  studentYear,
  setStudentYear,
  setScreen,
  setSelectedYear,
  setSelectedSemester,
  setSelectedModule,
  setStudyMode,
  setSelectedChapter
}: AcademicYearProfilePageProps) {
  const { language } = useLanguage();

  const handleSelectYear = (year: number) => {
    safeStorage.setItem('asu_medical_student_year', year.toString());
    safeStorage.removeItem('asu_portal_year');
    safeStorage.removeItem('asu_portal_semester');
    safeStorage.removeItem('asu_portal_module');
    safeStorage.removeItem('asu_portal_studyMode');
    safeStorage.removeItem('asu_portal_screen');

    setStudentYear(year);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedModule(null);
    setStudyMode(null);
    setSelectedChapter(null);
    setScreen('yearSelect');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }
  };

  const getYearName = (yr: number) => {
    if (language === 'en') {
      if (yr === 1) return "First Year";
      if (yr === 2) return "Second Year";
      if (yr === 3) return "Third Year";
      if (yr === 4) return "Fourth Year";
      if (yr === 5) return "Fifth Year";
    } else {
      if (yr === 1) return "السنة الأولى";
      if (yr === 2) return "السنة الثانية";
      if (yr === 3) return "السنة الثالثة";
      if (yr === 4) return "السنة الرابعة";
      if (yr === 5) return "السنة الخامسة";
    }
    return `Year ${yr}`;
  };

  return (
    <div className="p-6 text-gray-900 font-manrope">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center text-physiology shrink-0">
          <GraduationCap size={22} />
        </div>
        <div className="text-left rtl:text-right">
          <h3 className="font-archivo text-lg font-bold tracking-tight text-gray-900">
            {language === 'en' ? "Change Academic Year" : "تغيير السنة الدراسية"}
          </h3>
          <p className="text-xs text-gray-505 font-medium mt-0.5">
            {language === 'en' ? `Current: ${getYearName(studentYear || 1)}` : `الحالي: ${getYearName(studentYear || 1)}`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {([1, 2, 3, 4, 5] as const).map((yr) => {
          const isCurrent = studentYear === yr;
          return (
            <button
              key={yr}
              onClick={() => handleSelectYear(yr)}
              className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all duration-200 text-left rtl:text-right ${
                isCurrent
                  ? "bg-physiology/10 border-physiology/30 text-physiology-dark"
                  : "bg-gray-50 border-gray-100 hover:bg-physiology/5 text-gray-700"
              }`}
            >
              <div className="text-left rtl:text-right">
                <span className="block text-sm font-bold">
                  {language === 'en' ? `Year ${yr}` : `السنة ${yr}`}
                </span>
                <span className="block text-[11px] text-gray-400 mt-0.5">
                  {language === 'en'
                    ? `Switch to Year ${yr} syllabus and courses`
                    : `الانتقال إلى منهج ومقررات السنة ${yr}`}
                </span>
              </div>
              {isCurrent && (
                <div className="w-5.5 h-5.5 rounded-full bg-physiology flex items-center justify-center text-white shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
