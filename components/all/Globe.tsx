"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { useSpring } from "@react-spring/web";
import createGlobe from "cobe";

const HOME: [number, number] = [12.9716, 77.5946];

// cobe v2 shows longitude (228° - phi) front and centre. Start a little east of
// home so Bengaluru drifts through the middle of the view as it spins.
const START_PHI = ((228 - (HOME[1] + 20)) * Math.PI) / 180;

const Globe = () => {
  const { resolvedTheme } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef<number>(0);
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // cobe v2 wraps its canvas in a div of its own, so the canvas is created
    // here rather than by React, which would otherwise lose track of it.
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "width:100%;height:100%;contain:layout paint size;opacity:0;transition:opacity 1s ease";
    container.append(canvas);

    const dark = resolvedTheme === "dark";
    let phi = START_PHI;
    let width = container.offsetWidth;
    let frame = 0;

    const onResize = () => {
      width = container.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    // v2 takes CSS pixels and scales by devicePixelRatio itself.
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width,
      height: width,
      phi,
      theta: -0.45,
      dark: dark ? 1 : 0,
      diffuse: 0,
      mapSamples: 20000,
      mapBrightness: 12,
      baseColor: [1, 1, 1],
      markerColor: dark
        ? [184 / 255, 234 / 255, 219 / 255]
        : [38 / 255, 64 / 255, 115 / 255],
      glowColor: [120 / 255, 120 / 255, 120 / 255],
      markers: [{ location: HOME, size: 0.05 }],
      // v2 lifts markers off the surface by default, which reads as floating.
      markerElevation: 0,
    });

    // v2 dropped onRender, so the spin is driven from here.
    const tick = () => {
      if (pointerInteracting.current === null) {
        phi += 0.003;
      }
      globe.update({ phi: phi + r.get(), width, height: width });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const fadeIn = setTimeout(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fadeIn);
      globe.destroy();
      container.replaceChildren();
      window.removeEventListener("resize", onResize);
    };
  }, [r, resolvedTheme]);

  const setCursor = (cursor: string) => {
    if (containerRef.current) {
      containerRef.current.style.cursor = cursor;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
        pointerInteracting.current =
          e.clientX - pointerInteractionMovement.current;
        setCursor("grabbing");
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
        setCursor("grab");
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
        setCursor("grab");
      }}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta;
          api.start({ r: delta / 200 });
        }
      }}
      onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
          const delta = e.touches[0].clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta;
          api.start({ r: delta / 100 });
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        userSelect: "none",
      }}
    />
  );
};

export default Globe;
