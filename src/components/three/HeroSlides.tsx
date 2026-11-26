"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Noise-driven displacement between two photos, each mapped "object-fit: cover".
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform vec2 uFromSize;
  uniform vec2 uToSize;
  uniform vec2 uPlane;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;

  vec2 cover(vec2 uv, vec2 img) {
    float rp = uPlane.x / uPlane.y;
    float ri = img.x / img.y;
    vec2 s = rp < ri ? vec2(rp / ri, 1.0) : vec2(1.0, ri / rp);
    return (uv - 0.5) * s + 0.5;
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    // slow drift + pointer parallax
    float zoom = 1.0 - 0.035 * (0.5 + 0.5 * sin(uTime * 0.08));
    vec2 uv = (vUv - 0.5) * zoom + 0.5 + uMouse * 0.012;

    float n = fbm(uv * 3.2 + uTime * 0.03);
    float p = uProgress;
    float edge = smoothstep(p - 0.25, p + 0.25, n * 0.5 + (1.0 - vUv.y) * 0.5);
    float mask = 1.0 - edge;

    vec2 dir = vec2(n - 0.5, n - 0.5) * 0.35;
    vec2 uvFrom = cover(uv + dir * p, uFromSize);
    vec2 uvTo = cover(uv - dir * (1.0 - p), uToSize);

    vec4 a = texture2D(uFrom, uvFrom);
    vec4 b = texture2D(uTo, uvTo);
    vec4 col = mix(a, b, smoothstep(0.0, 1.0, mix(mask, p, 0.35)));

    // glowing seam along the transition edge
    float seam = (1.0 - abs(edge - 0.5) * 2.0) * step(0.001, p) * step(p, 0.999);
    col.rgb += vec3(0.48, 0.82, 0.61) * pow(seam, 6.0) * 0.35;

    gl_FragColor = vec4(col.rgb, 1.0);
  }
`;

function Slides({ images, index, onReady }: { images: string[]; index: number; onReady: () => void }) {
  const { viewport, size } = useThree();
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() => images.map(() => null));
  const shown = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);
  const mouse = useRef(new THREE.Vector2());

  // Built imperatively: R3F copies a `uniforms` prop, which would detach our live references.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uFrom: { value: null },
          uTo: { value: null },
          uFromSize: { value: new THREE.Vector2(16, 9) },
          uToSize: { value: new THREE.Vector2(16, 9) },
          uPlane: { value: new THREE.Vector2(1, 1) },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
        },
      }),
    [],
  );
  const uniforms = material.uniforms;
  useEffect(
    () => () => {
      tween.current?.kill();
      material.dispose();
    },
    [material],
  );

  // Load the first photo immediately, then the rest in order.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    const loaded: THREE.Texture[] = [];
    images.forEach((src, i) => {
      loader.load(src, (t) => {
        if (cancelled) return t.dispose();
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        loaded.push(t);
        setTextures((prev) => {
          const next = [...prev];
          next[i] = t;
          return next;
        });
      });
    });
    return () => {
      cancelled = true;
      loaded.forEach((t) => t.dispose());
    };
  }, [images]);

  const sizeOf = (t: THREE.Texture) => {
    const img = t.image as HTMLImageElement;
    return new THREE.Vector2(img.naturalWidth || img.width, img.naturalHeight || img.height);
  };

  // First photo available: show it (the parent fades the canvas in after it has drawn)
  useEffect(() => {
    const first = textures[0];
    if (!first || uniforms.uFrom.value) return;
    uniforms.uFrom.value = first;
    uniforms.uTo.value = first;
    uniforms.uFromSize.value = sizeOf(first);
    uniforms.uToSize.value = sizeOf(first);
  }, [textures, uniforms]);
  const announced = useRef(false);

  // Transition to the requested slide once its texture is available.
  useEffect(() => {
    const target = textures[index];
    if (!target || index === shown.current || !uniforms.uFrom.value) return;
    tween.current?.progress(1).kill();
    const from = (textures[shown.current] ?? uniforms.uTo.value) as THREE.Texture;
    uniforms.uFrom.value = from;
    uniforms.uFromSize.value = sizeOf(from);
    uniforms.uTo.value = target;
    uniforms.uToSize.value = sizeOf(target);
    uniforms.uProgress.value = 0;
    shown.current = index;
    tween.current = gsap.to(uniforms.uProgress, { value: 1, duration: 1.8, ease: "power2.inOut" });
  }, [index, textures, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    (uniforms.uPlane.value as THREE.Vector2).set(size.width, size.height);
    (uniforms.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.04);
    if (!announced.current && uniforms.uFrom.value) {
      announced.current = true;
      // this frame draws the photo; reveal on the next one
      requestAnimationFrame(onReady);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function HeroSlides({
  images,
  index,
  active,
  onReady,
}: {
  images: string[];
  index: number;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      flat
      linear
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
    >
      <Slides images={images} index={index} onReady={onReady} />
    </Canvas>
  );
}
