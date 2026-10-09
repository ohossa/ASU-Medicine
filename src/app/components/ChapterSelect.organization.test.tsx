import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe,it,expect,vi} from 'vitest';
import {ChapterSelect} from './ChapterSelect';
import type {ChapterData} from '../types';
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
const chapter={id:201,title:'DNA Replication',subtitle:'Additional topic · Beyond the study guide contents',emoji:'📚',page:0,lectureRange:'1 topic',accentColor:'biochem',subjects:[]} as ChapterData;
describe('IBM chapter provenance labels',()=>{
 it('shows additional-topic provenance without exposing internal chapter IDs as sequence numbers',()=>{
  render(<MemoryRouter><ChapterSelect chapters={[chapter]} moduleCode="IBM-1" moduleName="Biochemistry" studyModeName="MCQ" onSelectChapter={()=>{}} onBackToModeSelect={()=>{}}/></MemoryRouter>);
  expect(screen.getByText(chapter.subtitle)).toBeInTheDocument();expect(screen.getByText('#1')).toBeInTheDocument();expect(screen.queryByText('#201')).toBeNull();
 });
});
