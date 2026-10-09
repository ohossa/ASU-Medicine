import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {it,expect} from 'vitest';
const html=readFileSync('index.html','utf8');
it.each(['dark','light',null,'invalid','blocked'])('applies theme before module loading even when storage is %s',pref=>{
 const script=html.match(/<script id="theme-bootstrap">([\s\S]*?)<\/script>/)?.[1];expect(script).toBeTruthy();expect(html.indexOf('id="theme-bootstrap"')).toBeLessThan(html.indexOf('/src/main.tsx'));
 let dark=false;const meta={setAttribute:(_key:string,value:string)=>{meta.color=value;},color:''};const root={classList:{toggle:(_name:string,value:boolean)=>{dark=value;}},style:{colorScheme:''}};
 runInNewContext(script!,{document:{documentElement:root,querySelector:()=>meta},localStorage:{getItem:()=>{if(pref==='blocked')throw Error('denied');return pref;}}});expect(dark).toBe(pref!=='light');expect(root.style.colorScheme).toBe(pref==='light'?'light':'dark');expect(meta.color).toBe(pref==='light'?'#f8f9fc':'#0c0e16');
});
