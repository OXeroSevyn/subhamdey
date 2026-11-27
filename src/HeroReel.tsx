import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from './Backdrop';
import { C, BODY, DISPLAY, MONO, SERIF } from './theme';
import { CameraMotif, CineMotif, CodeMotif, DesignMotif, EditMotif, MotionMotif } from './motifs/Motifs';

const INTRO = 80;
const BEAT = 42; // frames per discipline
const OUTRO = 110;
const DISCIPLINES = [
  { n: '01', name: 'Graphic Design', tag: 'Design Thinking', color: C.p, Motif: DesignMotif },
  { n: '02', name: 'Motion Graphics', tag: 'After Effects', color: C.s, Motif: MotionMotif },
  { n: '03', name: 'Video Editing', tag: 'Premiere / DaVinci', color: C.t, Motif: EditMotif },
  { n: '04', name: 'Cinematography', tag: 'Visual Storytelling', color: C.green, Motif: CineMotif },
  { n: '05', name: 'Camera Handling', tag: 'DSLR & Mirrorless', color: '#fb7185', Motif: CameraMotif },
  { n: '06', name: 'Vibe Coding', tag: 'Android Dev', color: C.g1, Motif: CodeMotif },
];
export const REEL_DURATION = INTRO + BEAT * DISCIPLINES.length + OUTRO;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Letters drop in one by one with a spring
const KineticWord: React.FC<{ text: string; size: number; delay?: number; gradient?: boolean }> = ({ text, size, delay = 0, gradient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.03 }}>
      {text.split('').map((ch, i) => {
        const p = spring({ frame: frame - delay - i * 2, fps, config: { damping: 11, mass: 0.7 } });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              transform: `translateY(${(1 - p) * size * 0.9}px) rotate(${(1 - p) * 12}deg)`,
              opacity: Math.min(1, p * 1.4),
              ...(gradient
                ? { background: `linear-gradient(120deg, ${C.p2}, ${C.g1} 45%, ${C.s})`, WebkitBackgroundClip: 'text', color: 'transparent' }
                : { color: C.text }),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [INTRO - 12, INTRO], [1, 0], clamp);
  const line = interpolate(frame, [18, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: out, transform: `scale(${1 + (1 - out) * 0.08})` }}>
      <div style={{ fontFamily: MONO, fontWeight: 400, fontSize: 30, color: C.muted, letterSpacing: 10, textTransform: 'uppercase', opacity: line, marginBottom: 28 }}>
        Hi, I'm
      </div>
      <KineticWord text="Subham Dey" size={210} delay={4} gradient />
      <div style={{ height: 6, width: 900 * line, marginTop: 40, borderRadius: 6, background: `linear-gradient(90deg, ${C.p}, ${C.s})` }} />
      <div style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 40, color: C.text, marginTop: 34, opacity: line, letterSpacing: 2 }}>
        Creative Educator · Siliguri, India
      </div>
    </AbsoluteFill>
  );
};

const DisciplineBeat: React.FC<(typeof DISCIPLINES)[number]> = ({ n, name, tag, color, Motif }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15 } });
  const exit = interpolate(frame, [BEAT - 8, BEAT], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const wipe = interpolate(frame, [0, 10], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 150px', gap: 90 }}>
      {/* colour sweep that introduces each discipline */}
      <AbsoluteFill style={{ background: color, opacity: 0.18, clipPath: `inset(0 ${100 - wipe}% 0 0)` }} />
      <div style={{ flex: 1, minWidth: 0, transform: `translateX(${(1 - enter) * -120 - exit * 160}px)`, opacity: enter * (1 - exit) }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 120, color: 'transparent', WebkitTextStroke: `3px ${color}`, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: Math.max(...name.split(' ').map((w) => w.length)) > 10 ? 84 : 118, color: C.text, lineHeight: 1.02, marginTop: 18, letterSpacing: -3 }}>
          {name.split(' ').map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 34,
            padding: '12px 28px',
            borderRadius: 999,
            border: `2px solid ${color}`,
            color,
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          {tag}
        </div>
      </div>
      <div
        style={{
          width: 600,
          height: 600,
          flexShrink: 0,
          borderRadius: 40,
          background: 'rgba(255,255,255,.04)',
          border: '1.5px solid rgba(255,255,255,.1)',
          boxShadow: `0 40px 120px -30px ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${(1 - enter) * 200 + exit * -120}px) rotate(${(1 - enter) * 6}deg) scale(${0.9 + enter * 0.1})`,
          opacity: enter * (1 - exit),
        }}
      >
        <Motif color={color} />
      </div>
    </AbsoluteFill>
  );
};

// Progress rail along the bottom: six dots, one per discipline
const Rail: React.FC = () => {
  const frame = useCurrentFrame();
  const vis = interpolate(frame, [INTRO - 10, INTRO, INTRO + BEAT * 6, INTRO + BEAT * 6 + 10], [0, 1, 1, 0], clamp);
  const active = Math.floor((frame - INTRO) / BEAT);
  return (
    <div style={{ position: 'absolute', bottom: 70, left: 150, display: 'flex', gap: 14, opacity: vis }}>
      {DISCIPLINES.map((d, i) => (
        <div key={i} style={{ width: i === active ? 70 : 16, height: 16, borderRadius: 8, background: i <= active ? d.color : 'rgba(255,255,255,.2)' }} />
      ))}
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ['Design.', 'Film.', 'Code.'];
  const tagline = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const fadeOut = interpolate(frame, [OUTRO - 18, OUTRO], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fadeOut }}>
      <div style={{ display: 'flex', gap: 50 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - i * 7, fps, config: { damping: 12 } });
          return (
            <div
              key={w}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 130,
                color: [C.p2, C.g1, C.s][i],
                transform: `scale(${p}) translateY(${(1 - p) * 60}px)`,
                opacity: p,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: 64,
          color: C.text,
          marginTop: 50,
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 40}px)`,
        }}
      >
        I teach others <span style={{ color: C.s, fontWeight: 700 }}>how to see.</span>
      </div>
    </AbsoluteFill>
  );
};

export const HeroReel: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence durationInFrames={INTRO}>
      <Intro />
    </Sequence>
    {DISCIPLINES.map((d, i) => (
      <Sequence key={d.n} from={INTRO + i * BEAT} durationInFrames={BEAT}>
        <DisciplineBeat {...d} />
      </Sequence>
    ))}
    <Sequence from={INTRO + BEAT * DISCIPLINES.length} durationInFrames={OUTRO}>
      <Outro />
    </Sequence>
    <Rail />
  </AbsoluteFill>
);
