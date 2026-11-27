import { C } from '../theme';
import type { MotifKind } from '../scenes/MotifLoop';

export type Course = {
  key: MotifKind; num: string; icon: string; title: string; short: string; label: string; color: string; tag: string;
  summary: string; tools: string[]; outcomes: string[]; audience: string; skill: string; skillTag: string;
};

export const COURSES: Course[] = [
  {
    key: 'design', num: '01', icon: '🎨', title: 'Graphic Design', color: C.p, tag: 'Design Thinking', label: 'Design Thinking', skillTag: 'Visual Design',
    skill: 'Crafting visual identities, brand systems, typography layouts, and print collateral that communicate with clarity and character.',
    short: 'Typography, layout, color theory, logo design, and brand systems. Think visually and design with intention.',
    summary: "From design fundamentals to professional-level visual work. You'll develop an eye for composition, hierarchy, and visual communication that sets great design apart.",
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'],
    outcomes: ['Master typography rules, font pairing, and hierarchy', 'Understand color theory, contrast, and brand palettes', 'Create logos, posters, social media graphics, and brand kits', 'Build professional mood boards and design presentations', 'Learn grid systems, layouts, and spatial composition', 'Develop your own design process from brief to final output'],
    audience: 'Perfect for beginners, aspiring designers, content creators, entrepreneurs, and anyone who wants to communicate visually. No prior experience needed.',
  },
  {
    key: 'motion', num: '02', icon: '✨', title: 'Motion Graphics', color: C.s, tag: 'After Effects', label: 'After Effects', skillTag: 'Animation',
    skill: 'Bringing ideas to life through keyframing, kinetic type, and expressive motion design.',
    short: 'Keyframing, animation principles, kinetic typography, and motion design using After Effects and industry tools.',
    summary: "Bring static visuals to life with animation. From timing and easing curves to complex animated sequences. You'll create work that moves, feels alive, and communicates dynamically.",
    tools: ['Adobe After Effects', 'Adobe Premiere', 'Blender (basics)', 'LottieFiles', 'MotionBro'],
    outcomes: ['Understand the 12 principles of animation', 'Animate text, shapes, logos, and icons with precision', 'Work with keyframes, easing, and the graph editor', 'Build kinetic typography sequences', 'Create lower thirds, title cards, and broadcast graphics', 'Export animations for social media, web, and presentations'],
    audience: 'Ideal for graphic designers wanting to add motion, video editors looking to level up, and content creators who want eye-catching animated visuals.',
  },
  {
    key: 'edit', num: '03', icon: '🎬', title: 'Video Editing', color: C.t, tag: 'Premiere / DaVinci', label: 'Premiere / DaVinci', skillTag: 'Post Production',
    skill: 'Cutting, color grading, and shaping raw footage into compelling narratives.',
    short: 'Cuts, transitions, color grading, audio sync, and narrative pacing — shaping footage into professional stories.',
    summary: 'Editing is storytelling. Shape raw footage into compelling narratives through pacing, rhythm, transitions, color grading, and audio design.',
    tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Audition'],
    outcomes: ['Set up professional editing timelines and workflows', 'Cut for narrative pacing, emotion, and rhythm', 'Apply color correction and cinematic color grading', 'Mix and balance audio, dialogue, music, and SFX', 'Use transitions, effects, and overlays purposefully', 'Export optimized files for YouTube, Instagram, and client delivery'],
    audience: 'Great for aspiring video editors, YouTubers, social media managers, filmmakers, and anyone who wants to tell compelling stories through video.',
  },
  {
    key: 'cine', num: '04', icon: '🎥', title: 'Cinematography', color: C.green, tag: 'Visual Storytelling', label: 'Visual Storytelling', skillTag: 'Filmmaking',
    skill: 'Composition, lighting, and visual storytelling through the lens.',
    short: 'Composition, lighting, shot language, and visual storytelling. Learn to see like a director of photography.',
    summary: 'Cinematography is about seeing the world intentionally — crafting images with composition, light, movement, and lens choices that serve the story.',
    tools: ['DSLR & Mirrorless Cameras', 'Tripods & Gimbals', 'LED Lighting Kits', 'Lens Selection', 'ND Filters'],
    outcomes: ['Apply composition rules — rule of thirds, leading lines, depth', 'Understand and use natural and artificial lighting setups', 'Choose the right lens focal length for each shot', 'Design shot lists and storyboards', 'Execute camera movements — pans, tilts, tracking, handheld', 'Develop a visual language and consistent cinematic style'],
    audience: 'For aspiring filmmakers, YouTubers, social media creators, documentary makers, and anyone who wants to shoot footage that genuinely looks cinematic.',
  },
  {
    key: 'camera', num: '05', icon: '📷', title: 'Camera Handling', color: '#fb7185', tag: 'DSLR & Mirrorless', label: 'DSLR & Mirrorless', skillTag: 'Technical',
    skill: 'Mastering DSLR, mirrorless, and cinema cameras for precision and creative capture.',
    short: 'Exposure, focus, white balance, and full manual technique across DSLR, mirrorless, and cinema cameras.',
    summary: 'Know your camera deeply. Cut through menus and technical jargon to get confident, practical control over any camera — shooting full manual by the end.',
    tools: ['DSLR Cameras (Canon, Nikon)', 'Mirrorless Cameras (Sony, Fuji)', 'Memory Cards & Storage', 'Lens Filters', 'Camera Accessories'],
    outcomes: ['Fully understand the exposure triangle: ISO, shutter speed, aperture', 'Shoot confidently in Manual, Aperture Priority, Shutter Priority', 'Master auto and manual focus systems', 'Set white balance accurately in any lighting condition', 'Choose and switch lenses for different creative purposes', 'Maintain and care for camera equipment properly'],
    audience: 'Perfect for beginners who just got their first camera, hobbyist photographers wanting more control, and anyone shooting in Auto who wants to go full Manual.',
  },
  {
    key: 'code', num: '06', icon: '📱', title: 'Vibe Coding', color: C.g1, tag: 'Android Development', label: 'Android Dev', skillTag: 'Development',
    skill: 'Building real Android apps with a creative-first, intuitive approach. No CS degree required.',
    short: 'Android App Development with a creative-first mindset. Build real, functional apps — no CS degree needed.',
    summary: 'A creative-first approach to Android development — building real, functional, beautiful apps without getting lost in CS theory. Zero to shipping your first app.',
    tools: ['Android Studio', 'Kotlin', 'Jetpack Compose', 'Flutter', 'Firebase', 'Supabase', 'Google Antigravity', 'Cursor', 'Claude', 'Google Play Console'],
    outcomes: ['Set up Android Studio and understand the project structure', 'Build UI layouts using Jetpack Compose or XML', 'Handle user interactions, navigation, and screen flows', 'Connect apps to real data using Firebase or Supabase', 'Debug, test, and fix common app issues', 'Prepare and publish your app to the Google Play Store'],
    audience: 'Designed for creatives, designers, and entrepreneurs with no coding background. Also great for students looking for a fun entry point into mobile development.',
  },
];
