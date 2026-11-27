import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraMotif, CineMotif, CodeMotif, DesignMotif, EditMotif, MotionMotif } from '../motifs/Motifs';

export const MOTIFS = { design: DesignMotif, motion: MotionMotif, edit: EditMotif, cine: CineMotif, camera: CameraMotif, code: CodeMotif };
export type MotifKind = keyof typeof MOTIFS;

// Plays a course motif, holds it, then fades so the Player can loop it.
export const MotifLoop: React.FC<{ kind: MotifKind; color: string }> = ({ kind, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Motif = MOTIFS[kind];
  const fade = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fade }}>
      <Motif color={color} />
    </AbsoluteFill>
  );
};
