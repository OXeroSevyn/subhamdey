import { Composition } from 'remotion';
import { HeroReel, REEL_DURATION } from './HeroReel';
import { Viewfinder, VIEWFINDER_FRAMES } from './scenes/Viewfinder';
import { MotifLoop } from './scenes/MotifLoop';
import { Orbit } from './scenes/Orbit';
import { AboutBadge } from './scenes/AboutBadge';
import { StatsScene } from './scenes/StatsScene';
import { ContactScene } from './scenes/ContactScene';
import { C } from './theme';

// Everything the website plays live, registered here so it can be previewed in Remotion Studio.
export const Root: React.FC = () => (
  <>
    <Composition id="HeroReel" component={HeroReel} durationInFrames={REEL_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Viewfinder" component={Viewfinder} durationInFrames={VIEWFINDER_FRAMES} fps={30} width={1200} height={1500} />
    <Composition id="MotifLoop" component={MotifLoop} durationInFrames={90} fps={30} width={520} height={520} defaultProps={{ kind: 'design' as const, color: C.p }} />
    <Composition id="Orbit" component={Orbit} durationInFrames={300} fps={30} width={900} height={500} defaultProps={{ radius: 330, size: 70 }} />
    <Composition id="AboutBadge" component={AboutBadge} durationInFrames={300} fps={30} width={600} height={600} />
    <Composition
      id="StatsScene"
      component={StatsScene}
      durationInFrames={240}
      fps={30}
      width={1200}
      height={380}
      defaultProps={{ stats: [{ value: 6, label: 'Courses', color: C.p2 }, { value: 3, label: 'Worlds', color: C.s }] }}
    />
    <Composition id="ContactScene" component={ContactScene} durationInFrames={300} fps={30} width={1600} height={900} />
  </>
);
