"use client";

import { RefObject, useEffect } from "react";

/** Movement below this is a click, not a drag. */
const DRAG_THRESHOLD_PX = 4;

/** Per-frame velocity kept after release; lower stops sooner. */
const FRICTION = 0.94;

/**
 * Click-and-drag scrolling for a horizontal scroller, for mice only — touch
 * and pens already pan natively, and trackpads send wheel events.
 *
 * The strip keeps gliding for a moment after release, the way a flicked touch
 * list does, and the click that ends a drag is swallowed so letting go over a
 * button doesn't also press it. While dragging, `data-dragging` is set on the
 * node for styling.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let glide = 0;

    const stopGlide = () => cancelAnimationFrame(glide);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (node.scrollWidth <= node.clientWidth) return;

      stopGlide();
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startScroll = node.scrollLeft;
      lastTime = event.timeStamp;
      velocity = 0;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;

      const dx = event.clientX - startX;

      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;

        dragging = true;
        node.setPointerCapture(event.pointerId);
        node.dataset.dragging = "true";
      }

      node.scrollLeft = startScroll - dx;

      const elapsed = event.timeStamp - lastTime;
      if (elapsed > 0) {
        // Smoothed, so one jittery sample at release doesn't decide the glide.
        velocity = 0.8 * ((event.clientX - lastX) / elapsed) + 0.2 * velocity;
      }
      lastX = event.clientX;
      lastTime = event.timeStamp;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;

      if (!dragging) return;

      if (node.hasPointerCapture(event.pointerId)) {
        node.releasePointerCapture(event.pointerId);
      }
      delete node.dataset.dragging;

      // A pause before letting go means the reader meant to stop there.
      if (event.timeStamp - lastTime > 80) velocity = 0;

      let speed = velocity * 16; // px per frame at 60fps
      const step = () => {
        if (Math.abs(speed) < 0.5) return;

        node.scrollLeft -= speed;
        speed *= FRICTION;
        glide = requestAnimationFrame(step);
      };
      glide = requestAnimationFrame(step);
    };

    // Runs in the capture phase so the bar under the cursor never sees it.
    const onClick = (event: MouseEvent) => {
      if (!dragging) return;

      dragging = false;
      event.preventDefault();
      event.stopPropagation();
    };

    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    node.addEventListener("click", onClick, true);
    node.addEventListener("wheel", stopGlide, { passive: true });

    return () => {
      stopGlide();
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
      node.removeEventListener("click", onClick, true);
      node.removeEventListener("wheel", stopGlide);
    };
  }, [ref]);
}
