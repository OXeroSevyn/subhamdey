// Renders the Remotion reel into ../assets/reel for the static site.
// Usage: npm run render   (set BROWSER=/path/to/chrome to use a local Chrome)
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const out = '../assets/reel';
mkdirSync(out, { recursive: true });
const browser = process.env.BROWSER ? ` --browser-executable=${process.env.BROWSER}` : '';
const run = (cmd) => execSync(cmd + browser, { stdio: 'inherit' });

run(`npx remotion render src/index.ts HeroReel ${out}/hero-reel.mp4 --codec=h264 --crf=26 --pixel-format=yuv420p`);
run(`npx remotion render src/index.ts HeroReel ${out}/hero-reel.webm --codec=vp9 --crf=36`);
run(`npx remotion still src/index.ts HeroReel ${out}/hero-reel-poster.jpg --frame=60 --image-format=jpeg --jpeg-quality=82`);
