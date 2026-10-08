import {useAuth} from '@clerk/clerk-react';
import {useCallback,useEffect,useRef,useState} from 'react';

export const academicYearKey=(id:string)=>`asu_preferences:${id}:academic-year`;
interface YearPreference {year:number;version:1;timestamp:number}
function parsePreference(value:unknown):YearPreference|null {
 try {
  const p=typeof value==='string'?JSON.parse(value):value;
  return p && p.version===1 && Number.isInteger(p.year) && p.year>=1 && p.year<=5 && Number.isFinite(p.timestamp) ? p : null;
 } catch {return null;}
}
function cached(key:string){try{return parsePreference(localStorage.getItem(key));}catch{return null;}}

const pendingReads=new Map<string,Promise<YearPreference|null>>();
const recentReads=new Map<string,{at:number;value:string}>();
function hasFreshRead(key:string,saved:YearPreference|null){const recent=recentReads.get(key);return !!recent&&Date.now()-recent.at<60_000&&recent.value===JSON.stringify(saved);}
async function readCloudYear(key:string,getToken:()=>Promise<string|null>){
 const pending=pendingReads.get(key);if(pending)return pending;
 const job=(async()=>{
  const token=await getToken();
  if(!token)throw new Error('Sign in to load your year.');
  const response=await fetch('/api/sync',{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15_000)});
  if(!response.ok)throw new Error('Cloud preference could not be loaded. Please retry.');
  const payload=await response.json();return parsePreference(payload.data?.[key]);
 })();
 pendingReads.set(key,job);
 try{return await job;}finally{if(pendingReads.get(key)===job)pendingReads.delete(key);}
}

/** Account scoped, cloud-confirmed year. Legacy shared years require reconfirmation. */
export function useAcademicYear(){
 const {userId,isLoaded,getToken}=useAuth();
 const id=userId??'guest';const currentId=useRef(id);currentId.current=id;
 const tokenRef=useRef(getToken);tokenRef.current=getToken;
 const [state,setState]=useState<{id:string;year:number|null;loading:boolean;error:string|null}>(()=>{const saved=isLoaded?cached(academicYearKey(id)):null;return {id,year:saved?.year??null,loading:!isLoaded||(!saved&&!hasFreshRead(academicYearKey(id),saved)),error:null};});
 const [reload,setReload]=useState(0);
 useEffect(()=>{
  if(!isLoaded)return;
  let active=true;const key=academicYearKey(id);
  const saved=cached(key);
  setState({id,year:saved?.year??null,loading:!saved&&!hasFreshRead(key,saved),error:null});
  const load=async()=>{
   try {
    let preference:YearPreference|null;let didRead=false;
    if(!userId)preference=cached(key);
    else {
     const reuse=reload===0&&hasFreshRead(key,saved);didRead=!reuse;
     preference=reuse?saved:await readCloudYear(key,()=>tokenRef.current());
    }
    if(!active)return;
    // A year saved while this read was in flight must not be overwritten.
    const latest=cached(key);
    if(latest && latest.timestamp>(saved?.timestamp??0) && latest.timestamp>(preference?.timestamp??0))preference=latest;
    if(didRead)recentReads.set(key,{at:Date.now(),value:JSON.stringify(preference)});
    if(!preference){try{localStorage.removeItem(key);}catch{/* Storage may be unavailable. */}}
    if(preference){try{localStorage.setItem(key,JSON.stringify(preference));localStorage.setItem('asu_medical_student_year',String(preference.year));}catch{/* Cloud remains authoritative. */}}
    setState({id,year:preference?.year??null,loading:false,error:null});
   }catch{
    if(active)setState({id,year:cached(key)?.year??null,loading:false,error:'Could not load your cloud year. Choose your year to save it, or retry.'});
   }
  };void load();return()=>{active=false;};
 },[id,isLoaded,userId,reload]);
 const saveYear=useCallback(async(year:number)=>{
  if(!Number.isInteger(year)||year<1||year>5)throw new Error('Choose a valid academic year.');
  const key=academicYearKey(id);const preference:YearPreference={year,version:1,timestamp:Date.now()};
  if(userId){
   const token=await tokenRef.current();
   const response=await fetch('/api/sync',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({[key]:preference}),signal:AbortSignal.timeout(15_000)});
   if(!response.ok)throw new Error('Your year could not be saved to the cloud. Please try again.');
  }
  if(currentId.current!==id)return;
  recentReads.set(key,{at:Date.now(),value:JSON.stringify(preference)});
  try{localStorage.setItem(key,JSON.stringify(preference));localStorage.setItem('asu_medical_student_year',String(year));}catch{/* Cloud save has already succeeded. */}
  setState({id,year,loading:false,error:null});
 },[id,userId]);
 return {year:state.id===id?state.year:null,loading:!isLoaded||state.id!==id||state.loading,error:state.id===id?state.error:null,saveYear,retry:()=>setReload(n=>n+1)};
}
