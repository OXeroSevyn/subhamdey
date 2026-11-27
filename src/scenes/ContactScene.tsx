import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../theme';

// Expanding sonar rings + a paper plane looping a figure-eight with a dashed trail.
export const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = frame / durationInFrames;
  const pos = (tt: number) => {
    const a = tt * Math.PI * 2;
    return { x: width / 2 + Math.sin(a) * width * 0.36, y: height / 2 + Math.sin(a * 2) * height * 0.22 };
  };
  const p = pos(t);
  const ahead = pos(t + 0.003);
  const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
  const trail = Array.from({ length: 40 }, (_, i) => pos(t - i * 0.004));
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {[0, 1, 2, 3].map((i) => {
        const k = ((t * 2 + i / 4) % 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: width / 2 - 900 * k,
              top: height / 2 - 900 * k,
              width: 1800 * k,
              height: 1800 * k,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,.35)',
              opacity: 1 - k,
            }}
          />
        );
      })}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.6 }}>
        {trail.map((q, i) => (i % 2 === 0 ? <circle key={i} cx={q.x} cy={q.y} r={5 - i * 0.1} fill="#fff" opacity={0.5 - i * 0.012} /> : null))}
        <g transform={`translate(${p.x} ${p.y}) rotate(${angle})`}>
          <polygon points="40,0 -30,-24 -16,0 -30,24" fill="#fff" />
          <polygon points="40,0 -16,0 -30,24" fill={C.s} opacity={0.9} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
