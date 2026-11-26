"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const R = 1;
const MINT = new THREE.Color("#7ad19c");
const GOLD = new THREE.Color("#f2c94c");

function toVec(lat: number, lng: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Evenly spread points on the sphere (Fibonacci lattice). */
function useDots(count: number) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pos.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
}

const atmosphereShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      float i = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      gl_FragColor = vec4(0.48, 0.82, 0.61, 1.0) * i * 0.55;
    }`,
};

function Arc({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: boolean }) {
  const ref = useRef<{ material: { dashOffset: number } } | null>(null);
  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.38;
    mid.normalize().multiplyScalar(R * lift);
    return new THREE.QuadraticBezierCurve3(from, mid, to).getPoints(64);
  }, [from, to]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.material.dashOffset -= dt * 0.25;
  });
  return (
    <Line
      ref={ref as never}
      points={points}
      color={active ? GOLD : MINT}
      lineWidth={active ? 1.8 : 1}
      transparent
      opacity={active ? 0.95 : 0.4}
      dashed
      dashSize={0.04}
      gapSize={0.025}
    />
  );
}

function Marker({ pos, active }: { pos: THREE.Vector3; active: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.8) % 1;
    ring.current.scale.setScalar(1 + t * 2.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - t);
  });

  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <circleGeometry args={[active ? 0.022 : 0.014, 24]} />
        <meshBasicMaterial color={active ? GOLD : MINT} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring} position-z={0.001}>
        <ringGeometry args={[0.02, 0.026, 32]} />
        <meshBasicMaterial color={active ? GOLD : MINT} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

type LabelRefs = React.RefObject<(HTMLButtonElement | null)[]>;

function Globe({ points, active, labelRefs }: { points: [number, number][]; active: number; labelRefs: LabelRefs }) {
  const group = useRef<THREE.Group>(null);
  const dots = useDots(3200);
  const vecs = useMemo(() => points.map(([la, ln]) => toVec(la, ln, R * 1.003)), [points]);
  const pointer = useRef(new THREE.Vector2());
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock, camera, size }) => {
    const g = group.current;
    if (!g) return;
    // ease the active country round to face the camera
    const v = vecs[active];
    const targetY = -Math.atan2(v.x, v.z);
    const targetX = THREE.MathUtils.degToRad(points[active][0]) * 0.85;
    let dy = targetY - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy)); // shortest way round
    const sway = Math.sin(clock.elapsedTime * 0.35) * 0.04;
    g.rotation.y += (dy + sway * 0.2 + pointer.current.x * 0.12) * 0.045;
    g.rotation.x += (targetX + pointer.current.y * 0.08 - g.rotation.x) * 0.045;
    g.updateMatrixWorld();

    // place the DOM labels over their markers; fade those on the far side
    vecs.forEach((p, i) => {
      const el = labelRefs.current?.[i];
      if (!el) return;
      tmp.copy(p).applyMatrix4(g.matrixWorld);
      const facing = THREE.MathUtils.clamp((tmp.z - 0.15) * 3, 0, 1);
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -100%) translate(${x.toFixed(1)}px, ${(y - 12).toFixed(1)}px)`;
      el.style.opacity = facing.toFixed(2);
      el.style.pointerEvents = facing > 0.4 ? "auto" : "none";
      el.style.zIndex = String(Math.round(facing * 10) + (i === active ? 10 : 0));
    });
  });

  return (
    <group ref={group} rotation-order="XYZ">
      <mesh>
        <sphereGeometry args={[R * 0.985, 64, 64]} />
        <meshBasicMaterial color="#0a1711" />
      </mesh>
      <points geometry={dots}>
        <pointsMaterial color={MINT} size={0.011} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
      </points>
      {vecs.slice(0, -1).map((v, i) => (
        <Arc key={i} from={v} to={vecs[i + 1]} active={i === active || i + 1 === active} />
      ))}
      {vecs.map((v, i) => (
        <Marker key={i} pos={v} active={i === active} />
      ))}
    </group>
  );
}

/** Pulls the camera back so the globe (plus glow) always fits the panel's narrower side. */
function Fit({ radius = 1.32 }: { radius?: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * Math.min(1, aspect);
    cam.position.set(0, 0, radius / Math.sin(Math.atan(tanHalf)));
    cam.updateProjectionMatrix();
  }, [camera, size, radius]);
  return null;
}

export default function RouteGlobe({
  points,
  labels,
  active,
  onSelect,
  running,
}: {
  points: [number, number][];
  labels: string[];
  active: number;
  onSelect: (i: number) => void;
  running: boolean;
}) {
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="relative size-full">
      <Canvas camera={{ position: [0, 0, 3.1], fov: 38 }} dpr={[1, 2]} frameloop={running ? "always" : "never"} gl={{ antialias: true, alpha: true }}>
        <Fit />
        <Globe points={points} active={active} labelRefs={labelRefs} />
        <mesh scale={1.16}>
          <sphereGeometry args={[R, 64, 64]} />
          <shaderMaterial {...atmosphereShader} blending={THREE.AdditiveBlending} side={THREE.BackSide} transparent depthWrite={false} />
        </mesh>
      </Canvas>
      {/* DOM labels, positioned every frame by <Globe> */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            type="button"
            onClick={() => onSelect(i)}
            style={{ opacity: 0 }}
            className={
              "absolute left-0 top-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-300 will-change-transform " +
              (i === active ? "bg-gold text-gold-ink" : "bg-ink/70 text-snow/80 backdrop-blur hover:text-snow")
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
