import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// "Deep space" palette shared by the Remotion scenes and the site CSS (src/site/site.css).
export const C = {
  bg: '#05060f',
  ink: '#05060f',
  p: '#4361ee', // nebula blue
  p2: '#7b8cff',
  s: '#4cc9f0', // cyan
  t: '#2ec4b6',
  g1: '#9d4edd', // violet
  g2: '#f72585', // magenta
  green: '#38d39f',
  text: '#eef0ff',
  muted: 'rgba(238,240,255,0.6)',
  line: 'rgba(238,240,255,0.16)',
};

// Fonts are vendored in public/fonts (latin subset) so renders work offline.
export const DISPLAY = 'DM Sans';
export const BODY = 'DM Sans';
export const SERIF = 'DM Sans';
export const MONO = 'JetBrains Mono';
loadFont({ family: DISPLAY, url: staticFile('fonts/DMSans.woff2'), weight: '300 700' });
loadFont({ family: MONO, url: staticFile('fonts/JetBrainsMono.woff2'), weight: '400 700' });
