export const moduleConfettiColors: Record<string, string[]> = {
  MCNS:   ['#818cf8','#6366f1','#a78bfa'],
  MEM:    ['#f87171','#fca5a5','#fecaca'],
  P3:     ['#34d399','#10b981','#6ee7b7'],
  R:      ['#fbbf24','#f59e0b','#fcd34d'],
  MSS:    ['#e7e5e4','#d6d3d1','#a8a29e'],
  default: ['#ffffff','#c4c4c4','#888888'],
};

export function getConfettiColors(moduleCode: string, isPerfect: boolean): string[] {
  const colors = moduleConfettiColors[moduleCode] || moduleConfettiColors.default;
  return isPerfect ? colors : ['#ffffff','#c4c4c4','#888888'];
}