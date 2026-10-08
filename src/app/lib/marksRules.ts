export type GradeKey = 'A' | 'B' | 'C' | 'D';
export interface ModulePreset {
 id: string; name: string;
 sections: {id:string;name:string;max:number}[];
 boundaries: Record<GradeKey,number>;
 finalPass?: {sectionIds:string[]; minimum:number};
}
export const GIT_MARKS_PRESET: ModulePreset = {
 id:'MGL-3', name:'GIT & Liver Module',
 sections:[
 {id:'git-assessment-1',name:'Assessment 1',max:34},
 {id:'git-assessment-2',name:'Assessment 2',max:34},
 {id:'git-computer-lab',name:'Computer lab',max:58},
 {id:'git-real-lab',name:'Real lab',max:20},
 {id:'git-activities',name:'Activities',max:10},
 {id:'git-final-1',name:'Final — Paper 1',max:36},
 {id:'git-final-2',name:'Final — Paper 2',max:68}],
 boundaries:{A:221,B:195,C:169,D:156},
 finalPass:{sectionIds:['git-final-1','git-final-2'],minimum:41.6}
};
export function gradeFromScore(score:number,boundaries:Record<GradeKey,number>):GradeKey|'Fail' {
 for(const grade of ['A','B','C','D'] as const) if(score>=boundaries[grade]) return grade;
 return 'Fail';
}
export function evaluateFinalGate(preset:ModulePreset,scores:Record<string,string>) {
 let earned=0, remaining=0, invalid=false;
 const rule=preset.finalPass;
 if(!rule) return {status:'not-required' as const,earned,remaining,minimum:0};
 for(const id of rule.sectionIds){
 const section=preset.sections.find(s=>s.id===id)!;
 const raw=scores[id]?.trim()??'';
 if(!raw) {remaining+=section.max;continue;}
 const value=Number(raw);
 if(!Number.isFinite(value)||value<0||value>section.max) {invalid=true;remaining+=section.max;} else earned+=value;
 }
 const status=invalid?'invalid':earned>=rule.minimum?'passed':remaining===0?'failed':'pending';
 return {status,earned,remaining,minimum:rule.minimum};
}
