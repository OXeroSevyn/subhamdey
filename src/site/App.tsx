import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HeroReel, REEL_DURATION } from '../HeroReel';
import { MotifLoop } from '../scenes/MotifLoop';
import { AboutBadge } from '../scenes/AboutBadge';
import { StatsScene, type Stat } from '../scenes/StatsScene';
import { C } from '../theme';
import { COURSES, type Course } from './courses';
import { LoopPlayer, reduceMotion } from './LoopPlayer';
import { DotField } from './DotField';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = 'subhamdey.one@gmail.com';
// TODO(Subham): add real proof when ready, e.g. { value: 250, label: 'Students taught', color: C.s }
const STATS: Stat[] = [
  { value: 6, label: 'Courses', color: '#d4ff3a' },
  { value: 3, label: 'Design · Film · Code', color: C.p2 },
  { value: 'Blend Mode', label: 'Studio on IG & YT', color: C.g2 },
];
const PRINCIPLES = [
  ['Learn by making', 'Every class ends with something real: a poster, a cut, a shot list, an app on your phone.'],
  ['Real tools, real briefs', 'The same software and workflow I use on client and studio work, not toy versions of it.'],
  ['Find your voice', "Tools change every year. Taste and the way you see don't, so that's what we train."],
  ['Ship it', 'Work goes out into the world: your feed, your portfolio, the Play Store. Feedback beats perfection.'],
];

// words → masked spans so they can rise into place
const Split = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} aria-label={text}>
    {text.split(' ').map((w, i) => (
      <span className="w" key={i} aria-hidden="true"><span className="wi">{w}</span></span>
    ))}
  </span>
);

function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(reduceMotion ? 100 : 0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduceMotion) { onDone(); return; }
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) })
      .to(ref.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.1')
      .add(onDone, '-=0.5');
    return () => { tl.kill(); };
  }, [onDone]);
  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <span className="mono">Subham Dey — Creative Educator</span>
      <span className="count">{String(n).padStart(3, '0')}</span>
    </div>
  );
}

function CourseDialog({ course, onClose }: { course: Course; onClose: () => void }) {
  const x = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    x.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return (
    <div className="dlg-bd" onClick={(e) => e.target === e.currentTarget && onClose()} data-lenis-prevent>
      <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t" style={{ '--c': course.color } as React.CSSProperties}>
        <button className="x" ref={x} onClick={onClose} aria-label="Close course details">✕</button>
        <LoopPlayer className="art" component={MotifLoop} inputProps={{ kind: course.key, color: course.color }} width={520} height={520} frames={90} stillFrame={45} />
        <div>
          <span className="mono" style={{ color: course.color }}>Course {course.num} · {course.tag}</span>
          <h3 id="dlg-t">{course.title}</h3>
          <p className="big">{course.summary}</p>
          <h4>Tools</h4><div className="chips">{course.tools.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
          <h4>You'll learn</h4><ul className="outs">{course.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          <h4>Who it's for</h4><p>{course.audience}</p>
          <a className="btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent(course.title + ' course')}`}><span>Enquire about {course.title}</span><i>→</i></a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<Course | null>(null);
  const [hover, setHover] = useState<Course | null>(null);
  const last = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // smooth scroll
  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // anchor links glide
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      lenis.scrollTo(a.getAttribute('href')!, { duration: 1.6 });
    };
    document.addEventListener('click', onClick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); document.removeEventListener('click', onClick); };
  }, []);

  useEffect(() => {
    if (open) lenisRef.current?.stop(); else lenisRef.current?.start();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // scroll choreography
  useLayoutEffect(() => {
    if (!ready || reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero .wi', { yPercent: 110, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: 0.06 });
      gsap.from('.hero [data-fade]', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
      gsap.to('.hero-inner', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        gsap.from(el.querySelectorAll('.wi'), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      // showreel grows from a card to full-bleed while pinned
      if (window.innerWidth > 760) gsap.fromTo('.reel-frame', { scale: 0.62, borderRadius: 40 }, {
        scale: 1, borderRadius: 0, ease: 'none',
        scrollTrigger: { trigger: '.reel', start: 'top top', end: '+=120%', scrub: true, pin: true },
      });

      // principles: horizontal track while pinned
      const track = document.querySelector<HTMLElement>('.h-track');
      if (track && window.innerWidth > 760) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
          scrollTrigger: { trigger: '.h-wrap', start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth}`, scrub: 0.6, pin: true, invalidateOnRefresh: true },
        });
      }

      // course rows stagger in
      gsap.from('.row', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.rows', start: 'top 80%' } });

      // progress ring
      gsap.to('.prog circle.bar', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // hover preview follows the cursor
  useEffect(() => {
    if (!preview.current) return;
    const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const close = () => { setOpen(null); last.current?.focus(); };

  return (
    <div ref={root}>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <header className="bar">
        <a href="#top" className="logo" aria-label="Subham Dey, back to top">SD<span>●</span></a>
        <nav aria-label="Sections">
          <a href="#reel">Reel</a><a href="#courses">Courses</a><a href="#about">About</a>
        </nav>
        <a href="#contact" className="btn sm"><span>Start a course</span><i>→</i></a>
      </header>

      <svg className="prog" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="19" className="bg" />
        <circle cx="22" cy="22" r="19" className="bar" />
      </svg>

      <main id="top">
        <section className="hero">
          <DotField />
          <div className="hero-inner wrap">
            <p className="mono" data-fade><span className="live" />Creative educator · Siliguri, India</p>
            <h1>
              <Split text="I teach people" />
              <span className="line2"><Split text="how to" /><Split text="see." className="acc" /></span>
            </h1>
            <div className="hero-foot">
              <p data-fade>Designer, filmmaker and developer teaching the full visual stack, from pixels and frames to motion and code.</p>
              <ul className="for mono" data-fade>
                <li>For beginners</li><li>Creators</li><li>Brands</li><li>Students</li>
              </ul>
              <a href="#courses" className="btn" data-fade><span>Explore the six courses</span><i>→</i></a>
            </div>
          </div>
          <div className="scroll-cue mono" data-fade>Scroll</div>
        </section>

        <section className="strip">
          <div className="wrap strip-in">
            {[['06', 'Courses'], ['03', 'Worlds: design, film, code'], ['01', 'Studio: Blend Mode'], ['∞', 'Frames to learn from']].map(([n, l]) => (
              <div key={l} data-rise><b>{n}</b><span className="mono">{l}</span></div>
            ))}
          </div>
        </section>

        <section className="reel" id="reel">
          <div className="reel-frame">
            <LoopPlayer component={HeroReel} width={1920} height={1080} frames={REEL_DURATION} stillFrame={60} controls
              label="Showreel: Subham Dey introduces six disciplines, graphic design, motion graphics, video editing, cinematography, camera handling and vibe coding." />
          </div>
          <p className="reel-cap mono">Showreel — every frame drawn in code with Remotion</p>
        </section>

        <section className="block" id="courses">
          <div className="wrap">
            <div className="sec-head">
              <span className="mono">( 02 ) Courses</span>
              <h2 data-split><Split text="Six disciplines," /><Split text="one educator." className="acc" /></h2>
            </div>
            <div className="rows" onPointerLeave={() => setHover(null)}>
              {COURSES.map((c) => (
                <button key={c.key} className="row" style={{ '--c': c.color } as React.CSSProperties}
                  onPointerEnter={() => setHover(c)} onFocus={() => setHover(c)} onBlur={() => setHover(null)}
                  onClick={(e) => { last.current = e.currentTarget; setOpen(c); }} aria-haspopup="dialog">
                  <span className="mono n">{c.num}</span>
                  <span className="t">{c.title}</span>
                  <span className="mono tag">{c.label}</span>
                  <span className="arr" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="h-wrap" aria-label="How I teach">
          <div className="h-track">
            <div className="h-intro">
              <span className="mono">( 03 ) Method</span>
              <h2 data-split><Split text="How I" /><Split text="teach." className="acc" /></h2>
            </div>
            {PRINCIPLES.map(([t, d], i) => (
              <article className="panel" key={t}>
                <span className="pn">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="block" id="about">
          <div className="wrap about">
            <div className="badge" data-rise>
              {/* TODO(Subham): drop a square photo at public/assets/subham.jpg and it appears over the animated badge */}
              <LoopPlayer component={AboutBadge} width={600} height={600} frames={300} stillFrame={40} />
              <img src="/assets/subham.jpg" alt="Portrait of Subham Dey" onError={(e) => e.currentTarget.remove()} />
            </div>
            <div>
              <span className="mono">( 04 ) About</span>
              <h2 data-split><Split text="I don't just create." /><Split text="I teach others how to see." className="acc" /></h2>
              <p className="bio" data-rise>I'm a multidisciplinary creative and educator from Siliguri, West Bengal. My work lives where design, film and technology meet: brand identities, cinematic sequences, Android apps. I bring that real-world practice into every class, so students learn more than tools. They build taste.</p>
              <div data-rise>
                <LoopPlayer className="stats" component={StatsScene} inputProps={{ stats: STATS }} width={1200} height={380} frames={240} stillFrame={120}
                  label={STATS.map((s) => `${s.value} ${s.label}`).join(', ')} />
              </div>
            </div>
          </div>
        </section>

        <section className="cta" id="contact">
          <div className="wrap">
            <span className="mono">( 05 ) Contact</span>
            <h2 data-split><Split text="Working on something" /><Split text="creative?" className="acc" /></h2>
            <a className="mail" href={`mailto:${EMAIL}`} data-rise>{EMAIL}<i>↗</i></a>
            <div className="cta-foot mono" data-rise>
              <span>SLG · WB · IN — {new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())} IST</span>
              <nav aria-label="Social">
                {[
                  ['https://www.instagram.com/blendmodestudio', 'Instagram'],
                  ['https://www.youtube.com/@blendmodestudioofficial', 'YouTube'],
                  ['https://www.linkedin.com/in/subhamdeyone', 'LinkedIn'],
                  ['https://www.behance.net/subhamdey4', 'Behance'],
                ].map(([href, l]) => <a key={l} href={href} target="_blank" rel="noopener">{l}</a>)}
              </nav>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap mono"><span>© 2026 Subham Dey</span><span>Built with Three.js, GSAP, Lenis &amp; Remotion</span></footer>

      <div className={`preview ${hover && !open ? 'on' : ''}`} ref={preview} aria-hidden="true">
        <div className="pv-in" style={{ '--c': hover?.color } as React.CSSProperties}>
          {hover && <LoopPlayer key={hover.key} component={MotifLoop} inputProps={{ kind: hover.key, color: hover.color }} width={520} height={520} frames={90} stillFrame={20} />}
        </div>
      </div>

      {open && <CourseDialog course={open} onClose={close} />}
    </div>
  );
}
