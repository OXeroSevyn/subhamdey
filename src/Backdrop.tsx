import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from './theme';

// Drifting aurora blobs + grid. Motion is a pure function of a full loop
// (sin/cos of frame/duration) so the reel loops without a visible seam.
const Blob: React.FC<{ color: string; size: number; x: number; y: number; r: number; phase: number }> = ({ color, size, x, y, r, phase }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = (frame / durationInFrames) * Math.PI * 2 + phase;
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: x + Math.cos(a) * r - size / 2,
        top: y + Math.sin(a) * r - size / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity: 0.5,
        filter: 'blur(50px)',
      }}
    />
  );
};

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shift = (frame / durationInFrames) * 80; // grid cell = 80, so loops cleanly
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <Blob color={C.p} size={1100} x={420} y={300} r={120} phase={0} />
      <Blob color={C.s} size={900} x={1550} y={820} r={140} phase={2} />
      <Blob color={C.g1} size={800} x={1500} y={180} r={100} phase={4} />
      <Blob color={C.t} size={700} x={300} y={950} r={90} phase={1} />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `${shift}px ${shift}px`,
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      {/* vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(5,6,15,.85) 100%)' }} />
    </AbsoluteFill>
  );
};
