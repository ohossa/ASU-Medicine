import {it,expect} from 'vitest';
import {pastExamsFirst,isPastExamSection} from './practiceOrder';
it('puts labelled past exams first without changing source order or stable identities',()=>{
 const a={id:1,title:'Carbohydrates'},b={id:8,title:'Past Exams'},c={id:5,title:'Proteins'},d={id:101,title:'Anatomy',bankSection:'past-exams'};
 const original=[a,b,c,d]; expect(pastExamsFirst(original)).toEqual([b,d,a,c]); expect(original).toEqual([a,b,c,d]);expect(pastExamsFirst([a,c])).toEqual([a,c]);
});
it('recognizes future modules, recalled papers and Arabic labels without marking exam technique topics',()=>{
 for(const row of [{name:'Past exams & recalls'},{title:'Previous examination questions'},{title:'الامتحانات السابقة'}]) expect(isPastExamSection(row)).toBe(true);
 expect(isPastExamSection({title:'History Taking & Clinical Examination'})).toBe(false);
});
