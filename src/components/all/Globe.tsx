"use client";

import { useSpring } from "@react-spring/web";
import createGlobe, { COBEOptions } from "cobe";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

type Props = {};

const Globe = (props: Props) => {
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(
      canvasRef.current as HTMLCanvasElement,
      {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.3,
        dark: theme === "dark" ? 1 : 0,
        diffuse: 0,
        mapSamples: 20000,
        mapBrightness: 12,
        baseColor: [1, 1, 1],
        markerColor:
          theme === "dark"
            ? [184 / 255, 234 / 255, 219 / 255]
            : [38 / 255, 64 / 255, 115 / 255],
        glowColor: [120 / 255, 120 / 255, 120 / 255],
        markers: [{ location: [28.459497, 77.026634], size: 0.08 }],
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phi += 0.005;
          }
          state.phi = phi + r.get();
          state.width = width * 2;
          state.height = width * 2;
        },
      } as COBEOptions
    );

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [r, theme]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e: React.PointerEvent<HTMLCanvasElement>) => {
        pointerInteracting.current =
          e.clientX - pointerInteractionMovement.current;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grabbing";
        }
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab";
        }
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab";
        }
      }}
      onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta;
          api.start({ r: delta / 200 });
        }
      }}
      onTouchMove={(e: React.TouchEvent<HTMLCanvasElement>) => {
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
        contain: "layout paint size",
        opacity: 0,
        transition: "opacity 1s ease",
        userSelect: "none",
      }}
    />
  );
};

export default Globe;
