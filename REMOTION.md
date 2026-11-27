# Hero reel (Remotion)

Motion graphics for the site's Showreel section, written in React with [Remotion](https://www.remotion.dev).
The site itself stays a static `index.html`; this folder only produces the files in `public/assets/reel/`.
Vercel ignores this folder (see `../.vercelignore`).

```bash
cd remotion
npm install
npm run studio   # live preview + timeline in the browser
npm run render   # writes hero-reel.mp4, hero-reel.webm, hero-reel-poster.jpg into ../assets/reel
```

Edit `src/HeroReel.tsx` (scenes, timing, copy) and `src/motifs/Motifs.tsx` (one mini animation per course).
Colours and fonts in `src/theme.ts` match the site. Remotion is free for individuals; check their license if a company with 4+ people uses it.
