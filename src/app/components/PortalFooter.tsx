export function PortalFooter() {
  return (
    <footer className="w-full mt-16 pb-8 text-center space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-6">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">
        Ain Shams University • ASU Medical Portal
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-6 leading-relaxed">
        Developed for medical students. For inquiries, database updates, or error reports, please contact:{' '}
        <a
          href="mailto:omarhmaged@gmail.com"
          className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold"
        >
          omarhmaged@gmail.com
        </a>
      </p>
    </footer>
  );
}
