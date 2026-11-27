import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { reduceMotion } from './LoopPlayer';

// Op-art dot field for the hero: a grid of points that breathes in slow
// interference waves and swells into a lens wherever the pointer is.
const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;      // in grid space
  uniform float uMouseAmt;
  uniform float uPR;
  varying float vGlow;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.55 + uTime * 0.6) * cos(p.y * 0.48 - uTime * 0.45);
    float w2 = sin(length(p.xy) * 0.9 - uTime * 1.1);
    float d = distance(p.xy, uMouse);
    float lens = exp(-d * d * 0.09) * uMouseAmt;
    vec2 push = normalize(p.xy - uMouse + 0.0001) * lens * 1.4;
    p.xy += push;
    p.z = (w * 0.6 + w2 * 0.35) + lens * 2.5;
    vGlow = clamp(0.35 + w2 * 0.25 + w * 0.2 + lens * 1.2, 0.0, 1.5);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.2 + lens * 9.0 + (w2 + 1.0) * 1.3) * uPR * (12.0 / -mv.z);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 c = mix(uA, uB, clamp(vGlow - 0.4, 0.0, 1.0));
    gl_FragColor = vec4(c, smoothstep(0.5, 0.15, d) * clamp(vGlow, 0.15, 1.0));
  }
`;

export function DotField() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const small = window.innerWidth < 700;
    const pr = Math.min(window.devicePixelRatio, 1.75);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(pr);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, -6, 12);
    camera.lookAt(0, 0, 0);

    const cols = small ? 70 : 150, rows = small ? 90 : 80, gap = small ? 0.26 : 0.22;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      pos[k++] = (x - cols / 2) * gap; pos[k++] = (y - rows / 2) * gap; pos[k++] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(99, 99) }, uMouseAmt: { value: 0 }, uPR: { value: pr },
        uA: { value: new THREE.Color('#5b5f73') }, uB: { value: new THREE.Color('#d4ff3a') },
      },
    });
    scene.add(new THREE.Points(geo, mat));

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    // project pointer onto the z=0 plane
    const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
    const target = new THREE.Vector2(99, 99); let amt = 0, amtT = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      if (ray.ray.intersectPlane(plane, hit)) { target.set(hit.x, hit.y); amtT = 1; }
    };
    const onLeave = () => { amtT = 0; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let inView = true, raf = 0;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView && !reduceMotion) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); } });
    io.observe(el);
    const clock = new THREE.Clock();
    const loop = () => {
      if (!inView) return;
      mat.uniforms.uTime.value = clock.getElapsedTime();
      (mat.uniforms.uMouse.value as THREE.Vector2).lerp(target, 0.08);
      amt += (amtT - amt) * 0.05; mat.uniforms.uMouseAmt.value = amt;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    if (reduceMotion) { mat.uniforms.uTime.value = 4; renderer.render(scene, camera); } else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave);
      geo.dispose(); mat.dispose(); renderer.dispose(); el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={host} className="dots" aria-hidden="true" />;
}
