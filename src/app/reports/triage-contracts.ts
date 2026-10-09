export type TriagePriority='decision'|'uncertain'|'low';
export interface EvidenceSource {id:string;url:string;title:string;text:string;retrievedAt:string}
export interface EvidenceCitation {sourceId:string;quote:string;claim:string}
export interface TriageAssessment {
 key:string;fingerprint:string;version:string;priority:TriagePriority;issue:string;rationale:string;action:string;
 state:'complete'|'unreviewed'|'stale';models:string[];checkedAt:string;retryAt?:string;
 structural:string[];evidence:EvidenceSource[];citations:EvidenceCitation[];independentAnswer:number|null;
 unique:boolean|null;sourceVersion:string;attempts:number;
}
export interface TriageLabel {key:string;fingerprint:string;label:'actionable'|'uncertain'|'low';critical:boolean;notes:string;priority:TriagePriority;assessmentAt:string;at:string;by:string}
export interface TriageMetrics {labelled:number;actionable:number;criticalMisses:number;falseLow:number;recall:number|null;ready:boolean}
export interface TriageView {mode:'shadow'|'prioritized';metrics:TriageMetrics;assessments:TriageAssessment[];counts:Record<TriagePriority,number>;pending:number;lowReportIds:string[];reportAssessments:Record<string,string>;config:{provider:boolean;dailyLimit:number};labels:TriageLabel[]}
