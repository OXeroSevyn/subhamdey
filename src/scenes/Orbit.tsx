import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DISPLAY } from '../theme';

export const SIX = [
  { label: 'Design', color: C.p },
  { label: 'Motion', color: C.s },
  { label: 'Edit', color: C.t },
  { label: 'Cinema', color: C.green },
  { label: 'Camera', color: '#fb7185' },
  { label: 'Code', color: C.g1 },
];

// Six discipline orbs orbiting a centre. Rotation completes exactly one turn per
// composition so any duration loops seamlessly.
export const Orbit: React.FC<{ radius: number; size: number; labels?: boolean; tilt?: number }> = ({ radius, size, labels = true, tilt = 0.42 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const turn = (frame / durationInFrames) * Math.PI * 2;
  const intro = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 40 });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* orbit path */}
      <div
        style={{
          position: 'absolute',
          width: radius * 2,
          height: radius * 2 * tilt,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,.12)',
        }}
      />
      {SIX.map((d, i) => {
        const a = turn + (i / SIX.length) * Math.PI * 2;
        const depth = (Math.sin(a) + 1) / 2; // 0 back, 1 front
        const x = Math.cos(a) * radius * intro;
        const y = Math.sin(a) * radius * tilt * intro;
        const s = size * (0.6 + depth * 0.55);
        return (
          <div
            key={d.label}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px)`,
              zIndex: Math.round(depth * 100),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: 0.35 + depth * 0.65,
            }}
          >
            <div
              style={{
                width: s,
                height: s,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, #fff8, ${d.color} 45%, ${d.color}55 100%)`,
                boxShadow: `0 0 ${s * 0.8}px ${d.color}aa`,
              }}
            />
            {labels && (
              <div style={{ marginTop: s * 0.25, fontFamily: DISPLAY, fontWeight: 700, fontSize: s * 0.32, color: C.text, letterSpacing: 2, opacity: depth }}>
                {d.label.toUpperCase()}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ position: 'absolute', width: interpolate(intro, [0, 1], [0, 8]), height: 8, borderRadius: 4 }} />
    </AbsoluteFill>
  );
};
