// Per-subject palette. Feeds CSS vars AND the InteractiveBackground THEMES.
// Keys should match your subject IDs from app/data.ts.
export interface SubjectPalette { membrane: string; glow: string; accent: string }

export const SUBJECT_THEMES: Record<string, SubjectPalette> = {
  anatomy:      { membrane: 'rgba(239, 138, 98, 0.28)', glow: '#ef8a62', accent: '#f59e0b' }, // warm tissue
  physiology:   { membrane: 'rgba(45, 212, 191, 0.25)', glow: '#2dd4bf', accent: '#2dd4bf' }, // signature teal
  pharmacology: { membrane: 'rgba(59, 130, 246, 0.26)', glow: '#3b82f6', accent: '#3b82f6' }, // molecular blue
  microbiology: { membrane: 'rgba(132, 204, 22, 0.26)', glow: '#84cc16', accent: '#84cc16' }, // culture green
  pathology:    { membrane: 'rgba(168, 85, 247, 0.26)', glow: '#a855f7', accent: '#a855f7' }, // violet
  
  // Year accent mappings per Fable mockups
  year1:  { membrane: 'rgba(34,197,94,0.26)',  glow: '#22c55e', accent: '#22c55e' }, // green
  year2:  { membrane: 'rgba(59,130,246,0.26)', glow: '#3b82f6', accent: '#3b82f6' }, // blue
  year3:  { membrane: 'rgba(168,85,247,0.26)', glow: '#a855f7', accent: '#a855f7' }, // violet
  year4:  { membrane: 'rgba(249,115,22,0.26)', glow: '#f97316', accent: '#f97316' }, // orange
  year5:  { membrane: 'rgba(244,63,94,0.26)',  glow: '#f43f5e', accent: '#f43f5e' }, // coral
};

export const DEFAULT_SUBJECT = 'year2';

export function applySubjectTheme(id?: string) {
  const p = SUBJECT_THEMES[id ?? ''] ?? SUBJECT_THEMES[DEFAULT_SUBJECT];
  const root = document.documentElement;
  root.style.setProperty('--subject-accent', p.accent);
  root.style.setProperty('--subject-glow', p.glow);
  return p;
}
