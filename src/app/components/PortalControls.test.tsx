import {useState} from 'react';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,it,expect} from 'vitest';
import {ThemeContext} from '../context/ThemeContextValue';
import {ThemeToggle} from './ThemeToggle';
import {LanguageToggle} from './LanguageToggle';
import {PortalFooter} from './PortalFooter';
afterEach(cleanup);
it('uses a keyboard-operated native switch with truthful dark-mode state in RTL',async()=>{
 function Harness(){const [dark,setDark]=useState(true);return <div dir="rtl"><ThemeContext.Provider value={{isDark:dark,theme:dark?'dark':'light',toggleTheme:()=>setDark(!dark)}}><ThemeToggle/></ThemeContext.Provider></div>;}
 render(<Harness/>);const toggle=screen.getByRole('switch',{name:'Dark mode'});expect(toggle.tagName).toBe('BUTTON');expect(toggle).toHaveAttribute('aria-checked','true');expect(toggle).toHaveAttribute('dir','ltr');
 const user=userEvent.setup();await user.tab();expect(toggle).toHaveFocus();await user.keyboard(' ');expect(toggle).toHaveAttribute('aria-checked','false');await user.keyboard('{Enter}');expect(toggle).toHaveAttribute('aria-checked','true');
});
it('keeps the globe language control bilingual and accessible',()=>{
 function Harness(){const [ar,setAr]=useState(false);return <LanguageToggle value={ar?'ar':'en'} onToggle={()=>setAr(!ar)}/>;}render(<Harness/>);fireEvent.click(screen.getByRole('button',{name:'العربية'}));expect(screen.getByRole('button',{name:'English'})).toBeInTheDocument();
});
it('keeps a compact footer with contact and support destinations',()=>{render(<PortalFooter/>);expect(screen.getAllByRole('link')).toHaveLength(1);expect(screen.getByRole('button',{name:'Contact'})).toHaveAttribute('aria-haspopup','dialog');expect(screen.getByRole('link',{name:'Support'})).toHaveAttribute('href','/support');expect(screen.queryByText(/Ain Shams University/)).toBeNull();});

it('offers WhatsApp and email without navigating until the student chooses',()=>{HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};render(<PortalFooter/>);fireEvent.click(screen.getByRole('button',{name:'Contact'}));expect(screen.getByRole('dialog',{name:'Contact Omar'})).toBeInTheDocument();expect(document.body.style.overflow).toBe('hidden');expect(screen.getByRole('link',{name:/WhatsApp/})).toHaveAttribute('href','https://wa.me/201040479155');expect(screen.getByRole('link',{name:/Email/})).toHaveAttribute('href','mailto:omarhmaged@gmail.com');fireEvent.click(screen.getByRole('button',{name:'Close contact'}));expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).not.toBe('hidden');});
