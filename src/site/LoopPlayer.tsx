import { Player, type PlayerRef } from '@remotion/player';
import { useEffect, useRef, type ComponentType } from 'react';

export const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Props<T extends Record<string, unknown>> = {
  component: ComponentType<T>;
  inputProps?: T;
  width: number;
  height: number;
  frames: number;
  stillFrame?: number; // frame shown when motion is reduced
  controls?: boolean;
  className?: string;
  label?: string;
};

// A Remotion Player that loops silently, plays only while on screen, and
// freezes on a nice frame for visitors who prefer reduced motion.
export function LoopPlayer<T extends Record<string, unknown>>({ component, inputProps, width, height, frames, stillFrame, controls = false, className, label }: Props<T>) {
  const ref = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || reduceMotion) return;
    const io = new IntersectionObserver(([e]) => {
      const p = ref.current;
      if (!p) return;
      if (e.isIntersecting) p.play();
      else p.pause();
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <Player
        ref={ref}
        component={component as ComponentType<Record<string, unknown>>}
        inputProps={inputProps ?? {}}
        compositionWidth={width}
        compositionHeight={height}
        durationInFrames={frames}
        fps={30}
        loop
        autoPlay={!reduceMotion}
        numberOfSharedAudioTags={0}
        initiallyMuted
        controls={controls}
        initialFrame={stillFrame ?? 0}
        clickToPlay={controls}
        doubleClickToFullscreen={controls}
        acknowledgeRemotionLicense
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
