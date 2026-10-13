import {ChevronRight,CheckCircle2} from 'lucide-react';
import type {ChapterData,Question,SubjectData} from '../types';
import type {PracticeTopic} from '../learning/customPractice';
import {selectedPractice,latestTopicResult,practiceTopics} from '../learning/customPractice';
import {attemptedPracticeIds} from '../learning/practiceNavigation';
import type {QuizResult} from '../utils/storage';
import {useOptionalLearning} from '../learning/LearningProvider';
import {applySubjectTheme} from '../theme/subjectThemes';
import {questionCountLabel} from '../learning/practiceNavigation';
import './chapter-topics.css';

type LectureState={studied:boolean;revised:boolean};
export function ChapterTopicList({chapter,topics,history,lectures,moduleCode,onStart,rtl,onChooseTopic,showSubjectLabels=true,attemptedIds}:{
 chapter:ChapterData;topics:PracticeTopic[];history:QuizResult[];lectures:Record<string,LectureState>;
 attemptedIds?:Set<string>;
 onChooseTopic?:(topic:PracticeTopic)=>void;showSubjectLabels?:boolean;
 moduleCode?:string;onStart:(subject:SubjectData,questions:Question[])=>void;rtl:boolean;
}){
 const learning=useOptionalLearning();
 const currentAttempted=attemptedIds??attemptedPracticeIds(moduleCode??'',chapter,history,learning?.data?.entries??[]);
 return <section aria-label={rtl?'الموضوعات':'Topics'} className="chapter-topics">
  <h2>{moduleCode==='MGL-3'?(rtl?'الفصول / الموضوعات':'Chapters / topics'):(rtl?'اختر موضوعاً':'Choose a topic')}</h2>
  {topics.length===0?<p className="chapter-topics-empty">{rtl?'لا توجد موضوعات متاحة في هذا النمط.':'No topics available in this mode.'}</p>:<div className="chapter-topic-grid">
   {topics.map(topic=>{
    const source=chapter.subjects[topic.subjectIndex??chapter.subjects.findIndex(s=>s.name===topic.subjectName)];
    const active=topic.questions.length>0;
    const progress={attempted:topic.questions.filter(q=>currentAttempted.has(String(q.id))).length,total:topic.questions.length};
    const latest=latestTopicResult(history,chapter.id,topic.title,moduleCode,topic.key,practiceTopics(chapter,moduleCode).filter(t=>t.title===topic.title).length===1);
    const syllabus=topic.lectureNum===undefined?undefined:lectures[`${source.id}_L${topic.lectureNum}`];
    const completed=active&&progress.attempted===topic.questions.length;
    return <button key={topic.key} type="button" disabled={!active}
     aria-label={active?`${rtl?'تدرب على':'Practice'} ${topic.title}, ${questionCountLabel(topic.questions.length,rtl)}`:`${topic.title}, ${rtl?'لا توجد أسئلة في هذا النمط':'no questions in this mode'}`}
     className="chapter-topic" onClick={()=>{
      if(onChooseTopic){onChooseTopic(topic);return;}
      const run=selectedPractice(chapter,topics,new Set(topic.questions.map(q=>String(q.id))));
      const subject={...run.subject,id:source.id,iconName:source.iconName};
      applySubjectTheme(source.id);onStart(subject,run.questions);
     }}>
     <span className="chapter-topic-content">
      {showSubjectLabels&&chapter.subjects.length>1&&topic.subjectName.trim().toLocaleLowerCase()!==topic.title.trim().toLocaleLowerCase()&&<span className="chapter-topic-subject">{topic.subjectName}</span>}
      <span className="chapter-topic-title">{topic.title}</span>
      <span className="chapter-topic-meta">{active?questionCountLabel(topic.questions.length,rtl):rtl?'لا توجد أسئلة في هذا النمط':'No questions in this mode'}</span>
      {progress.attempted>0&&<span className="chapter-topic-progress"><span>{progress.attempted}/{progress.total} {rtl?'تمت الإجابة':'answered'}</span><progress value={progress.attempted} max={progress.total} aria-label={rtl?'الأسئلة المُجاب عنها':'Questions answered'}/></span>}
      {latest&&<span className="chapter-topic-result">{rtl?'آخر نتيجة':'Latest Result'}: <span>{latest.pct}% ({latest.correct}/{latest.total})</span></span>}
      {chapter.bankSection!=='past-exams'&&syllabus&&(syllabus.studied||syllabus.revised)&&<span className="chapter-topic-result">{rtl?'المنهج':'Syllabus'}: {Math.round(((syllabus.studied?1:0)+(syllabus.revised?1:0))*50)}%</span>}
     </span>
     {completed?<CheckCircle2 size={20} aria-label={rtl?'مكتمل':'Completed'} className="chapter-topic-completed"/>:<ChevronRight size={20} aria-hidden="true" className={rtl?'chapter-topic-chevron rtl':'chapter-topic-chevron'}/>}
    </button>;
   })}
  </div>}
 </section>;
}
