import { describe, expect, it } from 'vitest';
import type { QuestionReport } from '../../app/reports/contracts';
import { queryReportInbox } from '../../../server/report-inbox';
const make = (id: string, questionId: string, extra: Partial<QuestionReport> = {}): QuestionReport => ({
  id, requestHash: id, reporterId: id, category: 'wrong_answer', explanation: 'Check the innervation',
  status: 'new', notes: '', revision: 1, createdAt: '2026-10-08T10:00:00Z', updatedAt: '2026-10-08T10:00:00Z',
  notification: { state: 'unconfigured' }, snapshot: { moduleCode: 'MGL-3', chapterId: 1, chapterTitle: 'Anatomy', subjectName: 'Tongue', version: 'v1', question: { id: questionId, type: 'mcq', text: '42. Which nerve?' } }, ...extra,
});
describe('Owner report inbox queries', () => {
  it('finds reports beyond the first page by reporter email and question text', () => {
    const reports = Array.from({length: 31}, (_, i) => make(`r${i}`, `Q${i}`));
    reports[30].reporter = {name: 'Sara Ali', username: 'sara', email: 'sara@example.com', emailVerified: true};
    expect(queryReportInbox(reports, {search: 'SARA@example.com'}).reports.map(r => r.id)).toEqual(['r30']);
    expect(queryReportInbox(reports, {search: 'Which nerve'}).total).toBe(31);
  });
  it('groups the same parent including reported parts and keeps modules distinct', () => {
    const a = make('a', 'Q1');
    const b = make('b', 'Q1', {reporterId: 'a', status: 'fixed', subQuestionId: 'part2'});
    const c = make('c', 'Q1', {snapshot: {...a.snapshot, moduleCode: 'MEM-2'}});
    const result = queryReportInbox([a,b,c], {groupBy: 'question'});
    expect(result.total).toBe(2); expect(result.filteredReportCount).toBe(3);
    expect(result.groups![0]).toMatchObject({reportCount: 2, reporterCount: 1, unresolvedCount: 1});
    expect(result.groups![0].reports.map(r => r.id)).toEqual(['a','b']);
  });
  it('filters module, subject, chapter and unresolved status together', () => {
    const a = make('a','Q1'); a.snapshot.topicName='Oral cavity'; const b=make('b','Q1',{status: 'fixed'});
    const c=make('c','Q2',{snapshot:{...a.snapshot, subjectName:'Stomach'}});
    const d=make('d','Q3',{snapshot:{...a.snapshot,topicName:'Another topic'}});
    expect(queryReportInbox([a,b,c,d], {status:'unresolved',moduleCode:'MGL-3',subjectName:'Tongue',chapterId:1,topicName:'Oral cavity'}).reports.map(r=>r.id)).toEqual(['a']);
    expect(queryReportInbox([a,b,c], {moduleCode:'OTHER-3'}).total).toBe(0);
  });
  it('paginates whole groups and reports without losing members or mutating records', () => {
    const reports = Array.from({length: 30}, (_,i)=>make(`r${i}`,`Q${i}`));
    reports.push(make('repeat','Q29'));
    const original=JSON.stringify(reports);
    const result=queryReportInbox(reports,{groupBy:'question',offset:25});
    expect(result.groups).toHaveLength(5);expect(result.total).toBe(30);
    expect(result.groups!.find(g=>g.reports.some(r=>r.id==='repeat'))!.reportCount).toBe(2);
    expect(JSON.stringify(reports)).toBe(original);
    expect(queryReportInbox(reports,{offset:25}).reports).toHaveLength(6);
  });
  it('deduplicates repeated scan records and provides dependent filter choices', () => {
    const a=make('a','Q1');const b=make('b','Q1',{snapshot:{...a.snapshot,moduleCode:'MEM-2',subjectName:'Histology',chapterId:2,chapterTitle:'Cells'}});
    const result=queryReportInbox([a,a,b],{moduleCode:'MGL-3'});
    expect(result.total).toBe(1);expect(result.facets!.modules).toEqual(['MEM-2','MGL-3']);
    expect(result.facets!.subjects).toEqual(['Tongue']);expect(result.facets!.chapters).toEqual([{id:1,title:'Anatomy'}]);
  });
});
