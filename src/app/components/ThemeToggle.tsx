import { motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/** Shared profile/support switch; native keyboard behavior and a contained thumb. */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const reduced = useReducedMotion();
  return (
    <button type="button" role="switch" aria-checked={isDark} aria-label="Dark mode"
      onClick={toggleTheme} className="portal-theme-switch" dir="ltr"
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:64,minWidth:64,minHeight:44,padding:0,border:0,background:'transparent',cursor:'pointer',borderRadius:16}}>
      <span style={{position:'relative',display:'block',width:64,height:32,borderRadius:16,background:isDark?'#1e1e23':'#dcdce1',boxShadow:'inset 0 2px 4px rgb(0 0 0 / .15)'}}>
        <motion.span animate={{x:isDark?0:32}} transition={reduced?{duration:0}:{type:'spring',stiffness:500,damping:30}}
          style={{position:'absolute',left:2,top:2,width:28,height:28,borderRadius:'50%',display:'grid',placeItems:'center',background:isDark?'#2c2c2c':'#fff',color:isDark?'#bfdbfe':'#a16207',boxShadow:'0 2px 6px rgb(0 0 0 / .2)'}}>
          {isDark?<Moon size={18} aria-hidden="true"/>:<Sun size={18} aria-hidden="true"/>}
        </motion.span>
      </span>
    </button>
  );
}
