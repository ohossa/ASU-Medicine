import {it,expect} from 'vitest';
import {setHistoryAccount,historyStorageKey,HISTORY_WIRE_KEY} from '../../app/learning/historyScope';
import {getQuizHistory,saveQuizResult} from '../../app/utils/storage';
it('isolates browser histories while preserving unowned legacy data',()=>{
 localStorage.clear();localStorage.setItem(HISTORY_WIRE_KEY,JSON.stringify([{id:'legacy',pct:50}]));
 setHistoryAccount('alice');saveQuizResult({chapterId:1,chapterTitle:'A',subjectName:'S',correct:1,total:1,pct:100,elapsedSeconds:1,moduleCode:'M'});
 expect(getQuizHistory()).toHaveLength(1);setHistoryAccount('bob');expect(getQuizHistory()).toEqual([]);
 expect(localStorage.getItem(historyStorageKey('alice'))).toContain('A');expect(localStorage.getItem(HISTORY_WIRE_KEY)).toContain('legacy');
 setHistoryAccount(null);
});
