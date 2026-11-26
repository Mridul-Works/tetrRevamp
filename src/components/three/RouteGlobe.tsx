"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
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
      float i = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(0.48, 0.82, 0.61, 1.0) * i;
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

function Marker({ pos, label, active, onClick }: { pos: THREE.Vector3; label: string; active: boolean; onClick: () => void }) {
  const ring = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLButtonElement>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);

  useFrame(({ clock }) => {
    if (ring.current) {
      const s = 1 + ((clock.elapsedTime * 0.8) % 1) * 2.2;
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - ((clock.elapsedTime * 0.8) % 1));
    }
    // fade labels on the far side of the globe
    if (labelRef.current && ring.current) {
      ring.current.getWorldPosition(world);
      const facing = THREE.MathUtils.clamp((world.z - 0.15) * 3, 0, 1);
      labelRef.current.style.opacity = String(facing);
      labelRef.current.style.pointerEvents = facing > 0.4 ? "auto" : "none";
    }
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
      <Html center zIndexRange={[20, 0]} style={{ transform: "translateY(-22px)" }}>
        <button
          ref={labelRef}
          type="button"
          onClick={onClick}
          className={
            "whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-300 " +
            (active ? "bg-gold text-gold-ink" : "bg-ink/70 text-snow/80 backdrop-blur hover:text-snow")
          }
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

function Globe({ points, labels, active, onSelect }: { points: [number, number][]; labels: string[]; active: number; onSelect: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const dots = useDots(3200);
  const vecs = useMemo(() => points.map(([la, ln]) => toVec(la, ln, R * 1.003)), [points]);
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    const onMove = (e: PointerEvent) => pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const v = vecs[active];
    const targetY = -Math.atan2(v.x, v.z);
    const [lat] = points[active];
    const targetX = THREE.MathUtils.degToRad(lat) * 0.85;
    // shortest path around the y axis
    let dy = targetY - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    const sway = Math.sin(clock.elapsedTime * 0.35) * 0.04;
    g.rotation.y += (dy + sway * 0.2 + pointer.current.x * 0.12) * 0.045;
    g.rotation.x += (targetX + pointer.current.y * 0.08 - g.rotation.x) * 0.045;
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
        <Marker key={labels[i]} pos={v} label={labels[i]} active={i === active} onClick={() => onSelect(i)} />
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
  return (
    <Canvas camera={{ position: [0, 0, 3.1], fov: 38 }} dpr={[1, 2]} frameloop={running ? "always" : "never"} gl={{ antialias: true, alpha: true }}>
      <Fit />
      <Globe points={points} labels={labels} active={active} onSelect={onSelect} />
      <mesh scale={1.18}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial
          {...atmosphereShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </Canvas>
  );
}
