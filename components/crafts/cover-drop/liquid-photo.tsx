"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

const SETTLE = 1.15;
const FOV = 30;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;
  varying float vDist;
  varying vec2 vDir;

  // Rings running outward, only where the photo has spread, dying down.
  float wave(float d, float t) {
    float reach = 1.35 * (1.0 - pow(1.0 - min(t / 0.8, 1.0), 3.0));
    float inside = smoothstep(reach, reach - 0.3, d);
    return 0.07 * sin(16.0 * d - 10.0 * t) * exp(-3.4 * t) * inside;
  }

  void main() {
    vUv = uv;
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
    vDist = length(p) / length(vec2(uAspect, 1.0) * 0.5);
    vDir = normalize(p + 1e-5);
    vec2 edge = smoothstep(0.0, 0.1, min(uv, 1.0 - uv));
    vec3 pos = position;
    pos.z += wave(vDist, uTime) * edge.x * edge.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uCover;
  varying vec2 vUv;
  varying float vDist;
  varying vec2 vDir;

  void main() {
    float t = uTime;
    float grow = 1.0 - pow(1.0 - min(t / 0.8, 1.0), 3.0);
    float reach = 1.35 * grow;
    float inside = smoothstep(reach, reach - 0.3, vDist);
    float slope = cos(16.0 * vDist - 10.0 * t) * exp(-3.4 * t) * inside;

    float zoom = 1.0 + 0.15 * (1.0 - grow);
    vec2 uv = (vUv - 0.5) / zoom * uCover + 0.5;
    uv += vDir * slope * 0.018;
    vec3 color = texture2D(uMap, uv).rgb;

    float develop = smoothstep(0.0, 0.9, t);
    float grey = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(grey), color, mix(0.4, 1.0, develop));
    color *= mix(1.25, 1.0, develop);

    // Crests facing the light catch a highlight.
    float light = dot(vDir, normalize(vec2(-0.6, 0.8)));
    color += slope * light * 0.3;

    float alpha = 1.0 - smoothstep(reach - 0.14, reach, vDist);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

type Props = { src: string; onSettled: () => void };

export function LiquidPhoto({ src, onSettled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const settled = useRef(onSettled);

  useEffect(() => {
    settled.current = onSettled;
  });

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const { width, height } = host.getBoundingClientRect();
    const aspect = width / height;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    host.appendChild(renderer.domElement);

    // Far enough back that the flat plane exactly fills the view.
    const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 10);
    camera.position.z = 0.5 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

    const uniforms = {
      uMap: { value: null as THREE.Texture | null },
      uTime: { value: 0 },
      uAspect: { value: aspect },
      uCover: { value: new THREE.Vector2(1, 1) },
    };
    const geometry = new THREE.PlaneGeometry(aspect, 1, 160, 110);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));

    let frame = 0;
    let texture: THREE.Texture | null = null;

    new THREE.TextureLoader().load(src, (loaded) => {
      texture = loaded;
      const { width: w, height: h } = loaded.image as HTMLImageElement;
      const ratio = w / h;
      uniforms.uCover.value.set(
        Math.min(aspect / ratio, 1),
        Math.min(ratio / aspect, 1),
      );
      uniforms.uMap.value = loaded;

      const start = performance.now();
      const tick = () => {
        const t = (performance.now() - start) / 1000;
        uniforms.uTime.value = t;
        renderer.render(scene, camera);
        if (t < SETTLE) frame = requestAnimationFrame(tick);
        else settled.current();
      };
      tick();
    });

    return () => {
      cancelAnimationFrame(frame);
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src]);

  return <div ref={ref} aria-hidden className="absolute inset-0" />;
}
