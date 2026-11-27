import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, BODY, DISPLAY } from '../theme';

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
              borderRadius: 36,
              background: 'rgba(255,255,255,.045)',
              border: '2px solid rgba(255,255,255,.09)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateY(${(1 - p) * 60}px)`,
              opacity: p,
            }}
          >
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: typeof s.value === 'number' ? 130 : 64, color: s.color, lineHeight: 1.1, textAlign: 'center' }}>{v}</div>
            <div style={{ height: 6, width: 120 * p, borderRadius: 3, background: s.color, margin: '18px 0' }} />
            <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.muted, textTransform: 'uppercase', textAlign: 'center', padding: '0 20px' }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
