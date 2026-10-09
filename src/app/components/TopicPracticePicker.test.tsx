import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {TopicPracticePicker} from './TopicPracticePicker';
import type {ChapterData} from '../types';
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en'})}));
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=> <button role="switch" aria-checked="false">Shuffle questions</button>}));
const chapter:ChapterData={id:1,title:'Anatomy',subtitle:'',emoji:'',page:0,lectureRange:'',accentColor:'anatomy',subjects:[{id:'anatomy',name:'Anatomy',iconName:'Bone',lectures:'',lectureCount:3,lectureNames:['Oral cavity','Palate','Empty'],questions:[{id:'a',type:'mcq',text:'Mouth question',lecture:1,subjectColor:'anatomy',correctIndex:0,explanation:''},{id:'b',type:'truefalse',text:'Tongue statement',lecture:1,subjectColor:'anatomy',correctIndex:1,explanation:''},{id:'c',type:'essay',text:'Palate question',lecture:2,subjectColor:'anatomy',explanation:''}]}]};
afterEach(cleanup);
it('selects whole topics and individual questions and starts in canonical order',()=>{
 const start=vi.fn();render(<TopicPracticePicker chapter={chapter} moduleCode="MGL-3" onStart={start}/>);
 fireEvent.click(screen.getByRole('button',{name:'Choose topics'}));expect(screen.getByRole('button',{name:'Start practice'})).toBeDisabled();expect(screen.getByRole('checkbox',{name:'Empty'})).toBeDisabled();
 fireEvent.click(screen.getByRole('checkbox',{name:'Palate'}));fireEvent.click(screen.getByRole('button',{name:'Choose questions in Oral cavity'}));fireEvent.click(screen.getByRole('checkbox',{name:'Tongue statement'}));expect(screen.getByRole('checkbox',{name:'Oral cavity'})).toBePartiallyChecked();
 fireEvent.click(screen.getByRole('button',{name:'Start practice'}));expect(start.mock.calls[0][1].map((q:{id:string})=>q.id)).toEqual(['b','c']);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('searches without losing selected items; Clear resets all selection',()=>{
 render(<TopicPracticePicker chapter={chapter} onStart={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:'Choose topics'}));fireEvent.click(screen.getByRole('button',{name:'Select all'}));expect(screen.getByText('3 questions')).toBeInTheDocument();
 fireEvent.change(screen.getByRole('textbox'),{target:{value:'tongue'}});expect(screen.queryByRole('checkbox',{name:'Palate'})).not.toBeInTheDocument();expect(screen.getByRole('checkbox',{name:'Tongue statement'})).toBeChecked();
 fireEvent.click(screen.getByRole('button',{name:'Clear'}));expect(screen.getByRole('button',{name:'Start practice'})).toBeDisabled();
});
it('cancel releases scroll lock and returns focus to the trigger',()=>{
 render(<TopicPracticePicker chapter={chapter} onStart={vi.fn()}/>);const trigger=screen.getByRole('button',{name:'Choose topics'});fireEvent.click(trigger);expect(document.body.style.overflow).toBe('hidden');fireEvent(screen.getByRole('dialog'),new Event('cancel',{bubbles:false}));expect(document.body.style.overflow).not.toBe('hidden');expect(trigger).toHaveFocus();
});
