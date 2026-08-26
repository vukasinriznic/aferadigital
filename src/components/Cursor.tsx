"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const TOUCH_QUERY = "(pointer: coarse)";

function subscribeToPointer(onChange: () => void) {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28 });
  const springY = useSpring(y, { stiffness: 400, damping: 28 });
  const [visible, setVisible] = useState(false);
  // Server renders as non-touch, then this settles on the client without the
  // cascading render an effect-plus-setState would cause.
  const isTouch = useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    if (isTouch) return;

    const root = document.documentElement;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      // Only now is the dot on screen, so it is safe to hide the native cursor.
      root.classList.add("custom-cursor");
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      root.removeEventListener("mouseleave", handleLeave);
      root.classList.remove("custom-cursor");
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: "white",
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    />
  );
}
