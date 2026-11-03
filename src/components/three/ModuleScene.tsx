'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { moduleInfo, type ModuleFeature } from '@/data/module-features';
import { makeKit, shadowed } from './kit';
import { MODULE_SCENES } from './module-scenes';

const FOV = 34;
const TOUR_STEP = 3.2;

type Shape = 'circle' | 'hexagon' | 'square' | 'octagon';

// Per-module look: base shape and the tint of the base rim.
const MODULE_LOOK: Record<string, { shape: Shape; accent: 'brand' | 'accent' }> = {
  admissions: { shape: 'square', accent: 'brand' },
  student: { shape: 'hexagon', accent: 'accent' },
  staff: { shape: 'octagon', accent: 'brand' },
  fees: { shape: 'circle', accent: 'accent' },
  timetable: { shape: 'square', accent: 'accent' },
  attendance: { shape: 'hexagon', accent: 'brand' },
  exams: { shape: 'octagon', accent: 'accent' },
  communication: { shape: 'circle', accent: 'brand' },
  reports: { shape: 'square', accent: 'brand' },
  inventory: { shape: 'hexagon', accent: 'accent' },
  payroll: { shape: 'octagon', accent: 'brand' },
  library: { shape: 'circle', accent: 'accent' },
  transport: { shape: 'square', accent: 'brand' },
  'performance-insights': { shape: 'hexagon', accent: 'brand' },
  'ai-secretary': { shape: 'circle', accent: 'accent' },
  'parent-app': { shape: 'octagon', accent: 'accent' },
  pricing: { shape: 'square', accent: 'accent' },
  security: { shape: 'hexagon', accent: 'brand' },
};

// Shape of the base, as a list of points on a circle of radius 3.7.
function plinthShape(shape: Shape): THREE.BufferGeometry {
  const sides = { circle: 72, hexagon: 6, square: 4, octagon: 8 }[shape];
  const rot = shape === 'square' ? Math.PI / 4 : 0;
  return new THREE.CylinderGeometry(3.6, 3.75, 0.3, sides, 1, false, rot);
}

function rimGeometry(shape: Shape): THREE.BufferGeometry {
  // A torus with one tubular segment per side traces the same outline as the base.
  const sides = { circle: 120, hexagon: 6, square: 4, octagon: 8 }[shape];
  const g = new THREE.TorusGeometry(3.62, 0.03, 8, sides);
  g.rotateZ(shape === 'square' ? Math.PI / 4 : 0);
  return g;
}

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    brand: new THREE.Color().setStyle(v('--brand', '#026dde')),
    accent: new THREE.Color().setStyle(v('--brand-2', '#f59e0b')),
  };
}

// An interactive 3D diorama for one module and its three key features:
// drag to rotate, hover an object (or a feature below) to see which feature
// it represents.
export default function ModuleScene({
  moduleId,
  sceneId = moduleId,
  features: featuresProp,
  className = '',
  sceneClass = 'min-h-[340px]',
  steps = false,
}: {
  moduleId?: string;
  // Which diorama to show — defaults to the module's own; pages reuse them.
  sceneId?: string;
  // Three features matching the scene's three objects; defaults to the module's.
  features?: ModuleFeature[];
  className?: string;
  // Height of the picture itself (the three feature buttons sit below it).
  sceneClass?: string;
  // Label the three features Step 1, 2, 3.
  steps?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const legendHover = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const features = featuresProp ?? (moduleId ? moduleInfo(moduleId)?.features : undefined);
  const build = sceneId ? MODULE_SCENES[sceneId] : undefined;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !build) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.NeutralToneMapping;
    const canvas = renderer.domElement;
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
    canvas.style.touchAction = finePointer ? 'none' : 'pan-y';
    container.prepend(canvas);

    const pal = readPalette();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3e0, 1.4));
    const sun = new THREE.DirectionalLight(0xfff6e8, 2.1);
    sun.position.set(-5, 9, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    // Each module has its own base shape and accent, so the scenes read as distinct.
    const look = MODULE_LOOK[moduleId ?? sceneId ?? ''] ?? MODULE_LOOK.reports;
    const plinthGeo = plinthShape(look.shape);
    const plinth = shadowed(new THREE.Mesh(plinthGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })));
    plinth.position.y = -0.15;
    plinth.castShadow = false;
    scene.add(plinth);
    const rimColor = look.accent === 'accent' ? pal.accent : pal.brand;
    const rim = new THREE.Mesh(rimGeometry(look.shape), new THREE.MeshBasicMaterial({ color: rimColor }));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.0;
    scene.add(rim);

    const kit = makeKit(scene, pal.brand, pal.accent);
    const built = build(kit);

    // Builders give each feature's objects their own materials (and animate
    // those same instances), so highlighting can tint them in place.
    const spotMeshes: THREE.Mesh[][] = built.spots.map((g, i) => {
      const list: THREE.Mesh[] = [];
      g.traverse((c) => {
        if (!(c instanceof THREE.Mesh)) return;
        c.userData.spot = i;
        list.push(c);
      });
      return list;
    });
    const pickables = spotMeshes.flat();
    const spotLevels = [0, 0, 0];
    const highlight = new THREE.Color();
    const box3 = new THREE.Box3();
    const anchor = new THREE.Vector3();

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0.9, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.minPolarAngle = THREE.MathUtils.degToRad(30);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(75);
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.8;
    controls.enabled = finePointer;

    let width = 1;
    let height = 1;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Fit the plinth (r≈3.7) plus the tallest pieces, whichever axis is tighter.
      const r = Math.max(3.1 / tanHalf, 4.0 / (tanHalf * camera.aspect));
      const dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() < 0.01) dir.set(0.55, 0.6, 1);
      camera.position.copy(controls.target).add(dir.setLength(r));
      controls.update();
    };
    resize();

    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let pointerInside = false;
    let hovered: number | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      pointerInside = true;
    };
    const onLeave = () => {
      pointerInside = false;
      hovered = null;
    };
    // Tap/click an object to pin its metric (touch has no hover).
    const onUp = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      if (hit) {
        tourIdx = hit.object.userData.spot as number;
        tourAt = clock + TOUR_STEP * 2;
      }
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerup', onUp);

    let tourIdx = 0;
    let clock = 0;
    let tourAt = TOUR_STEP;
    let lastActive = -1;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const t = reduced ? 2 : clock;

      if (pointerInside) {
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(pickables, false)[0];
        hovered = hit ? (hit.object.userData.spot as number) : null;
      }
      if (!reduced && clock > tourAt) {
        tourIdx = (tourIdx + 1) % 3;
        tourAt = clock + TOUR_STEP;
      }
      const activeIdx = legendHover.current ?? hovered ?? tourIdx;
      if (activeIdx !== lastActive) {
        lastActive = activeIdx;
        setActive(activeIdx);
      }
      canvas.style.cursor = hovered !== null ? 'pointer' : finePointer ? 'grab' : 'default';

      built.update(t, dt);
      controls.update(dt);

      spotMeshes.forEach((list, i) => {
        spotLevels[i] += ((activeIdx === i ? 1 : 0) - spotLevels[i]) * 0.15;
        highlight.copy(pal.brand).multiplyScalar(0.6 * spotLevels[i]);
        list.forEach((m) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat.emissive && !m.userData.keepEmissive) mat.emissive.copy(highlight);
        });
      });

      // Feature chip floats above the active group.
      const el = chipRef.current;
      if (el) {
        box3.setFromObject(built.spots[activeIdx]);
        if (!box3.isEmpty()) {
          box3.getCenter(anchor);
          anchor.y = box3.max.y + 0.15;
          anchor.project(camera);
          const half = el.offsetWidth / 2 + 8;
          const sx = Math.min(width - half, Math.max(half, (anchor.x * 0.5 + 0.5) * width));
          const sy = Math.max(el.offsetHeight + 8, (-anchor.y * 0.5 + 0.5) * height);
          el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
          el.style.opacity = '1';
        }
      }

      renderer.render(scene, camera);
    }

    let raf = 0;
    let inView = true;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      frame(now);
    };
    const startLoop = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startLoop();
      else stopLoop();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onUp);
      controls.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      canvas.remove();
    };
  }, [build]);

  if (!features || !build) return null;
  const feature = features[active] ?? features[0];

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={containerRef} className={`relative ${sceneClass} flex-1 overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,var(--hero-from),var(--card))]`}>
        <div
          ref={chipRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 flex flex-col items-center opacity-0 transition-opacity duration-300 will-change-transform"
        >
          <span className="rounded-xl border border-border bg-card/95 px-3 py-2 text-center shadow-[0_10px_28px_-14px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <span className="block whitespace-nowrap font-display text-sm font-bold leading-tight text-heading">{feature.name}</span>
            <span className="mt-0.5 block max-w-[200px] text-[11px] leading-snug text-body">{feature.line}</span>
          </span>
          <span className="h-4 w-px bg-border" />
        </div>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-card/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-subtle">
          Drag to rotate
        </span>
      </div>
      {/* The same features as text — hover one to find it in the scene */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {features.map((f, i) => (
          <button
            key={f.name}
            type="button"
            onMouseEnter={() => (legendHover.current = i)}
            onMouseLeave={() => (legendHover.current = null)}
            onFocus={() => (legendHover.current = i)}
            onBlur={() => (legendHover.current = null)}
            className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${active === i ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}
          >
            {steps && <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-primary">Step {i + 1}</span>}
            <span className="block font-display text-sm font-bold text-heading">{f.name}</span>
            {!steps && <span className="block text-[11px] leading-snug text-subtle">{f.line}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
