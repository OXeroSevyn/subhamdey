// The site plays the compositions live with @remotion/player, so the only file we
// render is the social-share poster. Usage: npm run render  (BROWSER=/path/to/chrome optional)
import { execSync } from 'node:child_process';

const browser = process.env.BROWSER ? ` --browser-executable=${process.env.BROWSER}` : '';
execSync(`npx remotion still src/remotion-entry.ts HeroReel public/assets/reel/hero-reel-poster.jpg --frame=60 --image-format=jpeg --jpeg-quality=82${browser}`, { stdio: 'inherit' });
// Want an mp4 too?  npx remotion render src/remotion-entry.ts HeroReel out/hero-reel.mp4
