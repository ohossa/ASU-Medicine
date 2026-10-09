import {it,expect} from 'vitest';
import {parseQuestionTable} from './questionTable';
it('does not discard prose containing an incidental pipe or concentration notation',()=>{
 expect(parseQuestionTable('ACE converts angiotensin | to angiotensin II. Which enzyme?')).toBeNull();
 expect(parseQuestionTable('Higher |S] is needed to reach Vmax/2')).toBeNull();
});
it('recognizes a real Markdown table while preserving the surrounding prompt',()=>{
 expect(parseQuestionTable('Which pattern is correct?\n\n| A | B |\n| --- | :---: |\n| 1 | 2 |\n\nSelect the answer.')).toEqual({before:'Which pattern is correct?',headers:['A','B'],rows:[['1','2']],after:'Select the answer.'});
});
it('leaves malformed tables as intact text',()=>{
 expect(parseQuestionTable('| A | B |\n| --- | --- |\n| one |')).toBeNull();
});
