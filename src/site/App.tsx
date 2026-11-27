import { useEffect, useRef, useState } from 'react';
import { HeroReel, REEL_DURATION } from '../HeroReel';
import { HeroScene } from '../scenes/HeroScene';
import { MotifLoop } from '../scenes/MotifLoop';
import { Orbit } from '../scenes/Orbit';
import { AboutBadge } from '../scenes/AboutBadge';
import { StatsScene, type Stat } from '../scenes/StatsScene';
import { ContactScene } from '../scenes/ContactScene';
import { C } from '../theme';
import { COURSES, type Course } from './courses';
import { LoopPlayer, reduceMotion } from './LoopPlayer';

const EMAIL = 'subhamdey.one@gmail.com';
const WORDS = COURSES.map((c) => c.title);

// TODO(Subham): add real proof here when ready, e.g. { value: 250, label: 'Students taught', color: C.t }
const STATS: Stat[] = [
  { value: 6, label: 'Courses', color: C.p2 },
  { value: 3, label: 'Worlds: design · film · code', color: C.s },
  { value: 'Blend Mode', label: 'Studio on IG & YT', color: C.t },
];

function useTypewriter() {
  const [text, setText] = useState(reduceMotion ? WORDS.join(' · ') : '');
  useEffect(() => {
    if (reduceMotion) return;
    let wi = 0, ci = 0, del = false, t: number;
    const tick = () => {
      const w = WORDS[wi];
      if (!del) {
        setText(w.slice(0, ++ci));
        if (ci === w.length) { del = true; t = window.setTimeout(tick, 1800); return; }
      } else {
        setText(w.slice(0, --ci));
        if (ci === 0) { del = false; wi = (wi + 1) % WORDS.length; t = window.setTimeout(tick, 400); return; }
      }
      t = window.setTimeout(tick, del ? 55 : 85);
    };
    t = window.setTimeout(tick, 1200);
    return () => clearTimeout(t);
  }, []);
  return text;
}

function useSiteEffects(setActive: (id: string) => void, setWide: (w: boolean) => void) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => io.observe(el));
    const onScroll = () => {
      setWide(window.scrollY > 80);
      let cur = '';
      document.querySelectorAll<HTMLElement>('section[id]').forEach((s) => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [setActive, setWide]);
}

const NAV = [['reel', 'Reel'], ['skills', 'Skills'], ['about', 'About'], ['teach', 'Courses']] as const;

function CourseModal({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!course) return;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); };
  }, [course, onClose]);
  if (!course) return <div className="modal-bd" />;
  return (
    <div className="modal-bd open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mct">
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="modal-iw" style={{ background: course.color + '22' }}><span>{course.icon}</span></div>
            <div>
              <div className="modal-cn">Course {course.num}</div>
              <div className="modal-ct" id="mct">{course.title}</div>
            </div>
          </div>
          <button className="modal-x" ref={closeBtn} onClick={onClose} aria-label="Close course details">✕</button>
        </div>
        <LoopPlayer className="modal-motif" component={MotifLoop} inputProps={{ kind: course.key, color: course.color }} width={520} height={520} frames={90} stillFrame={45} />
        <div className="modal-body">
          <div className="modal-tag" style={{ background: course.color + '22', color: course.color }}>{course.tag}</div>
          <p className="modal-sum">{course.summary}</p>
          <div className="m-block">
            <div className="m-ttl">🛠 Tools &amp; Software</div>
            <div className="m-chips">{course.tools.map((t) => <span className="m-chip" key={t}>{t}</span>)}</div>
          </div>
          <div className="m-block">
            <div className="m-ttl">🎯 What You'll Learn</div>
            <ul className="m-outs">{course.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
          <div className="m-block">
            <div className="m-ttl">👤 Who It's For</div>
            <p className="modal-sum">{course.audience}</p>
          </div>
        </div>
        <div className="modal-foot">
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(course.title + ' course')}`} className="m-btn">✉ Enroll / Enquire</a>
          <button className="m-btn2" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [active, setActive] = useState('');
  const [wide, setWide] = useState(false);
  const [open, setOpen] = useState<Course | null>(null);
  const lastCard = useRef<HTMLElement | null>(null);
  const typed = useTypewriter();
  useSiteEffects(setActive, setWide);

  const openCourse = (c: Course, el: HTMLElement) => { lastCard.current = el; setOpen(c); };
  const close = () => { setOpen(null); lastCard.current?.focus(); };

  return (
    <>
      <div id="aurora" aria-hidden="true">
        <div className="aura aura1" /><div className="aura aura2" /><div className="aura aura3" /><div className="aura aura4" />
      </div>
      <div className="grid-overlay" aria-hidden="true" />

      <nav id="nav" className={wide ? 'wide' : ''}>
        <a href="#hero" className="nav-brand" aria-label="Subham Dey, back to top">
          <div className="nav-av">SD</div>
          <span className="nav-name">Subham Dey</span>
        </a>
        <div className="nav-sep" />
        <ul className="nav-links">
          {NAV.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      <a href={`mailto:${EMAIL}`} className="fab" title="Email Subham" aria-label="Email Subham">✉</a>

      {/* HERO: live Remotion backdrop behind HTML text */}
      <section className="hero" id="hero">
        <div className="hero-bg"><LoopPlayer className="cover-169" component={HeroScene} width={1920} height={1080} frames={360} stillFrame={60} /></div>
        <div className="hero-badge"><span className="bdot" />Available for Courses &amp; Collabs — 2026</div>
        <h1 className="hero-title">
          <span className="l1">Hi, I'm</span>
          <span className="l2">Subham Dey</span>
        </h1>
        <p className="hero-tw">I teach <span id="tw">{typed}</span></p>
        <p className="hero-sub">Creative educator, designer &amp; filmmaker. I teach the <b>full visual stack</b> — from pixels and frames to motion and code — helping students find their creative voice.</p>
        <div className="hero-btns">
          <a href="#teach" className="btn-glow"><span>🎓 My Courses</span></a>
          <a href="#reel" className="btn-outline">▶ Watch the Reel</a>
        </div>
        <div className="hero-chips">
          {COURSES.map((c) => <span className="hchip" key={c.key}>{c.icon} {c.title}</span>)}
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].flatMap((r) => [...WORDS, 'Android Dev'].map((w) => (
            <span key={r + w}><span>{w}</span><span className="td"> ✦ </span></span>
          )))}
        </div>
      </div>

      {/* SHOWREEL: the full Remotion composition, scrubbable */}
      <section className="section" id="reel">
        <div className="reveal">
          <div className="eyebrow">▶ Showreel</div>
          <h2 className="s-head">Six Crafts, <span className="acc">One Reel</span></h2>
          <p className="s-sub">Fourteen seconds, every frame animated in code and rendered live in your browser. Scrub it, pause it, go fullscreen.</p>
        </div>
        <div className="reel-frame reveal">
          <LoopPlayer
            className="reel-player"
            component={HeroReel}
            width={1920}
            height={1080}
            frames={REEL_DURATION}
            stillFrame={60}
            controls
            label="Showreel: Subham Dey introduces six disciplines, graphic design, motion graphics, video editing, cinematography, camera handling and vibe coding."
          />
        </div>
        <div className="reel-meta">
          <span><b>Built with</b> React + Remotion · plays live, no video file</span>
          <span>Design · Motion · Code: <b>Subham Dey</b></span>
        </div>
      </section>

      {/* SKILLS: each card runs its own motif composition */}
      <section className="section" id="skills">
        <div className="reveal">
          <div className="eyebrow">⚡ Expertise</div>
          <h2 className="s-head">What I <span className="acc">Create</span></h2>
          <p className="s-sub">A multidisciplinary skill set spanning design, film, and technology — built through real-world practice.</p>
        </div>
        <div className="bento">
          {COURSES.map((c, i) => (
            <div className={`bc bc${i + 1} reveal`} key={c.key}>
              <LoopPlayer className="bc-motif" component={MotifLoop} inputProps={{ kind: c.key, color: c.color }} width={520} height={520} frames={90} stillFrame={45} />
              <span className="bc-num">{c.num}</span>
              <div className="bc-tag">{c.skillTag}</div>
              <div className="bc-title">{c.key === 'code' ? 'Vibe Coding — Android' : c.title}</div>
              <div className="bc-desc">{c.skill}</div>
            </div>
          ))}
          <div className="bc bc7 reveal">
            <LoopPlayer className="bc-motif bc-orbit" component={Orbit} inputProps={{ radius: 330, size: 70 }} width={900} height={500} frames={300} stillFrame={20} />
            <div className="bc-tag">Education</div>
            <div className="bc-title">Teaching All 6</div>
            <div className="bc-desc">Every skill is also a course. Scroll down to explore the full curriculum and start your creative journey.</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-full" id="about">
        <div className="inner">
          <div className="reveal">
            <div className="eyebrow">👋 About Me</div>
            <h2 className="s-head">The Person <span className="acc">Behind the Work</span></h2>
          </div>
          <div className="about-wrap">
            <div className="glass reveal-l">
              {/* TODO(Subham): drop a square photo at public/assets/subham.jpg and it shows over the animated badge */}
              <div className="about-badge">
                <LoopPlayer component={AboutBadge} width={600} height={600} frames={300} stillFrame={40} />
                <img src="/assets/subham.jpg" alt="Portrait of Subham Dey" onError={(e) => e.currentTarget.remove()} />
              </div>
              <div className="glass-quote">"I don't just create —<br />I teach others <span className="hl">how to see.</span>"</div>
              <p className="glass-body">I'm Subham Dey — a multidisciplinary creative professional and passionate educator from Siliguri, West Bengal. My work lives at the crossroads of design, film, and technology, and I bring that real-world experience into every class I teach.</p>
            </div>
            <div className="about-right reveal-r">
              <LoopPlayer className="stats-player" component={StatsScene} inputProps={{ stats: STATS }} width={1200} height={380} frames={240} stillFrame={120}
                label={STATS.map((s) => `${s.value} ${s.label}`).join(', ')} />
              <p className="about-text">From crafting compelling <b>brand identities</b> to directing <b>cinematic sequences</b> and shipping <b>Android apps</b> — I bring genuine expertise to every subject I teach. My goal is to help students not just learn tools, but develop a real creative voice.</p>
              <div className="tags">
                {['🎨 Designer', '🎬 Filmmaker', '📱 Developer', '🎓 Educator', '📍 Siliguri, WB', '🇮🇳 India'].map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            </div>
          </div>
          <div className="principles">
            {[
              ['Learn by making', 'Every class ends with something real: a poster, a cut, a shot list, an app on your phone.'],
              ['Real tools, real briefs', 'The same software and workflow I use on client and studio work, not toy versions of it.'],
              ['Find your voice', "Tools change every year. Taste and the way you see don't, so that's what we train."],
            ].map(([t, d], i) => (
              <div className="pr reveal" key={t}>
                <div className="pr-n">HOW I TEACH · 0{i + 1}</div>
                <div className="pr-t">{t}</div>
                <p className="pr-d">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section" id="teach">
        <div className="reveal">
          <div className="eyebrow">🎓 Curriculum</div>
          <h2 className="s-head">What I <span className="acc">Teach</span></h2>
          <p className="s-sub">Six disciplines, one educator. Open any card to watch its motion lesson and see the full curriculum, tools, and outcomes.</p>
        </div>
        <div className="teach-grid">
          {COURSES.map((c, i) => (
            <div
              key={c.key}
              className={`tc tc${i + 1} reveal`}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`Open ${c.title} course details`}
              onClick={(e) => openCourse(c, e.currentTarget)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCourse(c, e.currentTarget); } }}
            >
              <span className="tc-num">Course {c.num}</span><span className="tc-ico">{c.icon}</span>
              <div className="tc-name">{c.title}</div>
              <p className="tc-desc">{c.short}</p><span className="tc-lbl">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT: Remotion paper plane + sonar rings behind */}
      <section className="section" id="contact">
        <div className="contact-wrap reveal">
          <div className="contact-bg"><LoopPlayer className="cover-169" component={ContactScene} width={1600} height={900} frames={300} stillFrame={70} /></div>
          <div className="c-eye">✉ Get in Touch</div>
          <h2 className="c-title">Ready to Learn<br />Together?</h2>
          <p className="c-sub">Reach out for courses, collaborations, freelance projects, or just to say hi. Always happy to connect with fellow creatives.</p>
          <a href={`mailto:${EMAIL}`} className="c-btn">✉ {EMAIL}</a>
        </div>
      </section>

      <footer>
        <p>© 2026 Subham Dey — Creative Educator · Siliguri, WB</p>
        <div className="fsocs">
          {[
            ['https://www.instagram.com/blendmodestudio', 'Instagram', 'Ig'],
            ['https://www.youtube.com/@blendmodestudioofficial', 'YouTube', 'Yt'],
            ['https://www.linkedin.com/in/subhamdeyone', 'LinkedIn', 'In'],
            ['https://www.behance.net/subhamdey4', 'Behance', 'Bē'],
          ].map(([href, label, short]) => (
            <a key={label} href={href} target="_blank" rel="noopener" className="fsoc" aria-label={label}>{short}</a>
          ))}
        </div>
      </footer>

      <CourseModal course={open} onClose={close} />
    </>
  );
}
