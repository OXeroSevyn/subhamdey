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
        uA: { value: new THREE.Color('#3a3a3a') }, uB: { value: new THREE.Color('#ffffff') },
      },
    });
    const field = new THREE.Points(geo, mat);
    scene.add(field);

    // B&W wireframe core the camera flies toward on scroll
    const core = new THREE.Group();
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.42, small ? 120 : 220, small ? 12 : 20, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.16 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    const ringGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.07 });
    const shell = new THREE.Mesh(ringGeo, ringMat);
    core.add(knot, shell);
    core.position.set(small ? 0 : 3.2, 0.5, 2.2);
    scene.add(core);

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    // project pointer onto the z=0 plane
    const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
    const target = new THREE.Vector2(99, 99); let amt = 0, amtT = 0;
    let prog = 0, mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1; my = -((e.clientY / window.innerHeight) * 2 - 1);
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
      const tt = clock.getElapsedTime(); mat.uniforms.uTime.value = tt;
      (mat.uniforms.uMouse.value as THREE.Vector2).lerp(target, 0.08);
      amt += (amtT - amt) * 0.05; mat.uniforms.uMouseAmt.value = amt;
      // scroll progress through the hero drives the camera flight
      const h = el.clientHeight || 1;
      const pT = Math.min(Math.max(window.scrollY / h, 0), 1);
      prog += (pT - prog) * 0.08;
      const e = prog * prog * (3 - 2 * prog);
      camera.position.set(
        THREE.MathUtils.lerp(0, core.position.x * 0.9, e) + mx * 0.6,
        THREE.MathUtils.lerp(-6, core.position.y - 0.2, e) + my * 0.4,
        THREE.MathUtils.lerp(12, core.position.z + 3.2, e),
      );
      camera.lookAt(core.position.x * e, core.position.y * e, core.position.z * e);
      camera.rotation.z += e * 0.35;
      knot.rotation.set(tt * 0.18 + e * 2, tt * 0.25, 0);
      shell.rotation.set(-tt * 0.07, tt * 0.1 + e, 0);
      knotMat.opacity = 0.16 + e * (small ? 0.18 : 0.5);
      ringMat.opacity = 0.07 + e * 0.12;
      core.scale.setScalar(1 + e * 0.4);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    if (reduceMotion) { mat.uniforms.uTime.value = 4; renderer.render(scene, camera); } else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave);
      geo.dispose(); mat.dispose(); knotGeo.dispose(); knotMat.dispose(); ringGeo.dispose(); ringMat.dispose(); renderer.dispose(); el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={host} className="dots" aria-hidden="true" />;
}
