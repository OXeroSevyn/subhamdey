import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../Backdrop';
import { Orbit } from './Orbit';
import { C } from '../theme';

// Hero background: aurora + grid + discipline orbit + light streaks. Text sits on top in HTML.
const Streak: React.FC<{ y: number; delay: number; color: string }> = ({ y, delay, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = ((frame + delay) % durationInFrames) / durationInFrames;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: -600 + t * 3200,
        width: 500,
        height: 3,
        borderRadius: 3,
        background: `linear-gradient(90deg, transparent, ${color})`,
        opacity: 0.6,
      }}
    />
  );
};

export const HeroScene: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ opacity: 0.55 }}>
      <Orbit radius={760} size={70} labels={false} tilt={0.36} />
    </AbsoluteFill>
    <Streak y={180} delay={0} color={C.p2} />
    <Streak y={860} delay={110} color={C.s} />
    <Streak y={520} delay={200} color={C.t} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,16,.55) 0%, transparent 60%)' }} />
  </AbsoluteFill>
);
