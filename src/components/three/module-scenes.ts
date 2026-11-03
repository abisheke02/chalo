import * as THREE from 'three';
import { shadowed, type Kit } from './kit';

// One small diorama per module. Each builder returns three hotspot groups —
// one per feature in src/data/module-features.ts, in the same order — and an
// update() for its animation. Everything sits on a disc of radius ~3.4.

export interface BuiltScene {
  spots: [THREE.Object3D, THREE.Object3D, THREE.Object3D];
  update: (t: number, dt: number) => void;
}

type Builder = (k: Kit) => BuiltScene;

const WHITE = 0xf7f4ee;
const INK = 0x2b3f5c;
const add = (k: Kit, ...objs: THREE.Object3D[]) => objs.forEach((o) => k.scene.add(o));
const wrap = (x: number) => x - Math.floor(x);
// A clock hand that pivots at its base rather than its middle.
const hand = (k: Kit, w: number, h: number, color: THREE.ColorRepresentation, z: number) => {
  const m = k.box(w, h, 0.03, k.std(color), 0, 0, z);
  m.geometry.translate(0, h / 2, 0);
  m.position.y = 0;
  return m;
};

// Admissions — applicants fall into a funnel and leave as enrolled students.
const admissions: Builder = (k) => {
  const applicants = new THREE.Group();
  const appMat = k.std(k.brand);
  const drops = Array.from({ length: 14 }, (_, i) => {
    const m = k.sphere(0.11, appMat);
    applicants.add(m);
    return { m, a: (i / 14) * Math.PI * 2, r: 0.4 + (i % 4) * 0.25, phase: i / 14 };
  });
  const funnelMat = k.std(k.accent, { side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
  const funnel = k.group(k.cyl(1.5, 0.3, 1.4, funnelMat, 0, 1.0, 0, 40), k.cyl(0.3, 0.3, 0.5, funnelMat, 0, 0.5, 0, 24));
  const enrolled = new THREE.Group();
  const cubeMat = k.std(k.green);
  for (let i = 0; i < 9; i++) enrolled.add(k.rbox(0.28, 0.28, 0.28, cubeMat, 1.4 + (i % 3) * 0.32, Math.floor(i / 3) * 0.3, 0.9));
  const form = k.group(k.rbox(1.0, 1.3, 0.08, k.std(WHITE), 0, 0, 0, 0.06));
  [0.95, 0.75, 0.55, 0.35].forEach((y, i) => form.add(k.box(i === 3 ? 0.4 : 0.7, 0.07, 0.02, k.std(i === 3 ? k.brand : 0xc9d3e0), i === 3 ? 0.15 : 0, y, 0.05)));
  form.position.set(-1.9, 0, 0.8);
  form.rotation.y = 0.5;
  add(k, applicants, funnel, enrolled, form);
  return {
    spots: [applicants, funnel, form],
    update: (t) => {
      drops.forEach((d) => {
        const p = wrap(d.phase + t * 0.25);
        const r = d.r * (1 - p * 0.8);
        d.m.position.set(Math.cos(d.a + t) * r, 3.4 - p * 2.4, Math.sin(d.a + t) * r);
        d.m.scale.setScalar(p > 0.9 ? (1 - p) * 10 : 1);
      });
      enrolled.children.forEach((c, i) => (c.scale.y = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.5 + i))));
    },
  };
};

// Student Management — a wall of student profiles, history stack, quick search.
const student: Builder = (k) => {
  const wall = new THREE.Group();
  const cards: THREE.Object3D[] = [];
  for (let i = 0; i < 12; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const card = k.group(k.rbox(0.7, 0.85, 0.06, k.std(WHITE), 0, 0, 0, 0.05));
    card.add(k.sphere(0.13, k.std(i % 3 ? k.brand : k.accent), 0, 0.5, 0.04));
    card.add(k.box(0.45, 0.05, 0.02, k.std(0xc9d3e0), 0, 0.3, 0.04), k.box(0.32, 0.05, 0.02, k.std(0xc9d3e0), 0, 0.18, 0.04));
    const a = (col - 1.5) * 0.32;
    card.position.set(Math.sin(a) * 2.6, 0.35 + row * 0.95, -Math.cos(a) * 2.6 + 1.6);
    card.rotation.y = -a;
    wall.add(card);
    cards.push(card);
  }
  const history = new THREE.Group();
  for (let i = 0; i < 12; i++) history.add(k.rbox(0.9, 0.08, 0.65, k.std(i % 2 ? 0xe6dccb : k.accent), 1.9, i * 0.1, 1.1, 0.02));
  const lens = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 10, 32), k.std(k.brand));
  const handle = k.cyl(0.05, 0.05, 0.5, k.std(INK));
  handle.position.set(0.32, -0.45, 0);
  handle.rotation.z = 0.7;
  lens.add(ring, handle);
  add(k, wall, history, lens);
  return {
    spots: [wall, history, lens],
    update: (t) => {
      const pick = Math.floor(t / 1.6) % cards.length;
      // The featured profile slides forward out of the wall.
      cards.forEach((c, i) => {
        const o = (c.userData.o as number | undefined) ?? 0;
        const next = o + ((i === pick ? 0.35 : 0) - o) * 0.1;
        c.translateZ(next - o);
        c.userData.o = next;
      });
      lens.position.set(-1.6 + Math.sin(t * 0.7) * 0.4, 1.8 + Math.sin(t * 1.3) * 0.15, 1.2);
      lens.rotation.y = Math.sin(t) * 0.3;
    },
  };
};

// Staff Management — an org chart of nodes, departments, and access locks.
const staff: Builder = (k) => {
  const people = new THREE.Group();
  const links = new THREE.Group();
  const lineMat = k.std(0xb8c4d6);
  const node = (x: number, y: number, z: number, mat: THREE.Material, r = 0.16) => {
    const s = k.sphere(r, mat, x, y - r, z);
    people.add(s);
    return new THREE.Vector3(x, y, z);
  };
  const link = (a: THREE.Vector3, b: THREE.Vector3) => {
    const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, len, 6), lineMat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    m.rotateX(Math.PI / 2);
    links.add(m);
  };
  const head = node(0, 2.9, 0, k.std(k.accent), 0.24);
  const depts = new THREE.Group();
  const deptColors = [k.brand, k.green, new THREE.Color(0x8b5cf6), k.accent, new THREE.Color(0x0891b2), new THREE.Color(0xe11d48)];
  deptColors.forEach((c, i) => {
    const a = (i / 6) * Math.PI * 2;
    const p = node(Math.cos(a) * 1.4, 1.9, Math.sin(a) * 1.4, k.std(c), 0.18);
    link(head, p);
    depts.add(k.cyl(0.32, 0.36, 0.12, k.std(c), Math.cos(a) * 2.5, 0, Math.sin(a) * 2.5));
    for (let j = -1; j <= 1; j++) {
      const b = a + j * 0.22;
      const q = node(Math.cos(b) * 2.5, 0.75, Math.sin(b) * 2.5, k.std(WHITE), 0.12);
      link(p, q);
    }
  });
  const lock = k.group(k.rbox(0.6, 0.5, 0.3, k.std(k.brand), 0, 0, 0, 0.06));
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 24, Math.PI), k.std(0x9aa7b8, { metalness: 0.6, roughness: 0.3 }));
  shackle.position.y = 0.5;
  lock.add(shackle);
  lock.position.set(0, 0, 0);
  add(k, people, links, depts, lock);
  return {
    spots: [people, depts, lock],
    update: (t) => {
      people.rotation.y = t * 0.15;
      links.rotation.y = t * 0.15;
      lock.rotation.y = Math.sin(t * 0.8) * 0.6;
      lock.position.y = 0.05 + Math.abs(Math.sin(t * 1.5)) * 0.1;
    },
  };
};

// Fees — monthly coin stacks, an on-time gauge, a sealed vault.
const fees: Builder = (k) => {
  const stacks = new THREE.Group();
  const coinGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.07, 28);
  const coinMat = k.std(k.accent, { metalness: 0.5, roughness: 0.35 });
  const heights = [8, 11, 10, 14, 13, 17];
  heights.forEach((n, i) => {
    for (let c = 0; c < n; c++) {
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set(-1.6 + i * 0.6, 0.04 + c * 0.075, -0.6);
      coin.castShadow = true;
      stacks.add(coin);
    }
  });
  const falling = new THREE.Mesh(coinGeo, coinMat);
  stacks.add(falling);
  const gauge = new THREE.Group();
  gauge.add(new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 12, 64), k.std(0xdfe5ee)));
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.12, 12, 64, Math.PI * 2 * 0.92), k.std(k.green));
  gauge.add(arc);
  gauge.position.set(-1.7, 1.2, 1.2);
  gauge.rotation.y = 0.5;
  const vault = k.group(k.rbox(1.1, 1.1, 1.0, k.std(0x56657a, { metalness: 0.5, roughness: 0.35 }), 0, 0, 0, 0.08));
  const door = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), k.std(0xc9d3e0, { metalness: 0.6, roughness: 0.3 }));
  door.rotation.x = Math.PI / 2;
  door.position.set(0, 0.55, 0.52);
  vault.add(door);
  vault.position.set(1.6, 0, 1.2);
  vault.rotation.y = -0.5;
  add(k, stacks, gauge, vault);
  return {
    spots: [stacks, gauge, vault],
    update: (t) => {
      const p = wrap(t * 0.6);
      falling.position.set(1.4, 0.04 + 17 * 0.075 + (1 - p) * 2, -0.6);
      falling.rotation.x = p * 6;
      arc.rotation.z = Math.PI / 2;
      door.rotation.y = t * 0.6;
    },
  };
};

// Timetable — a week board whose periods reshuffle without ever colliding.
const timetable: Builder = (k) => {
  const board = new THREE.Group();
  board.add(k.rbox(4.2, 0.12, 2.9, k.std(WHITE), 0, 0, 0, 0.04));
  const colors = [k.brand, k.accent, k.green, new THREE.Color(0x8b5cf6), new THREE.Color(0x0891b2)];
  const blocks: { m: THREE.Mesh; slot: number }[] = [];
  const slotPos = (s: number) => new THREE.Vector3(-1.75 + (s % 6) * 0.7, 0.12, -1.15 + Math.floor(s / 6) * 0.58);
  for (let s = 0; s < 30; s++) {
    if (s % 7 === 3) continue;
    const m = k.rbox(0.6, 0.18, 0.48, k.std(colors[s % 5]), 0, 0, 0, 0.04);
    m.position.copy(slotPos(s));
    board.add(m);
    blocks.push({ m, slot: s });
  }
  const clock = new THREE.Group();
  const face = k.cyl(0.6, 0.6, 0.1, k.std(WHITE), 0, 0, 0, 40);
  face.rotation.x = Math.PI / 2;
  face.position.set(0, 0, 0);
  const hour = hand(k, 0.05, 0.32, INK, 0.07);
  const minute = hand(k, 0.04, 0.48, k.brand, 0.08);
  clock.add(face, hour, minute);
  clock.position.set(-2.4, 1.4, 0.8);
  clock.rotation.y = 0.6;
  const sub = k.rbox(0.6, 0.18, 0.48, k.std(0xe11d48), 0, 0, 0, 0.04);
  add(k, board, clock, sub);
  const free = [3, 10, 17, 24];
  return {
    spots: [board, clock, sub],
    update: (t) => {
      minute.rotation.z = -t * 1.2;
      hour.rotation.z = -t * 0.1;
      const cycle = Math.floor(t / 2.5);
      const p = wrap(t / 2.5);
      const dest = slotPos(free[cycle % free.length]);
      sub.position.set(dest.x, 0.12 + (1 - Math.min(1, p * 2)) * 1.6, dest.z + (1 - Math.min(1, p * 2)) * 1.2);
      blocks.forEach((b, i) => (b.m.position.y = 0.12 + Math.max(0, Math.sin(t * 2 - i * 0.4)) * 0.06));
    },
  };
};

// Attendance — a classroom of students lighting up as they're marked present.
const attendance: Builder = (k) => {
  const room = new THREE.Group();
  const students: THREE.MeshStandardMaterial[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const x = -1.75 + c * 0.7, z = -1.2 + r * 0.75;
      room.add(k.rbox(0.5, 0.35, 0.32, k.std(0xd9c7a6), x, 0, z + 0.12, 0.03));
      const mat = k.std(0xc9d3e0);
      students.push(mat);
      const s = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.2, 4, 10), mat);
      s.position.set(x, 0.55, z - 0.12);
      s.castShadow = true;
      room.add(s);
    }
  }
  const tablet = k.group(k.rbox(0.9, 0.06, 0.65, k.std(0x1f2633), 0, 0, 0, 0.05));
  const screen = k.box(0.8, 0.01, 0.55, k.std(k.brand, { emissive: k.brand, emissiveIntensity: 0.3 }), 0, 0.06, 0);
  screen.userData.keepEmissive = true;
  tablet.add(screen);
  tablet.add(k.box(0.1, 0.5, 0.1, k.std(0x9aa7b8), 0, -0.5, -0.05));
  tablet.position.set(2.2, 0.75, 1.3);
  tablet.rotation.set(1.1, -0.5, 0);
  const phone = k.group(k.rbox(0.45, 0.85, 0.06, k.std(0x1f2633), 0, 0, 0, 0.06));
  const bubble = k.rbox(0.5, 0.22, 0.05, k.std(0xe11d48), 0.15, 0.9, 0.05, 0.08);
  phone.add(bubble);
  phone.position.set(-2.4, 0, 1.4);
  phone.rotation.y = 0.5;
  add(k, room, tablet, phone);
  const absent = new Set([5, 14, 19]);
  return {
    spots: [room, tablet, phone],
    update: (t) => {
      const sweep = wrap(t / 4) * 30;
      students.forEach((m, i) => {
        const marked = i < sweep;
        m.color.set(!marked ? 0xc9d3e0 : absent.has(i) ? 0xf59e0b : 0x10b981);
      });
      bubble.scale.setScalar(0.6 + Math.max(0, Math.sin(t * 2.5)) * 0.5);
    },
  };
};

// Exams — 360° analytics ring, report cards piling up, results stopwatch.
const exams: Builder = (k) => {
  const ring = new THREE.Group();
  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const b = k.box(0.2, 1, 0.2, k.std(i % 4 === 0 ? k.accent : k.brand), Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4);
    b.geometry.translate(0, 0, 0);
    ring.add(b);
    bars.push(b);
  }
  ring.add(k.cyl(0.35, 0.45, 0.5, k.std(WHITE)), k.sphere(0.25, k.std(k.accent), 0, 0.5, 0));
  const cards = new THREE.Group();
  for (let i = 0; i < 10; i++) cards.add(k.rbox(0.8, 0.04, 1.0, k.std(i % 2 ? WHITE : 0xe8eef7), 0, i * 0.05, 0, 0.02));
  cards.position.set(2.4, 0, 1.0);
  cards.rotation.y = -0.4;
  const watch = new THREE.Group();
  const body = k.cyl(0.45, 0.45, 0.14, k.std(WHITE), 0, 0, 0, 36);
  body.rotation.x = Math.PI / 2;
  const sweep = hand(k, 0.04, 0.36, 0xe11d48, 0.09);
  watch.add(body, sweep, k.cyl(0.08, 0.08, 0.15, k.std(INK), 0, 0.45, 0));
  watch.position.set(-2.4, 1.1, 1.0);
  watch.rotation.y = 0.5;
  add(k, ring, cards, watch);
  return {
    spots: [ring, cards, watch],
    update: (t) => {
      bars.forEach((b, i) => {
        const h = 0.5 + Math.abs(Math.sin(t * 0.9 + i * 0.7)) * 1.5;
        b.scale.y = h;
        b.position.y = h / 2;
      });
      ring.rotation.y = t * 0.25;
      cards.children.forEach((c, i) => (c.visible = i < 3 + Math.floor(wrap(t / 6) * 8)));
      sweep.rotation.z = -t * 3;
    },
  };
};

// Communication — a broadcast mast sending messages out to every parent.
const communication: Builder = (k) => {
  const phones = new THREE.Group();
  const phoneMats: THREE.MeshStandardMaterial[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const mat = k.std(0x1f2633);
    const p = k.rbox(0.28, 0.5, 0.05, mat, Math.cos(a) * 2.7, 0, Math.sin(a) * 2.7, 0.05);
    p.lookAt(0, 0.25, 0);
    phones.add(p);
    phoneMats.push(mat);
  }
  const messages = new THREE.Group();
  const msgMat = k.std(k.brand);
  const msgs = Array.from({ length: 12 }, (_, i) => {
    const m = k.rbox(0.22, 0.14, 0.04, msgMat, 0, 0, 0, 0.03);
    messages.add(m);
    return { m, a: (i / 12) * Math.PI * 2, phase: (i * 0.37) % 1 };
  });
  const channels = new THREE.Group();
  [k.green, k.brand, k.accent].forEach((c, i) => {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    channels.add(k.cyl(0.22, 0.26, 0.6 + i * 0.2, k.std(c), Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0));
  });
  const mast = k.group(k.cyl(0.08, 0.12, 2.4, k.std(0xdfe5ee)), k.rbox(0.5, 0.4, 0.4, k.std(k.brand), 0, 2.4, 0, 0.06));
  add(k, phones, messages, channels, mast);
  return {
    spots: [phones, messages, channels],
    update: (t) => {
      msgs.forEach((m, i) => {
        const p = wrap(m.phase + t * 0.35);
        const r = p * 2.6;
        m.m.position.set(Math.cos(m.a) * r, 2.5 - p * 2.1 + Math.sin(p * Math.PI) * 0.6, Math.sin(m.a) * r);
        m.m.rotation.y = -m.a;
        phoneMats[i].emissive.setHex(p > 0.92 ? 0x10b981 : 0x000000);
      });
    },
  };
};

// Reports — a wall of templates, an export flying out, a live line chart.
const reports: Builder = (k) => {
  const wall = new THREE.Group();
  for (let i = 0; i < 15; i++) {
    const tile = k.rbox(0.62, 0.45, 0.05, k.std(WHITE), -1.4 + (i % 5) * 0.7, 0.3 + Math.floor(i / 5) * 0.55, -1.6, 0.04);
    wall.add(tile);
    wall.add(k.box(0.15 + (i % 3) * 0.1, 0.06, 0.02, k.std(i % 2 ? k.brand : k.accent), -1.5 + (i % 5) * 0.7, 0.45 + Math.floor(i / 5) * 0.55, -1.56));
  }
  const file = k.group(k.rbox(0.5, 0.65, 0.06, k.std(k.green), 0, 0, 0, 0.04), k.box(0.3, 0.05, 0.02, k.std(WHITE), 0, 0.4, 0.04));
  const live = new THREE.Group();
  const pts = 14;
  const dots: THREE.Mesh[] = [];
  for (let i = 0; i < pts; i++) {
    const d = k.sphere(0.07, k.std(k.brand));
    live.add(d);
    dots.push(d);
  }
  const pie = new THREE.Group();
  [[0, 0.45, k.brand], [0.45, 0.3, k.accent], [0.75, 0.25, k.green]].forEach(([s, l, c]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.18, 32, 1, false, (s as number) * Math.PI * 2, (l as number) * Math.PI * 2), k.std(c as THREE.Color));
    m.position.y = 0.09;
    m.castShadow = true;
    pie.add(m);
  });
  pie.position.set(1.9, 0, 1.0);
  live.add(pie);
  add(k, wall, file, live);
  return {
    spots: [wall, file, live],
    update: (t) => {
      dots.forEach((d, i) => d.position.set(-1.9 + i * 0.22, 0.6 + Math.sin(i * 0.6 + t * 1.5) * 0.3 + i * 0.05, 1.0));
      const p = wrap(t / 3);
      file.position.set(-0.2 + p * 0.6, 0.6 + p * 1.6, -1.2 + p * 1.4);
      file.rotation.y = p * 2;
      file.scale.setScalar(p > 0.85 ? (1 - p) / 0.15 : 1);
      pie.rotation.y = t * 0.4;
    },
  };
};

// Inventory — fully stocked racks, a scanner sweeping crates, a low-stock beacon.
const inventory: Builder = (k) => {
  const racks = new THREE.Group();
  const frame = k.std(0x9aa7b8, { metalness: 0.4 });
  const crateMat = k.std(0xbf8a57);
  [-1.2, 1.2].forEach((x) => {
    for (let lvl = 0; lvl < 3; lvl++) {
      racks.add(k.box(2.0, 0.06, 0.8, frame, x, lvl * 0.7, -0.8));
      for (let c = 0; c < 3; c++) racks.add(k.rbox(0.5, 0.45, 0.5, crateMat, x - 0.6 + c * 0.6, lvl * 0.7 + 0.06, -0.8, 0.03));
    }
    [-0.95, 0.95].forEach((dx) => racks.add(k.box(0.06, 2.2, 0.06, frame, x + dx, 0, -0.45), k.box(0.06, 2.2, 0.06, frame, x + dx, 0, -1.15)));
  });
  const scanner = new THREE.Group();
  const gun = k.rbox(0.25, 0.4, 0.15, k.std(INK), 0, 0, 0, 0.04);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xe11d48, transparent: true, opacity: 0.25, depthWrite: false }));
  beam.rotation.x = Math.PI / 2;
  beam.position.z = -0.65;
  beam.position.y = 0.2;
  scanner.add(gun, beam);
  const beacon = new THREE.Group();
  const lamp = k.sphere(0.22, k.std(k.accent, { emissive: k.accent, emissiveIntensity: 0.6 }), 0, 0.3, 0);
  lamp.userData.keepEmissive = true;
  beacon.add(k.cyl(0.3, 0.35, 0.3, k.std(INK)), lamp);
  beacon.position.set(2.4, 0, 1.4);
  add(k, racks, scanner, beacon);
  return {
    spots: [racks, scanner, beacon],
    update: (t) => {
      scanner.position.set(Math.sin(t * 0.8) * 1.8, 1.0 + Math.sin(t * 1.6) * 0.5, 0.6);
      (lamp.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.max(0, Math.sin(t * 5)) * 1.2;
    },
  };
};

// Payroll — an error-free calculator, PF/ESI/TDS jars, payslips printing.
const payroll: Builder = (k) => {
  const calc = k.group(k.rbox(1.0, 0.18, 1.3, k.std(0x56657a), 0, 0, 0, 0.06));
  calc.add(k.box(0.8, 0.02, 0.35, k.std(0xc7f0dc, { emissive: 0x10b981, emissiveIntensity: 0.2 }), 0, 0.18, -0.4));
  for (let i = 0; i < 12; i++) calc.add(k.rbox(0.18, 0.06, 0.16, k.std(i % 4 === 3 ? k.accent : WHITE), -0.3 + (i % 4) * 0.2, 0.18, -0.05 + Math.floor(i / 4) * 0.22, 0.03));
  calc.position.set(-1.8, 0, 0.6);
  calc.rotation.y = 0.4;
  const jars = new THREE.Group();
  const coins: THREE.Mesh[] = [];
  [k.brand, k.green, k.accent].forEach((c, i) => {
    jars.add(k.cyl(0.32, 0.32, 0.8, k.std(0xffffff, { transparent: true, opacity: 0.45 }), -0.8 + i * 0.8, 0, -1.2));
    jars.add(k.cyl(0.28, 0.28, 0.25 + i * 0.12, k.std(c), -0.8 + i * 0.8, 0, -1.2));
    const coin = k.cyl(0.12, 0.12, 0.04, k.std(c, { metalness: 0.4 }));
    jars.add(coin);
    coins.push(coin);
  });
  const printer = k.group(k.rbox(1.0, 0.55, 0.7, k.std(WHITE), 0, 0, 0, 0.06), k.box(0.7, 0.04, 0.3, k.std(INK), 0, 0.55, -0.1));
  const slips: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const s = k.box(0.6, 0.01, 0.8, k.std(WHITE));
    printer.add(s);
    slips.push(s);
  }
  printer.position.set(1.8, 0, 0.7);
  printer.rotation.y = -0.4;
  add(k, calc, jars, printer);
  return {
    spots: [calc, jars, printer],
    update: (t) => {
      coins.forEach((c, i) => {
        const p = wrap(t * 0.5 + i / 3);
        c.position.set(-0.8 + i * 0.8, 1.6 - p * 1.1, -1.2);
      });
      slips.forEach((s, i) => {
        const p = wrap(t * 0.45 + i / 3);
        s.position.set(0, 0.3 + p * 0.8, 0.35 + p * 0.9);
        s.rotation.x = -p * 0.8;
      });
    },
  };
};

// Library — scan-to-issue desk, shelves of books, a due-date alarm.
const library: Builder = (k) => {
  const desk = k.group(k.rbox(1.3, 0.75, 0.6, k.std(0xa67c52), 0, 0, 0, 0.04), k.rbox(0.35, 0.05, 0.25, k.std(INK), 0.3, 0.75, 0, 0.02));
  desk.position.set(1.6, 0, 1.3);
  desk.rotation.y = -0.4;
  const shelves = new THREE.Group();
  const wood = k.std(0x8a6a4a);
  const spine = [0xe11d48, 0x026dde, 0xf59e0b, 0x10b981, 0x8b5cf6, 0x0891b2, 0xf97316];
  [-1.1, 1.1].forEach((x, si) => {
    shelves.add(k.box(1.9, 2.0, 0.08, wood, x, 0, -1.55));
    for (let lvl = 0; lvl < 3; lvl++) {
      shelves.add(k.box(1.9, 0.05, 0.5, wood, x, lvl * 0.65, -1.3));
      for (let b = 0; b < 9; b++) shelves.add(k.box(0.16, 0.45 + ((b + lvl) % 3) * 0.06, 0.38, k.std(spine[(b + lvl + si) % 7]), x - 0.75 + b * 0.19, lvl * 0.65 + 0.05, -1.3));
    }
  });
  const flyer = k.box(0.16, 0.5, 0.38, k.std(k.accent));
  shelves.add(flyer);
  const alarm = new THREE.Group();
  const face = k.cyl(0.38, 0.38, 0.18, k.std(k.brand), 0, 0, 0, 32);
  face.rotation.x = Math.PI / 2;
  alarm.add(face, k.sphere(0.12, k.std(0xdfe5ee), -0.25, 0.3, 0), k.sphere(0.12, k.std(0xdfe5ee), 0.25, 0.3, 0));
  alarm.position.set(-1.8, 0.45, 1.3);
  add(k, desk, shelves, alarm);
  return {
    spots: [desk, shelves, alarm],
    update: (t) => {
      const p = wrap(t / 3.5);
      const s = Math.sin(p * Math.PI);
      flyer.position.set(-1.1 + 0.2 + s * 2.5, 0.7 + s * 1.2, -1.3 + s * 2.4);
      flyer.rotation.z = s * 1.5;
      alarm.rotation.z = Math.sin(t * 30) * 0.08 * Math.max(0, Math.sin(t * 1.3));
    },
  };
};

// Transport — a small city on a street grid. Buses roam every street, obeying
// signals at the inner crossings and queueing behind each other. At stops,
// students walk to the bus and board or get off, and a parent notification
// pops up. A GPS satellite tracks one bus.
const transport: Builder = (k) => {
  const H = 2.0; // outer road centre line
  const A = H / 3; // inner street centre line
  const C = [-H, -A, A, H]; // street lines, on both axes
  const L = 2 * A; // length of every street section
  const RW = 0.4; // street width
  const ROAD_Y = 0.04;
  const CR = 0.2; // corner radius of a bus turn
  const LANE = 0.1; // bus lane offset from the street centre
  const BUS_S = 0.55;
  const roadMat = k.std(0x6b7380);

  // Street graph: nodes are the 4 x 4 crossings.
  const idx = (i: number, j: number) => i * 4 + j;
  const nx = (n: number) => C[Math.floor(n / 4)];
  const nz = (n: number) => C[n % 4];
  const neighbours = (n: number) => {
    const i = Math.floor(n / 4);
    const j = n % 4;
    const r: number[] = [];
    if (i > 0) r.push(idx(i - 1, j));
    if (i < 3) r.push(idx(i + 1, j));
    if (j > 0) r.push(idx(i, j - 1));
    if (j < 3) r.push(idx(i, j + 1));
    return r;
  };
  const edgeKey = (a: number, b: number) => (a < b ? a * 16 + b : b * 16 + a);
  const visits = new Map<number, number>();
  let seed = 11;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  // At a crossing, take the least-travelled street (never straight back), so
  // over time the buses cover every road.
  const pickNext = (from: number, at: number) => {
    let best = Infinity;
    let pool: number[] = [];
    neighbours(at)
      .filter((n) => n !== from)
      .forEach((n) => {
        const v = visits.get(edgeKey(at, n)) ?? 0;
        if (v < best) {
          best = v;
          pool = [n];
        } else if (v === best) pool.push(n);
      });
    const n = pool[Math.floor(rnd() * pool.length)];
    visits.set(edgeKey(at, n), best + 1);
    return n;
  };

  // Streets, lawns and lane markings.
  C.forEach((c) => add(k, k.box(2 * H + RW, ROAD_Y, RW, roadMat, 0, 0, c), k.box(RW, ROAD_Y - 0.003, 2 * H + RW, roadMat, c, 0, 0)));
  const BC = [0, 1, 2].map((i) => (C[i] + C[i + 1]) / 2); // block centres
  const lawn = k.std(0xdcebd5);
  BC.forEach((cx) => BC.forEach((cz) => add(k, k.box(L - RW, 0.02, L - RW, lawn, cx, 0, cz))));
  const dashes: [number, number, number][] = [];
  C.forEach((c) => {
    for (let v = -H + 0.2; v <= H - 0.2; v += 0.3) {
      if (C.some((q) => Math.abs(v - q) < RW / 2 + 0.1)) continue;
      dashes.push([v, c, 0], [c, v, Math.PI / 2]);
    }
  });
  const marks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.006, 0.026), k.std(0xf1f3f7), dashes.length);
  const o = new THREE.Object3D();
  dashes.forEach(([x, z, r], i) => {
    o.position.set(x, ROAD_Y + 0.004, z);
    o.rotation.set(0, r, 0);
    o.updateMatrix();
    marks.setMatrixAt(i, o.matrix);
  });
  marks.receiveShadow = true;
  k.scene.add(marks);

  // Buildings.
  const house = (hx: number, hz: number, fx: number, fz: number, w: number, d: number, h: number, wall: number, roof: number) => {
    const g = new THREE.Group();
    g.add(k.box(w, h, d, k.std(wall)));
    const cone = new THREE.Mesh(new THREE.ConeGeometry((w / Math.SQRT2) * 1.1, 0.16, 4), k.std(roof));
    cone.geometry.rotateY(Math.PI / 4);
    cone.scale.z = d / w;
    cone.position.y = h + 0.08;
    g.add(shadowed(cone));
    g.add(k.box(0.06, 0.1, 0.012, k.std(0x7a4b2a), 0, 0, d / 2 + 0.004));
    g.position.set(hx, 0.02, hz);
    g.rotation.y = Math.atan2(fx, fz);
    add(k, g);
  };
  const school = (sx: number, sz: number, rot: number) => {
    const wall = k.std(0xf3e6d0);
    const g = new THREE.Group();
    g.add(k.rbox(0.82, 0.28, 0.4, wall, 0, 0, 0, 0.03));
    g.add(k.box(0.88, 0.04, 0.46, k.std(k.brand), 0, 0.28, 0));
    g.add(k.box(0.18, 0.16, 0.18, wall, 0, 0.32, 0));
    const tower = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.14, 4), k.std(k.accent));
    tower.geometry.rotateY(Math.PI / 4);
    tower.position.y = 0.48 + 0.07;
    g.add(shadowed(tower));
    g.add(k.cyl(0.008, 0.008, 0.26, k.std(0xdfe5ee), 0.3, 0.32, 0, 8));
    g.add(k.box(0.12, 0.07, 0.01, k.std(k.accent), 0.36, 0.5, 0));
    g.add(k.box(0.12, 0.16, 0.02, k.std(k.brand), 0, 0, 0.205));
    [-0.32, -0.19, 0.19, 0.32].forEach((wx) => g.add(k.box(0.09, 0.09, 0.02, k.std(INK), wx, 0.1, 0.205)));
    g.position.set(sx, 0.02, sz);
    g.rotation.y = rot;
    add(k, g);
  };
  const tree = (x: number, z: number, s = 1) => {
    const g = k.group(
      k.cyl(0.02, 0.025, 0.12, k.std(0x7a4b2a), 0, 0, 0, 8),
      k.cyl(0.0, 0.12, 0.22, k.std(0x3fa66b), 0, 0.08, 0, 8),
      k.cyl(0.0, 0.09, 0.18, k.std(0x2f8f5a), 0, 0.2, 0, 8),
    );
    g.position.set(x, 0.02, z);
    g.scale.setScalar(s);
    add(k, g);
  };

  // A stop is a point on a street where buses pause; the door is where
  // students enter or leave the building.
  interface Stop {
    kind: 'home' | 'school';
    axis: 'x' | 'z'; // direction the street runs
    x: number;
    z: number;
    door: { x: number; z: number };
  }
  const stops: Stop[] = [];
  const WALLS = [0xf4e3c8, 0xe8d5d0, 0xdce8f2, 0xf1e0b8, 0xe3ecd8];
  const ROOFS = [0xc2563b, 0x8a4b3a, 0xb4543a, 0x6b4a8a, 0x3f7cac];
  let hi = 0;
  BC.forEach((cx, bi) =>
    BC.forEach((cz, bj) => {
      if ((bi === 0 && bj === 2) || (bi === 2 && bj === 0)) {
        const north = bj === 2;
        const rot = north ? 0 : Math.PI;
        school(cx, cz, rot);
        stops.push({ kind: 'school', axis: 'x', x: cx, z: cz + (north ? L / 2 : -L / 2), door: { x: cx, z: cz + (north ? 0.27 : -0.27) } });
        return;
      }
      if (bi === 1 && bj === 1) {
        tree(-0.22, -0.18);
        tree(0.25, -0.2, 0.9);
        tree(-0.2, 0.24, 0.85);
        tree(0.2, 0.22);
        return;
      }
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([ox, oz], n) => {
        const alongX = (bi + bj) % 2 === 0;
        const fx = alongX ? (ox > 0 ? 1 : -1) : 0;
        const fz = alongX ? 0 : oz > 0 ? 1 : -1;
        const hx = cx + ox;
        const hz = cz + oz;
        const h = 0.15 + ((hi * 7) % 3) * 0.03;
        house(hx, hz, fx, fz, 0.3, 0.26, h, WALLS[hi % 5], ROOFS[(hi * 3) % 5]);
        hi++;
        if (n !== 3) return;
        const door = { x: hx + fx * 0.19, z: hz + fz * 0.19 };
        // The street this house faces.
        if (alongX) stops.push({ kind: 'home', axis: 'z', x: cx + (fx > 0 ? L / 2 : -L / 2), z: hz, door });
        else stops.push({ kind: 'home', axis: 'x', x: hx, z: cz + (fz > 0 ? L / 2 : -L / 2), door });
      });
    }),
  );
  [[-2.4, -2.4], [2.4, 2.4], [-2.4, 2.4], [2.4, -2.4]].forEach(([x, z]) => tree(x, z, 0.7));

  // Signal heads: one per approach at each inner crossing. All heads on the
  // same axis share their lamp materials, so they change together.
  const ON = [0xff3b30, 0xffb020, 0x22c55e];
  const OFF = [0x4a2523, 0x4a3a1c, 0x1d3a2b];
  const axisMats = [0, 1].map(() => ON.map((c) => k.std(c, { emissive: 0x000000, roughness: 0.4 })));
  [1, 2].forEach((i) =>
    [1, 2].forEach((j) =>
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
        const g = new THREE.Group();
        g.add(k.cyl(0.014, 0.014, 0.34, k.std(0x4b5563), 0, 0, 0, 8));
        g.add(k.rbox(0.085, 0.2, 0.085, k.std(0x1f2937), 0, 0.34, 0, 0.015));
        axisMats[dx !== 0 ? 0 : 1].forEach((m, n) => {
          const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.027, 10, 8), m);
          lamp.position.set(0, 0.505 - n * 0.065, 0.045);
          g.add(lamp);
        });
        // On the kerb just before the crossing, on the bus's side of the road.
        g.position.set(C[i] - dx * (RW / 2 + 0.08) + dz * (RW / 2 + 0.06), ROAD_Y, C[j] - dz * (RW / 2 + 0.08) - dx * (RW / 2 + 0.06));
        g.rotation.y = Math.atan2(-dx, -dz);
        add(k, g);
      }),
    ),
  );
  // 0 green, 1 amber, 2 red for each axis at time c of the 13 s cycle.
  const PERIOD = 13;
  const phase = (axis: number, c: number) => {
    const u = (c + (axis === 0 ? 0 : PERIOD / 2)) % PERIOD;
    return u < 5 ? 0 : u < 6 ? 1 : 2;
  };
  let clock = 0;
  const lit = [-1, -1];
  const clockLabel = () => {
    const m = 460 + Math.floor(clock * 2);
    const h = Math.floor(m / 60) % 24;
    return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  };

  // GPS satellite, with a beam to the tracked bus, a ping and a location pin.
  const sat = new THREE.Group();
  sat.add(k.rbox(0.4, 0.3, 0.3, k.std(WHITE), 0, 0, 0, 0.04));
  [-0.55, 0.55].forEach((x) => sat.add(k.box(0.6, 0.04, 0.35, k.std(k.brand, { metalness: 0.4 }), x, 0.13, 0)));
  sat.position.set(0, 2.8, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: k.brand, transparent: true, opacity: 0.18, depthWrite: false });
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1, 20, 1, true), beamMat);
  k.scene.add(beam);
  const pingMats = [0, 1].map(() => new THREE.MeshBasicMaterial({ color: k.brand, transparent: true, opacity: 0, depthWrite: false }));
  const pings = pingMats.map((m) => {
    const g = new THREE.RingGeometry(0.12, 0.16, 40);
    g.rotateX(-Math.PI / 2);
    const r = new THREE.Mesh(g, m);
    k.scene.add(r);
    return r;
  });
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshBasicMaterial({ color: k.accent }));
  k.scene.add(pin);

  // Students.
  const NAMES = ['Aarav', 'Diya', 'Kabir', 'Meera', 'Riya', 'Arjun', 'Isha', 'Vihaan'];
  const COATS = [0xe11d48, 0x2563eb, 0xf59e0b, 0x10b981, 0x8b5cf6, 0x06b6d4, 0xf97316, 0xec4899];
  const skin = k.std(0xf1c9a5);
  const legs = k.std(INK);
  const kids = NAMES.map((_, i) => {
    const g = k.group(
      k.cyl(0.022, 0.022, 0.035, legs, 0, 0, 0, 8),
      k.cyl(0.026, 0.03, 0.07, k.std(COATS[i]), 0, 0.035, 0, 10),
      k.sphere(0.026, skin, 0, 0.105),
    );
    g.visible = false;
    k.scene.add(g);
    return g;
  });
  const free = NAMES.map((_, i) => i); // students not on a bus or walking
  interface Job {
    kid: number;
    delay: number;
    t: number;
    dur: number;
    from: { x: number; z: number };
    to: { x: number; z: number };
    started: boolean;
    done: () => void;
  }
  let jobs: Job[] = [];
  const walk = (kid: number, from: { x: number; z: number }, to: { x: number; z: number }, delay: number, done: () => void) =>
    jobs.push({ kid, delay, t: 0, dur: 1.1, from, to, started: false, done });

  // Parent notifications: little phone-style cards that pop above a building.
  interface Pop {
    sprite: THREE.Sprite;
    cv: HTMLCanvasElement;
    tex: THREE.CanvasTexture;
    mat: THREE.SpriteMaterial;
    age: number;
    active: boolean;
    x: number;
    y: number;
    z: number;
  }
  const accent = `#${k.brand.getHexString()}`;
  const pops: Pop[] = Array.from({ length: 4 }, () => {
    const cv = document.createElement('canvas');
    cv.width = 360;
    cv.height = 120;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(0.5, 0);
    sprite.renderOrder = 10;
    sprite.visible = false;
    k.scene.add(sprite);
    return { sprite, cv, tex, mat, age: 0, active: false, x: 0, y: 0, z: 0 };
  });
  const notify = (title: string, sub: string, x: number, z: number, y: number) => {
    const p = pops.find((q) => !q.active) ?? pops.reduce((a, b) => (b.age > a.age ? b : a));
    const g = p.cv.getContext('2d');
    if (!g) return;
    g.clearRect(0, 0, 360, 120);
    g.save();
    g.shadowColor = 'rgba(15,42,74,0.28)';
    g.shadowBlur = 14;
    g.shadowOffsetY = 4;
    g.fillStyle = '#ffffff';
    g.beginPath();
    const [rx, ry, rw, rh, rr] = [10, 8, 340, 92, 20];
    g.moveTo(rx + rr, ry);
    g.arcTo(rx + rw, ry, rx + rw, ry + rh, rr);
    g.arcTo(rx + rw, ry + rh, rx, ry + rh, rr);
    g.arcTo(rx, ry + rh, rx, ry, rr);
    g.arcTo(rx, ry, rx + rw, ry, rr);
    g.closePath();
    g.fill();
    g.restore();
    g.fillStyle = accent;
    g.beginPath();
    g.arc(52, 54, 24, 0, Math.PI * 2);
    g.fill();
    g.font = '24px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#ffffff';
    g.fillText('🔔', 52, 56);
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillStyle = '#0f2a4a';
    g.font = '700 24px system-ui, sans-serif';
    g.fillText(title, 92, 50);
    g.fillStyle = '#64748b';
    g.font = '500 19px system-ui, sans-serif';
    g.fillText(sub, 92, 78);
    p.tex.needsUpdate = true;
    Object.assign(p, { age: 0, active: true, x, y, z });
    p.sprite.visible = true;
  };

  // Buses.
  const VMAX = 0.8;
  interface Dwell {
    stop: Stop;
    t: number;
    pending: number;
  }
  interface Bus {
    g: THREE.Group;
    id: number;
    a: number; // street section: from node a to node b, then on to c
    b: number;
    c: number;
    s: number; // distance along the section
    v: number;
    x: number; // centre-line position and heading
    z: number;
    dx: number;
    dz: number;
    riders: number[];
    dwell: Dwell | null;
    last: Stop | null;
  }
  // Only one bus at a time may use a crossing; the others wait at the stop line.
  const owner: (Bus | undefined)[] = [];
  const buses = new THREE.Group();
  const starts: [number, number, number][] = [
    [idx(0, 0), idx(1, 0), 0.5],
    [idx(3, 3), idx(2, 3), 0.6],
    [idx(3, 0), idx(3, 1), 0.7],
  ];
  const fleet: Bus[] = starts.map(([a, b, s], i) => {
    const glass = k.std(INK, { roughness: 0.15, metalness: 0.3 });
    const lamp = k.std(0xfff6d5, { emissive: 0xfff1b8, emissiveIntensity: 0.6 });
    // Body, side windows, a door on the kerb side (-z), then windshield and
    // headlights at the front (+x).
    const g = k.group(
      k.rbox(0.8, 0.4, 0.36, k.std(0xf5b301), 0, 0.08, 0, 0.08),
      k.box(0.56, 0.13, 0.38, glass, -0.02, 0.3, 0),
      k.box(0.1, 0.2, 0.012, glass, 0.12, 0.14, -0.182),
      k.box(0.03, 0.2, 0.3, glass, 0.4, 0.24, 0),
      k.box(0.02, 0.05, 0.07, lamp, 0.41, 0.13, -0.11),
      k.box(0.02, 0.05, 0.07, lamp, 0.41, 0.13, 0.11),
    );
    g.scale.set(BUS_S, BUS_S, BUS_S * 0.85);
    buses.add(g);
    return { g, id: i + 1, a, b, c: pickNext(a, b), s, v: VMAX, x: 0, z: 0, dx: 1, dz: 0, riders: [], dwell: null, last: null };
  });
  visits.set(edgeKey(starts[0][0], starts[0][1]), 1);
  const pose = (bus: Bus) => {
    const ax = nx(bus.a);
    const az = nz(bus.a);
    const bx = nx(bus.b);
    const bz = nz(bus.b);
    const d1x = Math.sign(bx - ax);
    const d1z = Math.sign(bz - az);
    if (bus.s <= L - CR) {
      bus.x = ax + d1x * bus.s;
      bus.z = az + d1z * bus.s;
      bus.dx = d1x;
      bus.dz = d1z;
    } else {
      // Round the corner on a quadratic curve through the crossing.
      const d2x = Math.sign(nx(bus.c) - bx);
      const d2z = Math.sign(nz(bus.c) - bz);
      const t = (bus.s - (L - CR)) / (2 * CR);
      const u = 1 - t;
      bus.x = u * u * (bx - d1x * CR) + 2 * u * t * bx + t * t * (bx + d2x * CR);
      bus.z = u * u * (bz - d1z * CR) + 2 * u * t * bz + t * t * (bz + d2z * CR);
      const tx = u * d1x + t * d2x;
      const tz = u * d1z + t * d2z;
      const m = Math.hypot(tx, tz) || 1;
      bus.dx = tx / m;
      bus.dz = tz / m;
    }
    bus.g.position.set(bus.x + bus.dz * LANE, ROAD_Y, bus.z - bus.dx * LANE);
    bus.g.rotation.y = Math.atan2(-bus.dz, bus.dx);
  };
  fleet.forEach(pose);

  // Pause at a stop and, if there is something to do, run the boarding or
  // drop-off. Returns false when nobody needs the bus here.
  const beginDwell = (bus: Bus, st: Stop) => {
    const door = { x: bus.x + bus.dz * 0.24, z: bus.z - bus.dx * 0.24 };
    const d: Dwell = { stop: st, t: 0, pending: 1 };
    const finish = (fn: () => void) => () => {
      d.pending--;
      fn();
    };
    const sub = () => `Bus ${bus.id} · ${clockLabel()}`;
    if (st.kind === 'school') {
      bus.riders.splice(0).forEach((kid, i) => {
        d.pending++;
        walk(kid, door, st.door, 0.15 + i * 0.4, finish(() => {
          free.push(kid);
          notify(`${NAMES[kid]} reached school`, sub(), st.door.x, st.door.z, 0.85);
        }));
      });
    } else if (bus.riders.length > 0 && rnd() < 0.4) {
      const kid = bus.riders.shift() as number;
      d.pending++;
      walk(kid, door, st.door, 0.15, finish(() => {
        free.push(kid);
        notify(`${NAMES[kid]} is home`, sub(), st.door.x, st.door.z, 0.45);
      }));
    } else if (free.length) {
      const kid = free.shift() as number;
      d.pending++;
      walk(kid, st.door, door, 0.15, finish(() => {
        bus.riders.push(kid);
        notify(`${NAMES[kid]} boarded the bus`, sub(), st.door.x, st.door.z, 0.45);
      }));
    }
    d.pending--; // release the guard that stops an early finish
    if (d.pending === 0) {
      bus.last = st;
      return false;
    }
    bus.dwell = d;
    return true;
  };

  // Stop signs on the kerb, one per stop.
  const stopGroup = new THREE.Group();
  const pins: THREE.Mesh[] = [];
  stops.forEach((st) => {
    const side = st.axis === 'x' ? Math.sign(st.door.z - st.z) : Math.sign(st.door.x - st.x);
    const px = st.axis === 'x' ? st.x : st.x + side * (RW / 2 + 0.06);
    const pz = st.axis === 'x' ? st.z + side * (RW / 2 + 0.06) : st.z;
    stopGroup.add(k.cyl(0.012, 0.012, 0.26, k.std(0xdfe5ee), px, ROAD_Y, pz, 8));
    const p = k.sphere(0.065, k.std(0xe11d48), px, ROAD_Y + 0.24, pz);
    stopGroup.add(p);
    pins.push(p);
  });
  add(k, sat, buses, stopGroup);

  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  return {
    spots: [sat, buses, stopGroup],
    update: (t, dt) => {
      clock += dt;
      const cyc = clock % PERIOD;
      const state = [phase(0, cyc), phase(1, cyc)];
      [0, 1].forEach((ax) => {
        if (lit[ax] === state[ax]) return;
        lit[ax] = state[ax];
        axisMats[ax].forEach((m, i) => {
          const on = i === state[ax];
          m.color.setHex(on ? ON[i] : OFF[i]);
          m.emissive.setHex(on ? ON[i] : 0x000000);
          m.emissiveIntensity = on ? 1.6 : 0;
        });
      });

      fleet.forEach((bus) => {
        let target = VMAX;
        const straight = bus.s > CR && bus.s < L - CR;
        if (bus.dwell) {
          const d = bus.dwell;
          target = 0;
          d.t += dt;
          if (d.t > 2.2 && d.pending === 0 && bus.v < 0.05) {
            bus.last = d.stop;
            bus.dwell = null;
          }
        } else if (straight) {
          // Brake for a red or amber signal at the next inner crossing.
          const bi = Math.floor(bus.b / 4);
          const bj = bus.b % 4;
          const dn = L - bus.s; // distance to the crossing centre
          const red = bi > 0 && bi < 3 && bj > 0 && bj < 3 && state[bus.dx !== 0 ? 0 : 1] !== 0;
          if (red && dn - 0.46 >= -0.03 && dn - 0.46 < 1) target = Math.min(target, 1.5 * Math.max(dn - 0.46, 0));
          // Wait for another bus to clear the crossing, otherwise claim it. The
          // claim distance is inside the stop positions, so a bus dwelling at a
          // stop never holds a crossing.
          if (dn < 0.9) {
            const holder = owner[bus.b];
            if (holder && holder !== bus) target = Math.min(target, 1.5 * Math.max(0, dn - 0.46));
            else if (!red && dn <= 0.42) owner[bus.b] = bus;
          }
          // Slow for a stop ahead on this street, then dwell.
          for (const st of stops) {
            if (bus.last === st) continue;
            const onStreet = st.axis === 'x' ? Math.abs(bus.dz) < 0.1 && Math.abs(bus.z - st.z) < 0.04 : Math.abs(bus.dx) < 0.1 && Math.abs(bus.x - st.x) < 0.04;
            if (!onStreet) continue;
            const da = st.axis === 'x' ? (st.x - bus.x) * bus.dx : (st.z - bus.z) * bus.dz;
            if (da < -0.04 || da > 0.5) continue;
            target = Math.min(target, 1.5 * Math.max(da, 0));
            if (da < 0.05 && bus.v < 0.12 && !beginDwell(bus, st)) target = VMAX;
            break;
          }
        }
        // Keep a gap to a bus ahead going the same way.
        fleet.forEach((other) => {
          if (other === bus) return;
          const rx = other.x - bus.x;
          const rz = other.z - bus.z;
          const ahead = rx * bus.dx + rz * bus.dz;
          const lateral = Math.abs(rx * bus.dz - rz * bus.dx);
          if (ahead > 0 && ahead < 1.2 && lateral < 0.2 && other.dx * bus.dx + other.dz * bus.dz > 0.7) {
            target = Math.min(target, Math.max(0, ahead - 0.62) * 1.5);
          }
        });
        bus.v += THREE.MathUtils.clamp(target - bus.v, -2.4 * dt, 1.2 * dt);
        bus.s += Math.max(0, bus.v) * dt;
        if (bus.s >= L + CR) {
          bus.a = bus.b;
          bus.b = bus.c;
          bus.c = pickNext(bus.a, bus.b);
          bus.s -= L;
        }
        pose(bus);
        if (owner[bus.a] === bus && bus.s > 0.55) owner[bus.a] = undefined;
        if (bus.last && Math.hypot(bus.x - bus.last.x, bus.z - bus.last.z) > 0.9) bus.last = null;
      });

      // Students walking to and from the bus.
      jobs.forEach((j) => {
        if (j.delay > 0) {
          j.delay -= dt;
          return;
        }
        const m = kids[j.kid];
        if (!j.started) {
          j.started = true;
          m.visible = true;
          m.rotation.y = Math.atan2(j.to.x - j.from.x, j.to.z - j.from.z);
        }
        j.t += dt / j.dur;
        const p = Math.min(1, j.t);
        m.position.set(j.from.x + (j.to.x - j.from.x) * p, ROAD_Y + Math.abs(Math.sin(p * Math.PI * 4)) * 0.012, j.from.z + (j.to.z - j.from.z) * p);
        if (p >= 1) {
          m.visible = false;
          j.done();
        }
      });
      jobs = jobs.filter((j) => j.t < 1);

      // Notification pop-ups: spring in, hold, fade.
      pops.forEach((p) => {
        if (!p.active) return;
        p.age += dt;
        if (p.age > 3.2) {
          p.active = false;
          p.sprite.visible = false;
          return;
        }
        const q = Math.min(1, p.age / 0.3);
        const sc = 1 + 2.7 * Math.pow(q - 1, 3) + 1.7 * Math.pow(q - 1, 2); // ease-out-back
        p.sprite.scale.set(1.35 * sc, 0.45 * sc, 1);
        p.sprite.position.set(p.x, p.y + Math.min(p.age, 0.5) * 0.08, p.z);
        p.mat.opacity = p.age > 2.7 ? 1 - (p.age - 2.7) / 0.5 : 1;
      });

      const tracked = fleet[0].g.position;
      dir.copy(sat.position).sub(tracked);
      const len = dir.length();
      beam.position.copy(tracked).addScaledVector(dir, 0.5);
      beam.quaternion.setFromUnitVectors(up, dir.normalize());
      beam.scale.set(1, len, 1);
      sat.rotation.y = t * 0.3;
      pings.forEach((r, i) => {
        const p = (t * 0.7 + i * 0.5) % 1;
        r.position.set(tracked.x, ROAD_Y + 0.01, tracked.z);
        r.scale.setScalar(1 + p * 3.2);
        pingMats[i].opacity = (1 - p) * 0.65;
      });
      pin.position.set(tracked.x, 0.52 + Math.sin(t * 3) * 0.03, tracked.z);
      pins.forEach((p, i) => p.scale.setScalar(1 + Math.max(0, Math.sin(t * 3 + i * 2)) * 0.35));
    },
  };
};

// Performance Insights — a scanning ring over a terrain of class performance.
const performanceInsights: Builder = (k) => {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.04, 8, 96), k.std(k.brand, { emissive: k.brand, emissiveIntensity: 0.3 }));
  ring.userData.keepEmissive = true;
  const scan = k.group(ring);
  const terrain = new THREE.Group();
  const cohortColors = [k.brand, k.green, k.accent];
  const cells: { m: THREE.Mesh; x: number; z: number }[] = [];
  for (let x = 0; x < 7; x++) {
    for (let z = 0; z < 3; z++) {
      const m = k.box(0.38, 1, 0.38, k.std(cohortColors[z]), -1.35 + x * 0.45, 0, -0.5 + z * 0.5);
      terrain.add(m);
      cells.push({ m, x, z });
    }
  }
  const flags = new THREE.Group();
  [[1, 2], [5, 0]].forEach(([x, z]) => {
    const fx = -1.35 + x * 0.45, fz = -0.5 + z * 0.5;
    flags.add(k.cyl(0.02, 0.02, 0.9, k.std(INK), fx, 0.35, fz), k.box(0.28, 0.16, 0.02, k.std(0xe11d48), fx + 0.14, 1.05, fz));
  });
  add(k, scan, terrain, flags);
  return {
    spots: [scan, terrain, flags],
    update: (t) => {
      cells.forEach((c) => {
        const low = (c.x === 1 && c.z === 2) || (c.x === 5 && c.z === 0);
        const h = low ? 0.35 : 0.6 + Math.abs(Math.sin(t * 0.8 + c.x * 0.6 + c.z)) * 0.9;
        c.m.scale.y = h;
        c.m.position.y = h / 2;
      });
      ring.position.y = 0.2 + wrap(t / 3) * 1.8;
      ring.rotation.x = Math.PI / 2;
    },
  };
};

// AI Secretary — an always-on core, drafts orbiting it, answers rising.
const aiSecretary: Builder = (k) => {
  const core = new THREE.Group();
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), k.std(k.brand, { flatShading: true, emissive: k.brand, emissiveIntensity: 0.45, roughness: 0.3 }));
  orb.userData.keepEmissive = true;
  orb.castShadow = true;
  core.add(k.cyl(0.6, 0.75, 0.5, k.std(WHITE)), orb);
  orb.position.y = 1.5;
  const drafts = new THREE.Group();
  const docs = Array.from({ length: 5 }, () => {
    const d = k.group(k.rbox(0.45, 0.6, 0.04, k.std(WHITE), 0, 0, 0, 0.03), k.box(0.3, 0.04, 0.02, k.std(k.accent), 0, 0.45, 0.03), k.box(0.3, 0.04, 0.02, k.std(0xc9d3e0), 0, 0.33, 0.03));
    drafts.add(d);
    return d;
  });
  const answers = new THREE.Group();
  const bubbles = Array.from({ length: 4 }, (_, i) => {
    const b = k.rbox(0.55, 0.3, 0.08, k.std(i % 2 ? k.green : 0xe8eef7), 0, 0, 0, 0.12);
    answers.add(b);
    return b;
  });
  add(k, core, drafts, answers);
  return {
    spots: [core, drafts, answers],
    update: (t) => {
      orb.rotation.y = t * 0.6;
      orb.position.y = 1.5 + Math.sin(t * 1.6) * 0.1;
      docs.forEach((d, i) => {
        const a = t * 0.5 + (i / docs.length) * Math.PI * 2;
        d.position.set(Math.cos(a) * 1.9, 1.1 + Math.sin(a * 2) * 0.25, Math.sin(a) * 1.9);
        d.rotation.y = -a + Math.PI / 2;
      });
      bubbles.forEach((b, i) => {
        const p = wrap(t * 0.25 + i / 4);
        b.position.set(1.9 + Math.sin(i * 2) * 0.4, 0.3 + p * 2.6, 1.0);
        b.scale.setScalar(p > 0.85 ? (1 - p) / 0.15 : Math.min(1, p * 6));
      });
    },
  };
};

// Parent & Student App — parents around a phone that absorbs WhatsApp groups.
const parentApp: Builder = (k) => {
  const parents = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    parents.add(k.sphere(0.13, k.std(k.accent), Math.cos(a) * 2.6, 0.42, Math.sin(a) * 2.6), k.cyl(0.13, 0.18, 0.42, k.std(i % 2 ? k.brand : 0x56657a), Math.cos(a) * 2.6, 0, Math.sin(a) * 2.6));
  }
  const groups = new THREE.Group();
  const dots = Array.from({ length: 14 }, (_, i) => {
    const d = k.sphere(0.09, k.std(0x25d366));
    groups.add(d);
    return { d, a: (i / 14) * Math.PI * 2, phase: (i * 0.29) % 1 };
  });
  const phone = new THREE.Group();
  phone.add(k.rbox(1.1, 2.0, 0.14, k.std(0x1f2633, { roughness: 0.35 }), 0, 0, 0, 0.12));
  const screen = k.box(0.95, 1.8, 0.01, k.std(0xeaf3ff, { emissive: 0xeaf3ff, emissiveIntensity: 0.35 }), 0, 0.1, 0.075);
  screen.userData.keepEmissive = true;
  phone.add(screen);
  const tiles = [k.brand, k.accent, k.green].map((c, i) => {
    const tile = k.rbox(0.8, 0.42, 0.04, k.std(c), 0, 1.35 - i * 0.55, 0.1, 0.05);
    phone.add(tile);
    return tile;
  });
  phone.position.y = 0.2;
  add(k, parents, groups, phone);
  return {
    spots: [parents, groups, phone],
    update: (t) => {
      phone.rotation.y = Math.sin(t * 0.5) * 0.35;
      dots.forEach((d) => {
        const p = wrap(d.phase + t * 0.3);
        const r = 2.4 * (1 - p);
        d.d.position.set(Math.cos(d.a + p) * r, 1.0 + Math.sin(p * Math.PI) * 0.8, Math.sin(d.a + p) * r);
        d.d.scale.setScalar(1 - p * 0.7);
      });
      tiles.forEach((tile, i) => (tile.position.x = Math.sin(t * 1.3 + i) * 0.05));
    },
  };
};

// Security — a shield over encrypted data, a padlock, an audit log.
const security: Builder = (k) => {
  const shield = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.3);
  shape.quadraticCurveTo(0.7, 1.15, 0.95, 1.1);
  shape.lineTo(0.95, 0.4);
  shape.quadraticCurveTo(0.9, -0.5, 0, -0.9);
  shape.quadraticCurveTo(-0.9, -0.5, -0.95, 0.4);
  shape.lineTo(-0.95, 1.1);
  shape.quadraticCurveTo(-0.7, 1.15, 0, 1.3);
  const shieldMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 }), k.std(k.brand, { roughness: 0.4 }));
  shieldMesh.position.set(0, 1.4, -0.09);
  shieldMesh.castShadow = true;
  shield.add(shieldMesh);
  const tick = k.box(0.5, 0.12, 0.06, k.std(WHITE), 0.08, 1.45, 0.16);
  tick.rotation.z = 0.7;
  shield.add(tick);
  const data = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    data.add(k.rbox(0.28, 0.28, 0.28, k.std(i % 3 ? 0xdfe5ee : k.accent), Math.cos(a) * 2.4, 0, Math.sin(a) * 2.4, 0.04));
  }
  const lock = k.group(k.rbox(0.7, 0.6, 0.35, k.std(k.accent), 0, 0, 0, 0.06));
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 24, Math.PI), k.std(0x9aa7b8, { metalness: 0.6, roughness: 0.3 }));
  shackle.position.y = 0.6;
  lock.add(shackle);
  lock.position.set(1.6, 0, 1.2);
  const log = new THREE.Group();
  for (let i = 0; i < 5; i++) log.add(k.rbox(0.9, 0.05, 0.22, k.std(i % 2 ? WHITE : 0xe8eef7), 0, 0.3 + i * 0.2, 0, 0.02));
  log.add(k.box(0.06, 1.3, 0.06, k.std(0x9aa7b8), -0.48, 0, 0));
  log.position.set(-1.7, 0, 1.2);
  add(k, shield, data, lock, log);
  return {
    spots: [data, lock, log],
    update: (t) => {
      shield.rotation.y = Math.sin(t * 0.6) * 0.5;
      shield.position.y = Math.sin(t * 1.2) * 0.06;
      data.rotation.y = t * 0.2;
      data.children.forEach((c, i) => (c.position.y = Math.abs(Math.sin(t * 1.5 + i * 0.6)) * 0.15));
      log.children.forEach((c, i) => {
        if (i < 5) c.position.x = Math.sin(t * 2 + i) * 0.03;
      });
    },
  };
};

// Pricing — three plan podiums of rising height.
const pricing: Builder = (k) => {
  const make = (x: number, h: number, color: THREE.ColorRepresentation, icons: number) => {
    const g = k.group(k.rbox(1.2, h, 1.2, k.std(color), 0, 0, 0, 0.08));
    for (let i = 0; i < icons; i++) g.add(k.rbox(0.26, 0.26, 0.26, k.std(WHITE), -0.3 + (i % 3) * 0.3, h + Math.floor(i / 3) * 0.3, 0, 0.05));
    g.position.x = x;
    return g;
  };
  const basic = make(-1.6, 0.6, 0xdfe5ee, 3);
  const growth = make(0, 1.1, k.brand, 5);
  const enterprise = make(1.6, 0.85, k.accent, 6);
  add(k, basic, growth, enterprise);
  return {
    spots: [basic, growth, enterprise],
    update: (t) => {
      [basic, growth, enterprise].forEach((g, i) => (g.position.y = Math.max(0, Math.sin(t * 1.4 + i * 1.3)) * 0.08));
    },
  };
};

export const MODULE_SCENES: Record<string, Builder> = {
  admissions,
  student,
  staff,
  fees,
  timetable,
  attendance,
  exams,
  communication,
  reports,
  inventory,
  payroll,
  library,
  transport,
  'performance-insights': performanceInsights,
  'ai-secretary': aiSecretary,
  'parent-app': parentApp,
  security,
  pricing,
};
