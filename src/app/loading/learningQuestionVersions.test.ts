import {describe,it,expect,vi} from 'vitest';
import {createHash} from 'node:crypto';
import {captureLearningSourceBank,resolveLearningQuestionVersions} from './learningQuestionVersions';
import {applyPublishedEdits} from '../lib/publishedEdits';

const hash=(q:unknown)=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const question={id:'q1',type:'mcq',text:'Original',lecture:1,options:['A','B'],correctIndex:0,explanation:'Reason',contentVersion:'explicit-medical-v1'};
const makeBank=()=>({meta:{moduleCode:'MBL-2'},chapters:[{id:1,subjects:[{id:'physiology',questions:[{...question}]}]},{id:2,subjects:[{id:'biochem',questions:[{...question,id:'q2'}]}]}]});
const edit=(payload:object,baseVersion=hash(question))=>({moduleCode:'MBL-2',chapterId:1,questionId:'q1',baseVersion,question:payload});
describe('learning canonical question versions',()=>{
 it('matches server SHA of full canonical JSON including explicit contentVersion, only requested chapter',async()=>{
  const versions=await resolveLearningQuestionVersions(makeBank(),'MBL-2',1,[]);
  expect([...versions]).toEqual([['q1',hash(question)]]);
 });
 it('hashes edited canonical payload rather than injected runtime contentVersion',async()=>{
  const payload={...question,text:'Corrected',contentVersion:'explicit-edit-version'};
  const versions=await resolveLearningQuestionVersions(makeBank(),'MBL-2',1,[edit(payload)]);
  expect(versions.get('q1')).toBe(hash(payload));
  expect(versions.get('q1')).not.toBe(hash({...payload,contentVersion:hash(payload)}));
 });
 it('ignores stale edits and illegal lecture or ID changes using existing published guards',async()=>{
  for(const change of [edit({...question,text:'Stale'},'wrong'),edit({...question,lecture:2}),edit({...question,id:'other'})]){
   expect((await resolveLearningQuestionVersions(makeBank(),'MBL-2',1,[change])).get('q1')).toBe(hash(question));
  }
 });
 it('includes valid creation and excludes guarded deletion, rejecting cross-chapter duplicate created IDs',async()=>{
  const created={...question,id:'new',text:'Created'};
  const creation={moduleCode:'MBL-2',chapterId:1,subjectId:'physiology',questionId:'new',baseVersion:'created',question:created};
  const versions=await resolveLearningQuestionVersions(makeBank(),'MBL-2',1,[{...edit(question),deleted:true},creation,{...creation,questionId:'q2',question:{...created,id:'q2'}}]);
  expect([...versions]).toEqual([['new',hash(created)]]);
 });
 it('retains exact source fields after public overlays replace runtime arrays',async()=>{
  const bank=makeBank(),source=captureLearningSourceBank(bank),payload={...question,text:'Edited'};
  await applyPublishedEdits({'MBL-2':{v2Raw:bank}},[edit(payload)]);
  expect((await resolveLearningQuestionVersions(source,'MBL-2',1,[])).get('q1')).toBe(hash(question));
  expect((await resolveLearningQuestionVersions(source,'MBL-2',1,[edit(payload)])).get('q1')).toBe(hash(payload));
 });
 it('uses case parent canonical hash, whose children share the server snapshot version',async()=>{
  const q={id:'case',type:'case',text:'Case',lecture:1,subQuestions:[{id:'child',type:'essay',text:'Explain',modelAnswer:'Answer'}]};
  const bank={meta:{moduleCode:'MEM-2'},chapters:[{id:1,subjects:[{id:'clinical',questions:[q]}]}]};
  expect([...await resolveLearningQuestionVersions(bank,'MEM-2',1,[])]).toEqual([['case',hash(q)]]);
 });
 it('does not expose learning progress for coming-soon or mismatched module banks',async()=>{
  expect((await resolveLearningQuestionVersions({...makeBank(),comingSoon:true},'MBL-2',1,[])).size).toBe(0);
  expect((await resolveLearningQuestionVersions(makeBank(),'OTHER',1,[])).size).toBe(0);
 });
 it('public getter lazily loads requested module, caches hashes, and returns caller-isolated maps',async()=>{
  const {getLearningQuestionVersions,moduleDatabases}=await import('../data');
  const first=await getLearningQuestionVersions('MBL-2',1);
  const raw=moduleDatabases['MBL-2'].v2Raw!.chapters![0].subjects![0].questions[0];
  expect(first.get(String(raw.id))).toBe(hash(raw));
  const digest=vi.spyOn(crypto.subtle,'digest');
  first.clear();const second=await getLearningQuestionVersions('MBL-2',1);
  expect(second.size).toBeGreaterThan(0);expect(digest).not.toHaveBeenCalled();digest.mockRestore();
  expect((await getLearningQuestionVersions('UNKNOWN',1)).size).toBe(0);
  // A second lazy module load increments correctionRevision and invalidates the earlier cache.
  await getLearningQuestionVersions('P4-3',1);
  const again=vi.spyOn(crypto.subtle,'digest');await getLearningQuestionVersions('MBL-2',1);
  expect(again).toHaveBeenCalled();again.mockRestore();
 });
});
