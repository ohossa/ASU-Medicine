import { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <div className={`group rounded-2xl bg-white/5 dark:bg-white/[0.07] backdrop-blur-2xl border border-white/10 dark:border-white/5 p-6 
      transition-all duration-300 ease-out 
      hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-white/[0.08]
      ${className}`}>
      {children}
    </div>
  );
}