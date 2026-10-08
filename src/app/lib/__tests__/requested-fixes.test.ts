import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {GIT_MARKS_PRESET,evaluateFinalGate,gradeFromScore} from '../marksRules';
describe('GIT official marks',()=>{
 it('totals 260 with a 104-mark final counted once',()=>{
 expect(GIT_MARKS_PRESET.sections.reduce((n,s)=>n+s.max,0)).toBe(260);
 expect(GIT_MARKS_PRESET.sections.filter(s=>s.id.startsWith('git-final')).reduce((n,s)=>n+s.max,0)).toBe(104);
 });
 it.each([[155.99,'Fail'],[156,'D'],[168.99,'D'],[169,'C'],[194.99,'C'],[195,'B'],[220.99,'B'],[221,'A'],[260,'A']])('grades %s as %s',(score,grade)=>expect(gradeFromScore(score as number,GIT_MARKS_PRESET.boundaries)).toBe(grade));
 it('requires the combined final pass independently of overall marks',()=>{
 expect(evaluateFinalGate(GIT_MARKS_PRESET,{'git-final-1':'36','git-final-2':'5.6'}).status).toBe('passed');
 expect(evaluateFinalGate(GIT_MARKS_PRESET,{'git-final-1':'36','git-final-2':'5.59'}).status).toBe('failed');
 expect(evaluateFinalGate(GIT_MARKS_PRESET,{'git-final-1':'0'}).status).toBe('pending');
 expect(evaluateFinalGate(GIT_MARKS_PRESET,{'git-final-1':'37','git-final-2':'68'}).status).toBe('invalid');
 });
});
describe('case reference assets',()=>{
 it('has every referenced case image locally',()=>{
 const code=readFileSync('src/app/components/ClinicalCaseSolver.tsx','utf8');
 for(const [,url] of code.matchAll(/imageUrl: "([^"]+)"/g)) expect(existsSync(`public${url}`),url).toBe(true);
 });
});
