import { useSyncExternalStore } from 'react';
import { useUser } from '@clerk/clerk-react';
import { triggerCloudSync } from '../hooks/useCloudSync';
const prefix='asu_preferences:';
export const shuffleKey=(id:string)=>`${prefix}${id}:shuffle`;
function subscribe(update:()=>void){ window.addEventListener('storage',update);window.addEventListener('asu-preferences-changed',update);return()=>{window.removeEventListener('storage',update);window.removeEventListener('asu-preferences-changed',update);}; }
export function useShufflePreference(){
 const {user}=useUser();const key=shuffleKey(user?.id??'guest');
 const value=useSyncExternalStore(subscribe,()=>{try{return localStorage.getItem(key)??'';}catch{return '';}},()=> '');
 let enabled=false;try{enabled=JSON.parse(value).enabled===true;}catch{}
 return {enabled,setEnabled:(enabled:boolean)=>{localStorage.setItem(key,JSON.stringify({enabled,timestamp:Date.now()}));window.dispatchEvent(new Event('asu-preferences-changed'));if(user)triggerCloudSync();}};
}
