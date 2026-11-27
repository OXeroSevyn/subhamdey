import { useEffect, useState } from 'react';
import { HeroReel, REEL_DURATION } from '../HeroReel';
import { Viewfinder, VIEWFINDER_FRAMES } from '../scenes/Viewfinder';
import { MotifLoop } from '../scenes/MotifLoop';
import { AboutBadge } from '../scenes/AboutBadge';
import { StatsScene, type Stat } from '../scenes/StatsScene';
import { ContactScene } from '../scenes/ContactScene';
import { C } from '../theme';
import { COURSES } from './courses';
import { LoopPlayer } from './LoopPlayer';

const EMAIL = 'subhamdey.one@gmail.com';

// TODO(Subham): add real proof when ready, e.g. { value: 250, label: 'Students taught', color: C.s }
const STATS: Stat[] = [
  { value: 6, label: 'Courses', color: C.ink },
  { value: 3, label: 'Design · Film · Code', color: C.s },
  { value: 'Blend Mode', label: 'Studio on IG & YT', color: C.p },
];

const NAV = [
  ['reel', '01', 'Reel'],
  ['courses', '02', 'Courses'],
  ['about', '03', 'About'],
  ['contact', '04', 'Contact'],
] as const;

function useClock() {
  const fmt = () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 15000); return () => clearInterval(id); }, []);
  return t;
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

function Chapter({ id, n, title, sub, children }: { id: string; n: string; title: React.ReactNode; sub?: string; children: React.ReactNode }) {
  return (
    <section className="chapter" id={id}>
      <div className="wrap">
        <div className="ch-head reveal">
          <span className="mono ch-num">({n}) — {id}</span>
          <h2>{title}</h2>
          {sub && <p className="ch-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function App() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const clock = useClock();
  useReveal(setActive);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <a href="#top" className="brand" aria-label="Subham Dey, back to top"><span className="mark">SD</span><span>Subham Dey</span></a>
          <nav aria-label="Sections">
            {NAV.map(([id, n, label]) => (
              <a key={id} href={`#${id}`} className={`mono ${active === id ? 'on' : ''}`}><b>{n}</b>{label}</a>
            ))}
          </nav>
          <span className="clock mono"><span className="dot" />Siliguri {clock} IST</span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="reveal">
              <p className="kicker mono">Creative educator · Siliguri, India · 2026</p>
              <h1>I teach people<br />how to <em>see.</em></h1>
              <p className="lede">I'm <b>Subham Dey</b>, a designer, filmmaker and developer. I teach the full visual stack, from pixels and frames to motion and code, so students find a creative voice of their own.</p>
              <div className="ctas">
                <a href="#courses" className="btn solid">See the six courses →</a>
                <a href="#reel" className="btn">▶ Play the reel</a>
              </div>
            </div>
            <div className="reveal">
              <LoopPlayer className="vf" component={Viewfinder} width={1200} height={1500} frames={VIEWFINDER_FRAMES} stillFrame={40}
                label="Camera viewfinder cycling through six course animations" />
              <div className="vf-cap mono"><span>Fig. 1 — Six takes</span><span>Live · Remotion</span></div>
            </div>
          </div>
          <div className="wrap">
            <div className="crafts mono">{COURSES.map((c) => <span key={c.key}>{c.title}</span>)}</div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].flatMap((r) => [...COURSES.map((c) => c.title), 'Android Dev'].map((w) => (
              <span key={r + w}>{w} <i>✺</i></span>
            )))}
          </div>
        </div>

        <Chapter id="reel" n="01" title={<>Six crafts, <em>one reel.</em></>} sub="Fourteen seconds, every frame drawn in code and playing live in your browser. Scrub it, pause it, go fullscreen.">
          <div className="reel reveal">
            <LoopPlayer component={HeroReel} width={1920} height={1080} frames={REEL_DURATION} stillFrame={60} controls
              label="Showreel: Subham Dey introduces six disciplines, graphic design, motion graphics, video editing, cinematography, camera handling and vibe coding." />
          </div>
          <div className="reel-meta mono"><span>Built with React + Remotion</span><span>Design · Motion · Code — S. Dey</span></div>
        </Chapter>

        <Chapter id="courses" n="02" title={<>The <em>index.</em></>} sub="Six disciplines, one educator. Open a course to watch its motion lesson and see the tools, outcomes and who it's for.">
          <div className="index reveal">
            {COURSES.map((c) => {
              const isOpen = open === c.key;
              return (
                <div key={c.key} className={`row ${isOpen ? 'open' : ''}`} style={{ '--c': c.color } as React.CSSProperties}>
                  <button className="row-btn" aria-expanded={isOpen} aria-controls={`course-${c.key}`} onClick={() => setOpen(isOpen ? null : c.key)}>
                    <span className="row-n mono">{c.num}</span>
                    <span className="row-t">{c.title}</span>
                    <span className="row-tag mono">{c.label}</span>
                    <span className="row-x" aria-hidden="true">+</span>
                  </button>
                  <div className="row-body" id={`course-${c.key}`} role="region" aria-label={`${c.title} details`}>
                    <div>
                      {isOpen && (
                        <div className="row-inner">
                          <div>
                            <LoopPlayer className="lesson" component={MotifLoop} inputProps={{ kind: c.key, color: c.color }} width={520} height={520} frames={90} stillFrame={45} />
                            <p className="lesson-cap mono">Lesson {c.num} — in motion</p>
                          </div>
                          <div>
                            <h3>Overview</h3>
                            <p className="sum">{c.summary}</p>
                            <h3>Tools</h3>
                            <div className="chips">{c.tools.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                            <h3>You'll learn</h3>
                            <ul className="outs">{c.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
                            <h3>Who it's for</h3>
                            <p>{c.audience}</p>
                            <a className="btn solid" href={`mailto:${EMAIL}?subject=${encodeURIComponent(c.title + ' course')}`}>Enquire about {c.title} →</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Chapter>

        <Chapter id="about" n="03" title={<>The person <em>behind</em> the work.</>}>
          <div className="about">
            <div className="reveal">
              {/* TODO(Subham): drop a square photo at public/assets/subham.jpg and it appears over the animated badge */}
              <div className="badge">
                <LoopPlayer component={AboutBadge} width={600} height={600} frames={300} stillFrame={40} />
                <img src="/assets/subham.jpg" alt="Portrait of Subham Dey" onError={(e) => e.currentTarget.remove()} />
              </div>
            </div>
            <div className="reveal">
              <p className="quote">"I don't just create. I teach others <em>how to see.</em>"</p>
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
              <div className="pr reveal" key={t}>
                <span className="mono">How I teach — 0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Chapter>

        <section className="contact" id="contact">
          <div className="contact-bg" aria-hidden="true"><LoopPlayer component={ContactScene} width={1600} height={900} frames={300} stillFrame={70} /></div>
          <div className="wrap reveal">
            <p className="mono">(04) — Contact</p>
            <h2>Let's make<br />something <em>move.</em></h2>
            <a className="mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
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
        <div className="wrap mono"><span>© 2026 Subham Dey — Creative Educator</span><span>Animated with Remotion</span></div>
      </footer>
    </>
  );
}
