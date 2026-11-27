import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

// Four tiny loops for the "How I teach" panels. 480x360, 150 frames each.
const F = 'DM Sans', M = 'JetBrains Mono';
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const useSpr = (from: number, damping = 12) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: { damping } });
};
const Loop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  const o = interpolate(f, [0, 8, d - 12, d], [0, 1, 1, 0], cl);
  return <AbsoluteFill style={{ opacity: o, alignItems: 'center', justifyContent: 'center' }}>{children}</AbsoluteFill>;
};

// 01 Learn by making: a poster builds itself
export const PosterBuild: React.FC = () => {
  const a = useSpr(6), b = useSpr(18), c = useSpr(30), t = useSpr(44, 10), st = useSpr(70, 8);
  return <Loop><svg width="480" height="360" viewBox="0 0 480 360">
    <rect x="150" y="30" width="180" height="250" rx="8" fill="#f4f1ff" transform={`rotate(-3 240 155)`} />
    <g transform="rotate(-3 240 155)">
      <circle cx="240" cy="120" r={52 * a} fill="#ff6b6b" />
      <rect x={170} y={150} width={140 * b} height="22" fill="#8b5cf6" />
      <polygon points="300,60 320,100 280,100" fill="#22d3ee" transform={`translate(0 ${(1 - c) * -80})`} opacity={c} />
      <text x="170" y={220 + (1 - t) * -60} opacity={t} fontFamily={F} fontWeight="800" fontSize="34" fill="#0c0a1f">MAKE.</text>
      <text x="170" y="250" opacity={t} fontFamily={M} fontSize="11" fill="#0c0a1f">CLASS 01 · POSTER</text>
    </g>
    <g transform={`translate(330 250) rotate(-14) scale(${interpolate(st, [0, 1], [2.4, 1])})`} opacity={st}>
      <circle r="38" fill="none" stroke="#ffb347" strokeWidth="4" />
      <text textAnchor="middle" y="6" fontFamily={M} fontWeight="700" fontSize="15" fill="#ffb347">DONE ✓</text>
    </g>
  </svg></Loop>;
};

// 02 Real tools: mini editor window, cursor drags a layer, trims, exports
export const ToolWindow: React.FC = () => {
  const f = useCurrentFrame();
  const drag = interpolate(f, [15, 45], [0, 70], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const trim = interpolate(f, [60, 85], [0, 40], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const cx = interpolate(f, [0, 15, 45, 55, 60, 85, 95, 105], [300, 175, 245, 250, 330, 290, 300, 372], cl);
  const cy = interpolate(f, [0, 15, 45, 55, 60, 85, 95, 105], [200, 120, 120, 200, 250, 250, 120, 74], cl);
  const done = interpolate(f, [108, 116], [0, 1], cl);
  return <Loop><svg width="480" height="360" viewBox="0 0 480 360">
    <rect x="60" y="50" width="360" height="250" rx="12" fill="#17132e" stroke="rgba(255,255,255,.2)" />
    {['#ff6b6b', '#ffb347', '#22d3ee'].map((c, i) => <circle key={c} cx={80 + i * 14} cy="66" r="4.5" fill={c} />)}
    <rect x={345} y="60" width="62" height="22" rx="11" fill={done ? '#38d39f' : '#8b5cf6'} />
    <text x="376" y="75" textAnchor="middle" fontFamily={M} fontSize="10" fill="#fff">{done > .5 ? 'SAVED ✓' : 'EXPORT'}</text>
    <rect x="80" y="92" width="230" height="130" rx="6" fill="#0c0a1f" />
    <rect x={130 + drag} y="105" width="70" height="50" rx="6" fill="#ff7ab6" />
    <circle cx="160" cy="185" r="22" fill="#22d3ee" opacity=".8" />
    {[0, 1, 2].map((i) => <rect key={i} x="322" y={100 + i * 22} width="84" height="16" rx="4" fill={i === 0 ? 'rgba(255,122,182,.35)' : 'rgba(255,255,255,.08)'} />)}
    <rect x="80" y="236" width="326" height="50" rx="6" fill="rgba(255,255,255,.05)" />
    <rect x="90" y="244" width={150} height="14" rx="3" fill="#8b5cf6" />
    <rect x="90" y="264" width={250 - trim} height="14" rx="3" fill="#ffb347" />
    <g transform={`translate(${cx} ${cy})`}><path d="M0 0 L0 18 L5 13 L9 21 L12 20 L8 12 L14 12 Z" fill="#fff" stroke="#0c0a1f" /></g>
    <g opacity={done} transform={`translate(240 ${170 - done * 10})`}>
      <rect x="-80" y="-18" width="160" height="36" rx="18" fill="#38d39f" />
      <text textAnchor="middle" y="5" fontFamily={F} fontWeight="700" fontSize="15" fill="#0c0a1f">final_v1.mp4 ↓</text>
    </g>
  </svg></Loop>;
};

// 03 Find your voice: one subject, four styles
const STY = [
  { bg: '#f4f1ff', fg: '#0c0a1f', label: 'MINIMAL', stroke: 0 },
  { bg: '#ff6b6b', fg: '#ffb347', label: 'POP', stroke: 0 },
  { bg: '#0c0a1f', fg: '#22d3ee', label: 'NEON', stroke: 1 },
  { bg: '#e9dcc0', fg: '#5a3e2b', label: 'RETRO', stroke: 0 },
];
export const StyleCycle: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(3, Math.floor(f / 36)); const s = STY[idx];
  const local = f - idx * 36;
  const pop = interpolate(local, [0, 6], [0.85, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  return <Loop><svg width="480" height="360" viewBox="0 0 480 360">
    <g transform={`translate(240 170) scale(${pop})`}>
      <rect x="-110" y="-110" width="220" height="220" rx={idx === 1 ? 110 : idx === 3 ? 4 : 20} fill={s.bg}
        style={s.stroke ? { filter: 'drop-shadow(0 0 12px #22d3ee)' } : undefined} stroke={s.stroke ? '#22d3ee' : 'none'} strokeWidth="2" />
      {/* the subject: a simple camera */}
      <g fill={s.stroke ? 'none' : s.fg} stroke={s.stroke ? s.fg : 'none'} strokeWidth="3">
        <rect x="-58" y="-28" width="116" height="74" rx="10" />
        <rect x="-22" y="-42" width="44" height="18" rx="4" />
      </g>
      <circle cy="9" r="24" fill={s.bg} stroke={s.fg} strokeWidth="5" />
      <circle cy="9" r="9" fill={s.fg} />
    </g>
    <text x="240" y="325" textAnchor="middle" fontFamily={M} fontSize="13" letterSpacing="3" fill="#f4f1ff">{s.label} · {idx + 1}/4</text>
  </svg></Loop>;
};

// 04 Ship it: rocket launches, counters tick up
export const ShipLaunch: React.FC = () => {
  const f = useCurrentFrame();
  const up = interpolate(f, [30, 90], [0, 260], { ...cl, easing: Easing.in(Easing.cubic) });
  const shake = f < 30 ? Math.sin(f * 2.2) * 2 : 0;
  const n = (to: number) => Math.round(interpolate(f, [40, 120], [0, to], { ...cl, easing: Easing.out(Easing.cubic) }));
  return <Loop><svg width="480" height="360" viewBox="0 0 480 360">
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 73) % 480} cy={(i * 47 + f * 3) % 360} r="1.5" fill="#fff" opacity=".5" />)}
    <g transform={`translate(${170 + shake} ${230 - up})`}>
      <ellipse cy="62" rx={10 + Math.sin(f) * 2} ry={22 + Math.sin(f * 1.7) * 6} fill="#ffb347" opacity={f > 20 ? 1 : .4} />
      <path d="M0 -60 C22 -30 22 20 16 44 L-16 44 C-22 20 -22 -30 0 -60 Z" fill="#f4f1ff" />
      <circle cy="-8" r="9" fill="#22d3ee" />
      <path d="M-16 20 L-32 50 L-14 44 Z M16 20 L32 50 L14 44 Z" fill="#ff6b6b" />
    </g>
    <g fontFamily={F} fontWeight="700" fill="#f4f1ff">
      {[['♥', n(1280), '#ff7ab6', 120], ['▶', n(5400), '#22d3ee', 175], ['★', n(48), '#ffb347', 230]].map(([ic, v, c, y]) => (
        <g key={ic as string} transform={`translate(290 ${y})`}>
          <rect width="140" height="40" rx="20" fill="rgba(255,255,255,.08)" />
          <text x="20" y="27" fontSize="18" fill={c as string}>{ic}</text>
          <text x="46" y="27" fontSize="18">{(v as number).toLocaleString('en-IN')}</text>
        </g>))}
    </g>
  </svg></Loop>;
};

export const METHOD_SCENES = [PosterBuild, ToolWindow, StyleCycle, ShipLaunch];
