import {act, renderHook, waitFor, cleanup} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {useAcademicYear, academicYearKey} from './useAcademicYear';
const auth=vi.hoisted(()=>({isLoaded:true,userId:'alice' as string|null,getToken:vi.fn(async()=> 'token')}));
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>auth}));
let testClock=Date.now();
beforeEach(()=>{testClock+=60_001;vi.spyOn(Date,'now').mockReturnValue(testClock);localStorage.clear();auth.userId='alice';vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({data:{}}))));});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();vi.unstubAllEnvs();});
it('requires existing students to reconfirm instead of trusting the old shared year',async()=>{
 localStorage.setItem('asu_medical_student_year','3');
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));expect(result.current.year).toBeNull();
});
it('restores the confirmed cloud year on a new device',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({data:{[academicYearKey('alice')]:{year:2,version:1,timestamp:1}}}))));
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.year).toBe(2));
});
it('persists only this account preference and closes selection after confirmed saving',async()=>{
 const fetchMock=vi.fn(async()=>new Response(JSON.stringify({data:{}})));vi.stubGlobal('fetch',fetchMock);
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));
 await act(()=>result.current.saveYear(3));expect(result.current.year).toBe(3);
 const request=fetchMock.mock.calls.at(-1) as unknown as [string,RequestInit];
 expect(request[1].method).toBe('POST');expect(Object.keys(JSON.parse(request[1].body as string))).toEqual([academicYearKey('alice')]);
});
it('does not claim a save succeeded when the cloud rejects it',async()=>{
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));
 vi.stubGlobal('fetch',vi.fn(async()=>new Response('',{status:503})));
 await act(async()=>{await expect(result.current.saveYear(2)).rejects.toThrow();});
 expect(result.current.year).toBeNull();expect(localStorage.getItem(academicYearKey('alice'))).toBeNull();
});
it('never displays the previous account year during an account switch',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({data:{[academicYearKey('alice')]:{year:3,version:1,timestamp:1}}}))));
 const {result,rerender}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.year).toBe(3));
 auth.userId='bob';rerender();expect(result.current.year).toBeNull();await waitFor(()=>expect(result.current.loading).toBe(false));expect(result.current.year).toBeNull();
});
it('rejects invalid year values before sending them',async()=>{
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));
 await expect(result.current.saveYear(9)).rejects.toThrow();
});
it('shows only this account cached year immediately while refreshing the cloud',async()=>{
 localStorage.setItem(academicYearKey('alice'),JSON.stringify({year:3,version:1,timestamp:101}));
 let finish!:(r:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;})));
 const {result}=renderHook(()=>useAcademicYear());
 expect(result.current.year).toBe(3);expect(result.current.loading).toBe(false);
 await waitFor(()=>expect(finish).toBeTypeOf('function'));
 await act(async()=>finish(new Response(JSON.stringify({data:{[academicYearKey('alice')]:{year:2,version:1,timestamp:2}}}))));
 await waitFor(()=>expect(result.current.year).toBe(2));expect(result.current.loading).toBe(false);
});
it('shares concurrent cloud reads between startup and page hooks',async()=>{
 let finish!:(r:Response)=>void;
 const fetchMock=vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;}));vi.stubGlobal('fetch',fetchMock);
 const a=renderHook(()=>useAcademicYear()),b=renderHook(()=>useAcademicYear());
 await waitFor(()=>expect(fetchMock).toHaveBeenCalledTimes(1));
 await act(async()=>finish(new Response(JSON.stringify({data:{}}))));
 await waitFor(()=>expect(a.result.current.loading||b.result.current.loading).toBe(false));
});
it('does not let an older cloud read undo a year just saved by the student',async()=>{
 let finish!:(r:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(async(_url,opts)=>opts?.method==='POST'?new Response('{}'):await new Promise<Response>(resolve=>{finish=resolve;})));
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(finish).toBeTypeOf('function'));
 await act(()=>result.current.saveYear(3));
 await act(async()=>finish(new Response(JSON.stringify({data:{[academicYearKey('alice')]:{year:2,version:1,timestamp:1}}}))));
 expect(result.current.year).toBe(3);expect(result.current.loading).toBe(false);
});
it('does not repeat startup loading when the cloud confirms no year was selected',async()=>{
 auth.userId='new-student';
 const fetchMock=vi.fn(async()=>new Response(JSON.stringify({data:{}})));vi.stubGlobal('fetch',fetchMock);
 const boot=renderHook(()=>useAcademicYear());await waitFor(()=>expect(boot.result.current.loading).toBe(false));
 const page=renderHook(()=>useAcademicYear());
 expect(page.result.current.loading).toBe(false);expect(page.result.current.year).toBeNull();
 expect(fetchMock).toHaveBeenCalledTimes(1);
});
it('allows account-scoped localhost preview year selection without pretending to sync the cloud',async()=>{
 vi.stubEnv('MODE','development');vi.stubEnv('DEV',true);
 const fetchMock=vi.fn().mockRejectedValue(new Error('No server credentials'));vi.stubGlobal('fetch',fetchMock);
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));
 await act(()=>result.current.saveYear(3));expect(result.current.year).toBe(3);expect(fetchMock).not.toHaveBeenCalled();
 expect(JSON.parse(localStorage.getItem(academicYearKey('alice'))!)).toMatchObject({year:3});
 auth.userId='bob';const other=renderHook(()=>useAcademicYear());await waitFor(()=>expect(other.result.current.loading).toBe(false));expect(other.result.current.year).toBeNull();
 vi.unstubAllEnvs();
});

it('keeps cloud saving mandatory in production even on localhost',async()=>{
 vi.stubEnv('DEV',false);vi.stubEnv('MODE','production');
 const {result}=renderHook(()=>useAcademicYear());await waitFor(()=>expect(result.current.loading).toBe(false));
 vi.stubGlobal('fetch',vi.fn(async()=>new Response('',{status:503})));
 await act(async()=>{await expect(result.current.saveYear(3)).rejects.toThrow();});
 expect(result.current.year).toBeNull();expect(result.current.localPreview).toBe(false);
});
