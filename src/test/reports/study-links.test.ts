import {it,expect} from 'vitest';
import {resolveStudyLink} from '../../app/utils/studyLinks';
import type {ChapterData} from '../../app/types';
const chapters=[{id:4,title:'Stomach',subjects:[{id:'histology',questions:[{id:'moved',type:'mcq'}]}]}] as ChapterData[];
it('finds questions by stable ID after chapter movement and preserves subject selection',()=>{
 const link=resolveStudyLink(chapters,new URLSearchParams('chapter=1&question=moved'));
 expect(link).toMatchObject({chapter:{id:4},subject:{id:'histology'},questions:[{id:'moved'}]});
});
it('returns an explicit unavailable result for missing questions instead of opening a guessed chapter',()=>{
 expect(resolveStudyLink(chapters,new URLSearchParams('question=retired'))).toBeNull();
});
it('opens a lecture subset without mixing the rest of its subject',()=>{
 const bank=[{id:1,subjects:[{id:'anatomy',name:'Anatomy',lectureNames:['Tongue','Palate'],questions:[{id:'tongue',lecture:1},{id:'palate',lecture:2}]}]}] as ChapterData[];
 expect(resolveStudyLink(bank,new URLSearchParams('chapter=1&subject=anatomy&lecture=2'))?.questions.map(q=>q.id)).toEqual(['palate']);
});
