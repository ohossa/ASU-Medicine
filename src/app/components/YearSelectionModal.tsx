import React from 'react';
import { GraduationCap } from 'lucide-react';
import { triggerCloudSync } from '../hooks/useCloudSync';

interface Props {
  onSelect: (year: number) => void;
}

export function YearSelectionModal({ onSelect }: Props) {
  const handleSelect = (year: number) => {
    localStorage.setItem('asu_medical_student_year', year.toString());
    triggerCloudSync();
    onSelect(year);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 shadow-2xl animate-pop-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-physiology/10 to-transparent rounded-bl-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-physiology/10 flex items-center justify-center text-physiology">
            <GraduationCap size={32} strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-archivo text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome to the Portal!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
              To personalize your experience, please select your current academic year.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3, 4, 5].map((year) => (
            <button
              key={year}
              onClick={() => handleSelect(year)}
              className="w-full py-4 px-6 bg-gray-50 hover:bg-physiology/10 dark:bg-gray-800/50 dark:hover:bg-physiology/10 text-gray-700 dark:text-gray-300 hover:text-physiology-dark dark:hover:text-physiology rounded-2xl font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-physiology/20 shadow-sm flex items-center justify-between group"
            >
              <span>Year {year}</span>
              <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Select
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
