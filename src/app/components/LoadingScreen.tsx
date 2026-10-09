import {useEffect} from 'react';
import './loading-screen.css';
interface LoadingScreenProps{isLoading?:boolean;progress?:number;label?:string;onComplete?:()=>void;duration?:number;compact?:boolean}
/** Display actual readiness. The quiet loader never adds an animation delay. */
export default function LoadingScreen({isLoading=true,progress,label='Opening your study space…',onComplete,compact=false}:LoadingScreenProps){
 useEffect(()=>{if(!isLoading)onComplete?.();},[isLoading,onComplete]);
 if(!isLoading)return null;
 return <div role="status" aria-live="polite" aria-busy="true" className={`study-loading study-loading--${compact?'route':'entry'}`}><div className="study-loading-content"><div className="study-loading-brand"><span className="study-loading-mark" aria-hidden="true">ASU</span><strong>ASUCodes</strong></div><p>{label}</p>{progress!==undefined&&Number.isFinite(progress)?<progress aria-label="Loading progress" max={100} value={Math.max(0,Math.min(100,progress))}/>:<span className="study-loading-spinner" aria-hidden="true"/>}</div></div>;
}
