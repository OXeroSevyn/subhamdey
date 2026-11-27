import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { reduceMotion } from './LoopPlayer';

// Fixed, full-screen Three.js spiral galaxy behind the whole site.
// Scroll flies the camera from a low edge-on view to a high top-down view;
// the mouse adds parallax. Freezes on one frame for reduced-motion visitors.
const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute vec3 aRandom;
  varying vec3 vColor;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    // differential rotation: inner stars orbit faster than outer ones
    float angle = atan(world.x, world.z);
    float dist = length(world.xz);
    angle += (1.0 / (dist + 0.6)) * uTime * 0.35;
    world.x = cos(angle) * dist;
    world.z = sin(angle) * dist;
    world.xyz += aRandom;
    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -view.z);
    vColor = color;
  }
`;
const FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(1.0 - d, 8.0);
    gl_FragColor = vec4(vColor * strength, 1.0);
  }
`;

export function Galaxy() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const small = window.innerWidth < 700;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    const pr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#05060f');
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

    // ── galaxy ──
    const count = small ? 45000 : 110000;
    const radius = 6;
    const branches = 4;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const inside = new THREE.Color('#ffd7f0');
    const mid = new THREE.Color('#9d4edd');
    const outside = new THREE.Color('#4cc9f0');
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      pos[i * 3] = Math.cos(branch) * r;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(branch) * r;
      const spread = 0.35 * (r + 0.4);
      const rand = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;
      rnd[i * 3] = rand();
      rnd[i * 3 + 1] = rand() * 0.35;
      rnd[i * 3 + 2] = rand();
      const t = r / radius;
      if (t < 0.35) tmp.copy(inside).lerp(mid, t / 0.35);
      else tmp.copy(mid).lerp(outside, (t - 0.35) / 0.65);
      col.set([tmp.r, tmp.g, tmp.b], i * 3);
      scale[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(rnd, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: { uTime: { value: 0 }, uSize: { value: small ? 26 : 32 }, uPixelRatio: { value: pr } },
    });
    const galaxy = new THREE.Points(geo, mat);
    scene.add(galaxy);

    // ── background stars ──
    const sCount = 4000;
    const sPos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(25 + Math.random() * 30);
      sPos.set([v.x, v.y, v.z], i * 3);
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.08, color: '#c9d1ff', transparent: true, opacity: 0.8, depthWrite: false }));
    scene.add(stars);

    // ── interaction ──
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth - 0.5; mouse.ty = e.clientY / window.innerHeight - 0.5; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    let progress = 0;
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const onVis = () => { visible = document.visibilityState === 'visible'; if (visible) loop(); };
    document.addEventListener('visibilitychange', onVis);

    const place = (t: number, elapsed: number) => {
      // camera path: low + close & off-centre (hero) → high top-down (footer)
      const ease = t * t * (3 - 2 * t);
      const angle = ease * Math.PI * 0.9 + 0.6;
      const dist = THREE.MathUtils.lerp(small ? 9 : 7.5, 11, ease);
      const height = THREE.MathUtils.lerp(1.2, 9, ease);
      camera.position.set(Math.cos(angle) * dist + mouse.x * 1.5, height - mouse.y * 1.2, Math.sin(angle) * dist);
      camera.lookAt(small ? 0 : THREE.MathUtils.lerp(-2.2, 0, ease), small ? THREE.MathUtils.lerp(2.4, 0, ease) : 0, 0);
      mat.uniforms.uTime.value = elapsed;
      stars.rotation.y = elapsed * 0.01;
    };

    const loop = () => {
      if (!visible) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? window.scrollY / max : 0;
      progress += (target - progress) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      place(progress, clock.getElapsedTime());
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    if (reduceMotion) { place(0, 8); renderer.render(scene, camera); } else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      geo.dispose(); sGeo.dispose(); mat.dispose(); renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={host} className="galaxy" aria-hidden="true" />;
}
