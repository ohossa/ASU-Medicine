import { useEffect, useRef } from 'react';
import { pulse } from '../../lib/pulseEngine';

/* ============================================================
   3D SIMPLEX NOISE (compact, public-domain style implementation)
   ============================================================ */
const Simplex = (() => {
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],
    [1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  
  // Deterministic shuffle for a stable, loopable field
  let seed = 1337;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 255; i > 0; i--) {
    const n = Math.floor(rnd() * (i + 1));
    const temp = p[i];
    p[i] = p[n];
    p[n] = temp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
  const F3 = 1 / 3;
  const G3 = 1 / 6;

  function noise3D(xin: number, yin: number, zin: number): number {
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);
    let i1 = 0, j1 = 0, k1 = 0;
    let i2 = 0, j2 = 0, k2 = 0;
    
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1;j1=0;k1=0; i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0; i2=1;j2=0;k2=1; }
      else               { i1=0;j1=0;k1=1; i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0)       { i1=0;j1=0;k1=1; i2=0;j2=1;k2=1; }
      else if (x0 < z0)  { i1=0;j1=1;k1=0; i2=0;j2=1;k2=1; }
      else               { i1=0;j1=1;k1=0; i2=1;j2=1;k2=0; }
    }
    
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) {
      const g = grad3[permMod12[ii + perm[jj + perm[kk]]]];
      t0 *= t0;
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0 + g[2] * z0);
    }
    
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) {
      const g = grad3[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]];
      t1 *= t1;
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1 + g[2] * z1);
    }
    
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) {
      const g = grad3[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]];
      t2 *= t2;
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2 + g[2] * z2);
    }
    
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) {
      const g = grad3[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]];
      t3 *= t3;
      n3 = t3 * t3 * (g[0] * x3 + g[1] * y3 + g[2] * z3);
    }
    
    return 32 * (n0 + n1 + n2 + n3);
  }
  return { noise3D };
})();

/* ============================================================
   THEME TOKENS — Deep Bio-Luminescent / Clean Medical Glass
   ============================================================ */
const THEMES = {
  dark: {
    base:        '#0c0e16',
    membrane:    'rgba(45, 212, 191, 0.25)',   // #2dd4bf
    membraneGlow:'#2dd4bf',
    spline:      'rgba(59, 130, 246, OPACITY)',// #3b82f6, opacity injected 0.05–0.15
    splineMax:   0.15,
    impulse:     'rgba(59, 130, 246, 0.4)',
    impulseCore: '#3b82f6',
    ambient:     'rgba(168, 85, 247, 0.03)',   // #a855f7 violet back-glow
    ambientOn:   true,
    glowAlpha:   0.10
  },
  light: {
    base:        '#f8fafc',
    membrane:    'rgba(16, 185, 129, 0.3)',    // #10b981
    membraneGlow:'#10b981',
    spline:      'rgba(100, 116, 139, OPACITY)',// #64748b
    splineMax:   0.13,
    impulse:     'rgba(100, 116, 139, 0.25)',
    impulseCore: '#64748b',
    ambient:     'rgba(168, 85, 247, 0)',      // disabled for clean glass
    ambientOn:   false,
    glowAlpha:   0.06
  }
};

const MOOD_TINT: Record<string, string> = {
  correct:   'rgba(34, 197, 94, OPACITY)',  // brand green bloom
  wrong:     'rgba(244, 63, 94, OPACITY)',  // coral (matches Year 5 / Essay accent)
  streak:    'rgba(168, 85, 247, OPACITY)', // violet (Year 3)
  celebrate: 'rgba(59, 130, 246, OPACITY)', // blue (Year 2 / Mixed)
};

/* ============================================================
   CELL (morphing lipid membrane node)
   Layers — 0: background (tiny/dense), 1: midground (sharp/glow),
            2: foreground (large/blurred, chromatic aberration)
   ============================================================ */
// Global layout configurations adjusted dynamically inside InteractiveBackground
let isMobile = false;
let currentMaxNodes = 38;
let currentBlobPoints = 8;
let currentLayerDef = [
  { count: 20, rMin: 3,  rMax: 7,  speed: 0.12, blur: 0,  alpha: 0.45, parallax: 0.3 },
  { count: 12, rMin: 14, rMax: 26, speed: 0.20, blur: 0,  alpha: 1.0,  parallax: 0.6 },
  { count: 6,  rMin: 34, rMax: 58, speed: 0.30, blur: 5,  alpha: 0.5,  parallax: 1.0 }
];
const DENDRITE_RANGE = 200;

interface MouseState {
  x: number;
  y: number;
  lx: number;
  ly: number;
  energy: number;
  active: boolean;
}

class Cell {
  layer: number;
  x: number;
  y: number;
  px: number;
  py: number;
  r: number;
  noiseSeed: number;
  morphPhase: number;
  mitosis: number;
  scale: number;

  constructor(layer: number, x?: number, y?: number) {
    this.layer = layer;
    const def = currentLayerDef[layer];
    this.x = x ?? Math.random() * window.innerWidth;
    this.y = y ?? Math.random() * window.innerHeight;
    this.px = this.x;
    this.py = this.y;
    this.r = def.rMin + Math.random() * (def.rMax - def.rMin);
    this.noiseSeed = Math.random() * 1000;
    this.morphPhase = Math.random() * Math.PI * 2;
    this.mitosis = 0;
    this.scale = 1;
  }

  step(time: number, dt: number, W: number, H: number, mouse: MouseState, motionScale: number) {
    const def = currentLayerDef[this.layer];
    const ms = motionScale;

    // --- Flow field: curl-like steering from 3D simplex noise ---
    const ns = 0.0011;
    const a = Simplex.noise3D(this.x * ns, this.y * ns, time * 0.00002 + this.noiseSeed)
              * Math.PI * 2.2;
    let fx = Math.cos(a) * def.speed * def.parallax;
    let fy = Math.sin(a) * def.speed * def.parallax;

    // --- Vortex attraction & drag from cursor ---
    if (mouse.active && this.layer >= 1) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d2 = dx * dx + dy * dy;
      const R = 220;
      if (d2 < R * R && d2 > 1) {
        const d = Math.sqrt(d2);
        const fall = 1 - d / R;
        const swirl = mouse.energy * fall * 0.9;     // tangential orbit force
        fx += (-dy / d) * swirl + (dx / d) * fall * mouse.energy * 0.25;
        fy += ( dx / d) * swirl + (dy / d) * fall * mouse.energy * 0.25;
      }
    }

    // --- Verlet integration (also powers mitosis push-apart collisions) ---
    const vx = (this.x - this.px) * 0.92 + fx * ms * dt * 0.06;
    const vy = (this.y - this.py) * 0.92 + fy * ms * dt * 0.06;
    this.px = this.x; this.py = this.y;
    this.x += vx; this.y += vy;

    // Soft toroidal wrap
    const m = 80;
    if (this.x < -m) this.x = this.px = W + m;
    else if (this.x > W + m) this.x = this.px = -m;
    if (this.y < -m) this.y = this.py = H + m;
    else if (this.y > H + m) this.y = this.py = -m;

    this.morphPhase += 0.001 * dt * 0.06 * (0.5 + 0.5 * ms); // slow even when settling
    if (this.mitosis > 0) this.mitosis = Math.max(0, this.mitosis - dt * 0.0012);
    if (this.scale < 1) this.scale = Math.min(1, this.scale + dt * 0.0015);
  }

  // Build deformed membrane as a closed bezier path
  trace(path: Path2D, time: number) {
    const pts: [number, number][] = [];
    const squash = this.mitosis > 0 ? 1 + Math.sin(this.mitosis * Math.PI) * 0.45 : 1;
    const ptsCount = currentBlobPoints;
    for (let i = 0; i < ptsCount; i++) {
      const ang = (i / ptsCount) * Math.PI * 2;
      const wob = Simplex.noise3D(
        Math.cos(ang) * 0.8 + this.noiseSeed,
        Math.sin(ang) * 0.8,
        time * 0.00008 + this.morphPhase
      );
      const rr = this.r * this.scale * (1 + wob * 0.28)
               * (1 + (squash - 1) * Math.abs(Math.cos(ang)));
      pts.push([this.x + Math.cos(ang) * rr, this.y + Math.sin(ang) * rr]);
    }

    path.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
    for (let i = 1; i <= ptsCount; i++) {
      const p0 = pts[i % ptsCount];
      const p1 = pts[(i + 1) % ptsCount];
      path.quadraticCurveTo(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
    }
  }
}

interface Pulse {
  cell: Cell;
  t: number;
  branch: boolean;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect mobile screen state at mount
    isMobile = window.innerWidth < 768;
    currentBlobPoints = isMobile ? 6 : 8;
    currentLayerDef = isMobile
      ? [
          { count: 10, rMin: 3,  rMax: 6,  speed: 0.08, blur: 0,  alpha: 0.35, parallax: 0.3 },
          { count: 6,  rMin: 10, rMax: 18, speed: 0.14, blur: 0,  alpha: 0.70, parallax: 0.6 },
          { count: 2,  rMin: 24, rMax: 36, speed: 0.20, blur: 0,  alpha: 0.35, parallax: 1.0 }
        ]
      : [
          { count: 20, rMin: 3,  rMax: 7,  speed: 0.10, blur: 0,  alpha: 0.45, parallax: 0.3 },
          { count: 12, rMin: 14, rMax: 26, speed: 0.16, blur: 0,  alpha: 1.0,  parallax: 0.6 },
          { count: 6,  rMin: 34, rMax: 58, speed: 0.24, blur: 5,  alpha: 0.5,  parallax: 1.0 }
        ];
    currentMaxNodes = isMobile ? 20 : 38;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      // Cap DPR at 1.0 on mobile to avoid high fill-rate bottlenecks, 1.4 on desktop
      DPR = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.4);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const cells: Cell[] = [];
    currentLayerDef.forEach((def, li) => {
      for (let i = 0; i < def.count; i++) {
        cells.push(new Cell(li, Math.random() * W, Math.random() * H));
      }
    });

    /* ============================================================
       MOTION CONTROL — prefers-reduced-motion: 2s ease-out to 0
       ============================================================ */
    let motionScale = 1;            // global speed multiplier
    let motionTarget = 1;
    let motionEaseStart = 0;
    let motionEaseFrom = 1;
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setMotionTarget = (t: number) => {
      motionTarget = t;
      motionEaseFrom = motionScale;
      motionEaseStart = performance.now();
    };

    if (rmQuery.matches) {
      motionScale = 0;
      motionTarget = 0;
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setMotionTarget(e.matches ? 0 : 1);
    };
    rmQuery.addEventListener('change', handleReducedMotionChange);

    function updateMotion(now: number) {
      if (motionScale === motionTarget) return;
      const t = Math.min((now - motionEaseStart) / 2000, 1);  // 2-second curve
      const eased = 1 - Math.pow(1 - t, 3);                   // cubic ease-out
      motionScale = motionEaseFrom + (motionTarget - motionEaseFrom) * eased;
      if (t >= 1) motionScale = motionTarget;
    }

    /* ============================================================
       POINTER STATE — vortex energy, dendrites, mitosis
       ============================================================ */
    const mouse: MouseState = { x: -9999, y: -9999, lx: -9999, ly: -9999, energy: 0, active: false };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (mouse.active) {
        const dx = e.clientX - mouse.lx;
        const dy = e.clientY - mouse.ly;
        mouse.energy = Math.min(2.5, mouse.energy + Math.hypot(dx, dy) * 0.02);
      }
      mouse.lx = mouse.x = e.clientX;
      mouse.ly = mouse.y = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    // --- Click Mitosis: split nearest midground cell, Verlet push-apart ---
    const handlePointerDown = (e: PointerEvent) => {
      if (motionScale < 0.05) return;
      let best: Cell | null = null;
      let bd = Infinity;
      for (const c of cells) {
        if (c.layer !== 1) continue;
        const d = (c.x - e.clientX) ** 2 + (c.y - e.clientY) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
      if (!best) return;
      best.mitosis = 1;
      best.r *= 0.78;
      best.scale = 0.6;
      const ang = Math.random() * Math.PI * 2;
      const push = best.r * 1.6;
      // Verlet impulse
      best.px = best.x + Math.cos(ang) * push * 0.3;
      best.py = best.y + Math.sin(ang) * push * 0.3;
      if (cells.length < currentMaxNodes) {
        const twin = new Cell(1, best.x, best.y);
        twin.r = best.r;
        twin.scale = 0.4;
        twin.mitosis = 1;
        twin.px = twin.x - Math.cos(ang) * push * 0.3;
        twin.py = twin.y - Math.sin(ang) * push * 0.3;
        cells.push(twin);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    /* ============================================================
       DENDRITES & BIO-ELECTRIC PULSES
       ============================================================ */
    const pulses: Pulse[] = [];
    let nextPulseAt = 0;

    // Quadratic spline point along a dendrite to a cell
    function dendriteCtrl(cx: number, cy: number, cell: Cell) {
      const mx = (cx + cell.x) / 2, my = (cy + cell.y) / 2;
      const dx = cell.x - cx, dy = cell.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const bow = Simplex.noise3D(cell.noiseSeed, d * 0.01, performance.now() * 0.00004) * d * 0.35;
      return [mx + (-dy / d) * bow, my + (dx / d) * bow];
    }
    
    function pointOnQuad(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
      const u = 1 - t;
      return [u*u*x0 + 2*u*t*cx + t*t*x1, u*u*y0 + 2*u*t*cy + t*t*y1];
    }

    function nearestCells(n: number) {
      return cells
        .filter(c => c.layer >= 1)
        .map(c => ({ c, d: Math.hypot(c.x - mouse.x, c.y - mouse.y) }))
        .filter(o => o.d < DENDRITE_RANGE)
        .sort((a, b) => a.d - b.d)
        .slice(0, n);
    }

    /* ============================================================
       RENDER LOOP
       ============================================================ */
    let last = performance.now();
    let targets: { c: Cell; d: number }[] = [];
    let animationFrameId: number;

    const frame = (now: number) => {
      animationFrameId = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50);
      last = now;
      updateMotion(now);
      mouse.energy *= 0.94;

      // Pulse-driven ambient energy: density, speed, glow all scale with this.
      const E = pulse.energy;           // 0..1
      const urgency = pulse.timerUrgency;

      // Simulation
      for (const c of cells) c.step(now, dt, W, H, mouse, motionScale * (0.7 + E * 0.6));
      targets = mouse.active ? nearestCells(3) : [];

      // Spawn pulses at random 2–5 Hz intervals
      if (mouse.active && targets.length && motionScale > 0.05 && now > nextPulseAt) {
        const tgt = targets[Math.floor(Math.random() * targets.length)];
        pulses.push({ cell: tgt.c, t: 0, branch: Math.random() < 0.4 });
        nextPulseAt = now + 1000 / (2 + Math.random() * 3);
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += dt * 0.0008 * Math.max(motionScale, 0.0001);
        if (pulses[i].t >= 1 || motionScale < 0.02) pulses.splice(i, 1);
      }

      // Draw
      const isDark = document.documentElement.classList.contains('dark');
      const currentTheme = isDark ? THEMES.dark : THEMES.light;

      ctx.fillStyle = currentTheme.base;
      ctx.fillRect(0, 0, W, H);

      if (pulse.mood !== 'idle' && pulse.mood !== 'focus' && MOOD_TINT[pulse.mood]) {
        ctx.fillStyle = MOOD_TINT[pulse.mood].replace('OPACITY', '0.04');
        ctx.fillRect(0, 0, W, H);
      }

      // Ambient violet back-glow spots (dark mode and desktop only to optimize mobile GPU fill-rate)
      if (currentTheme.ambientOn && !isMobile) {
        for (let i = 0; i < 2; i++) {
          const gx = W * (0.2 + 0.5 * i) + Math.sin(now * 0.00001 + i * 2) * 80 * motionScale;
          const gy = H * (0.3 + 0.4 * (i % 2)) + Math.cos(now * 0.000008 + i) * 60 * motionScale;
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 420);
          g.addColorStop(0, currentTheme.ambient);
          g.addColorStop(1, 'rgba(168,85,247,0)');
          ctx.fillStyle = g;
          ctx.fillRect(gx - 420, gy - 420, 840, 840);
        }
      }

      // Dendritic splines
      if (targets.length) {
        const proximity = 1 - targets[0].d / DENDRITE_RANGE;
        const op = Math.max(0.05, Math.min(currentTheme.splineMax, 0.05 + proximity * 0.1));
        const splinePath = new Path2D();
        for (const { c } of targets) {
          const [cx, cy] = dendriteCtrl(mouse.x, mouse.y, c);
          splinePath.moveTo(mouse.x, mouse.y);
          splinePath.quadraticCurveTo(cx, cy, c.x, c.y);
          // Bifurcation
          const [bx, by] = pointOnQuad(mouse.x, mouse.y, cx, cy, c.x, c.y, 0.55);
          for (const s of [-1, 1]) {
            const ang = Math.atan2(c.y - by, c.x - bx) + s * 0.7;
            const len = 18 + c.r;
            splinePath.moveTo(bx, by);
            splinePath.quadraticCurveTo(
              bx + Math.cos(ang) * len * 0.6, by + Math.sin(ang) * len * 0.6,
              bx + Math.cos(ang + s * 0.3) * len, by + Math.sin(ang + s * 0.3) * len
            );
          }
        }
        ctx.strokeStyle = currentTheme.spline.replace('OPACITY', op.toFixed(3));
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.stroke(splinePath);
      }

      // Pulses
      for (const p of pulses) {
        if (!targets.some(t => t.c === p.cell)) continue;
        const [cx, cy] = dendriteCtrl(mouse.x, mouse.y, p.cell);
        const [px, py] = pointOnQuad(mouse.x, mouse.y, cx, cy, p.cell.x, p.cell.y, p.t);
        const g = ctx.createRadialGradient(px, py, 0, px, py, 7);
        g.addColorStop(0, currentTheme.impulseCore);
        g.addColorStop(0.3, currentTheme.impulse);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(px - 7, py - 7, 14, 14);
      }

      // Answer bursts
      for (let i = pulse.bursts.length - 1; i >= 0; i--) {
        const b = pulse.bursts[i];
        b.t += dt * 0.0016;
        if (b.t >= 1) { pulse.bursts.splice(i, 1); continue; }
        const radius = 12 + b.t * 220;
        const fade = 1 - b.t;
        const tint = b.kind === 'wrong'
          ? `rgba(244,63,94,${(0.5 * fade).toFixed(3)})`
          : b.kind === 'levelup'
            ? `rgba(168,85,247,${(0.6 * fade).toFixed(3)})`
            : `rgba(34,197,94,${(0.5 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = tint;
        ctx.lineWidth = 2 + fade * 2;
        ctx.stroke();
      }

      // Read current subject-glow if set
      let customGlow = '';
      try {
        customGlow = getComputedStyle(document.documentElement).getPropertyValue('--subject-glow').trim();
      } catch (e) {}
      const membraneGlowColor = customGlow || currentTheme.membraneGlow;
      const glowAlphaValue = currentTheme.glowAlpha + E * 0.12;

      // Membranes
      for (let li = 0; li < 3; li++) {
        const def = currentLayerDef[li];
        const layerPath = new Path2D();
        for (const c of cells) if (c.layer === li) c.trace(layerPath, now);

        ctx.save();
        ctx.globalAlpha = def.alpha;
        
        // Skip canvas filter blur on mobile for massive performance gains
        if (def.blur && !isMobile) ctx.filter = `blur(${def.blur}px)`;

        if (li === 2 && !isMobile) {
          // Chromatic aberration (desktop only to optimize fill-rate)
          ctx.globalAlpha = def.alpha * 0.35;
          ctx.translate(-1.5, 0);
          ctx.fillStyle = 'rgba(255, 60, 60, 0.10)';
          ctx.fill(layerPath);
          ctx.translate(3, 0);
          ctx.fillStyle = 'rgba(60, 90, 255, 0.10)';
          ctx.fill(layerPath);
          ctx.translate(-1.5, 0);
          ctx.globalAlpha = def.alpha;
        }
        ctx.fillStyle = currentTheme.membrane;
        ctx.fill(layerPath);

        if (li === 1) {
          ctx.filter = 'none';
          ctx.globalAlpha = glowAlphaValue;
          ctx.strokeStyle = membraneGlowColor;
          ctx.lineWidth = 6;
          ctx.stroke(layerPath);
        }
        ctx.restore();
      }

      // Urgency red wash
      if (urgency > 0.5) {
        const a = (urgency - 0.5) * 0.5;
        const g = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.8);
        g.addColorStop(0, 'rgba(244,63,94,0)');
        g.addColorStop(1, `rgba(244,63,94,${a.toFixed(3)})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      rmQuery.removeEventListener('change', handleReducedMotionChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="bio-dendrite-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
