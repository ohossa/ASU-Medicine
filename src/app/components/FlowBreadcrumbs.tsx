import {useEffect,useId,useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ChevronRight,MoreHorizontal} from 'lucide-react';
import './flow-breadcrumbs.css';

export interface FlowCrumb {label:string;onClick?:()=>void}
const compactQuery='(max-width: 640px)';
function compactSnapshot(){return typeof window!=='undefined'&&Boolean(window.matchMedia?.(compactQuery).matches);}
function subscribeCompact(update:()=>void){
 const query=window.matchMedia?.(compactQuery);if(!query)return ()=>{};
 query.addEventListener('change',update);return ()=>query.removeEventListener('change',update);
}

/** Keep the current location visible; every ancestor remains in the full path. */
export function FlowBreadcrumbs({crumbs,rtl=false,onNavigate}:{
 crumbs:FlowCrumb[];rtl?:boolean;onNavigate?:(action:()=>void)=>void;
}){
 const compact=useSyncExternalStore(subscribeCompact,compactSnapshot,()=>false);
 const [open,setOpen]=useState(false),[shift,setShift]=useState(0);
 const root=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const panelId=useId();
 const close=()=>{setOpen(false);setShift(0);};
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))close();};
  window.addEventListener('pointerdown',outside);window.addEventListener('resize',close);
  return()=>{window.removeEventListener('pointerdown',outside);window.removeEventListener('resize',close);};
 },[open]);
 useLayoutEffect(()=>{
  if(!open||!panel.current)return;
  const rect=panel.current.getBoundingClientRect();
  setShift(rect.left<16?16-rect.left:rect.right>window.innerWidth-16?window.innerWidth-16-rect.right:0);
 },[open]);
 const activate=(crumb:FlowCrumb)=>{close();if(crumb.onClick){if(onNavigate)onNavigate(crumb.onClick);else crumb.onClick();}};
 const crumbContent=(crumb:FlowCrumb,index:number)=>crumb.onClick?
  <button type="button" className="flow-crumb-action" aria-current={index===crumbs.length-1?'page':undefined} title={crumb.label} onClick={()=>activate(crumb)}>{crumb.label}</button>:
  <span className="flow-crumb-label" aria-current={index===crumbs.length-1?'page':undefined} title={crumb.label}>{crumb.label}</span>;
 const fullPath=()=>crumbs.map((crumb,index)=><li key={`${index}-${crumb.label}`}>
  {index>0&&<ChevronRight size={13} aria-hidden="true" className={rtl?'flow-crumb-chevron rtl':'flow-crumb-chevron'}/>} {crumbContent(crumb,index)}
 </li>);
 if(!crumbs.length)return null;
 return <div ref={root} dir={rtl?'rtl':'ltr'} className="flow-breadcrumbs" onKeyDown={event=>{
  if(event.key==='Escape'&&open){event.preventDefault();close();trigger.current?.focus();}
  if(open&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   const actions=Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button')??[]);if(!actions.length)return;
   event.preventDefault();const current=actions.indexOf(document.activeElement as HTMLButtonElement);
   const next=event.key==='Home'?0:event.key==='End'?actions.length-1:event.key==='ArrowDown'?(current+1)%actions.length:(current<=0?actions.length-1:current-1);
   actions[next].focus();
  }
 }}>
  {compact?<>
   <ol aria-label={rtl?'الموقع الحالي':'Current location'} className="flow-compact-path">
    {crumbs.slice(-2).map((crumb,index)=>{const original=crumbs.length-Math.min(2,crumbs.length)+index;return <li key={`${original}-${crumb.label}`}>
     {index>0&&<ChevronRight size={13} aria-hidden="true" className={rtl?'flow-crumb-chevron rtl':'flow-crumb-chevron'}/>} {crumbContent(crumb,original)}
    </li>;})}
   </ol>
   <div className="flow-path-disclosure">
    <button ref={trigger} type="button" className="flow-path-trigger" aria-label={rtl?'عرض المسار الكامل':'Show full path'} aria-expanded={open} aria-controls={panelId} onClick={()=>{if(open)close();else setOpen(true);}}>
     <MoreHorizontal size={19} aria-hidden="true"/>
    </button>
    {open&&<div ref={panel} id={panelId} className="flow-path-panel" style={{transform:`translateX(${shift}px)`}}>
     <p className="flow-path-heading">{rtl?'المسار الكامل':'Full path'}</p>
     <ol aria-label={rtl?'المسار الكامل':'Full path'} className="flow-menu-path">{fullPath()}</ol>
    </div>}
   </div>
  </>:<ol aria-label={rtl?'المسار الكامل':'Full path'} className="flow-desktop-path">{fullPath()}</ol>}
 </div>;
}
