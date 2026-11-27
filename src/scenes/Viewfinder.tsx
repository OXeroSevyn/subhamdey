import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO, SERIF } from '../theme';
import { MOTIFS, type MotifKind } from './MotifLoop';

// Hero piece: a camera viewfinder that cuts between the six course motifs,
// with timecode, REC light and a slate label for each "take".
const TAKES: { kind: MotifKind; label: string; color: string }[] = [
  { kind: 'design', label: 'Graphic Design', color: C.p },
  { kind: 'motion', label: 'Motion Graphics', color: C.s },
  { kind: 'edit', label: 'Video Editing', color: C.t },
  { kind: 'cine', label: 'Cinematography', color: C.green },
  { kind: 'camera', label: 'Camera Handling', color: C.g2 },
  { kind: 'code', label: 'Vibe Coding', color: C.g1 },
];
export const TAKE = 60;
export const VIEWFINDER_FRAMES = TAKE * TAKES.length;

const Take: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const t = TAKES[i];
  const Motif = MOTIFS[t.kind];
  const flash = interpolate(frame, [0, 4], [1, 0], { extrapolateRight: 'clamp' });
  const out = interpolate(frame, [TAKE - 6, TAKE], [1, 0], { extrapolateLeft: 'clamp' });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: out }}>
        <div style={{ transform: 'scale(1.6)' }}>
          <Motif color={t.color} />
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 70, bottom: 120, fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, color: C.text, lineHeight: 1, opacity: out }}>
        {t.label}
      </div>
      <div style={{ position: 'absolute', left: 74, bottom: 250, fontFamily: MONO, fontSize: 30, color: t.color, letterSpacing: 4 }}>
        TAKE 0{i + 1} / 06
      </div>
      <AbsoluteFill style={{ background: C.s, opacity: flash * 0.35 }} />
    </AbsoluteFill>
  );
};

export const Viewfinder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const secs = Math.floor(frame / fps);
  const ff = String(frame % fps).padStart(2, '0');
  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M ${x} ${y + dy * 90} L ${x} ${y} L ${x + dx * 90} ${y}`} stroke={C.text} strokeWidth={8} fill="none" />
  );
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {TAKES.map((_, i) => (
        <Sequence key={i} from={i * TAKE} durationInFrames={TAKE}>
          <Take i={i} />
        </Sequence>
      ))}
      <svg width={width} height={height} style={{ position: 'absolute' }}>
        {corner(40, 40, 1, 1)}
        {corner(width - 40, 40, -1, 1)}
        {corner(40, height - 40, 1, -1)}
        {corner(width - 40, height - 40, -1, -1)}
        <line x1={width / 2 - 30} y1={height / 2} x2={width / 2 + 30} y2={height / 2} stroke={C.line} strokeWidth={3} />
        <line x1={width / 2} y1={height / 2 - 30} x2={width / 2} y2={height / 2 + 30} stroke={C.line} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', top: 80, left: 90, display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 30, color: C.text, letterSpacing: 3 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: C.s, opacity: Math.floor(frame / 10) % 2 ? 0.25 : 1 }} />
        REC
      </div>
      <div style={{ position: 'absolute', top: 80, right: 90, fontFamily: MONO, fontSize: 30, color: C.text, letterSpacing: 3 }}>
        00:00:{String(secs).padStart(2, '0')}:{ff}
      </div>
      <div style={{ position: 'absolute', bottom: 70, right: 90, fontFamily: MONO, fontSize: 24, color: C.muted, letterSpacing: 3 }}>ISO 400 · 1/50 · 4K</div>
    </AbsoluteFill>
  );
};
