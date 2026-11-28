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
import { METHOD_SCENES } from '../scenes/MethodScenes';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = 'subhamdey.one@gmail.com';
// TODO(Subham): add real proof when ready, e.g. { value: 250, label: 'Students taught', color: '#ffffff' }
const STATS: Stat[] = [
  { value: 6, label: 'Courses', color: '#ffffff' },
  { value: 3, label: 'Design · Film · Code', color: '#ffffff' },
  { value: 'Blend Mode', label: 'Studio on IG & YT', color: '#ffffff' },
];
// pulled from each course's audience notes
const WHO = [
  ['Total beginners', "Just got your first camera, or never opened Photoshop? Graphic Design and Camera Handling start from zero.", ['design', 'camera']],
  ['YouTubers & creators', 'Shoot footage that looks cinematic, cut it with rhythm, and add motion that stops the scroll.', ['edit', 'cine', 'motion']],
  ['Designers levelling up', 'Already design? Add motion, kinetic type and broadcast graphics to your toolkit.', ['motion']],
  ['Aspiring filmmakers', 'Composition, light, lenses, shot lists and storyboards. Learn to see like a DP.', ['cine', 'camera']],
  ['Entrepreneurs & brands', 'Logos, posters, social graphics and brand kits you can make yourself, with intention.', ['design']],
  ['Builders without a CS degree', 'Ship a real Android app with Kotlin, Compose or Flutter, plus AI tools like Cursor and Claude.', ['code']],
] as const;
const TOOLS = [...new Set(COURSES.flatMap((c) => c.tools))];
// TODO(Subham): add fees, batch dates, online vs in-person, duration once decided
const FAQ = [
  ['Do I need any experience?', 'No. Graphic Design needs no prior experience, Camera Handling starts with your first camera, and Vibe Coding needs no CS degree.'],
  ['Which software will I use?', 'Industry tools: Photoshop, Illustrator, After Effects, Premiere Pro, DaVinci Resolve, Android Studio and more. Each course lists its own.'],
  ['What will I actually make?', 'Real work: logos and brand kits, kinetic type, edited stories, shot lists, manual-mode photos, and a working Android app.'],
  ['Can I take more than one course?', 'Yes. The six are designed to stack: design feeds motion, camera feeds cinematography, cinematography feeds editing.'],
  ['How do I join, and what does it cost?', "Email me with the course you're after and I'll reply with the current batches, format and fees."],
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
  const last = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
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
          x: () => -(track.scrollWidth - document.documentElement.clientWidth), ease: 'none',
          scrollTrigger: { trigger: '.h-wrap', start: 'top top', end: () => `+=${track.scrollWidth - document.documentElement.clientWidth}`, scrub: 0.6, pin: true, invalidateOnRefresh: true },
        });
      }

      // course rows stagger in
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((g) => gsap.from(g.children, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: g, start: 'top 85%' } }));

      // progress ring
      gsap.to('.prog circle.bar', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  const close = () => { setOpen(null); last.current?.focus(); };

  return (
    <div ref={root}>
      <div className="mesh" aria-hidden="true"><i /><i /></div>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <header className="bar">
        <a href="#top" className="logo" aria-label="Subham Dey, back to top">SD<span>●</span></a>
        <nav aria-label="Sections">
          <a href="#courses">Courses</a><a href="#who">Who it's for</a><a href="#studio">Studio</a><a href="#about">About</a><a href="#faq">FAQ</a>
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
            <div className="cards" data-stagger>
              {COURSES.map((c) => (
                <button key={c.key} className="card glass" style={{ '--c': c.color } as React.CSSProperties}
                  onClick={(e) => { last.current = e.currentTarget; setOpen(c); }} aria-haspopup="dialog">
                  <div className="top">
                    <div className="ic"><LoopPlayer component={MotifLoop} inputProps={{ kind: c.key, color: c.color }} width={260} height={260} frames={90} stillFrame={30} /></div>
                    <div><span className="mono">{c.num} · {c.label}</span><h3>{c.title}</h3></div>
                  </div>
                  <p>{c.short}</p>
                  <ul>{c.outcomes.slice(0, 3).map((o) => <li key={o}>{o}</li>)}</ul>
                  <div className="chips">{c.tools.slice(0, 4).map((t) => <span className="chip" key={t}>{t}</span>)}{c.tools.length > 4 && <span className="chip">+{c.tools.length - 4}</span>}</div>
                  <span className="more">Full syllabus ↗</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="who" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="mono">( 03 ) Who it's for</span>
              <h2 data-split><Split text="Built for" /><Split text="where you are." className="acc" /></h2>
            </div>
            <div className="who" data-stagger>
              {WHO.map(([t, d, ks]) => (
                <article className="glass" key={t}>
                  <span className="mono">{ks.map((k) => COURSES.find((c) => c.key === k)!.title).join(' · ')}</span>
                  <b>{t}</b><p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Toolbox">
          <div className="mq"><div className="mq-in">{[...TOOLS.slice(0, 14), ...TOOLS.slice(0, 14)].map((t, i) => <span key={i}>{t}</span>)}</div></div>
          <div className="mq rev"><div className="mq-in">{[...TOOLS.slice(14), ...TOOLS.slice(14)].map((t, i) => <span key={i}>{t}</span>)}</div></div>
        </section>

        <section className="h-wrap" aria-label="How I teach">
          <div className="h-track">
            <div className="h-intro">
              <span className="mono">( 04 ) Method</span>
              <h2 data-split><Split text="How I" /><Split text="teach." className="acc" /></h2>
            </div>
            {PRINCIPLES.map(([t, d], i) => (
              <article className="panel" key={t}>
                <span className="pn">0{i + 1}</span>
                <div className="pan-art"><LoopPlayer component={METHOD_SCENES[i]} width={480} height={360} frames={150} stillFrame={120} /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="block" id="studio">
          <div className="wrap studio">
            <div className="big glass" data-rise>
              <span className="mono">( 05 ) The studio</span>
              <h3>Blend Mode <span className="gt">Studio</span></h3>
              {/* TODO(Subham): add what Blend Mode makes (clients, formats, launch year) */}
              <p>Blend Mode is where I make and share work in public: design breakdowns, motion pieces and films on Instagram and YouTube. It's the same practice students learn from in class.</p>
              <div className="links">
                <a className="btn" href="https://www.instagram.com/blendmodestudio" target="_blank" rel="noopener"><span>Instagram</span><i>→</i></a>
                <a className="btn ghost" href="https://www.youtube.com/@blendmodestudioofficial" target="_blank" rel="noopener"><span>YouTube</span><i>→</i></a>
              </div>
            </div>
            <div className="side" data-stagger>
              <article className="glass"><span className="mono">Portfolio</span><b>Design work on Behance</b><p className="lead">Brand identities, posters and layouts.</p><a className="mono" href="https://www.behance.net/subhamdey4" target="_blank" rel="noopener">behance.net/subhamdey4 ↗</a></article>
              <article className="glass"><span className="mono">Network</span><b>Connect on LinkedIn</b><p className="lead">For collaborations, workshops and studio work.</p><a className="mono" href="https://www.linkedin.com/in/subhamdeyone" target="_blank" rel="noopener">linkedin.com/in/subhamdeyone ↗</a></article>
            </div>
          </div>
        </section>

        <section className="block" id="about" style={{ paddingTop: 0 }}>
          <div className="wrap about">
            <div className="badge" data-rise>
              {/* TODO(Subham): drop a square photo at public/assets/subham.jpg and it appears over the animated badge */}
              <LoopPlayer component={AboutBadge} width={600} height={600} frames={300} stillFrame={40} />
              <img src="/assets/subham.jpg" alt="Portrait of Subham Dey" onError={(e) => e.currentTarget.remove()} />
            </div>
            <div>
              <span className="mono">( 06 ) About</span>
              <h2 data-split><Split text="I don't just create." /><Split text="I teach others how to see." className="acc" /></h2>
              <p className="bio" data-rise>I'm a multidisciplinary creative and educator from Siliguri, West Bengal. My work lives where design, film and technology meet: brand identities, cinematic sequences, Android apps. I bring that real-world practice into every class, so students learn more than tools. They build taste.</p>
              <div data-rise>
                <LoopPlayer className="stats" component={StatsScene} inputProps={{ stats: STATS }} width={1200} height={380} frames={240} stillFrame={120}
                  label={STATS.map((s) => `${s.value} ${s.label}`).join(', ')} />
              </div>
            </div>
          </div>
        </section>

        <section className="block" id="faq" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="mono">( 07 ) FAQ</span>
              <h2 data-split><Split text="Good" /><Split text="questions." className="acc" /></h2>
            </div>
            <div className="faq" data-stagger>
              {FAQ.map(([q, a]) => <details className="glass" key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
          </div>
        </section>

        <section className="cta" id="contact">
          <div className="wrap">
            <span className="mono">( 08 ) Contact</span>
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

      {open && <CourseDialog course={open} onClose={close} />}
    </div>
  );
}
