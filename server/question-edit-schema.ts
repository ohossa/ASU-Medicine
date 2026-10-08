import { z } from 'zod';
const common={id:z.union([z.string().min(1).max(180),z.number().int()]),text:z.string().trim().min(1).max(30000),explanation:z.string().max(50000).optional(),modelAnswer:z.string().max(50000).nullable().optional(),options:z.array(z.string().trim().min(1).max(10000)).min(2).max(30).optional(),correctIndex:z.number().int().nonnegative().optional(),blanks:z.array(z.string().min(1)).min(1).max(30).optional(),acceptedAnswers:z.array(z.array(z.string().min(1)).min(1)).optional(),pairs:z.array(z.object({premise:z.string().min(1),target:z.string().min(1)})).min(1).max(100).optional()};
const types=z.enum(['mcq','truefalse','essay','fillblank','matching','case','casestudy']);
function validateAnswer(q:any,ctx:z.RefinementCtx){
 const fail=(message:string)=>ctx.addIssue({code:'custom',message});
 if(q.type==='mcq'||q.type==='truefalse'){if(!q.options || !Number.isInteger(q.correctIndex) || q.correctIndex>=q.options.length)fail('Choose a correct answer from the options.');if(q.type==='truefalse'&&q.options?.length!==2)fail('True/false needs exactly two options.');if(q.options&&new Set(q.options.map((o:string)=>o.trim().toLowerCase())).size!==q.options.length)fail('Options must be distinct.');}
 if(q.type==='essay'&&!q.modelAnswer?.trim())fail('Essay questions need a model answer.');
 if(q.type==='fillblank'){if(!q.blanks?.length)fail('Fill-in questions need answers.');if(q.acceptedAnswers&&q.acceptedAnswers.length!==q.blanks?.length)fail('Accepted answers must match the blank count.');}
 if(q.type==='matching'&&!q.pairs?.length)fail('Matching questions need pairs.');
 if(['case','casestudy'].includes(q.type)&&!q.subQuestions?.length)fail('Cases need question parts.');
}
const child=z.object({...common,type:z.enum(['mcq','essay','fillblank'])}).passthrough().superRefine(validateAnswer);
export const editableQuestionSchema=z.object({...common,type:types,lecture:z.number().int().nonnegative(),subQuestions:z.array(child).min(1).max(50).optional()}).passthrough().superRefine(validateAnswer);
