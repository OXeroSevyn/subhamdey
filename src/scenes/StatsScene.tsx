import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { MONO, SERIF } from '../theme';

export type Stat = { value: number | string; label: string; color: string };

// Counters that count up with springs and draw an underline. Hold, then fade for loop.
export const StatsScene: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ flexDirection: 'row', gap: 30, padding: 10, opacity: fade }}>
      {stats.map((s, i) => {
        const p = spring({ frame: frame - i * 8, fps, config: { damping: 16 }, durationInFrames: 45 });
        const v = typeof s.value === 'number' ? Math.round(s.value * p) : s.value;
        return (
          <div
            key={s.label}
            style={{
              flex: 1,
                            background: 'rgba(12,10,31,.78)',
              border: '2px solid rgba(255,255,255,.14)',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateY(${(1 - p) * 60}px)`,
              opacity: p,
            }}
          >
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: typeof s.value === 'number' ? 180 : 84, color: '#ffffff', textShadow: `0 0 40px ${s.color}88`, lineHeight: 1.1, textAlign: 'center' }}>{v}</div>
            <div style={{ height: 6, width: 120 * p, borderRadius: 3, background: s.color, margin: '18px 0' }} />
            <div style={{ fontFamily: MONO, fontWeight: 400, fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,.88)', textTransform: 'uppercase', textAlign: 'center', padding: '0 20px' }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
