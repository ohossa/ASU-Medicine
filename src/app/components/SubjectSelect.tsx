import React,{useEffect,useLayoutEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Search,X,ChevronRight} from 'lucide-react';
import type {ChapterData,Question,SubjectData} from '../types';
import {useLanguage} from '../hooks/useLanguage';
import {useSyncedHistory} from '../hooks/useSyncedHistory';
import {historyAccount} from '../learning/historyScope';
import {practiceTopics,type PracticeTopic} from '../learning/customPractice';
import {subjectBranches,questionCountLabel,topicCountLabel,attemptedPracticeIds,topicPracticeBatch} from '../learning/practiceNavigation';
import type {QuizSessionSave} from '../hooks/useQuizSession';
import {useOptionalLearning} from '../learning/LearningProvider';
import {getLearningQuestionVersions} from '../data';
import {isPastExamSection, pastExamsFirst} from '../lib/practiceOrder';
import {ShuffleSwitch} from '../preferences/ShuffleSwitch';
import {FlowBreadcrumbs} from './FlowBreadcrumbs';
import {TopicPracticePicker} from './TopicPracticePicker';
import {TopicSessionPicker} from './TopicSessionPicker';
import {ChapterTopicList} from './ChapterTopicList';
import {PortalFooter} from './PortalFooter';

export interface BreadcrumbItem{label:string;onClick?:()=>void}
interface Props{
 chapter:ChapterData;onBack:()=>void;onSelectSubject:(subject:SubjectData,questions:Question[])=>void;
 onQuickStart:(questions:Question[])=>void;breadcrumbPath?:BreadcrumbItem[];userButton?:React.ReactNode;moduleCode?:string;
 selectedBranch?:string|null;onBranchChange?:(id:string|null)=>void;
}
type ChapterState={lectures?:Record<string,{studied:boolean;revised:boolean}>};
export function SubjectSelect({chapter,onBack,onSelectSubject,breadcrumbPath,userButton,moduleCode,selectedBranch,onBranchChange}:Props){
 const {language}=useLanguage();const rtl=language==='ar';const history=useSyncedHistory();const learning=useOptionalLearning();
 const [localBranch,setLocalBranch]=useState<string|null>(null);const [search,setSearch]=useState('');const [sessionTopic,setSessionTopic]=useState<PracticeTopic|null>(null);
 const [learningVersionState,setLearningVersionState]=useState<{chapter:ChapterData;moduleCode?:string;versions:Map<string,string>}|null>(null);
 const [versionError,setVersionError]=useState('');const [versionRetry,setVersionRetry]=useState(0);
 const hasCloudEntries=!!learning?.data?.entries.length;
 useEffect(()=>{let cancelled=false;setVersionError('');
  if(!hasCloudEntries)return;
  getLearningQuestionVersions(moduleCode??'',chapter.id).then(versions=>{if(!cancelled)setLearningVersionState({chapter,moduleCode,versions});}).catch(()=>{if(!cancelled)setVersionError('Progress could not be checked.');});
  return()=>{cancelled=true;};
 },[chapter,moduleCode,hasCloudEntries,versionRetry]);
 const cloudVersions=learningVersionState?.chapter===chapter&&learningVersionState.moduleCode===moduleCode?learningVersionState.versions:undefined;
 const progressReady=!hasCloudEntries||!!cloudVersions;
 const [trackerData,setTrackerData]=useState<Record<number,ChapterState>>({});const account=historyAccount();
 useLayoutEffect(()=>{setLocalBranch(null);setSearch('');setSessionTopic(null);},[chapter.id,moduleCode,account]);
 useLayoutEffect(()=>{
  const update=()=>{try{setTrackerData(JSON.parse(localStorage.getItem(`asu_study_tracker:${account??'guest'}:${moduleCode}`)??'{}'));}catch{setTrackerData({});}};
  update();window.addEventListener('storage',update);return()=>window.removeEventListener('storage',update);
 },[account,moduleCode,chapter.id]);
 const isPast=isPastExamSection(chapter);
 const allTopics=useMemo(()=>{
  const raw=pastExamsFirst(practiceTopics(chapter,moduleCode));
  return isPast?raw.filter(t=>t.questions.length>0):raw;
 },[chapter,moduleCode,isPast]);
 const branches=useMemo(()=>{
  const raw=subjectBranches(chapter,moduleCode);
  return isPast?raw.map(b=>({...b,topics:b.topics.filter(t=>t.questions.length>0)})).filter(b=>b.topics.length>0):raw;
 },[chapter,moduleCode,isPast]);
 const branch=branches.find(b=>b.id===(selectedBranch===undefined?localBranch:selectedBranch));
 const chooseBranch=(id:string|null)=>{setSearch('');setLocalBranch(id);onBranchChange?.(id);};
 const choosingSubject=branches.length>1&&!branch;
 const rawTopics=branch?allTopics.filter(t=>chapter.subjects[t.subjectIndex!].id===branch.id):allTopics;
 const topics=isPast?rawTopics.filter(t=>t.questions.length>0):rawTopics;
 const visible=topics.filter(t=>`${t.title} ${t.subjectName}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const questionCount=topics.reduce((n,t)=>n+t.questions.length,0);const activeTopics=topics.filter(t=>t.questions.length>0).length;
 const attempted=useMemo(()=>attemptedPracticeIds(moduleCode??'',chapter,history,learning?.data?.entries??[],cloudVersions),[moduleCode,chapter,history,learning?.data?.entries,cloudVersions]);
 const baseCrumbs=breadcrumbPath??[{label:chapter.title}];
 const crumbs=branch?[...baseCrumbs.slice(0,-1),{label:chapter.title,onClick:()=>chooseBranch(null)},{label:branch.title}]:baseCrumbs;
 const BackArrow=rtl?ArrowRight:ArrowLeft;
 const begin=(topic:PracticeTopic,size:20|40|'all')=>{
  const load=(key:string):QuizSessionSave|null=>{try{return JSON.parse(localStorage.getItem(`asu_quiz_session:${account??'guest'}:${chapter.id}:${key}`)??'null');}catch{return null;}};
  const run=topicPracticeBatch(chapter,topic,size,attempted,load);setSessionTopic(null);onSelectSubject(run.subject,run.questions);
 };
 return <div dir={rtl?'rtl':'ltr'} className="min-h-screen text-foreground">
  <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
   <nav aria-label={rtl?'مسار التنقل':'Breadcrumb'} className="sticky top-3 z-20 mb-8 flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-3 py-2 glass-panel">
    <button type="button" onClick={()=>branch?chooseBranch(null):onBack()} aria-label={rtl?'رجوع':'Back'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><BackArrow size={18} aria-hidden="true"/></button>
    <FlowBreadcrumbs crumbs={crumbs} rtl={rtl}/>
    <ShuffleSwitch/>{userButton&&<div className="shrink-0">{userButton}</div>}
   </nav>
   <header className="mb-8">
    {branch&&<p className="mb-2 text-sm text-muted-foreground">{chapter.title}</p>}
    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{branch?.title??chapter.title}</h1>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{choosingSubject?`${branches.length} ${rtl?'مواد':'subjects'}`:topicCountLabel(activeTopics,rtl)} · {questionCountLabel(questionCount,rtl)}</p>
    {!branch&&chapter.subtitle&&chapter.subtitle!==chapter.title&&<p className="mt-1 text-sm text-muted-foreground">{chapter.subtitle}</p>}
   </header>
   {choosingSubject?<section aria-label={rtl?'المواد':'Subjects'} className="chapter-topics"><h2>{rtl?'اختر مادة':'Choose a subject'}</h2><div className="chapter-topic-grid">{branches.map(b=>{
    const count=b.topics.reduce((n,t)=>n+t.questions.length,0);const topicCount=b.topics.filter(t=>t.questions.length>0).length;
    return <button type="button" key={b.id} className="chapter-topic" disabled={!count} aria-label={`${rtl?'افتح':'Open'} ${b.title}, ${topicCountLabel(topicCount,rtl)}, ${questionCountLabel(count,rtl)}`} onClick={()=>chooseBranch(b.id)}><span className="chapter-topic-content"><span className="chapter-topic-title">{b.title}</span><span className="chapter-topic-meta">{topicCountLabel(topicCount,rtl)} · {questionCountLabel(count,rtl)}</span></span><ChevronRight size={20} aria-hidden="true" className={rtl?'chapter-topic-chevron rtl':'chapter-topic-chevron'}/></button>;
   })}</div></section>:<>
    <div className="chapter-topic-search"><Search size={18} aria-hidden="true"/><input type="search" aria-label={rtl?'البحث في الموضوعات':'Search topics'} placeholder={rtl?'ابحث في الموضوعات':'Search topics'} value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label={rtl?'مسح البحث':'Clear topic search'} onClick={()=>setSearch('')}><X size={18} aria-hidden="true"/></button>}</div>
    {search&&visible.length>0&&<p className="chapter-topic-search-status" role="status">{topicCountLabel(visible.length,rtl)}</p>}
    {search&&visible.length===0?<p className="chapter-topics-empty" role="status">{rtl?'لا توجد موضوعات مطابقة للبحث.':'No topics match your search.'}</p>:<ChapterTopicList chapter={chapter} topics={visible} history={history} lectures={trackerData[chapter.id]?.lectures??{}} moduleCode={moduleCode} onStart={onSelectSubject} rtl={rtl} showSubjectLabels={!branch} attemptedIds={attempted} onChooseTopic={topic=>topic.questions.length>20?setSessionTopic(topic):begin(topic,'all')}/>}
    {questionCount>0&&<TopicPracticePicker key={branch?.id??'all'} chapter={chapter} availableTopics={topics} scopeTitle={branch?.title} moduleCode={moduleCode} onStart={onSelectSubject}/>}
   </>}
   {sessionTopic&&<TopicSessionPicker topic={sessionTopic} remaining={sessionTopic.questions.filter(q=>!attempted.has(String(q.id))).length} ar={rtl} progressReady={progressReady} progressError={versionError} onRetry={()=>{setVersionError('');setVersionRetry(n=>n+1);}} onClose={()=>setSessionTopic(null)} onStart={size=>begin(sessionTopic,size)}/>}
  </div>
  <PortalFooter />
 </div>;
}
export default SubjectSelect;
