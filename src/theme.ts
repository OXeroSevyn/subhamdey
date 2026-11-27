import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// "Studio paper" palette: warm paper, ink, one hot signal orange and a cobalt blue.
// The site CSS (src/site/site.css) uses the same tokens.
export const C = {
  bg: '#f3efe6',
  ink: '#121212',
  p: '#2b4dff', // cobalt
  p2: '#2b4dff',
  s: '#ff4d1c', // signal orange
  t: '#0f9e9e',
  g1: '#7b3cff',
  g2: '#ff3d8b',
  green: '#1f9d55',
  text: '#121212',
  muted: 'rgba(18,18,18,0.55)',
  line: 'rgba(18,18,18,0.14)',
};

// Fonts are vendored in public/fonts (latin subset) so renders work offline.
export const DISPLAY = 'Space Grotesk';
export const BODY = 'Space Grotesk';
export const SERIF = 'Instrument Serif';
export const MONO = 'JetBrains Mono';
loadFont({ family: DISPLAY, url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' });
loadFont({ family: SERIF, url: staticFile('fonts/InstrumentSerif.woff2') });
loadFont({ family: SERIF, url: staticFile('fonts/InstrumentSerif-Italic.woff2'), style: 'italic' });
loadFont({ family: MONO, url: staticFile('fonts/JetBrainsMono.woff2'), weight: '400 700' });
