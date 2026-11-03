import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Small helpers shared by the per-module scenes: consistent low-poly
// materials and shadow-casting primitives, positioned by their base.

export interface Kit {
  scene: THREE.Scene;
  brand: THREE.Color;
  accent: THREE.Color;
  green: THREE.Color;
  std: (color: THREE.ColorRepresentation, extra?: THREE.MeshStandardMaterialParameters) => THREE.MeshStandardMaterial;
  box: (w: number, h: number, d: number, mat: THREE.Material, x?: number, y?: number, z?: number) => THREE.Mesh;
  rbox: (w: number, h: number, d: number, mat: THREE.Material, x?: number, y?: number, z?: number, r?: number) => THREE.Mesh;
  cyl: (rt: number, rb: number, h: number, mat: THREE.Material, x?: number, y?: number, z?: number, seg?: number) => THREE.Mesh;
  sphere: (r: number, mat: THREE.Material, x?: number, y?: number, z?: number) => THREE.Mesh;
  group: (...children: THREE.Object3D[]) => THREE.Group;
}

export function shadowed<T extends THREE.Object3D>(o: T): T {
  o.traverse((c) => {
    if (c instanceof THREE.Mesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
  return o;
}

export function makeKit(scene: THREE.Scene, brand: THREE.Color, accent: THREE.Color): Kit {
  const std: Kit['std'] = (color, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...extra });
  return {
    scene,
    brand,
    accent,
    green: new THREE.Color(0x10b981),
    std,
    box: (w, h, d, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y + h / 2, z);
      return shadowed(m);
    },
    rbox: (w, h, d, mat, x = 0, y = 0, z = 0, r = 0.05) => {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), mat);
      m.position.set(x, y + h / 2, z);
      return shadowed(m);
    },
    cyl: (rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 24) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
      m.position.set(x, y + h / 2, z);
      return shadowed(m);
    },
    sphere: (r, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat);
      m.position.set(x, y + r, z);
      return shadowed(m);
    },
    group: (...children) => {
      const g = new THREE.Group();
      children.forEach((c) => g.add(c));
      return g;
    },
  };
}
