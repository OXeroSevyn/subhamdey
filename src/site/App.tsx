import { useEffect, useRef, useState } from 'react';
import { HeroReel, REEL_DURATION } from '../HeroReel';
import { MotifLoop } from '../scenes/MotifLoop';
import { AboutBadge } from '../scenes/AboutBadge';
import { StatsScene, type Stat } from '../scenes/StatsScene';
import { ContactScene } from '../scenes/ContactScene';
import { C } from '../theme';
import { COURSES, type Course } from './courses';
import { LoopPlayer, reduceMotion } from './LoopPlayer';
import { Galaxy } from './Galaxy';

const EMAIL = 'subhamdey.one@gmail.com';
const WORDS = COURSES.map((c) => c.title);

// TODO(Subham): add real proof when ready, e.g. { value: 250, label: 'Students taught', color: C.s }
const STATS: Stat[] = [
  { value: 6, label: 'Courses', color: C.p2 },
  { value: 3, label: 'Design · Film · Code', color: C.g2 },
  { value: 'Blend Mode', label: 'Studio on IG & YT', color: C.s },
];
const NAV = [['reel', 'Reel'], ['courses', 'Courses'], ['about', 'About']] as const;

function useTypewriter() {
  const [text, setText] = useState(reduceMotion ? WORDS[0] : '');
  useEffect(() => {
    if (reduceMotion) return;
    let wi = 0, ci = 0, del = false, t = 0;
    const tick = () => {
      const w = WORDS[wi];
      if (!del) { setText(w.slice(0, ++ci)); if (ci === w.length) { del = true; t = window.setTimeout(tick, 1700); return; } }
      else { setText(w.slice(0, --ci)); if (ci === 0) { del = false; wi = (wi + 1) % WORDS.length; t = window.setTimeout(tick, 350); return; } }
      t = window.setTimeout(tick, del ? 45 : 80);
    };
    t = window.setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, []);
  return text;
}

function useReveal(setActive: (s: string) => void) {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    const spy = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((el) => spy.observe(el));
    return () => { io.disconnect(); spy.disconnect(); };
  }, [setActive]);
}

// pointer spotlight on cards
const spot = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

function CourseDialog({ course, onClose }: { course: Course; onClose: () => void }) {
  const x = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    x.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); };
  }, [onClose]);
  return (
    <div className="dlg-bd" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dlg glass" role="dialog" aria-modal="true" aria-labelledby="dlg-t" style={{ '--c': course.color } as React.CSSProperties}>
        <button className="x" ref={x} onClick={onClose} aria-label="Close course details">✕</button>
        <div>
          <LoopPlayer className="art" component={MotifLoop} inputProps={{ kind: course.key, color: course.color }} width={520} height={520} frames={90} stillFrame={45} />
        </div>
        <div>
          <span className="mono" style={{ color: course.color }}>Course {course.num}</span>
          <h3 id="dlg-t">{course.title}</h3>
          <span className="tag">{course.tag}</span>
          <h4>Overview</h4><p>{course.summary}</p>
          <h4>Tools</h4><div className="chips">{course.tools.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
          <h4>You'll learn</h4><ul className="outs">{course.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          <h4>Who it's for</h4><p>{course.audience}</p>
          <a className="btn prime" href={`mailto:${EMAIL}?subject=${encodeURIComponent(course.title + ' course')}`}>Enquire about {course.title} →</a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState<Course | null>(null);
  const last = useRef<HTMLElement | null>(null);
  const typed = useTypewriter();
  useReveal(setActive);
  const close = () => { setOpen(null); last.current?.focus(); };

  return (
    <>
      <Galaxy />

      <nav className="nav glass" aria-label="Sections">
        <a href="#top" className="brand" aria-label="Subham Dey, back to top">SD</a>
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className={`link ${active === id ? 'on' : ''}`}>{label}</a>)}
        <a href="#contact" className="link cta">Contact</a>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <span className="pill mono reveal"><span className="pulse" />Open for courses & collabs · 2026</span>
            <h1 className="reveal"><span>Subham</span><span className="grad">Dey.</span></h1>
            <p className="typed reveal">I teach <b>{typed}</b><span className="caret" aria-hidden="true" /></p>
            <p className="lede reveal">Creative educator, designer and filmmaker from Siliguri, India. I teach the full visual stack, from pixels and frames to motion and code, so you can find a creative voice of your own.</p>
            <div className="ctas reveal">
              <a href="#courses" className="btn prime">Explore the courses →</a>
              <a href="#reel" className="btn">▶ Watch the reel</a>
            </div>
          </div>
          <div className="hint mono" aria-hidden="true">Scroll to fly<i /></div>
        </section>

        <section className="block" id="reel">
          <div className="wrap">
            <div className="head reveal">
              <span className="mono">01 · Showreel</span>
              <h2>Six crafts. <span className="grad">One reel.</span></h2>
              <p>Fourteen seconds, every frame animated in code with Remotion and playing live in your browser. Scrub it, pause it, go fullscreen.</p>
            </div>
            <div className="reel glass reveal">
              <LoopPlayer component={HeroReel} width={1920} height={1080} frames={REEL_DURATION} stillFrame={60} controls
                label="Showreel: Subham Dey introduces six disciplines, graphic design, motion graphics, video editing, cinematography, camera handling and vibe coding." />
            </div>
            <div className="reel-meta mono reveal"><span>React · Remotion · Three.js</span><span>Design · Motion · Code — Subham Dey</span></div>
          </div>
        </section>

        <section className="block" id="courses">
          <div className="wrap">
            <div className="head reveal">
              <span className="mono">02 · Courses</span>
              <h2>Six disciplines, <span className="grad">one educator.</span></h2>
              <p>Every skill I practise is a course you can take. Open one to see its motion lesson, tools and outcomes.</p>
            </div>
            <div className="grid">
              {COURSES.map((c) => (
                <button key={c.key} className="card glass reveal" style={{ '--c': c.color } as React.CSSProperties} onPointerMove={spot}
                  onClick={(e) => { last.current = e.currentTarget; setOpen(c); }} aria-haspopup="dialog">
                  <LoopPlayer className="art" component={MotifLoop} inputProps={{ kind: c.key, color: c.color }} width={520} height={520} frames={90} stillFrame={45} />
                  <span className="num mono">Course {c.num} · {c.label}</span>
                  <h3>{c.title}</h3>
                  <p>{c.short}</p>
                  <span className="go">View curriculum →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="about">
          <div className="wrap">
            <div className="head reveal">
              <span className="mono">03 · About</span>
              <h2>The person <span className="grad">behind the work.</span></h2>
            </div>
            <div className="about glass reveal">
              {/* TODO(Subham): drop a square photo at public/assets/subham.jpg and it appears over the animated badge */}
              <div className="badge">
                <LoopPlayer component={AboutBadge} width={600} height={600} frames={300} stillFrame={40} />
                <img src="/assets/subham.jpg" alt="Portrait of Subham Dey" onError={(e) => e.currentTarget.remove()} />
              </div>
              <div>
                <p className="quote">"I don't just create. I teach others <span className="grad">how to see.</span>"</p>
                <p className="bio">I'm a multidisciplinary creative and educator from Siliguri, West Bengal. My work lives where <b>design</b>, <b>film</b> and <b>technology</b> meet: brand identities, cinematic sequences, Android apps. I bring that real-world practice into every class, so students learn more than tools. They build taste.</p>
                <LoopPlayer className="stats" component={StatsScene} inputProps={{ stats: STATS }} width={1200} height={380} frames={240} stillFrame={120}
                  label={STATS.map((s) => `${s.value} ${s.label}`).join(', ')} />
                <div className="tags mono">{['Designer', 'Filmmaker', 'Developer', 'Educator', 'Siliguri, WB', 'India'].map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </div>
            <div className="principles">
              {[
                ['Learn by making', 'Every class ends with something real: a poster, a cut, a shot list, an app on your phone.'],
                ['Real tools, real briefs', 'The same software and workflow I use on client and studio work, not toy versions of it.'],
                ['Find your voice', "Tools change every year. Taste and the way you see don't, so that's what we train."],
              ].map(([t, d], i) => (
                <div className="pr glass reveal" key={t}>
                  <span className="mono">How I teach · 0{i + 1}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-bg" aria-hidden="true"><LoopPlayer component={ContactScene} width={1600} height={900} frames={300} stillFrame={70} /></div>
          <div className="wrap reveal">
            <span className="mono" style={{ color: 'var(--cyan)' }}>04 · Contact</span>
            <h2>Let's make<br /><span className="grad">something move.</span></h2>
            <p>Courses, collaborations, freelance projects, or just to say hi. Always happy to connect with fellow creatives.</p>
            <a className="btn prime" href={`mailto:${EMAIL}`}>✉ {EMAIL}</a>
            <div className="socials mono">
              {[
                ['https://www.instagram.com/blendmodestudio', 'Instagram'],
                ['https://www.youtube.com/@blendmodestudioofficial', 'YouTube'],
                ['https://www.linkedin.com/in/subhamdeyone', 'LinkedIn'],
                ['https://www.behance.net/subhamdey4', 'Behance'],
              ].map(([href, label]) => <a key={label} href={href} target="_blank" rel="noopener">{label} ↗</a>)}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap mono"><span>© 2026 Subham Dey — Creative Educator</span><span>Three.js galaxy · Remotion motion</span></div>
      </footer>

      {open && <CourseDialog course={open} onClose={close} />}
    </>
  );
}
