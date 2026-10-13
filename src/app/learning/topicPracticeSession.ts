import type {Question,SubjectData} from '../types';
import type {QuizSessionSave} from '../hooks/useQuizSession';
import {sessionMatchesQuestions} from '../preferences/shuffle';

/** Keep named-topic drafts accessible without resuming broad or changed question sets. */
export function findTopicPracticeSession(subject:SubjectData,questions:Question[],load:(key:string)=>QuizSessionSave|null){
 const key=subject.sessionKey??subject.name;
 const current=load(key);
 if(!subject.sessionKey?.startsWith('custom:'))return current;
 if(current&&!current.finished&&sessionMatchesQuestions(questions,current))return current;
 const topics=new Set(questions.map(q=>q.practiceTopic?.key));
 if(!questions.length||topics.size!==1||topics.has(undefined))return null;
 const legacy=load(subject.name);
 if(!legacy||legacy.finished||legacy.subjectName!==subject.name||!legacy.questionVersions||legacy.questionVersions.length!==legacy.questionIds?.length)return null;
 return sessionMatchesQuestions(questions,legacy)?legacy:null;
}
