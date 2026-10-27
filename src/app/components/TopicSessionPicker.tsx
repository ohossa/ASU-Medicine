import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import type {PracticeTopic} from '../learning/customPractice';
import {questionCountLabel} from '../learning/practiceNavigation';
export function TopicSessionPicker({topic,remaining,ar,onClose,onStart,progressReady=true,progressError='',onRetry}:{topic:PracticeTopic;remaining:number;ar:boolean;progressReady?:boolean;progressError?:string;onRetry?:()=>void;onClose:()=>void;onStart:(size:20|40|'all')=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const element=dialog.current!;const before=document.activeElement as HTMLElement;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';element.showModal();return()=>{element.close();document.body.style.overflow=overflow;before?.focus();};},[]);
 return <dialog ref={dialog} className="topic-session-dialog" dir={ar?'rtl':'ltr'} aria-labelledby="topic-session-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
  <header><h2 id="topic-session-title">{ar?'تدرب على':'Practice'} {topic.title}</h2><button type="button" aria-label={ar?'إغلاق':'Close session options'} onClick={onClose}><X size={20} aria-hidden="true"/></button></header>
  <p>{questionCountLabel(topic.questions.length,ar)} · {ar?`${remaining} لم تتم ممارستها بعد`:`${remaining} not yet practised`}</p>
  <p>{ar?'اختر طول الجلسة. يمكنك إكمال بقية الأسئلة لاحقاً.':'Choose a session length. You can practise the remaining questions afterward.'}</p>
  {!progressReady&&<p role="status">{progressError?(ar?'تعذر التحقق من التقدم. يمكنك تدريب الموضوع كاملاً.':'Progress could not be checked. You can practise the whole topic.'):(ar?'جارٍ التحقق من التقدم…':'Checking progress…')}{progressError&&<button type="button" onClick={onRetry}>{ar?'إعادة المحاولة':'Retry progress'}</button>}</p>}
  <div className="topic-session-options">
   <button type="button" disabled={!progressReady} onClick={()=>onStart(20)}>{questionCountLabel(20,ar)}</button>
   {topic.questions.length>40&&<button type="button" disabled={!progressReady} onClick={()=>onStart(40)}>{questionCountLabel(40,ar)}</button>}
   <button type="button" onClick={()=>onStart('all')}>{ar?'الموضوع كاملاً':'Whole topic'} · {questionCountLabel(topic.questions.length,ar)}</button>
  </div>
  <small>{ar?'الجلسات القصيرة تستأنف التدريب غير المكتمل أو تفتح المجموعة التالية. يظل الموضوع الكامل متاحاً للمراجعة.':'Short sessions resume an unfinished batch or open the next batch. The last batch may be shorter; the whole topic stays available for review.'}</small>
 </dialog>;
}
