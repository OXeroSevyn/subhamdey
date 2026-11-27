import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DISPLAY } from '../theme';

// One tiny animated "lesson" per discipline. Each motif is a 520x520 SVG.
const S = 520;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const useLocal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

// 01 Graphic design: grid + circle, square, triangle snap into a composition
export const DesignMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame, fps } = useLocal();
  const pop = (d: number) => spring({ frame: frame - d, fps, config: { damping: 12, mass: 0.6 } });
  const gridDraw = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      {[1, 2].map((i) => (
        <g key={i} stroke="rgba(255,255,255,.18)" strokeWidth={2}>
          <line x1={(S / 3) * i} y1={0} x2={(S / 3) * i} y2={S * gridDraw} />
          <line x1={0} y1={(S / 3) * i} x2={S * gridDraw} y2={(S / 3) * i} />
        </g>
      ))}
      <circle cx={S / 3} cy={S / 3} r={92 * pop(4)} fill={color} />
      <rect
        x={S / 3}
        y={S / 3}
        width={170}
        height={170}
        fill="none"
        stroke={C.text}
        strokeWidth={10}
        transform={`rotate(${(1 - pop(9)) * 90} ${S / 3 + 85} ${S / 3 + 85})`}
        opacity={pop(9)}
      />
      <polygon
        points={`${(S * 2) / 3},${S / 3 + 40} ${(S * 2) / 3 + 90},${(S * 2) / 3 + 60} ${(S * 2) / 3 - 90},${(S * 2) / 3 + 60}`}
        fill={C.s}
        opacity={0.9}
        transform={`translate(0 ${(1 - pop(14)) * 200})`}
      />
      <text x={30} y={S - 28} fill={C.muted} fontFamily={DISPLAY} fontSize={22} letterSpacing={4} opacity={pop(18)}>
        Aa · 60/30/10
      </text>
    </svg>
  );
};

// 02 Motion graphics: ball travelling an easing curve, with the graph drawn under it
export const MotionMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame } = useLocal();
  const t = interpolate(frame, [4, 32], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.3, 1) });
  const lin = interpolate(frame, [4, 32], [0, 1], clamp);
  const x0 = 60, x1 = 460, y0 = 440, y1 = 120;
  const path = `M ${x0} ${y0} C ${x0 + 280} ${y0}, ${x1 - 280} ${y1}, ${x1} ${y1}`;
  const len = 560;
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={2} />
      <path d={path} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - lin)} />
      {/* bezier handles */}
      <line x1={x0} y1={y0} x2={x0 + 280} y2={y0} stroke={C.s} strokeWidth={3} opacity={0.8} />
      <line x1={x1} y1={y1} x2={x1 - 280} y2={y1} stroke={C.s} strokeWidth={3} opacity={0.8} />
      <circle cx={x0 + 280} cy={y0} r={10} fill={C.s} />
      <circle cx={x1 - 280} cy={y1} r={10} fill={C.s} />
      {/* the object being animated */}
      <circle cx={x0 + (x1 - x0) * lin} cy={y0 - (y0 - y1) * t} r={26} fill={C.text} />
      {[0.15, 0.3, 0.45].map((d, i) => {
        const tl = Math.max(0, lin - d * 0.25);
        const te = interpolate(tl, [0, 1], [0, 1], { easing: Easing.bezier(0.7, 0, 0.3, 1) });
        return <circle key={i} cx={x0 + (x1 - x0) * tl} cy={y0 - (y0 - y1) * te} r={26 - i * 6} fill={color} opacity={0.35 - i * 0.1} />;
      })}
      <text x={x0} y={495} fill={C.muted} fontFamily={DISPLAY} fontSize={22} letterSpacing={4}>
        ease-in-out
      </text>
    </svg>
  );
};

// 03 Video editing: timeline tracks with clips sliding in and a playhead sweeping
export const EditMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame, fps } = useLocal();
  const clips = [
    { track: 0, x: 40, w: 150, c: color },
    { track: 0, x: 200, w: 110, c: C.p },
    { track: 0, x: 320, w: 160, c: color },
    { track: 1, x: 90, w: 220, c: C.g1 },
    { track: 1, x: 320, w: 100, c: C.g2 },
    { track: 2, x: 40, w: 440, c: C.green },
  ];
  const head = interpolate(frame, [10, 38], [40, 480], clamp);
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      {[0, 1, 2].map((tr) => (
        <rect key={tr} x={30} y={150 + tr * 95} width={460} height={78} rx={10} fill="rgba(255,255,255,.04)" />
      ))}
      {clips.map((c, i) => {
        const p = spring({ frame: frame - i * 2.5, fps, config: { damping: 14 } });
        return (
          <rect key={i} x={c.x + (1 - p) * 420} y={158 + c.track * 95} width={c.w - 6} height={62} rx={8} fill={c.c} opacity={0.85 * p} />
        );
      })}
      {/* audio waveform on track 3 */}
      {Array.from({ length: 36 }).map((_, i) => {
        const h = 10 + Math.abs(Math.sin(i * 1.7)) * 34;
        return <rect key={i} x={50 + i * 12} y={379 - h / 2} width={5} height={h} rx={2} fill="rgba(5,5,16,.55)" />;
      })}
      <line x1={head} y1={110} x2={head} y2={440} stroke={C.text} strokeWidth={4} />
      <polygon points={`${head - 14},100 ${head + 14},100 ${head},122`} fill={C.text} />
      <text x={30} y={80} fill={C.muted} fontFamily={DISPLAY} fontSize={22} letterSpacing={4}>
        00:00:{String(Math.floor(interpolate(head, [40, 480], [0, 24]))).padStart(2, '0')}:12
      </text>
    </svg>
  );
};

// 04 Cinematography: viewfinder, rule-of-thirds and a subject easing onto a power point
export const CineMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame } = useLocal();
  const t = interpolate(frame, [2, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sx = interpolate(t, [0, 1], [260, (S * 2) / 3]);
  const sy = interpolate(t, [0, 1], [260, S / 3]);
  const rec = Math.floor(frame / 8) % 2 === 0;
  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M ${x} ${y + dy * 50} L ${x} ${y} L ${x + dx * 50} ${y}`} stroke={C.text} strokeWidth={6} fill="none" />
  );
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      {corner(30, 30, 1, 1)}
      {corner(490, 30, -1, 1)}
      {corner(30, 490, 1, -1)}
      {corner(490, 490, -1, -1)}
      {[1, 2].map((i) => (
        <g key={i} stroke="rgba(255,255,255,.22)" strokeWidth={2} strokeDasharray="8 10">
          <line x1={(S / 3) * i} y1={30} x2={(S / 3) * i} y2={490} />
          <line x1={30} y1={(S / 3) * i} x2={490} y2={(S / 3) * i} />
        </g>
      ))}
      <circle cx={sx} cy={sy} r={60} fill={color} opacity={0.9} />
      <circle cx={sx} cy={sy} r={90} fill="none" stroke={color} strokeWidth={3} opacity={0.5 * t} />
      <circle cx={70} cy={70} r={10} fill="#ef4444" opacity={rec ? 1 : 0.2} />
      <text x={90} y={78} fill={C.text} fontFamily={DISPLAY} fontSize={20} letterSpacing={3}>REC</text>
      <text x={330} y={470} fill={C.muted} fontFamily={DISPLAY} fontSize={20} letterSpacing={3}>35mm · f/1.8</text>
    </svg>
  );
};

// 05 Camera handling: aperture iris closing / opening, f-stop readout
export const CameraMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame } = useLocal();
  const open = interpolate(frame, [0, 18, 36], [1, 0.25, 0.6], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const blades = 7;
  const R = 190;
  const stops = ['1.4', '2', '2.8', '4', '5.6', '8', '11'];
  const stop = stops[Math.round(interpolate(open, [0.25, 1], [6, 0]))];
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      <circle cx={260} cy={240} r={R + 26} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={4} />
      <circle cx={260} cy={240} r={R} fill={color} opacity={0.25} />
      <g transform={`rotate(${frame * 1.5} 260 240)`}>
        {Array.from({ length: blades }).map((_, i) => {
          const a = (i / blades) * Math.PI * 2;
          const inner = R * open;
          // each blade: a wedge that slides toward the centre as the iris closes
          const x1 = 260 + Math.cos(a) * inner;
          const y1 = 240 + Math.sin(a) * inner;
          const x2 = 260 + Math.cos(a + 1.3) * (R + 4);
          const y2 = 240 + Math.sin(a + 1.3) * (R + 4);
          const x3 = 260 + Math.cos(a) * (R + 4);
          const y3 = 240 + Math.sin(a) * (R + 4);
          return <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="#1a1a33" stroke={C.p2} strokeWidth={2} />;
        })}
      </g>
      <text x={260} y={500} textAnchor="middle" fill={C.text} fontFamily={DISPLAY} fontWeight={700} fontSize={38}>
        f/{stop}
      </text>
    </svg>
  );
};

// 06 Vibe coding: a phone frame with code typing out and UI blocks popping in
export const CodeMotif: React.FC<{ color: string }> = ({ color }) => {
  const { frame, fps } = useLocal();
  const lines = ['@Composable', 'fun Hello() {', '  Text("vibes ✓")', '}'];
  const chars = Math.floor(interpolate(frame, [0, 26], [0, 46], clamp));
  let used = 0;
  const ui = (d: number) => spring({ frame: frame - d, fps, config: { damping: 13 } });
  return (
    <svg width={S} height={S} viewBox="0 0 520 520">
      <rect x={20} y={60} width={270} height={400} rx={18} fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.14)" />
      {lines.map((l, i) => {
        const show = l.slice(0, Math.max(0, chars - used));
        used += l.length;
        return (
          <text key={i} x={40} y={120 + i * 44} fill={i === 0 ? color : C.text} fontFamily="monospace" fontSize={24}>
            {show}
          </text>
        );
      })}
      <rect x={40} y={110 + Math.min(3, Math.floor(chars / 12)) * 44} width={12} height={4} fill={C.text} opacity={frame % 10 < 5 ? 1 : 0} />
      {/* phone */}
      <rect x={320} y={40} width={180} height={360} rx={30} fill="#0f0f22" stroke={C.text} strokeWidth={5} />
      <rect x={385} y={52} width={50} height={8} rx={4} fill="rgba(255,255,255,.3)" />
      <rect x={340} y={86} width={140} height={70} rx={12} fill={color} transform={`scale(1 ${ui(14)})`} style={{ transformOrigin: '410px 86px' }} />
      <rect x={340} y={170} width={140} height={22} rx={8} fill="rgba(255,255,255,.25)" opacity={ui(18)} />
      <rect x={340} y={204} width={100} height={22} rx={8} fill="rgba(255,255,255,.15)" opacity={ui(21)} />
      <rect x={340} y={330} width={140} height={44} rx={22} fill={C.s} opacity={ui(25)} />
      <text x={410} y={360} textAnchor="middle" fill={C.bg} fontFamily={DISPLAY} fontWeight={700} fontSize={18} opacity={ui(25)}>
        SHIP IT
      </text>
    </svg>
  );
};
