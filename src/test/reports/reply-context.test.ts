import {it, expect} from 'vitest';
import { replyContext, renderReplyEmail } from '../../app/reports/reply-context';
import type {QuestionReport} from '../../app/reports/contracts';
const report = {id:'r_test', category:'wrong_answer', explanation:'I think <script>this is wrong</script>', notes:'PRIVATE', reporterId:'PRIVATE_ACCOUNT', snapshot:{moduleCode:'MGL-3',chapterTitle:'Oral cavity',subjectName:'Anatomy',question:{id:'q1',type:'mcq',text:'Which <organ>?',options:['Tongue','Palate'],correctIndex:1,explanation:'Because <reason>.'}}} as QuestionReport;
it('includes the submitted question, options, original key, explanation and student note without private metadata',()=>{
 const c=replyContext(report)!; const e=renderReplyEmail('Thanks. We corrected it.',c);
 expect(e.text).toContain('B. Palate'); expect(e.text).toContain('Because <reason>.'); expect(e.text).toContain(report.explanation);
 expect(e.text).toContain('Question as reported'); expect(e.text).not.toContain('PRIVATE');
 expect(e.html).toContain('&lt;script&gt;'); expect(e.html).not.toContain('<script>'); expect(e.html).toContain('&lt;organ&gt;');
});
it('includes the parent case and only the reported part with its model answer',()=>{
 const r={...report,subQuestionId:'b',snapshot:{...report.snapshot,question:{id:'case1',type:'case',text:'A patient presents...',subQuestions:[{id:'a',text:'Unreported part',modelAnswer:'Other answer'},{id:'b',text:'Explain the diagnosis',modelAnswer:'Diagnosis here',explanation:'Reason here'}]}}};
 const c=replyContext(r)!; expect(c.question).toContain('A patient presents...'); expect(c.question).toContain('Explain the diagnosis'); expect(c.question).not.toContain('Unreported part'); expect(c.question).toContain('Diagnosis here');
});
it('shows true/false defaults and matching or blank keys without inventing missing answers',()=>{
 const q=(question:any)=>replyContext({...report,snapshot:{...report.snapshot,question:{id:'q',...question}}})!.question;
 expect(q({type:'truefalse',text:'Statement',correctIndex:1})).toContain('B. False');
 expect(q({type:'matching',pairs:[{premise:'A',target:'B'}]})).toContain('A → B');
 expect(q({type:'fillblank',blanks:['liver'],acceptedAnswers:[['hepatic tissue']]})).toContain('hepatic tissue');
 expect(q({type:'mcq',text:'Missing key'})).toContain('Not recorded');
});

it('renders ASUCodes Question Review header and plain ASUCodes footer without official university claims',()=>{
 const c=replyContext(report)!;
 const e=renderReplyEmail('Thanks. We corrected it.',c);
 expect(e.html).toContain('ASUCodes · Question Review');
 expect(e.html).not.toContain('Faculty Review');
 expect(e.html).toContain('>ASUCodes</div>');
 expect(e.html).not.toContain('Ain Shams University Faculty of Medicine · ASUCodes');
});
