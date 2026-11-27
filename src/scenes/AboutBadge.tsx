import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DISPLAY, MONO } from '../theme';

// Spinning gradient rings around an "SD" monogram, with role words orbiting.
const ROLES = ['DESIGNER', 'FILMMAKER', 'DEVELOPER', 'EDUCATOR'];

export const AboutBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const turn = (frame / durationInFrames) * 360;
  const pop = spring({ frame, fps, config: { damping: 10, mass: 0.8 }, durationInFrames: 30 });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {[260, 210].map((r, i) => (
        <div
          key={r}
          style={{
            position: 'absolute',
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            border: '6px solid transparent',
            background: `conic-gradient(from ${i ? -turn * 2 : turn}deg, ${C.p}, transparent 30%, ${C.s} 55%, transparent 80%, ${C.p}) border-box`,
            WebkitMask: 'linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0)',
            mask: 'linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0)',
            opacity: 0.9 - i * 0.3,
          }}
        />
      ))}
      <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: 'absolute', transform: `rotate(${-turn}deg)` }}>
        <defs>
          <path id="ring" d="M300,300 m-232,0 a232,232 0 1,1 464,0 a232,232 0 1,1 -464,0" />
        </defs>
        <text fill={C.ink} fontFamily={MONO} fontSize={22} letterSpacing={6}>
          <textPath href="#ring">{ROLES.map((r) => `${r}  ✦  `).join('')}</textPath>
        </text>
      </svg>
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: C.ink,
          transform: `scale(${pop}) rotate(${(1 - pop) * -30}deg)`,
          boxShadow: `18px 18px 0 ${C.s}`,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 130,
          color: C.bg,
          letterSpacing: -4,
        }}
      >
        SD
      </div>
    </AbsoluteFill>
  );
};
