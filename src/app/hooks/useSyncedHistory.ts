import {useLayoutEffect,useState} from 'react';
import {getQuizHistory} from '../utils/storage';
import {historyStorageKey} from '../learning/historyScope';
/** Hydrate before paint and react to late cloud pulls and same-tab saves. */
export function useSyncedHistory() {
  const [history,setHistory]=useState(getQuizHistory);
  const key=historyStorageKey();
  useLayoutEffect(()=>{
    const update=()=>setHistory(getQuizHistory());
    update();
    window.addEventListener('storage',update);
    window.addEventListener('asu-history-updated',update);
    return()=>{
      window.removeEventListener('storage',update);
      window.removeEventListener('asu-history-updated',update);
    };
  },[key]);
  return history;
}
