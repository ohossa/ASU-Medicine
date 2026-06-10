import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { InteractiveBackground } from './ui/InteractiveBackground';
import { Activity } from 'lucide-react';

export function LoginScreen() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50/50 dark:bg-black font-manrope selection:bg-physiology/20 selection:text-physiology-dark">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <InteractiveBackground />
        <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full bg-physiology/30 dark:bg-physiology/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen blob-float-1" />
        <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full bg-anatomy/30 dark:bg-anatomy/20 blur-[160px] mix-blend-multiply dark:mix-blend-screen blob-float-2" />
        <div className="absolute top-[40%] left-[40%] h-[30vw] w-[30vw] rounded-full bg-biochem/30 dark:bg-biochem/20 blur-[140px] mix-blend-multiply dark:mix-blend-screen blob-float-3" />
      </div>

      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side: Branding and Hero Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left z-10 lg:pl-10">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-physiology to-clinical flex items-center justify-center shadow-lg shadow-physiology/20">
              <Activity className="text-white" size={24} />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="font-archivo text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">ASU Medical Portal</h2>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Ain Shams University</span>
            </div>
          </div>
          
          <h1 className="font-archivo text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            Master your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-physiology via-clinical to-biochem">Medical Studies.</span>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mt-2">
            Securely save your progress, seamlessly sync across all your devices, and access premium interactive medical quizzes anytime, anywhere.
          </p>

          <div className="flex items-center gap-6 justify-center lg:justify-start mt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-black shadow-sm ${i === 1 ? 'bg-physiology/20' : i === 2 ? 'bg-anatomy/20' : i === 3 ? 'bg-biochem/20' : 'bg-histology/20'}`} />
              ))}
            </div>
            <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
              Join <span className="text-physiology">5,000+</span> Medical Students
            </div>
          </div>
        </div>

        {/* Right Side: Clerk SignIn UI */}
        <div className="flex justify-center z-10 w-full lg:justify-end">
          <div className="glass-panel p-4 rounded-[40px] glow-border shadow-2xl">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-none m-0 rounded-[32px] border-none",
                  headerTitle: "font-archivo font-black text-2xl text-gray-900 dark:text-white",
                  headerSubtitle: "font-manrope font-semibold text-gray-500 dark:text-gray-400",
                  socialButtonsBlockButton: "rounded-2xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-gray-900 dark:text-white font-bold h-12",
                  socialButtonsBlockButtonText: "font-archivo font-bold",
                  dividerLine: "bg-gray-200 dark:bg-gray-800",
                  dividerText: "text-gray-400 dark:text-gray-500 font-bold",
                  formFieldLabel: "text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider mb-2",
                  formFieldInput: "rounded-xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 h-12 text-gray-900 dark:text-white font-semibold focus:ring-physiology focus:border-physiology transition-all",
                  formButtonPrimary: "bg-physiology hover:bg-physiology-dark transition-all rounded-xl h-12 font-archivo font-bold text-base shadow-lg shadow-physiology/20",
                  footerActionText: "text-gray-500 dark:text-gray-400 font-semibold",
                  footerActionLink: "text-physiology hover:text-physiology-dark font-bold transition-all",
                  identityPreview: "rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
                  identityPreviewText: "text-gray-900 dark:text-white font-semibold",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
