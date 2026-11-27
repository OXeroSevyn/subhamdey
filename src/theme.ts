import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Same palette + type as index.html so the reel feels native to the site.
export const C = {
  bg: '#050510',
  p: '#6366f1',
  p2: '#818cf8',
  s: '#f97316',
  t: '#06b6d4',
  g1: '#a855f7',
  g2: '#ec4899',
  green: '#10b981',
  text: '#f1f0ff',
  muted: 'rgba(241,240,255,0.55)',
};

// Fonts are vendored in public/fonts (variable woff2, latin subset) so renders work offline.
export const DISPLAY = 'Unbounded';
export const BODY = 'Plus Jakarta Sans';
loadFont({ family: DISPLAY, url: staticFile('fonts/Unbounded.woff2'), weight: '200 900' });
loadFont({ family: BODY, url: staticFile('fonts/PlusJakartaSans.woff2'), weight: '200 800' });
