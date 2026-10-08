import {useEffect,useRef,useState} from 'react';
import {useAuth,useUser} from '@clerk/clerk-react';
import {reportRequest} from './client';
/** Visibility follows server authorization, including the configured Clerk user-ID pin. */
export function useOwnerAccess(){
 const {user}=useUser(),{getToken}=useAuth(),token=useRef(getToken);token.current=getToken;
 const [allowedId,setAllowedId]=useState<string|null>(null);
 const id=user?.id,ownsEmail=user?.emailAddresses.some(e=>e.emailAddress.toLowerCase()==='omarhmaged@gmail.com'&&e.verification?.status==='verified');
 useEffect(()=>{if(!id||!ownsEmail){setAllowedId(null);return;}const abort=new AbortController();reportRequest<{isAdmin:boolean}>(token.current,'?action=access',{signal:abort.signal}).then(r=>{if(!abort.signal.aborted)setAllowedId(r.isAdmin?id:null);}).catch(()=>{if(!abort.signal.aborted)setAllowedId(null);});return()=>abort.abort();},[id,ownsEmail]);
 return Boolean(ownsEmail&&id&&allowedId===id);
}
