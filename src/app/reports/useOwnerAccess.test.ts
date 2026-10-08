import {describe,it,expect,vi,afterEach} from 'vitest';
import {renderHook,waitFor} from '@testing-library/react';
import {useOwnerAccess} from './useOwnerAccess';
const state=vi.hoisted(()=>({id:'owner',email:'omarhmaged@gmail.com',allowed:true}));
vi.mock('@clerk/clerk-react',()=>({useUser:()=>({user:{id:state.id,emailAddresses:[{emailAddress:state.email,verification:{status:'verified'}}]}}),useAuth:()=>({getToken:async()=> 'test'})}));
vi.mock('./client',()=>({reportRequest:async()=>({isAdmin:state.allowed})}));
afterEach(()=>{state.id='owner';state.email='omarhmaged@gmail.com';state.allowed=true;});
describe('private admin menu visibility',()=>{
 it('shows only after server authorization and hides immediately on account switch',async()=>{const {result,rerender}=renderHook(()=>useOwnerAccess());expect(result.current).toBe(false);await waitFor(()=>expect(result.current).toBe(true));state.id='student';state.email='student@example.com';rerender();expect(result.current).toBe(false);});
 it('does not trust the email when the server denies the pinned account',async()=>{state.allowed=false;const {result}=renderHook(()=>useOwnerAccess());await waitFor(()=>expect(result.current).toBe(false));});
});
