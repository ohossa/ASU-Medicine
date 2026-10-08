import type {Question,QuizAnswer,SubjectColor,SubjectData} from '../types';
import {checkAnswerCorrect} from './quiz';
/** Same correctness rule as the results screen; skipped/ungraded items also need practice. */
export function getMissedQuestions(questions:readonly Question[],answers:Record<number,QuizAnswer>):Question[]{
 return questions.filter((question,index)=>!checkAnswerCorrect(question,answers[index]));
}
const suffix=' · Missed questions';
/** Distinct labels keep focused retries out of the full-topic result/session slot. */
export function missedPracticeSubject(subject:SubjectData|null,questions:Question[],accent:SubjectColor):SubjectData {
 const name=subject?.name??'All topics';
 return {...(subject??{id:accent,iconName:'BookOpen',lectures:'',lectureCount:0}),name:name.endsWith(suffix)?name:name+suffix,questions};
}
