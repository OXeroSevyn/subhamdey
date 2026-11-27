import { Composition } from 'remotion';
import { HeroReel, REEL_DURATION } from './HeroReel';

export const Root: React.FC = () => (
  <Composition
    id="HeroReel"
    component={HeroReel}
    durationInFrames={REEL_DURATION}
    fps={30}
    width={1920}
    height={1080}
  />
);
