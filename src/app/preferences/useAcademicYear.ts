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

/** Account scoped, cloud-confirmed year. Legacy shared years require reconfirmation. */
export function useAcademicYear(){
 const {userId,isLoaded,getToken}=useAuth();
 const id=userId??'guest';const currentId=useRef(id);currentId.current=id;
 const tokenRef=useRef(getToken);tokenRef.current=getToken;
 const [state,setState]=useState<{id:string;year:number|null;loading:boolean;error:string|null}>({id:'',year:null,loading:true,error:null});
 const [reload,setReload]=useState(0);
 useEffect(()=>{
  if(!isLoaded)return;
  let active=true;const key=academicYearKey(id);
  setState({id,year:null,loading:true,error:null});
  const load=async()=>{
   try {
    let preference:YearPreference|null;
    if(!userId)preference=cached(key);
    else {
     const token=await tokenRef.current();
     const response=await fetch('/api/sync',{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15_000)});
     if(!response.ok)throw new Error('Cloud preference could not be loaded. Please retry.');
     const payload=await response.json();preference=parsePreference(payload.data?.[key]);
    }
    if(!active)return;
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
  try{localStorage.setItem(key,JSON.stringify(preference));localStorage.setItem('asu_medical_student_year',String(year));}catch{/* Cloud save has already succeeded. */}
  setState({id,year,loading:false,error:null});
 },[id,userId]);
 return {year:state.id===id?state.year:null,loading:!isLoaded||state.id!==id||state.loading,error:state.id===id?state.error:null,saveYear,retry:()=>setReload(n=>n+1)};
}
