import {useEffect,useRef,useState} from 'react';
import { HeartHandshake,Mail,MessageCircle,X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import './portal-footer.css';

export function PortalFooter() {
  const {language}=useLanguage();const ar=language==='ar';
  const [contact,setContact]=useState(false);const dialog=useRef<HTMLDialogElement>(null);const contactButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const element=dialog.current;if(!contact||!element)return;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';element.showModal();return()=>{element.close();document.body.style.overflow=overflow;contactButton.current?.focus();};},[contact]);
  return <footer className="portal-footer" dir={ar?'rtl':'ltr'}>
    <div className="portal-footer-inner">
      <span className="portal-footer-brand">ASUCodes</span>
      <nav aria-label={ar?'روابط الموقع':'Footer links'}>
        <button ref={contactButton} type="button" onClick={()=>setContact(true)} aria-haspopup="dialog">{ar?'تواصل':'Contact'}</button>
        <a href="/support"><HeartHandshake size={16} aria-hidden="true"/>{ar?'دعم الموقع':'Support'}</a>
      </nav>
    </div>
    {contact&&<dialog ref={dialog} className="portal-contact-dialog" aria-labelledby="portal-contact-title" onCancel={()=>setContact(false)}
      onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)setContact(false);}}>
      <div className="portal-contact-heading"><h2 id="portal-contact-title">{ar?'تواصل مع عمر':'Contact Omar'}</h2><button autoFocus type="button" aria-label={ar?'إغلاق':'Close contact'} onClick={()=>setContact(false)}><X size={20}/></button></div>
      <p>{ar?'اختار الطريقة الأنسب ليك.':'Choose whichever works best for you.'}</p>
      <a href="https://wa.me/201040479155" target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span><strong>WhatsApp</strong><small dir="ltr">01040479155</small></span></a>
      <a href="mailto:omarhmaged@gmail.com"><Mail size={21}/><span><strong>{ar?'البريد الإلكتروني':'Email'}</strong><small>omarhmaged@gmail.com</small></span></a>
    </dialog>}
  </footer>;
}
