"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const SEEN_KEY = "afera-intro-seen";
const LOGO_MS = 1150;
const FADE_START_MS = 950;
const FADE_MS = 400;

type Phase = "cover" | "intro" | "fading" | "gone";

export function IntroLoader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("cover");

  useEffect(() => {
    const skip =
      sessionStorage.getItem(SEEN_KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (skip) {
      setPhase("gone");
      return;
    }

    sessionStorage.setItem(SEEN_KEY, "1");
    setPhase("intro");

    // Unmounting is timer-driven, never animation-driven: in a background tab
    // rAF is paused, so waiting on the animation would leave the page covered.
    const fade = setTimeout(() => setPhase("fading"), FADE_START_MS);
    const done = setTimeout(() => setPhase("gone"), FADE_START_MS + FADE_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, []);

  return (
    <>
      {children}

      {phase !== "gone" && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-surface transition-opacity ease-out ${
            phase === "fading" ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          {phase !== "cover" && (
            <motion.div
              className="w-40 sm:w-56"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1, 1, 3.2], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: LOGO_MS / 1000,
                times: [0, 0.3, 0.55, 1],
                ease: ["easeOut", "linear", "easeIn"],
              }}
            >
              <Image
                src="/images/logo-mark.png"
                alt="Afera Digital"
                width={900}
                height={789}
                priority
                className="h-auto w-full"
              />
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
