import { useEffect, useMemo, useRef, useState } from 'react';
import { ListChecks, Search, X, ChevronDown, Award, Timer, BookOpen } from 'lucide-react';
import type { ChapterData, SubjectData, Question } from '../types';
import { practiceTopics, selectedMultiChapterPractice } from '../learning/customPractice';
import {
  MRS_CONTINUOUS_II_CONFIG,
  filterMrsContinuousChapters,
  generateMrsContinuousMockExam,
} from '../learning/mrsContinuousExam';
import { ShuffleSwitch } from '../preferences/ShuffleSwitch';
import { useLanguage } from '../hooks/useLanguage';
import { questionCountLabel, topicCountLabel } from '../learning/practiceNavigation';
import { SelectionBox } from './TopicPracticePicker';
import './topic-practice.css';

interface Props {
  chapters: ChapterData[];
  moduleName: string;
  moduleCode: string;
  onStart: (virtualChapter: ChapterData, subject: SubjectData, questions: Question[]) => void;
}

export function ChapterPracticePicker({ chapters, moduleName, moduleCode, onStart }: Props) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const hasContinuous = moduleCode === 'MRS-2';

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'continuous-ii'>('all');
  const [selected, setSelected] = useState(new Set<string>());
  const [search, setSearch] = useState('');
  const [expandedChapters, setExpandedChapters] = useState(new Set<number>());

  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Scoped chapters based on active tab
  const scopedChapters = useMemo(() => {
    if (hasContinuous && activeTab === 'continuous-ii') {
      return filterMrsContinuousChapters(chapters, moduleCode);
    }
    return chapters;
  }, [chapters, moduleCode, hasContinuous, activeTab]);

  // Pre-calculate topics for each chapter in the current scope
  const chapterDataMap = useMemo(() => {
    return scopedChapters.map(chapter => {
      const topics = practiceTopics(chapter, moduleCode);
      const questionIds = topics.flatMap(t => t.questions.map(q => String(q.id)));
      return {
        chapter,
        topics,
        questionIds,
        totalQuestions: questionIds.length,
      };
    });
  }, [scopedChapters, moduleCode]);

  // Selected session payload
  const run = useMemo(
    () => selectedMultiChapterPractice(scopedChapters, selected, moduleCode, language),
    [scopedChapters, selected, moduleCode, language]
  );

  // Filtered chapters according to search input
  const query = search.trim().toLowerCase();
  const visibleChapters = useMemo(() => {
    if (!query) return chapterDataMap;
    return chapterDataMap.filter(({ chapter, topics }) => {
      const matchTitle = chapter.title.toLowerCase().includes(query);
      const matchTopic = topics.some(t =>
        t.title.toLowerCase().includes(query) ||
        t.questions.some(q => q.text.toLowerCase().includes(query))
      );
      return matchTitle || matchTopic;
    });
  }, [chapterDataMap, query]);

  // Switch tab and reset selection cleanly
  const handleTabChange = (tab: 'all' | 'continuous-ii') => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setSelected(new Set());
      setSearch('');
    }
  };

  // Handle native dialog open/close lifecycle and focus restore
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = before;
      trigger.current?.focus();
    };
  }, [open]);

  // Toggle chapter expansion
  const toggleChapterExpand = (chapterId: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Toggle selection for a list of question IDs
  const toggleQuestionIds = (ids: string[]) => {
    if (!ids.length) return;
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = ids.every(id => next.has(id));
      if (allSelected) {
        ids.forEach(id => next.delete(id));
      } else {
        ids.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Select all questions across all currently scoped chapters
  const handleSelectAll = () => {
    const all = new Set<string>();
    chapterDataMap.forEach(({ questionIds }) => {
      questionIds.forEach(id => all.add(id));
    });
    setSelected(all);
  };

  // Clear selection
  const handleClear = () => {
    setSelected(new Set());
  };

  // Start custom practice from selected topics
  const handleStart = () => {
    if (run.questions.length === 0) return;
    setOpen(false);
    if (hasContinuous && activeTab === 'continuous-ii') {
      const customCa2Chapter: ChapterData = {
        ...run.virtualChapter,
        title: ar
          ? 'تدريب مخصص — التقييم المستمر الثاني (CA-2)'
          : 'Continuous II Custom Practice (CA-2)',
        subtitle: ar
          ? `مخطط التقييم المستمر الثاني · ${run.questions.length} سؤالاً محدداً`
          : `Continuous II Assessment · ${run.questions.length} selected questions`,
      };
      onStart(customCa2Chapter, run.subject, run.questions);
    } else {
      onStart(run.virtualChapter, run.subject, run.questions);
    }
  };

  // Launch official 38-MCQ Blueprint Mock Exam
  const handleStartMockExam = () => {
    const mock = generateMrsContinuousMockExam(chapters, language);
    setOpen(false);
    onStart(mock.virtualChapter, mock.subject, mock.questions);
  };

  return (
    <>
      {/* ── Compact Action Banner ── */}
      <section className="topic-practice-banner mb-6" aria-label={ar ? 'صمّم تدريبك' : 'Build your practice'}>
        <div className="topic-practice-intro">
          <ListChecks size={24} aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              {ar ? 'صمّم تدريبك' : 'Build your practice'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {ar
                ? 'اختر فصولاً أو موضوعات محددة في جلسة واحدة.'
                : 'Choose multiple chapters or specific topics for one session.'}
            </p>
          </div>
        </div>
        <div className="topic-practice-banner-actions">
          {hasContinuous && (
            <button
              type="button"
              className="topic-practice-ca2-badge"
              onClick={() => {
                setActiveTab('continuous-ii');
                setSelected(new Set());
                setOpen(true);
              }}
            >
              <Award size={18} aria-hidden="true" />
              <span>{ar ? '🎯 التقييم المستمر الثاني (CA-2)' : '🎯 Continuous II Exam (CA-2)'}</span>
            </button>
          )}
          <button
            ref={trigger}
            type="button"
            className="report-primary"
            aria-haspopup="dialog"
            onClick={() => {
              setActiveTab('all');
              setSelected(new Set());
              setOpen(true);
            }}
          >
            {ar ? 'اختر الفصول' : 'Choose chapters'}
          </button>
        </div>
      </section>

      {/* ── Modal Dialog ── */}
      {open && (
        <dialog
          ref={dialog}
          className="topic-practice-dialog"
          aria-labelledby="chapter-picker-title"
          dir={ar ? 'rtl' : 'ltr'}
          onCancel={() => setOpen(false)}
          onClick={e => {
            if (e.target !== e.currentTarget) return;
            const r = e.currentTarget.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
              setOpen(false);
            }
          }}
        >
          {/* Dialog Header */}
          <header>
            <div>
              <p className="topic-practice-eyebrow">
                {moduleName} · {moduleCode}
                {hasContinuous && activeTab === 'continuous-ii' && (
                  <span> · {ar ? 'التقييم المستمر الثاني' : 'Continuous II'}</span>
                )}
              </p>
              <h2 id="chapter-picker-title">
                {hasContinuous && activeTab === 'continuous-ii'
                  ? (ar ? 'اختر موضوعات التقييم المستمر الثاني' : 'Continuous II Assessment Practice')
                  : (ar ? 'اختر تدريبك عبر الفصول' : 'Choose your practice')}
              </h2>
            </div>
            <button
              type="button"
              aria-label={ar ? 'إغلاق نافذة التدريب' : 'Close practice picker'}
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </header>

          {/* Module Tabs (when module has Continuous assessment) */}
          {hasContinuous && (
            <div
              className="topic-practice-tabs"
              role="tablist"
              aria-label={ar ? 'أقسام التدريب' : 'Practice tabs'}
            >
              <button
                type="button"
                role="tab"
                id="tab-all"
                aria-controls="tabpanel-all"
                aria-selected={activeTab === 'all'}
                data-active={activeTab === 'all'}
                className="topic-practice-tab"
                onClick={() => handleTabChange('all')}
              >
                <BookOpen size={16} aria-hidden="true" />
                <span>{ar ? 'جميع محتويات الموديول' : 'All Module Content'}</span>
              </button>
              <button
                type="button"
                role="tab"
                id="tab-ca2"
                aria-controls="tabpanel-ca2"
                aria-selected={activeTab === 'continuous-ii'}
                data-active={activeTab === 'continuous-ii'}
                data-variant="ca2"
                className="topic-practice-tab"
                onClick={() => handleTabChange('continuous-ii')}
              >
                <Award size={16} aria-hidden="true" />
                <span>{ar ? 'مخطط التقييم المستمر الثاني (CA-2)' : 'Continuous II Blueprint (CA-2)'}</span>
              </button>
            </div>
          )}

          {/* Continuous II Blueprint Banner (when on continuous-ii tab) */}
          {hasContinuous && activeTab === 'continuous-ii' && (
            <div
              className="topic-practice-blueprint"
              role="region"
              aria-label={ar ? 'تفاصيل التقييم المستمر الثاني' : 'Continuous II blueprint details'}
            >
              <div className="topic-practice-blueprint-header">
                <div>
                  <h4>
                    <Award size={18} className="text-primary" aria-hidden="true" />
                    <span>{ar ? MRS_CONTINUOUS_II_CONFIG.examTitleAr : MRS_CONTINUOUS_II_CONFIG.examTitle}</span>
                  </h4>
                  <p>
                    {ar
                      ? `السبت 7 نوفمبر 2026 · ${MRS_CONTINUOUS_II_CONFIG.totalLectures} محاضرة رسمية (الأسابيع 1-3) · ${MRS_CONTINUOUS_II_CONFIG.totalMarks} درجة · ${MRS_CONTINUOUS_II_CONFIG.durationMinutes} دقيقة`
                      : `${MRS_CONTINUOUS_II_CONFIG.dateStr} · ${MRS_CONTINUOUS_II_CONFIG.totalLectures} Lectures (Weeks 1-3) · ${MRS_CONTINUOUS_II_CONFIG.totalMarks} Marks · ${MRS_CONTINUOUS_II_CONFIG.durationMinutes} min`}
                  </p>
                </div>
              </div>

              <div
                className="topic-practice-blueprint-units"
                aria-label={ar ? 'توزيع الوحدات والدرجات' : 'Blueprint unit distribution'}
              >
                {MRS_CONTINUOUS_II_CONFIG.units.map(unit => (
                  <span key={unit.id} className="topic-practice-unit-pill">
                    <span>{ar ? unit.nameAr : unit.name}</span>
                    <strong>{unit.marks} {ar ? 'درجات' : 'marks'}</strong>
                  </span>
                ))}
              </div>

              <div className="topic-practice-blueprint-actions">
                <button
                  type="button"
                  className="topic-practice-mock-btn"
                  onClick={handleStartMockExam}
                >
                  <Timer size={16} aria-hidden="true" />
                  <span>
                    {ar
                      ? 'بدء محاكاة الاختبار الرسمي (38 سؤالاً · 49 دقيقة)'
                      : 'Start 38-MCQ Blueprint Mock Exam (49 min)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Tools: Search + Action Buttons */}
          <div className="topic-picker-tools">
            <label className="topic-picker-search">
              <Search size={18} aria-hidden="true" />
              <input
                autoFocus
                type="search"
                placeholder={ar ? 'ابحث عن فصل أو موضوع...' : 'Find a chapter or topic...'}
                aria-label={ar ? 'ابحث عن فصل أو موضوع' : 'Find a chapter or topic'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  aria-label={ar ? 'مسح البحث' : 'Clear search'}
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="topic-picker-actions">
              <button type="button" onClick={handleSelectAll}>
                {ar ? 'تحديد الكل' : 'Select all'}
              </button>
              <button type="button" disabled={!selected.size} onClick={handleClear}>
                {ar ? 'إلغاء التحديد' : 'Clear'}
              </button>
              <ShuffleSwitch />
            </div>
          </div>

          {/* Chapters & Topics List */}
          <div className="topic-picker-list">
            {visibleChapters.length === 0 && (
              <p className="topic-picker-empty">
                {ar ? 'لا توجد نتائج مطابقة لبحثك.' : 'No chapters or topics match your search.'}
              </p>
            )}

            {visibleChapters.map(({ chapter, topics, questionIds, totalQuestions }) => {
              const selectedCount = questionIds.filter(id => selected.has(id)).length;
              const isAllSelected = totalQuestions > 0 && selectedCount === totalQuestions;
              const isPartial = selectedCount > 0 && selectedCount < totalQuestions;
              const isExpanded = expandedChapters.has(chapter.id) || !!query;

              return (
                <section
                  className="topic-picker-topic"
                  key={chapter.id}
                  data-selected={selectedCount > 0}
                >
                  {/* Chapter Header Row */}
                  <div className="topic-picker-row">
                    <label>
                      <SelectionBox
                        checked={isAllSelected}
                        partial={isPartial}
                        disabled={totalQuestions === 0}
                        label={chapter.title}
                        onChange={() => toggleQuestionIds(questionIds)}
                      />
                      <span>
                        <strong className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden="true">{chapter.emoji}</span>
                          <span>{chapter.title}</span>
                        </strong>
                        <small>
                          {totalQuestions > 0
                            ? `${selectedCount} / ${totalQuestions} ${
                                ar ? 'سؤال محدد' : selectedCount === 1 ? 'question selected' : 'questions selected'
                              }`
                            : ar ? 'لا توجد أسئلة' : 'No questions'}
                        </small>
                      </span>
                    </label>

                    {/* Chevron to Expand/Collapse Topics */}
                    <button
                      type="button"
                      disabled={topics.length === 0}
                      aria-label={`${
                        isExpanded ? (ar ? 'طي فصول' : 'Collapse') : (ar ? 'عرض موضوعات' : 'Show topics of')
                      } ${chapter.title}`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleChapterExpand(chapter.id)}
                    >
                      <ChevronDown
                        size={20}
                        className="transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }}
                      />
                    </button>
                  </div>

                  {/* Constituent Topics Accordion */}
                  {isExpanded && topics.length > 0 && (
                    <div className="chapter-picker-topics">
                      {topics
                        .filter(topic => {
                          if (!query) return true;
                          const matchCh = chapter.title.toLowerCase().includes(query);
                          const matchTop = topic.title.toLowerCase().includes(query);
                          const matchQ = topic.questions.some(q => q.text.toLowerCase().includes(query));
                          return matchCh || matchTop || matchQ;
                        })
                        .map(topic => {
                          const topicIds = topic.questions.map(q => String(q.id));
                          const topicSelectedCount = topicIds.filter(id => selected.has(id)).length;
                          const isTopicAll = topicIds.length > 0 && topicSelectedCount === topicIds.length;
                          const isTopicPartial = topicSelectedCount > 0 && topicSelectedCount < topicIds.length;

                          return (
                            <div key={topic.key} className="chapter-picker-topic-row">
                              <label>
                                <SelectionBox
                                  checked={isTopicAll}
                                  partial={isTopicPartial}
                                  disabled={topicIds.length === 0}
                                  label={topic.title}
                                  onChange={() => toggleQuestionIds(topicIds)}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="chapter-picker-topic-title">
                                    {topic.title}
                                  </div>
                                  <div className="chapter-picker-topic-meta">
                                    {topicSelectedCount} / {topicIds.length} {ar ? 'أسئلة' : 'questions'}
                                    {topic.subjectName && topic.subjectName !== chapter.title && (
                                      <span className="ms-2 opacity-75">· {topic.subjectName}</span>
                                    )}
                                  </div>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* Dialog Sticky Footer */}
          <footer>
            <div role="status" aria-live="polite">
              <strong>{questionCountLabel(run.questions.length, ar)}</strong>
              <small>
                {topicCountLabel(run.subject.lectureCount, ar)} · {ar ? 'نقاط وتقدم حسب الموضوع' : 'XP and progress stay with each topic'}
              </small>
            </div>
            <button
              className="report-primary"
              type="button"
              disabled={run.questions.length === 0}
              onClick={handleStart}
            >
              {ar ? 'ابدأ التدريب' : 'Start practice'}
            </button>
          </footer>
        </dialog>
      )}
    </>
  );
}
export default ChapterPracticePicker;
