import {it,expect,vi,afterEach} from 'vitest';
import {renderHook,waitFor,act,cleanup} from '@testing-library/react';
import {useCloudSync} from '../../app/hooks/useCloudSync';
import {historyStorageKey,HISTORY_WIRE_KEY} from '../../app/learning/historyScope';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({userId:'alice',isSignedIn:true,getToken:async()=> 'token'})}));
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
it('refreshes another device history on focus and keeps unsent local results',async()=>{
 let cloud=[{id:'phone',pct:100,date:'2026-10-09'}];
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({data:{[HISTORY_WIRE_KEY]:cloud}})})));
 renderHook(()=>useCloudSync());
 await waitFor(()=>expect(JSON.parse(localStorage.getItem(historyStorageKey('alice'))!)).toHaveLength(1));
 localStorage.setItem(historyStorageKey('alice'),JSON.stringify([{id:'computer',pct:50,date:'2026-10-09'},...cloud]));
 cloud=[{id:'phone-new',pct:100,date:'2026-10-10'},...cloud];
 act(()=>window.dispatchEvent(new Event('focus')));
 await waitFor(()=>expect(JSON.parse(localStorage.getItem(historyStorageKey('alice'))!).map((r:{id:string})=>r.id).sort()).toEqual(['computer','phone','phone-new']));
});
it('uploads an account-scoped pending resume on reconnect without uploading unrelated browser settings',async()=>{
 const session='asu_quiz_session:alice:1:Oral';
 localStorage.setItem(session,JSON.stringify({timestamp:20,current:16}));
 localStorage.setItem('theme','dark');
 const calls:RequestInit[]=[];
 vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{
   calls.push(options);
   return {ok:true,json:async()=>({data:{[session]:{timestamp:10,current:1}}})};
 }));
 renderHook(()=>useCloudSync());
 await waitFor(()=>expect(calls.some(c=>c.method==='POST')).toBe(true));
 const posted=JSON.parse(String(calls.find(c=>c.method==='POST')!.body));
 expect(posted[session].current).toBe(16);
 expect(posted.theme).toBeUndefined();
});
