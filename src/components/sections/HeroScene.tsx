'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MODULES } from '@/data/module-features';
import { CAMPUS_ZONES as ZONES, CAMPUS_ZONE_PINS, STREET_GATE, STREET_STOPS } from '@/data/campus-zones';

// A miniature school campus. Every module is a place on it — hover to see
// that module's key features, click to open its section on /product.
// Hotspot order below must match the `spots` array built in the effect.
const SPOT_IDS = [
  'admissions', 'student', 'parent-app', 'attendance', 'timetable', 'exams',
  'fees', 'staff', 'payroll', 'reports', 'performance-insights', 'ai-secretary',
  'library', 'inventory', 'communication', 'transport',
] as const;

// Short names for the always-visible pins, in the same order as SPOT_IDS.
const SHORT: Record<string, string> = {
  admissions: 'Admissions', student: 'Students', 'parent-app': 'Parent App', attendance: 'Attendance', timetable: 'Timetable', exams: 'Exams',
  fees: 'Fees', staff: 'Staff', payroll: 'Payroll', reports: 'Reports', 'performance-insights': 'Insights', 'ai-secretary': 'AI Secretary',
  library: 'Library', inventory: 'Inventory', communication: 'Messages', transport: 'Transport',
};

const FOV = 32;
const INTRO = 2.8;
const TOUR_STEP = 2.8;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x: number) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    brand: new THREE.Color().setStyle(v('--brand', '#026dde')),
    accent: new THREE.Color().setStyle(v('--brand-2', '#f59e0b')),
  };
}

// `spin` (degrees) turns the camera around the campus, opposite to the carousel's spin.
// For a game-style hero: `onVisit` makes a click report the module instead of opening it, `visited` ticks
// the pins already explored, `highlight` rings the pins worth a look and `selected` keeps one building lit.
export default function HeroScene({
  wideOffset = 0.21,
  distance = 1,
  spin,
  labels = true,
  onVisit,
  visited,
  highlight,
  selected,
  zoneMode = false,
  focusCamera = false,
  squarePlot = false,
  landscape = false,
  drop = 0,
  stretchMax = 1,
  streetView = false,
}: {
  wideOffset?: number;
  distance?: number;
  spin?: MotionValue<number>;
  labels?: boolean;
  onVisit?: (id: string) => void;
  visited?: string[];
  highlight?: string[];
  selected?: string | null;
  // Group the 16 modules into the seven places in data/campus-zones.ts: the tags, hover, clicks and
  // `selected` then work on places, and choosing one turns and moves the camera to it.
  zoneMode?: boolean;
  // In zone mode, also turn and move the camera in on the chosen place. Off by default: the campus just keeps floating.
  focusCamera?: boolean;
  // A rounded-square plot with a road round its edge, instead of the round island.
  squarePlot?: boolean;
  // Lay a wide field of grass round the island and fade it into the page, so the scene reaches both sides of a wide box.
  landscape?: boolean;
  // Sit the scene lower in its box by this fraction of the box's height (the bottom is then cut off by the box).
  drop?: number;
  // In a box much wider than it is tall, stretch the picture sideways (up to this many times) so the campus reaches
  // toward both sides instead of sitting small in the middle. 1 means no stretching.
  stretchMax?: number;
  // Street view: the camera stands on the ground at eye height and walks to the chosen place. Drag to look around.
  streetView?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef(spin);
  useEffect(() => {
    spinRef.current = spin;
  }, [spin]);
  const pinRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pinHover = useRef<number | null>(null); // a pin the pointer or keyboard is on
  const visitRef = useRef(onVisit);
  const visitedRef = useRef<string[]>([]);
  const highlightRef = useRef<string[]>([]);
  const selectedRef = useRef<string | null>(null);
  useEffect(() => {
    visitRef.current = onVisit;
    visitedRef.current = visited ?? [];
    highlightRef.current = highlight ?? [];
    selectedRef.current = selected ?? null;
  });
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });

  const spots = SPOT_IDS.map((id) => MODULES.find((m) => m.id === id)!);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // No WebGL — the copy stands on its own.
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.NeutralToneMapping;
    const canvas = renderer.domElement;
    // Absolutely positioned so the canvas's pixel size never feeds back into layout.
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
    canvas.style.touchAction = finePointer ? 'none' : 'pan-y';
    container.prepend(canvas);

    const pal = readPalette();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 150);
    const target = new THREE.Vector3(0, 0.6, 0.4);
    if (streetView) camera.fov = 64;

    // --- Daylight ---
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9c9a4, 1.35));
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const sun = new THREE.DirectionalLight(0xfff3df, 2.3);
    sun.position.set(-9, 15, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 45 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    sun.shadow.radius = 3;
    scene.add(sun);

    // --- Material helpers ---
    const std = (color: THREE.ColorRepresentation, extra: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...extra });
    const WALL = 0xf6f1e8;
    const brandMat = () => std(pal.brand, { roughness: 0.55 });
    const accentMat = () => std(pal.accent, { roughness: 0.55 });
    const themed: { mat: THREE.MeshStandardMaterial; tone: 'brand' | 'accent' }[] = [];
    const roof = (tone: 'brand' | 'accent') => {
      const mat = tone === 'brand' ? brandMat() : accentMat();
      themed.push({ mat, tone });
      return mat;
    };

    const shadowed = <T extends THREE.Object3D>(o: T) => {
      o.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      return o;
    };
    const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y + h / 2, z);
      return shadowed(m);
    };
    const rbox = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, r = 0.05) => {
      const g = new RoundedBoxGeometry(w, h, d, 2, r);
      const m = new THREE.Mesh(g, mat);
      m.position.set(x, y + h / 2, z);
      return shadowed(m);
    };
    const gable = (w: number, h: number, d: number, mat: THREE.Material, y: number) => {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, 0);
      shape.lineTo(w / 2, 0);
      shape.lineTo(0, h);
      shape.closePath();
      const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
      g.translate(0, 0, -d / 2);
      const m = new THREE.Mesh(g, mat);
      m.position.y = y;
      return shadowed(m);
    };

    // A flat panel with lettering (a building's name board, the gate sign), as a plane that faces +z.
    const lettered = (text: string, w: number, h: number, bg: string, fg: string, fontPx = 64) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = Math.round((512 * h) / w);
      const g = c.getContext('2d')!;
      g.fillStyle = bg;
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = fg;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = `800 ${fontPx}px system-ui, Arial, sans-serif`;
      g.fillText(text, c.width / 2, c.height / 2 + 3);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
    };
    const CREAM = 0xf1e3c4;
    const FRAME = 0x1d4fa8;
    const ORANGE = 0xe8711a;

    // Windows on the front (+z) and back faces of a w×d block, one row per floor.
    const glassGeo = new THREE.BoxGeometry(0.3, 0.4, 0.04);
    const frameGeo = new THREE.BoxGeometry(0.4, 0.5, 0.03);
    const sillGeo = new THREE.BoxGeometry(0.46, 0.05, 0.1);
    const glassMat = std(0xffffff, { roughness: 0.25, metalness: 0.2 });
    const frameMat = std(FRAME, { roughness: 0.6 });
    const sillMat = std(0xffffff, { roughness: 0.8 });
    const windowRows = (group: THREE.Group, w: number, d: number, y0: number, floorH: number, floors: number, skip?: (k: number, f: number) => boolean) => {
      const per = Math.max(1, Math.floor((w - 0.4) / 0.55));
      const count = per * floors * 2;
      const inst = new THREE.InstancedMesh(glassGeo, glassMat, count);
      const frames = new THREE.InstancedMesh(frameGeo, frameMat, count);
      const sills = new THREE.InstancedMesh(sillGeo, sillMat, count);
      const m = new THREE.Object3D();
      const c = new THREE.Color();
      const hide = new THREE.Object3D();
      hide.scale.setScalar(0.0001);
      hide.updateMatrix();
      let i = 0;
      for (let f = 0; f < floors; f++) {
        for (let k = 0; k < per; k++) {
          for (const side of [1, -1]) {
            const x = -((per - 1) * 0.55) / 2 + k * 0.55;
            const y = y0 + f * floorH + floorH * 0.55;
            const z = (side * d) / 2;
            const gone = skip?.(k, f) ?? false;
            const place3 = (o: THREE.InstancedMesh, dy: number, dz: number) => {
              if (gone) o.setMatrixAt(i, hide.matrix);
              else {
                m.position.set(x, y + dy, z + side * dz);
                m.updateMatrix();
                o.setMatrixAt(i, m.matrix);
              }
            };
            place3(inst, 0, 0.03);
            place3(frames, 0, 0.012);
            place3(sills, -0.27, 0.05);
            inst.setColorAt(i, c.set((k + f) % 3 === 0 ? 0xa9cdf0 : 0x4f7fb8));
            i++;
          }
        }
      }
      group.add(inst, frames, sills);
    };

    // --- Hotspots ---
    type Spot = { meshes: THREE.Mesh[]; anchor: () => THREE.Vector3; group: THREE.Object3D; active: number };
    const spotList: Spot[] = [];
    const pickables: THREE.Mesh[] = [];
    const risers: { obj: THREE.Object3D; delay: number }[] = [];

    function register(index: number, group: THREE.Object3D, anchor: () => THREE.Vector3, meshes?: THREE.Mesh[]) {
      const list: THREE.Mesh[] = meshes ?? [];
      if (!meshes) group.traverse((c) => c instanceof THREE.Mesh && list.push(c));
      list.forEach((m) => {
        // Own material per hotspot so highlighting one place never tints another.
        if (m.material instanceof THREE.MeshStandardMaterial) m.material = m.material.clone();
        m.userData.spot = index;
        pickables.push(m);
      });
      spotList[index] = { meshes: list, anchor, group, active: 0 };
    }
    // Small things (trees, lamp posts, the tower) that street view hides while they stand between the visitor and what they are looking at.
    const clutter: { o: THREE.Object3D; x: number; z: number }[] = [];
    const place = (g: THREE.Object3D, x: number, z: number, rotY = 0) => {
      g.position.set(x, 0, z);
      g.rotation.y = rotY;
      scene.add(g);
      risers.push({ obj: g, delay: Math.hypot(x, z) * 0.08 });
      return g;
    };
    const top = (g: THREE.Object3D, y: number) => () => new THREE.Vector3(g.position.x, y, g.position.z);

    // --- Ground, road, paths, track ---
    // A rounded square outline, drawn into a shape or a hole path.
    const roundedRect = <T extends THREE.Path>(target: T, half: number, rc: number): T => {
      const a = half - rc;
      target.moveTo(-a, -half);
      target.lineTo(a, -half);
      target.absarc(a, -a, rc, -Math.PI / 2, 0, false);
      target.lineTo(half, a);
      target.absarc(a, a, rc, 0, Math.PI / 2, false);
      target.lineTo(-a, half);
      target.absarc(-a, a, rc, Math.PI / 2, Math.PI, false);
      target.lineTo(-half, -a);
      target.absarc(-a, -a, rc, Math.PI, Math.PI * 1.5, false);
      return target;
    };
    // A path round a rounded square, by fraction of its length: position and direction of travel.
    const makeLoop = (h: number, rc: number) => {
      const a = h - rc;
      const arc = (Math.PI / 2) * rc;
      const corner = (cx: number, cz: number, th0: number) => (d: number) => {
        const th = th0 + d / rc;
        return { x: cx + rc * Math.cos(th), z: cz + rc * Math.sin(th), tx: -Math.sin(th), tz: Math.cos(th) };
      };
      const pieces: { len: number; at: (d: number) => { x: number; z: number; tx: number; tz: number } }[] = [
        { len: a, at: (d) => ({ x: h, z: d, tx: 0, tz: 1 }) },
        { len: arc, at: corner(a, a, 0) },
        { len: 2 * a, at: (d) => ({ x: a - d, z: h, tx: -1, tz: 0 }) },
        { len: arc, at: corner(-a, a, Math.PI / 2) },
        { len: 2 * a, at: (d) => ({ x: -h, z: a - d, tx: 0, tz: -1 }) },
        { len: arc, at: corner(-a, -a, Math.PI) },
        { len: 2 * a, at: (d) => ({ x: -a + d, z: -h, tx: 1, tz: 0 }) },
        { len: arc, at: corner(a, -a, Math.PI * 1.5) },
        { len: a, at: (d) => ({ x: h, z: -a + d, tx: 0, tz: 1 }) },
      ];
      const total = pieces.reduce((sum, pc) => sum + pc.len, 0);
      return (u: number) => {
        let d = (((u % 1) + 1) % 1) * total;
        for (const pc of pieces) {
          if (d <= pc.len) return pc.at(d);
          d -= pc.len;
        }
        return pieces[0].at(0);
      };
    };
    const busLoop = makeLoop(8.6, 1.7);

    if (squarePlot) {
      const slab = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(new THREE.Shape(), 9.7, 2.6), { depth: 0.8, bevelEnabled: false }), std(0x9ccc84));
      slab.rotation.x = -Math.PI / 2;
      slab.position.y = -0.8;
      slab.receiveShadow = true;
      scene.add(slab);
      const base = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(new THREE.Shape(), 9.45, 2.4), { depth: 1.4, bevelEnabled: false }), std(0xd9c7a6));
      base.rotation.x = -Math.PI / 2;
      base.position.y = -2.2;
      scene.add(base);
    } else {
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(9.7, 10, 0.8, 72), std(0x9ccc84));
      ground.position.y = -0.4;
      ground.receiveShadow = true;
      scene.add(ground);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(10, 9.2, 1.4, 72), std(0xd9c7a6));
      soil.position.y = -1.5;
      scene.add(soil);
    }
    const flat = (geo: THREE.BufferGeometry, color: number, y: number, x = 0, z = 0) => {
      const m = new THREE.Mesh(geo, std(color));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, y, z);
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };
    if (squarePlot) {
      const road = roundedRect(new THREE.Shape(), 9.15, 2.2);
      road.holes.push(roundedRect(new THREE.Path(), 8.1, 1.2));
      flat(new THREE.ShapeGeometry(road), 0x6b7380, 0.01);
      const dash = roundedRect(new THREE.Shape(), 8.63, 1.73);
      dash.holes.push(roundedRect(new THREE.Path(), 8.57, 1.67));
      flat(new THREE.ShapeGeometry(dash), 0xf4f0e6, 0.015);
    } else {
      flat(new THREE.RingGeometry(8.1, 9.15, 96), 0x6b7380, 0.01);
      flat(new THREE.RingGeometry(8.6, 8.66, 96), 0xf4f0e6, 0.015);
    }
    flat(new THREE.PlaneGeometry(1.3, 11.2), 0xebe3d3, 0.012, 0, 2.3);
    flat(new THREE.PlaneGeometry(9.4, 1.1), 0xebe3d3, 0.012, 0, 0.5);
    const track = flat(new THREE.RingGeometry(1.0, 1.32, 64), 0xc96a4c, 0.02, 3.1, 3.5);
    track.scale.set(2.0, 1.15, 1);
    const field = flat(new THREE.CircleGeometry(1.0, 64), 0x7fbf6a, 0.022, 3.1, 3.5);
    field.scale.set(2.0, 1.15, 1);

    // A wide field round the island, fading into the page's colour a long way off.
    if (landscape) {
      const field = new THREE.Mesh(new THREE.CircleGeometry(90, 64), std(0xb4da9a));
      field.rotation.x = -Math.PI / 2;
      field.position.y = -0.82;
      field.receiveShadow = true;
      scene.add(field);
      scene.fog = new THREE.Fog(0xeef4fc, 40, 95);
    }

    // 0 Admissions — main gate: cream piers, a blue arch with the chalo sign
    {
      const g = new THREE.Group();
      g.add(rbox(0.42, 1.9, 0.42, std(CREAM), -1.35, 0, 0), rbox(0.42, 1.9, 0.42, std(CREAM), 1.35, 0, 0));
      g.add(rbox(3.2, 0.5, 0.5, roof('brand'), 0, 1.9, 0));
      const sign = lettered('chalo', 1.5, 0.4, '#ffffff', '#026dde', 118);
      sign.position.set(0, 2.15, 0.27);
      g.add(sign);
      const bar = std(0x14307a);
      [-1, 1].forEach((s) => {
        g.add(box(0.7, 0.05, 0.05, bar, s * 0.78, 0.15, 0.1), box(0.7, 0.05, 0.05, bar, s * 0.78, 0.95, 0.1));
        for (let k = 0; k < 6; k++) g.add(box(0.03, 0.9, 0.03, bar, s * (0.47 + k * 0.12), 0.1, 0.1));
      });
      place(g, 0, 7.6);
      register(0, g, top(g, 2.7));
    }
    // 1 Student Management — the security cabin and reception: cream walls, blue roof, a lit window
    {
      const g = new THREE.Group();
      g.add(rbox(1.9, 1.05, 1.4, std(CREAM)));
      g.add(rbox(2.1, 0.16, 1.6, roof('brand'), 0, 1.05, 0));
      g.add(box(0.45, 0.7, 0.04, std(0x2a4a7a), -0.5, 0, 0.71));
      g.add(box(0.75, 0.45, 0.04, std(0xbfe0ff, { emissive: 0x4f8fd0, emissiveIntensity: 0.5 }), 0.35, 0.3, 0.71));
      g.add(box(0.85, 0.55, 0.03, frameMat, 0.35, 0.25, 0.7));
      place(g, 2.7, 6.6, -0.3);
      clutter.push({ o: g, x: 2.7, z: 6.6 });
      register(1, g, top(g, 1.7));
    }
    // 2 Parent App — a phone the size of a billboard
    const phoneCards: THREE.Mesh[] = [];
    {
      const g = new THREE.Group();
      g.add(rbox(1.0, 0.3, 0.6, std(WALL)));
      g.add(rbox(1.05, 1.95, 0.14, std(0x1f2633, { roughness: 0.4 }), 0, 0.3, 0, 0.12));
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 1.72), std(0xeaf3ff, { emissive: 0xeaf3ff, emissiveIntensity: 0.35 }));
      screen.position.set(0, 1.28, 0.075);
      screen.userData.keepEmissive = true;
      g.add(screen);
      [pal.brand, pal.accent, new THREE.Color(0x10b981)].forEach((c, i) => {
        const card = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.36, 0.03), std(c));
        card.position.set(0, 1.8 - i * 0.48, 0.09);
        g.add(card);
        phoneCards.push(card);
      });
      place(g, -2.8, 6.7, 0.35);
      clutter.push({ o: g, x: -2.8, z: 6.7 });
      register(2, g, top(g, 2.5));
    }
    // 3–5 Attendance / Timetable / Exams — the classroom block, one floor each: cream walls, blue roof, a pediment with a clock,
    // an entrance with orange piers and a blue "Classrooms" banner, windows with blue frames and flower boxes
    {
      const g = new THREE.Group();
      const W = 6.6, D = 2.0, H = 1.05;
      const floors = [0, 1, 2].map((f) => {
        const m = rbox(W, H, D, std(f === 1 ? 0xede0be : CREAM), 0, f * H, 0, 0.03);
        g.add(m);
        return m;
      });
      windowRows(g, W, D, 0, H, 3, (k, f) => k === 5 && f === 0);
      // flower boxes under the windows of the first floor
      const boxMat = std(ORANGE);
      const leafMat = std(0x4fae3f);
      const per = Math.floor((W - 0.4) / 0.55);
      for (let k = 0; k < per; k++) {
        if (k === 5) continue;
        const x = -((per - 1) * 0.55) / 2 + k * 0.55;
        g.add(box(0.38, 0.1, 0.14, boxMat, x, 1.05 + 0.22, D / 2 + 0.07));
        g.add(box(0.34, 0.08, 0.1, leafMat, x, 1.05 + 0.32, D / 2 + 0.07));
      }
      // a low blue hip roof, ridge running along the block
      const roofShape = gable(D + 0.5, 0.55, W + 0.3, roof('brand'), 3 * H);
      roofShape.rotation.y = Math.PI / 2;
      g.add(roofShape);
      // the pediment over the entrance, with the clock and the name
      const ped = gable(2.3, 0.85, 0.5, std(CREAM), 3 * H);
      ped.position.z = D / 2 + 0.05;
      g.add(ped);
      const pedRoof = gable(2.6, 0.95, 0.56, roof('brand'), 3 * H - 0.08);
      pedRoof.position.z = D / 2 + 0.03;
      pedRoof.scale.set(1, 1, 0.7);
      g.add(pedRoof);
      const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 28), std(0xffffff));
      clock.rotation.x = Math.PI / 2;
      clock.position.set(0, 3 * H + 0.5, D / 2 + 0.34);
      g.add(clock);
      const hand = box(0.025, 0.14, 0.02, std(0x1b2a4a), 0, 3 * H + 0.5, D / 2 + 0.37);
      const hand2 = box(0.1, 0.025, 0.02, std(0x1b2a4a), 0.04, 3 * H + 0.5, D / 2 + 0.37);
      g.add(hand, hand2);
      const brand = lettered('chalo', 0.95, 0.26, '#f1e3c4', '#026dde', 118);
      brand.position.set(0, 3 * H + 0.14, D / 2 + 0.32);
      g.add(brand);
      // entrance: orange piers, glass doors, the banner, steps
      [-0.62, 0.62].forEach((x) => g.add(box(0.2, 1.25, 0.2, std(ORANGE), x, 0, D / 2 + 0.12)));
      g.add(box(1.0, 1.0, 0.04, std(0x2a4a7a, { roughness: 0.2 }), 0, 0, D / 2 + 0.03));
      const banner = lettered('Classrooms', 1.7, 0.3, '#0f4fb0', '#ffffff', 64);
      banner.position.set(0, 1.23, D / 2 + 0.29);
      g.add(box(1.76, 0.34, 0.3, roof('brand'), 0, 1.23, D / 2 + 0.12), banner);
      g.add(box(1.4, 0.07, 0.35, std(0xe9e2d2), 0, 0, D / 2 + 0.5), box(1.2, 0.14, 0.25, std(0xe9e2d2), 0, 0, D / 2 + 0.4));
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.5, 20), std(0xdfe5ee));
      tank.position.set(2.4, 3 * H + 0.45, 0);
      g.add(shadowed(tank));
      place(g, 0, -4.3);
      floors.forEach((m, f) => register(3 + f, g, () => new THREE.Vector3(g.position.x + 1.6, (f + 1) * H + 0.05, g.position.z + D / 2), [m]));
    }
    // 6–7 Fees (ground) / Staff (first floor) — admin block: cream walls, orange roof, the "Admin" sign over the door
    {
      const g = new THREE.Group();
      const W = 2.8, D = 2.2, H = 1.0;
      const floors = [0, 1].map((f) => {
        const m = rbox(W, H, D, std(CREAM), 0, f * H, 0, 0.03);
        g.add(m);
        return m;
      });
      windowRows(g, W, D, 0, H, 2, (k, f) => f === 0 && (k === 1 || k === 2));
      const hip = gable(D + 0.4, 0.55, W + 0.3, roof('accent'), 2 * H);
      hip.rotation.y = Math.PI / 2;
      g.add(hip);
      g.add(box(0.55, 0.85, 0.04, std(0x2a4a7a, { roughness: 0.2 }), 0, 0, D / 2 + 0.03));
      const aSign = lettered('Admin', 0.95, 0.28, '#0f4fb0', '#ffffff', 96);
      aSign.position.set(0, 1.0, D / 2 + 0.1);
      g.add(box(1.0, 0.32, 0.08, roof('brand'), 0, 0.84, D / 2 + 0.04), aSign);
      const fb = std(ORANGE);
      const fl = std(0x4fae3f);
      [-1, 0, 1, 2].forEach((k) => {
        const x = -0.825 + (k + 1) * 0.55;
        g.add(box(0.36, 0.09, 0.13, fb, x, 0.0 + 1.0 + 0.22, D / 2 + 0.07), box(0.32, 0.07, 0.1, fl, x, 1.0 + 0.31, D / 2 + 0.07));
      });
      place(g, -5.5, 0.4, Math.PI / 2);
      floors.forEach((m, f) => register(6 + f, g, () => new THREE.Vector3(g.position.x + 1.1, (f + 1) * H + 0.05, g.position.z), [m]));
    }
    // 8 Payroll — accounts annex
    {
      const g = new THREE.Group();
      g.add(rbox(1.5, 1.0, 1.5, std(WALL)));
      g.add(rbox(1.7, 0.15, 1.7, roof('brand'), 0, 1.0, 0));
      g.add(box(0.4, 0.65, 0.04, std(0x3d6496), 0, 0, 0.76));
      place(g, -6.2, 3.2, 0.5);
      register(8, g, top(g, 1.6));
    }
    // 9 Reports (office) + 10 Performance Insights (rooftop dish)
    let dish: THREE.Group;
    {
      const g = new THREE.Group();
      const W = 2.6, D = 2.2;
      const office = rbox(W, 1.5, D, std(WALL), 0, 0, 0, 0.04);
      g.add(office);
      const strip = box(W - 0.3, 1.05, 0.04, std(0x7fb4ea, { roughness: 0.15, metalness: 0.3, emissive: 0x2a5d9a, emissiveIntensity: 0.35 }), 0, 0.2, D / 2 + 0.01);
      g.add(strip);
      g.add(box(W - 0.2, 1.15, 0.03, frameMat, 0, 0.15, D / 2));
      const aiChip = lettered('AI', 0.55, 0.55, '#0f4fb0', '#ffffff', 200);
      aiChip.position.set(0.7, 0.75, D / 2 + 0.04);
      g.add(aiChip);
      const oSign = lettered('Office & AI', 1.5, 0.3, '#0f4fb0', '#ffffff', 64);
      oSign.position.set(0, 1.58, D / 2 + 0.14);
      g.add(oSign);
      const roofSlab = rbox(W + 0.25, 0.16, D + 0.25, roof('brand'), 0, 1.5, 0);
      g.add(roofSlab);
      place(g, 5.5, 0.4, -Math.PI / 2);
      register(9, g, top(g, 1.85), [office, strip, roofSlab]);

      dish = new THREE.Group();
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 10), std(0xdfe5ee));
      mast.position.y = 0.35;
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.5, 28, 12, 0, Math.PI * 2, 0, Math.PI / 3), std(0xffffff, { side: THREE.DoubleSide, roughness: 0.4 }));
      bowl.rotation.x = Math.PI / 2.4;
      bowl.position.y = 0.8;
      dish.add(shadowed(mast), shadowed(bowl));
      dish.position.set(5.5, 1.66, 0.4);
      scene.add(dish);
      risers.push({ obj: dish, delay: 0.9 });
      register(10, dish, () => new THREE.Vector3(5.5, 2.75, 0.4), [mast, bowl]);
    }
    // 11 AI Secretary — floating orb kiosk
    let orb: THREE.Mesh;
    let orbRing: THREE.Mesh;
    {
      const g = new THREE.Group();
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.55, 24), std(WALL));
      ped.position.y = 0.275;
      orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), std(pal.brand, { flatShading: true, emissive: pal.brand, emissiveIntensity: 0.45, roughness: 0.3 }));
      orb.position.y = 1.15;
      orbRing = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.025, 8, 64), std(pal.accent, { emissive: pal.accent, emissiveIntensity: 0.4 }));
      orbRing.position.y = 1.15;
      orb.userData.keepEmissive = true;
      orbRing.userData.keepEmissive = true;
      g.add(shadowed(ped), shadowed(orb), orbRing);
      place(g, 6.1, 4.6);
      register(11, g, top(g, 1.95), [ped, orb, orbRing]);
    }
    // 12 Library — a cream block with orange piers, glass doors, a blue top and the "Library & Store" sign (book spines show through the windows)
    {
      const g = new THREE.Group();
      const W = 3.0, D = 2.0;
      g.add(rbox(W, 1.5, D, std(CREAM), 0, 0, 0, 0.03));
      g.add(rbox(W + 0.3, 0.22, D + 0.3, roof('brand'), 0, 1.5, 0));
      [-0.78, 0.78].forEach((x) => g.add(box(0.26, 1.35, 0.22, std(ORANGE), x, 0, D / 2 + 0.1)));
      g.add(box(1.3, 1.0, 0.04, std(0x2a4a7a, { roughness: 0.2 }), 0, 0, D / 2 + 0.03));
      const spines = [0xe11d48, 0x026dde, 0xf59e0b, 0x10b981, 0x8b5cf6];
      spines.forEach((c, i) => {
        g.add(box(0.12, 0.45 + (i % 3) * 0.08, 0.04, std(c), -0.5 + i * 0.25, 0.2, D / 2 + 0.06));
      });
      const sign = lettered('Library & Store', 2.2, 0.42, '#0f4fb0', '#ffffff', 58);
      sign.position.set(0, 1.97, D / 2 + 0.02);
      sign.rotation.x = -0.12;
      g.add(box(2.26, 0.46, 0.08, roof('brand'), 0, 1.74, D / 2 - 0.04), sign);
      [-1.05, 1.05].forEach((x) => g.add(box(0.07, 0.3, 0.07, std(0xdfe5ee), x, 1.72, D / 2 - 0.05)));
      [-1.15, 1.15].forEach((x) => {
        g.add(box(0.5, 0.45, 0.04, std(0x2a4a7a, { roughness: 0.2 }), x * 0.9, 0.55, D / 2 + 0.03));
      });
      place(g, 5.2, -5.1, -0.5);
      register(12, g, top(g, 2.7));
    }
    // 13 Inventory — store shed with crates
    let movingCrate: THREE.Mesh;
    {
      const g = new THREE.Group();
      g.add(rbox(1.9, 1.05, 1.5, std(WALL)));
      g.add(gable(2.1, 0.6, 1.7, roof('accent'), 1.05));
      const crate = std(0xbf8a57);
      [[1.25, 0, 0.3], [1.25, 0, -0.15], [1.25, 0.36, 0.08], [1.65, 0, 0.1]].forEach(([x, y, z]) => g.add(box(0.36, 0.36, 0.36, crate, x, y, z)));
      movingCrate = box(0.32, 0.32, 0.32, crate, 0.6, 0, 0.95);
      g.add(movingCrate);
      place(g, -5.2, -5.0, 0.5);
      register(13, g, top(g, 2.0));
    }
    // 14 Communication — a slim announcement tower: cream shaft, a glass lookout, a blue pyramid top and a speaker panel
    const broadcast: THREE.Mesh[] = [];
    {
      const g = new THREE.Group();
      const mast = box(0.7, 2.6, 0.7, std(CREAM), 0, 0, 0);
      const cabin = box(0.84, 0.5, 0.84, std(0x8fc0f0, { roughness: 0.2, emissive: 0x2a5d9a, emissiveIntensity: 0.3 }), 0, 2.6, 0);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.78, 0.55, 4), roof('brand'));
      cap.rotation.y = Math.PI / 4;
      cap.position.y = 3.37;
      shadowed(cap);
      const panel = lettered('((•))', 0.5, 0.5, '#0f4fb0', '#ffffff', 150);
      panel.position.set(0, 1.75, 0.36);
      g.add(mast, cabin, cap, panel);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1, 0.02, 6, 64),
          new THREE.MeshBasicMaterial({ color: pal.brand, transparent: true, opacity: 0, depthWrite: false }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 3.3;
        ring.visible = !streetView;
        g.add(ring);
        broadcast.push(ring);
      }
      place(g, -2.7, 3.2);
      clutter.push({ o: g, x: -2.7, z: 3.2 });
      register(14, g, top(g, 3.9), [mast, cabin, cap]);
    }
    // 15 Transport — bus bay + buses on the ring road
    const buses: THREE.Group[] = [];
    {
      const g = new THREE.Group();
      [-1.05, 1.05].forEach((x) => g.add(box(0.1, 1.05, 0.1, std(CREAM), x, 0, -0.5), box(0.1, 1.05, 0.1, std(CREAM), x, 0, 0.5)));
      g.add(rbox(2.5, 0.1, 1.4, roof('accent'), 0, 1.05, 0));
      g.add(box(2.5, 0.12, 0.06, roof('brand'), 0, 1.0, 0.72));
      const bbSign = lettered('Bus Bay', 0.9, 0.2, '#0f4fb0', '#ffffff', 74);
      bbSign.position.set(0, 1.06, 0.76);
      g.add(bbSign);
      // a bus parked under the canopy
      const park = new THREE.Group();
      park.add(rbox(1.5, 0.62, 0.62, std(0xf5b301, { roughness: 0.5 }), 0, 0.1, 0, 0.1), box(1.1, 0.22, 0.64, std(0x2b3f5c, { roughness: 0.15 }), -0.05, 0.42, 0));
      const pName = lettered('chalo', 0.5, 0.14, '#f5b301', '#0a4aa8', 80);
      pName.position.set(-0.05, 0.25, 0.32);
      park.add(pName);
      [-0.5, 0.5].forEach((x) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.66, 12), std(0x222222));
        w.rotation.x = Math.PI / 2;
        w.position.set(x, 0.12, 0);
        park.add(w);
      });
      park.position.set(0, 0, -0.05);
      g.add(park);
      place(g, -5.0, 6.3, 0.65);
      const busMeshes: THREE.Mesh[] = [];
      g.traverse((c) => c instanceof THREE.Mesh && busMeshes.push(c));
      for (let i = 0; i < 2; i++) {
        const bus = new THREE.Group();
        const body = rbox(1.35, 0.6, 0.58, std(0xf5b301, { roughness: 0.5 }), 0, 0.12, 0, 0.1);
        const glass = std(0x2b3f5c, { roughness: 0.15, metalness: 0.3 });
        const win = box(1.0, 0.2, 0.6, glass, -0.05, 0.42, 0);
        // Windshield and headlights at the front (+x, the direction of travel).
        const windshield = box(0.04, 0.3, 0.5, glass, 0.68, 0.34, 0);
        const lampMat = std(0xfff6d5, { emissive: 0xfff1b8, emissiveIntensity: 0.6 });
        const lamps = [-0.18, 0.18].map((z) => box(0.03, 0.07, 0.1, lampMat, 0.68, 0.2, z));
        const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.62, 12);
        const wheelMat = std(0x222222);
        [-0.4, 0.4].forEach((x) => {
          const w = new THREE.Mesh(wheelGeo, wheelMat);
          w.rotation.x = Math.PI / 2;
          w.position.set(x, 0.12, 0);
          bus.add(w);
        });
        bus.add(body, win, windshield, ...lamps);
        scene.add(bus);
        buses.push(bus);
        busMeshes.push(body, win);
      }
      register(15, g, () => new THREE.Vector3(buses[0].position.x, 1.2, buses[0].position.z), busMeshes);
    }

    // --- Decor: trees, flag, students, clouds ---
    const leafMats = [std(0x5fa857, { flatShading: true }), std(0x4c9a4f, { flatShading: true }), std(0x7cbf5a, { flatShading: true })];
    const trunkMat = std(0x8a6a4a);
    const treeSpots: [number, number, number][] = [
      [-7.4, -2.2, 1], [-7.6, 0.9, 0.8], [-3.4, -6.8, 0.9], [-1.4, -7.4, 1.1], [1.9, -7.3, 0.9], [3.2, -7.0, 0.8],
      [7.4, -2.3, 1], [7.5, 2.3, 0.85], [-3.6, 0.0, 0.7], [-2.3, -1.6, 0.6], [2.5, -1.7, 0.65], [7.3, -4.4, 0.8],
      [-7.2, -4.2, 0.9], [-1.4, 5.6, 0.55], [1.2, 5.3, 0.6], [-4.1, 4.4, 0.7], [0.6, 2.0, 0.5], [-7.4, 5.0, 0.8], [6.9, 6.0, 0.7],
    ];
    if (squarePlot) treeSpots.push([7.1, -7.0, 0.9], [-7.1, -7.0, 0.85], [-7.0, 7.0, 0.8]);
    treeSpots.forEach(([x, z, s], i) => {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 6), trunkMat);
      trunk.position.y = 0.25;
      const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), leafMats[i % 3]);
      leaves.position.y = 0.9;
      leaves.scale.set(1, 1.2, 1);
      t.add(trunk, leaves);
      t.scale.setScalar(s);
      place(shadowed(t), x, z, i);
      clutter.push({ o: t, x, z });
    });
    const flagGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 8), std(0xdfe5ee));
    pole.position.y = 1.2;
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.38, 6, 1), std(0xf97316, { side: THREE.DoubleSide }));
    flag.geometry.translate(0.3, 0, 0);
    flag.position.set(0.03, 2.15, 0);
    flagGroup.add(shadowed(pole), flag);
    place(flagGroup, 1.3, 6.2);
    clutter.push({ o: flagGroup, x: 1.3, z: 6.2 });

    // Students walking the paths.
    const studentGeo = new THREE.CapsuleGeometry(0.08, 0.16, 3, 8);
    const studentMats = [std(0xffffff), std(pal.brand), std(0xf2c14e)];
    const routes = [
      [new THREE.Vector3(0.3, 0, 7.0), new THREE.Vector3(0.3, 0, -3.0)],
      [new THREE.Vector3(-4.0, 0, 0.6), new THREE.Vector3(4.0, 0, 0.6)],
      [new THREE.Vector3(-0.3, 0, -3.0), new THREE.Vector3(-0.3, 0, 7.0)],
    ];
    const students = Array.from({ length: 12 }, (_, i) => {
      const m = new THREE.Mesh(studentGeo, studentMats[i % 3]);
      m.castShadow = true;
      scene.add(m);
      return { m, route: routes[i % 3], phase: (i * 0.137) % 1, speed: 0.045 + (i % 4) * 0.008 };
    });

    const cloudMat = std(0xffffff, { roughness: 1, transparent: true, opacity: 0.92 });
    const clouds = [[-6, 6.8, -3], [3, 7.4, -6], [7, 6.4, 3], [-3, 7.8, 5], [8, 7.0, -5]].map(([x, y, z], i) => {
      const c = new THREE.Group();
      [[0, 0, 0, 0.7], [0.7, -0.1, 0.1, 0.5], [-0.7, -0.15, 0, 0.5], [0.2, 0.3, 0, 0.45]].forEach(([dx, dy, dz, r]) => {
        const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), cloudMat);
        puff.position.set(dx, dy, dz);
        c.add(puff);
      });
      c.visible = !streetView; // seen from the ground, the clouds are just grey blobs in the way
      c.position.set(x, y, z);
      c.userData.speed = 0.15 + i * 0.05;
      scene.add(c);
      return c;
    });

    // --- Extra campus life: fountain garden, basketball court, playground, rooftop solar, lamp posts ---
    const stone = std(0xe8e2d4);
    const steel = std(0xdfe5ee);
    const ripples: THREE.Mesh[] = [];
    {
      const g = new THREE.Group();
      g.add(shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.2, 28), stone)));
      const water = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 28), std(0x6fb7f0, { roughness: 0.2, metalness: 0.1 }));
      water.position.y = 0.17;
      const spout = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.55, 12), stone);
      spout.position.y = 0.45;
      g.add(water, shadowed(spout));
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.015, 6, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, depthWrite: false }));
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.2;
        g.add(ring);
        ripples.push(ring);
      }
      const petals = [0xf472b6, 0xfacc15, 0xffffff, 0xfb923c];
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const f = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), std(petals[i % 4]));
        f.position.set(Math.cos(a) * 0.95, 0.1, Math.sin(a) * 0.95);
        g.add(f);
      }
      place(g, -2.4, 1.9);
    }
    {
      // Basketball court with two hoops.
      const g = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 1.5), std(0xd9825b));
      slab.position.y = 0.025;
      slab.receiveShadow = true;
      g.add(slab);
      const line = std(0xffffff);
      g.add(box(2.4, 0.01, 0.03, line, 0, 0.05, 0.65), box(2.4, 0.01, 0.03, line, 0, 0.05, -0.65), box(0.03, 0.01, 1.3, line, 1.2, 0.05, 0), box(0.03, 0.01, 1.3, line, -1.2, 0.05, 0), box(0.03, 0.01, 1.3, line, 0, 0.05, 0));
      [-1, 1].forEach((side) => {
        g.add(box(0.05, 0.9, 0.05, steel, side * 1.15, 0.05, 0));
        g.add(box(0.04, 0.3, 0.4, std(0xffffff), side * 1.11, 0.7, 0));
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 20), std(0xf97316));
        hoop.rotation.x = Math.PI / 2;
        hoop.position.set(side * 0.98, 0.78, 0);
        g.add(hoop);
      });
      place(g, -5.4, -2.9);
    }
    const swings: THREE.Group[] = [];
    {
      // Playground: a swing set and a slide.
      const g = new THREE.Group();
      [-0.8, 0.8].forEach((x) => [-0.25, 0.25].forEach((z) => g.add(box(0.06, 1.1, 0.06, steel, x, 0, z))));
      g.add(box(1.8, 0.06, 0.06, steel, 0, 1.1, 0));
      [-0.35, 0.35].forEach((x) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, 1.1, 0);
        const rope = box(0.02, 0.7, 0.02, std(0x8a6a4a), 0, -0.7, 0);
        const seat = box(0.28, 0.04, 0.12, std(pal.accent), 0, -0.74, 0);
        pivot.add(rope, seat);
        g.add(pivot);
        swings.push(pivot);
      });
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 1.1), std(0xe11d48));
      ramp.rotation.x = 0.62;
      ramp.position.set(1.7, 0.52, 0.3);
      g.add(shadowed(ramp));
      g.add(box(0.4, 0.06, 0.4, std(0xf5b301), 1.7, 0.9, -0.2), box(0.05, 0.9, 0.05, steel, 1.5, 0, -0.2), box(0.05, 0.9, 0.05, steel, 1.9, 0, -0.2));
      place(g, 3.4, -2.0);
    }
    {
      // Solar panels on the classroom block's roof.
      const g = new THREE.Group();
      const cell = std(0x1e3a8a, { roughness: 0.3, metalness: 0.4 });
      [-1.4, -0.4, 0.6].forEach((x) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.6), cell);
        panel.rotation.x = -0.45;
        panel.position.set(x, 3.32, 0);
        g.add(shadowed(panel));
      });
      place(g, -1.0, -4.3);
    }
    {
      // Lamp posts along the ring road, skipping the gate and the bus bay.
      const lampLoop = makeLoop(7.7, 1.1);
      const lampMat = std(0xfff3c4, { emissive: 0xffe9a0, emissiveIntensity: 0.9 });
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * 360;
        const near = (c: number) => Math.abs(((ang - c + 540) % 360) - 180) < 14;
        const a = (ang * Math.PI) / 180;
        const lp = squarePlot ? lampLoop((i + 0.5) / 16) : { x: Math.cos(a) * 7.75, z: Math.sin(a) * 7.75 };
        // keep clear of the gate and the bus bay
        if (squarePlot ? Math.hypot(lp.x, lp.z - 7.75) < 1.8 || Math.hypot(lp.x + 5, lp.z - 7.75) < 1.8 : near(90) || near(128)) continue;
        const lg = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.0, 8), steel);
        pole.position.y = 0.5;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), lampMat);
        head.position.y = 1.05;
        lg.add(shadowed(pole), head);
        place(lg, lp.x, lp.z);
        clutter.push({ o: lg, x: lp.x, z: lp.z });
      }
    }

    // --- Theme colours ---
    function applyPalette() {
      const p = readPalette();
      pal.brand.copy(p.brand);
      pal.accent.copy(p.accent);
      themed.forEach(({ mat, tone }) => mat.color.copy(tone === 'brand' ? p.brand : p.accent));
      spotList.forEach((s) =>
        s.meshes.forEach((m) => {
          const t = m.userData.themedTone as 'brand' | 'accent' | undefined;
          if (t && m.material instanceof THREE.MeshStandardMaterial) m.material.color.copy(t === 'brand' ? p.brand : p.accent);
        }),
      );
      studentMats[1].color.copy(p.brand);
      broadcast.forEach((r) => (r.material as THREE.MeshBasicMaterial).color.copy(p.brand));
      (orb.material as THREE.MeshStandardMaterial).color.copy(p.brand);
      (orb.material as THREE.MeshStandardMaterial).emissive.copy(p.brand);
    }
    // Hotspot meshes got cloned materials; remember which ones were themed roofs.
    spotList.forEach((s) =>
      s.meshes.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.color?.equals(pal.brand)) m.userData.themedTone = 'brand';
        else if (mat.color?.equals(pal.accent)) m.userData.themedTone = 'accent';
      }),
    );
    const highlight = new THREE.Color();

    // Pulsing ring on the ground under whichever module is active.
    const markerMat = new THREE.MeshBasicMaterial({ color: pal.brand, transparent: true, opacity: 0, depthWrite: false });
    const marker = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.05, 48), markerMat);
    marker.rotation.x = -Math.PI / 2;
    marker.position.y = 0.04;
    scene.add(marker);
    const markerPos = new THREE.Vector3();

    // --- Camera controls ---
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.5;
    controls.minPolarAngle = THREE.MathUtils.degToRad(30);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(68);
    controls.autoRotate = !reduced && !squarePlot;
    controls.autoRotateSpeed = 0.35;
    controls.enabled = false;

    // --- Sizing ---
    let width = 1;
    let height = 1;
    let radius = 24;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const wide = width >= 1024;
      // On desktop the canvas spans the whole hero; push the campus right of the copy.
      const ox = wide && wideOffset ? -width * wideOffset : 0;
      const oy = -height * drop;
      if (ox || oy) camera.setViewOffset(width, height, ox, oy, width, height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      // Phones crop the ring road slightly rather than shrinking the campus to a speck.
      // `distance` pulls the camera back for boxes that are narrower than the scene.
      radius = squarePlot
        ? Math.max(11.6 / (tanHalf * camera.aspect), 9.2 / tanHalf) // the corners at the widest turn, or the plot's depth, whichever needs more room
        : (wide ? 27 : Math.min(30, Math.max(19, 7.2 / (tanHalf * camera.aspect)))) * distance;
      // Wide box: show the campus stretched sideways, about as wide as the box (never more than stretchMax times).
      if (stretchMax > 1) {
        const stretch = Math.min(stretchMax, Math.max(1, 0.95 * (width / height)));
        camera.aspect = width / height / stretch;
        camera.updateProjectionMatrix();
      }
    };
    resize();
    const placeCamera = (r: number, polarDeg: number, azDeg: number) => {
      const phi = THREE.MathUtils.degToRad(polarDeg);
      const theta = THREE.MathUtils.degToRad(azDeg);
      camera.position.set(
        target.x + r * Math.sin(phi) * Math.sin(theta),
        target.y + r * Math.cos(phi),
        target.z + r * Math.sin(phi) * Math.cos(theta),
      );
      camera.lookAt(target);
    };

    // --- Pointer: hover + click-to-open ---
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let pointerInside = false;
    let hovered: number | null = null;
    const setNdc = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const pick = (): number | null => {
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      return hit ? (hit.object.userData.spot as number) : null;
    };
    const hrefFor = (i: number) => `/product#${SPOT_IDS[i]}`;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      setNdc(e);
      pointerInside = true;
    };
    const onLeave = () => {
      pointerInside = false;
      hovered = null;
    };
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved > 6) return; // a drag, not a click
      setNdc(e);
      const i = pick();
      if (i === null) return;
      if (visitRef.current) visitRef.current(groupIds[groupOfSpot[i]]);
      else routerRef.current.push(hrefFor(i));
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);

    // --- Frame ---
    const proj = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    let tourIdx = -1;
    let tourAt = INTRO;
    let introDone = reduced || streetView;
    const start = performance.now();
    let last = start;

    // Groups: in zone mode a group is a place holding several modules, otherwise each module is its own group.
    const groupOfSpot = SPOT_IDS.map((id, i) => (zoneMode ? ZONES.findIndex((z) => z.modules.includes(id)) : i));
    const groupIds: string[] = zoneMode ? ZONES.map((z) => z.id) : [...SPOT_IDS];
    const groupCount = groupIds.length;
    const pinDefs: { group: number; anchor: () => THREE.Vector3 }[] = zoneMode
      ? CAMPUS_ZONE_PINS.map((pp) => {
          const v = new THREE.Vector3(...pp.at);
          return { group: ZONES.findIndex((z) => z.id === pp.zone), anchor: () => v };
        })
      : spotList.map((sp, i) => ({ group: i, anchor: sp.anchor }));
    const wantT = new THREE.Vector3();
    const offset = new THREE.Vector3();
    let zoomNow = 1;
    const markerBase = zoneMode ? 2.4 : 1;

    let appliedTurn = 0;
    let appliedSway = 0;

    // --- Street view: stand at the gate, walk to the chosen place, look around by dragging ---
    const eye = 1.7;
    const walkPos = new THREE.Vector3(STREET_GATE[0], 8.5, STREET_GATE[1]);
    let yaw = 0; // 0 looks into the campus (towards -z); a positive turn is towards +x
    let yawWant = 0;
    let pitch = -0.42;
    let pitchWant = -0.42;
    let lastStop: string | null | undefined;
    camera.rotation.order = 'YXZ';
    const stopFor = (id: string | null) => {
      const z = id ? ZONES.find((zz) => zz.id === id) : undefined;
      const s = z ? STREET_STOPS[z.id] : undefined;
      if (!z || !s) return { x: STREET_GATE[0], z: STREET_GATE[1], fx: 0, fz: 0, h: 8.5, p: -0.42 };
      const f = s.face ?? [z.focus[0], z.focus[2]];
      return { x: s.stand[0], z: s.stand[1], fx: f[0], fz: f[1], h: s.height ?? eye, p: s.look ?? 0.04 };
    };
    const streetStep = (dt: number, t: number) => {
      const id = selectedRef.current;
      const st = stopFor(id);
      if (id !== lastStop) {
        lastStop = id;
        yawWant = Math.atan2(st.fx - st.x, -(st.fz - st.z));
        pitchWant = st.p;
      }
      const k = reduced ? 1 : 1 - Math.exp(-dt * 2.4);
      const dx = st.x - walkPos.x;
      const dz = st.z - walkPos.z;
      const left = Math.hypot(dx, dz);
      walkPos.x += dx * k;
      walkPos.z += dz * k;
      walkPos.y += (st.h - walkPos.y) * k;
      const bob = reduced || st.h > eye + 0.5 ? 0 : Math.sin(t * 9) * 0.035 * Math.min(1, left / 1.2);
      const dy = ((((yawWant - yaw) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      yaw += dy * (reduced ? 1 : 1 - Math.exp(-dt * 4));
      pitch += (pitchWant - pitch) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
      camera.position.set(walkPos.x, walkPos.y + bob, walkPos.z);
      camera.rotation.set(pitch, -yaw, 0);
      // Clear the view: hide whatever stands in the strip between the visitor and the place (but not the place itself).
      const vx = st.fx - walkPos.x;
      const vz = st.fz - walkPos.z;
      const vl = Math.hypot(vx, vz) || 1;
      clutter.forEach((c) => {
        const px = c.x - walkPos.x;
        const pz = c.z - walkPos.z;
        const along = (px * vx + pz * vz) / vl;
        const side = Math.abs(px * vz - pz * vx) / vl;
        const nearFace = Math.hypot(c.x - st.fx, c.z - st.fz) < 1.6;
        c.o.visible = !(along > -0.5 && along < vl && side < 2.4 && !nearFace);
      });
    };
    if (streetView) {
      canvas.style.touchAction = 'pan-y';
      let drag: { x: number; y: number } | null = null;
      canvas.addEventListener('pointerdown', (e) => {
        drag = { x: e.clientX, y: e.clientY };
      });
      canvas.addEventListener('pointermove', (e) => {
        if (!drag || !(e.buttons & 1)) return;
        const ddx = e.clientX - drag.x;
        const ddy = e.clientY - drag.y;
        drag = { x: e.clientX, y: e.clientY };
        yawWant -= ddx * 0.0045;
        yaw -= ddx * 0.0045;
        if (e.pointerType === 'mouse') {
          pitchWant = Math.max(-0.5, Math.min(0.6, pitchWant + ddy * 0.003));
          pitch = pitchWant;
        }
      });
      const end = () => {
        drag = null;
      };
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointerleave', end);
    }
    let fc = 0;
    const occRay = new THREE.Raycaster();
    const occDir = new THREE.Vector3();
    const pinVis = SPOT_IDS.map(() => 1);
    const pinOp = SPOT_IDS.map(() => 0);
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = reduced ? 10 : (now - start) / 1000;

      if (streetView) {
        streetStep(dt, t);
      } else if (!introDone) {
        const k = easeInOut(clamp01(t / INTRO));
        placeCamera(radius * (1.45 - 0.45 * k), 18 + 37 * k, 95 - 70 * k);
        if (t >= INTRO) {
          introDone = true;
          controls.enabled = finePointer;
          controls.update();
        }
      } else {
        // Turn the camera by the change in the carousel's spin, in the opposite direction.
        const wantTurn = -((spinRef.current?.get() ?? 0) * Math.PI) / 180;
        const delta = wantTurn - appliedTurn;
        if (Math.abs(delta) > 1e-5) {
          controls.rotateLeft(delta);
          appliedTurn = wantTurn;
        }
        if (zoneMode && focusCamera) {
          const sel = selectedRef.current ? ZONES.find((z) => z.id === selectedRef.current) : undefined;
          const k = reduced ? 1 : 1 - Math.exp(-dt * 4.5);
          controls.autoRotate = !reduced && !sel;
          if (sel) wantT.set(sel.focus[0], sel.focus[1], sel.focus[2]);
          else wantT.copy(target);
          controls.target.lerp(wantT, k);
          zoomNow += ((sel ? sel.zoom : 1) - zoomNow) * k;
          offset.copy(camera.position).sub(controls.target);
          if (sel) {
            const cur = Math.atan2(offset.x, offset.z);
            const d = ((((THREE.MathUtils.degToRad(sel.az) - cur) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            const horiz = Math.hypot(offset.x, offset.z);
            offset.x = horiz * Math.sin(cur + d * k);
            offset.z = horiz * Math.cos(cur + d * k);
          }
          offset.setLength(radius * zoomNow);
          camera.position.copy(controls.target).add(offset);
        }
        if (squarePlot && !reduced) {
          const want = Math.sin(t * 0.28) * THREE.MathUtils.degToRad(24);
          controls.rotateLeft(want - appliedSway);
          appliedSway = want;
        }
        controls.update(dt);
      }

      // Buildings rise into place on load.
      risers.forEach(({ obj, delay }) => {
        const s = reduced ? 1 : easeOutBack(clamp01((t - 0.2 - delay) / 0.7));
        obj.scale.y = Math.max(0.001, s);
      });

      if (pinHover.current !== null) hovered = pinHover.current;
      else {
        const pk = pointerInside ? pick() : null;
        hovered = pk !== null ? groupOfSpot[pk] : null;
      }
      canvas.style.cursor = hovered !== null ? 'pointer' : finePointer && introDone ? 'grab' : 'default';

      if (!reduced && introDone && t > tourAt) {
        tourIdx = (tourIdx + 1) % groupCount;
        tourAt = t + TOUR_STEP;
      }
      const selIdx = selectedRef.current ? groupIds.indexOf(selectedRef.current) : -1;
      const activeIdx = hovered !== null ? hovered : selIdx >= 0 ? selIdx : introDone && !reduced && tourIdx >= 0 ? tourIdx : null;

      spotList.forEach((s, i) => {
        s.active += ((activeIdx === groupOfSpot[i] ? 1 : 0) - s.active) * 0.15;
        highlight.copy(pal.brand).multiplyScalar(0.7 * s.active);
        s.meshes.forEach((m) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat.emissive && !m.userData.keepEmissive) mat.emissive.copy(highlight);
        });
      });

      if (activeIdx !== null) {
        const a = zoneMode ? { x: ZONES[activeIdx].focus[0], z: ZONES[activeIdx].focus[2] } : spotList[activeIdx].anchor();
        markerPos.set(a.x, 0.04, a.z);
        marker.position.lerp(markerPos, marker.material.opacity < 0.05 ? 1 : 0.2);
      }
      const pulse = (t * 0.9) % 1;
      marker.scale.setScalar((1 + pulse * 0.9) * markerBase);
      markerMat.opacity += ((activeIdx !== null ? (1 - pulse) * 0.85 : 0) - markerMat.opacity) * 0.3;
      markerMat.color.copy(pal.brand);

      // Moving parts.
      if (!reduced) {
        buses.forEach((bus, i) => {
          const a = t * 0.12 + i * Math.PI;
          if (squarePlot) {
            const q = busLoop((t * 0.12) / (Math.PI * 2) + i * 0.5);
            bus.position.set(q.x, 0, q.z);
            tangent.set(q.tx, 0, q.tz);
          } else {
            bus.position.set(Math.cos(a) * 8.38, 0, Math.sin(a) * 8.38);
            tangent.set(-Math.sin(a), 0, Math.cos(a));
          }
          bus.rotation.y = Math.atan2(-tangent.z, tangent.x);
        });
        students.forEach((s) => {
          const u = (s.phase + t * s.speed) % 1;
          const back = u > 0.5;
          const k = back ? (1 - u) * 2 : u * 2;
          s.m.position.lerpVectors(s.route[0], s.route[1], k);
          s.m.position.y = 0.16 + Math.abs(Math.sin(t * 9 + s.phase * 10)) * 0.03;
        });
        broadcast.forEach((ring, i) => {
          const p = (t * 0.45 + i / 3) % 1;
          ring.scale.setScalar(0.3 + p * 2.2);
          (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.7;
        });
        orb.rotation.y = t * 0.8;
        orb.position.y = 1.15 + Math.sin(t * 2) * 0.08;
        orbRing.rotation.x = Math.PI / 2 + Math.sin(t) * 0.4;
        orbRing.rotation.y = t * 1.2;
        dish.rotation.y = Math.sin(t * 0.4) * 1.2;
        phoneCards.forEach((c, i) => {
          c.position.x = Math.sin(t * 1.4 + i * 1.2) * 0.04;
        });
        movingCrate.position.x = 0.6 + Math.max(0, Math.sin(t * 0.9)) * 1.0;
        flag.rotation.y = Math.sin(t * 3) * 0.25;
        swings.forEach((sw, i) => {
          sw.rotation.x = Math.sin(t * 1.5 + i * 0.8) * 0.5;
        });
        ripples.forEach((rg, i) => {
          const q = (t * 0.6 + i / 2) % 1;
          rg.scale.setScalar(0.3 + q * 0.9);
          (rg.material as THREE.MeshBasicMaterial).opacity = (1 - q) * 0.7;
        });
        clouds.forEach((c) => {
          c.position.x += dt * c.userData.speed;
          if (c.position.x > 11) c.position.x = -11;
        });
      } else {
        buses.forEach((bus, i) => {
          if (squarePlot) {
            const q = busLoop(0.08 + i * 0.5);
            bus.position.set(q.x, 0, q.z);
            bus.rotation.y = Math.atan2(-q.tz, q.tx);
          } else bus.position.set(Math.cos(i * Math.PI + 0.5) * 8.38, 0, Math.sin(i * Math.PI + 0.5) * 8.38);
        });
        students.forEach((s) => s.m.position.lerpVectors(s.route[0], s.route[1], s.phase));
      }

      // Pins: a short name floats over each building (or each place), so nothing has to be hovered to be found.
      // A few pins are tested each frame for being hidden behind another building; hidden pins fade out.
      fc++;
      for (let k = 0; k < 4; k++) {
        const pi = (fc * 4 + k) % pinDefs.length;
        const a = pinDefs[pi].anchor();
        const dist = camera.position.distanceTo(a);
        occRay.set(camera.position, occDir.subVectors(a, camera.position).normalize());
        occRay.far = dist;
        const hit = occRay.intersectObjects(pickables, false)[0];
        pinVis[pi] = hit && groupOfSpot[hit.object.userData.spot as number] !== pinDefs[pi].group && hit.distance < dist - 0.4 ? 0 : 1;
      }
      pinDefs.forEach((pd, pi) => {
        const el = pinRefs.current[pi];
        if (!el) return;
        proj.copy(pd.anchor()).project(camera);
        const half = el.offsetWidth / 2 + 4;
        const sx = Math.min(width - half, Math.max(half, (proj.x * 0.5 + 0.5) * width));
        const sy = Math.max(el.offsetHeight + 8, (-proj.y * 0.5 + 0.5) * height);
        const isActive = activeIdx === pd.group;
        const want = !introDone ? 0 : isActive ? 1 : activeIdx !== null ? pinVis[pi] * 0.45 : pinVis[pi];
        pinOp[pi] += (want - pinOp[pi]) * 0.2;
        el.style.transform = `translate3d(${sx}px, ${sy - 6}px, 0) translate(-50%, -100%)`;
        el.style.opacity = pinOp[pi].toFixed(2);
        el.style.pointerEvents = pinOp[pi] > 0.4 ? 'auto' : 'none';
        el.style.zIndex = isActive ? '10' : '1';
        el.dataset.on = isActive ? '1' : '0';
        el.dataset.visited = visitedRef.current.includes(groupIds[pd.group]) ? '1' : '0';
        el.dataset.hint = highlightRef.current.includes(groupIds[pd.group]) ? '1' : '0';
      });

      renderer.render(scene, camera);
    }

    // --- Loop (paused while offscreen or tab hidden) ---
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
    const mo = new MutationObserver(applyPalette);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });

    if (reduced && !streetView) placeCamera(radius, 55, 25);
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
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
  }, [wideOffset, distance, zoneMode, focusCamera, squarePlot, landscape, drop, stretchMax, streetView]);

  const CALLOUT_TITLE: Record<string, string> = {
    front: 'Front Office (Gate)', classes: 'Classroom Block (3 Floors)', admin: 'Admin Block', office: 'Office & AI',
    library: 'Library & Store', comms: 'Announcement Tower', transport: 'Bus Bay',
  };
  const pins = zoneMode
    ? CAMPUS_ZONE_PINS.map((pp, i) => {
        const gi = ZONES.findIndex((z) => z.id === pp.zone);
        const z = ZONES[gi];
        return { key: `${z.id}-${i}`, id: z.id, group: gi, title: z.title, label: CALLOUT_TITLE[z.id] ?? z.short, href: `/product#${z.modules[0]}`, sub: z.modules.map((id) => SHORT[id] ?? id).join(', ') };
      })
    : spots.map((m, i) => ({ key: m.id, id: m.id, group: i, title: m.title, label: SHORT[m.id] ?? m.title, href: `/product#${m.id}`, sub: '' }));
  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {labels && pins.map((pin, i) => (
        <Link
          key={pin.key}
          href={pin.href}
          ref={(el) => {
            pinRefs.current[i] = el;
          }}
          data-on="0"
          data-visited="0"
          data-hint="0"
          onClick={(e) => {
            if (visitRef.current) {
              e.preventDefault();
              visitRef.current(pin.id);
            }
          }}
          aria-label={pin.title}
          onPointerEnter={() => { pinHover.current = pin.group; }}
          onPointerLeave={() => { pinHover.current = null; }}
          onFocus={() => { pinHover.current = pin.group; }}
          onBlur={() => { pinHover.current = null; }}
          className={`group absolute left-0 top-0 flex whitespace-nowrap border bg-card/95 font-semibold text-heading opacity-0 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.45)] backdrop-blur-sm will-change-transform transition-[background-color,color,border-color] duration-150 data-[on=1]:border-transparent data-[on=1]:bg-primary data-[on=1]:text-white data-[hint=1]:ring-2 data-[hint=1]:ring-primary ${
            pin.sub ? 'flex-col items-start rounded-2xl border-[#cfe0fb] px-3 py-1.5 text-[12px]' : 'items-center gap-1.5 rounded-full border-border px-2.5 py-1 text-[11px]'
          }`}
          style={{ pointerEvents: 'none' }}
        >
          {pin.sub ? (
            <>
              <span className="text-[12.5px] font-extrabold leading-tight">{pin.label}</span>
              <span className="text-[10.5px] font-medium leading-tight text-body group-data-[on=1]:text-white/85">{pin.sub}</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-primary group-data-[on=1]:bg-white" />
              {pin.label}
            </>
          )}
          <span aria-hidden="true" className="hidden text-emerald-600 group-data-[visited=1]:inline group-data-[on=1]:text-white">✓</span>
        </Link>
      ))}

      {labels && <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-subtle max-sm:hidden">Drag to turn the campus · hover or click a building</p>}
    </div>
  );
}
