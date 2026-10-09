import {useEffect,useMemo,useRef,useState} from 'react';
import {ListChecks,Search,X,ChevronDown} from 'lucide-react';
import type {ChapterData,SubjectData,Question} from '../types';
import {practiceTopics,selectedPractice} from '../learning/customPractice';
import {ShuffleSwitch} from '../preferences/ShuffleSwitch';
import {useLanguage} from '../hooks/useLanguage';
import './topic-practice.css';
function SelectionBox({checked,partial,onChange,label,disabled=false}:{disabled?:boolean;checked:boolean;partial:boolean;onChange:()=>void;label:string}){
 const ref=useRef<HTMLInputElement>(null);useEffect(()=>{if(ref.current)ref.current.indeterminate=partial;},[partial]);
 return <input ref={ref} disabled={disabled} type="checkbox" checked={checked} aria-label={label} onChange={onChange}/>;
}
export function TopicPracticePicker({chapter,moduleCode,onStart}:{chapter:ChapterData;moduleCode?:string;onStart:(subject:SubjectData,questions:Question[])=>void}){
 const {language}=useLanguage();const ar=language==='ar';const [open,setOpen]=useState(false);const [selected,setSelected]=useState(new Set<string>());const [search,setSearch]=useState('');const [expanded,setExpanded]=useState(new Set<string>());
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const topics=useMemo(()=>practiceTopics(chapter,moduleCode),[chapter,moduleCode]);
 const run=useMemo(()=>selectedPractice(chapter,topics,selected),[chapter,topics,selected]);
 const visible=topics.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())||t.questions.some(q=>q.text.toLowerCase().includes(search.toLowerCase())));
 useEffect(()=>{if(!open||!dialog.current)return;const element=dialog.current;const before=document.body.style.overflow;document.body.style.overflow='hidden';element.showModal();return()=>{element.close();document.body.style.overflow=before;trigger.current?.focus();};},[open]);
 const toggle=(ids:string[])=>setSelected(prev=>{const next=new Set(prev);const remove=ids.every(id=>next.has(id));ids.forEach(id=>remove?next.delete(id):next.add(id));return next;});
 return <>
 <section className="topic-practice-banner"><div className="topic-practice-intro"><ListChecks size={24} aria-hidden="true"/><div><h3>{ar?'صمّم تدريبك':'Build your practice'}</h3><p>{ar?'اختر موضوعات أو أسئلة محددة في جلسة واحدة.':'Choose topics or individual questions for one session.'}</p></div></div><button ref={trigger} type="button" className="report-primary" aria-haspopup="dialog" onClick={()=>setOpen(true)}>{ar?'اختر الموضوعات':'Choose topics'}</button></section>
 {open&&<dialog ref={dialog} className="topic-practice-dialog" aria-labelledby="topic-picker-title" dir={ar?'rtl':'ltr'} onCancel={()=>setOpen(false)} onClick={e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setOpen(false);}}>
 <header><div><p className="topic-practice-eyebrow">{chapter.title}</p><h2 id="topic-picker-title">{ar?'اختر تدريبك':'Choose your practice'}</h2></div><button type="button" aria-label={ar?'إغلاق':'Close topic picker'} onClick={()=>setOpen(false)}><X size={22}/></button></header>
 <div className="topic-picker-tools"><label className="topic-picker-search"><Search size={18} aria-hidden="true"/><input autoFocus placeholder={ar?'ابحث عن موضوع أو سؤال':'Find a topic or question'} aria-label={ar?'ابحث عن موضوع أو سؤال':'Find a topic or question'} value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="topic-picker-actions"><button type="button" onClick={()=>setSelected(new Set(topics.flatMap(t=>t.questions.map(q=>String(q.id)))))}>{ar?'تحديد الكل':'Select all'}</button><button type="button" disabled={!selected.size} onClick={()=>setSelected(new Set())}>{ar?'إلغاء التحديد':'Clear'}</button><ShuffleSwitch/></div></div>
 <div className="topic-picker-list">{visible.length===0&&<p className="topic-picker-empty">{ar?'لا توجد نتائج. جرّب بحثاً آخر.':'No matches. Try another search.'}</p>}{visible.map(topic=>{
 const ids=topic.questions.map(q=>String(q.id));const count=ids.filter(id=>selected.has(id)).length;const isExpanded=expanded.has(topic.key);const titleMatch=topic.title.toLowerCase().includes(search.toLowerCase());const questionList=topic.questions.filter(q=>!search||titleMatch||q.text.toLowerCase().includes(search.toLowerCase()));
 return <section className="topic-picker-topic" key={topic.key} data-selected={count>0}>
 <div className="topic-picker-row"><label><SelectionBox checked={ids.length>0&&count===ids.length} partial={count>0&&count<ids.length} label={topic.title} disabled={!ids.length} onChange={()=>toggle(ids)}/><span><strong>{topic.title}</strong><small>{ids.length?`${count} / ${ids.length} ${ar?'سؤال محدد':'questions selected'}`:ar?'لا توجد أسئلة في هذا النمط':'No questions in this mode'}</small></span></label><button type="button" disabled={!ids.length} aria-label={`${ar?'اختر أسئلة من':'Choose questions in'} ${topic.title}`} aria-expanded={isExpanded||!!search} onClick={()=>setExpanded(prev=>{const next=new Set(prev);next.has(topic.key)?next.delete(topic.key):next.add(topic.key);return next;})}><ChevronDown size={20} style={{transform:isExpanded?'rotate(180deg)':undefined}}/></button></div>
 {(isExpanded||!!search)&&questionList.length>0&&<div className="topic-picker-questions">{questionList.map(q=><label key={q.id}><input type="checkbox" checked={selected.has(String(q.id))} onChange={()=>toggle([String(q.id)])}/><span>{q.text}</span></label>)}</div>}
 </section>;
 })}</div>
 <footer><div role="status" aria-live="polite"><strong>{run.questions.length} {ar?'سؤال':'questions'}</strong><small>{run.subject.lectureCount} {ar?'موضوعات · نقاط وتقدم حسب الموضوع':'topics · XP and progress stay with each topic'}</small></div><button className="report-primary" type="button" disabled={!run.questions.length} onClick={()=>{setOpen(false);onStart(run.subject,run.questions);}}>{ar?'ابدأ التدريب':'Start practice'}</button></footer>
 </dialog>}
 </>;
}
