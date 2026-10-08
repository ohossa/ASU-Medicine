import { useSyncExternalStore } from 'react';
import { correctionStatus,correctionRevision,refreshQuestionCorrections } from '../data';
const subscribe=(update:()=>void)=>{window.addEventListener('asu-corrections-status',update);return()=>window.removeEventListener('asu-corrections-status',update);};
export function CorrectionStatus(){const status=useSyncExternalStore(subscribe,()=>correctionStatus,()=> 'loading');if(status!=='unavailable')return null;return <div role="status" className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-2 text-xs text-muted-foreground">Latest question corrections couldn’t be loaded. You’re viewing the bundled bank.<button type="button" onClick={()=>void refreshQuestionCorrections()} className="underline hover:text-foreground">Retry</button></div>;}

export function useBankRevision(){return useSyncExternalStore(subscribe,()=>correctionRevision,()=>0);}
