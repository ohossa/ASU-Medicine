import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {useAcademicYear, academicYearKey} from './useAcademicYear';
const auth=vi.hoisted(()=>({isLoaded:true,userId:'alice' as string|null,getToken:vi.fn(async()=> 'token')}));
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>auth}));
beforeEach(()=>{localStorage.clear();auth.userId='alice';vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({data:{}}))));});
afterEach(()=>vi.unstubAllGlobals());
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
