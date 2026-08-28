"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const SEEN_KEY = "afera-intro-seen";
const LOGO_MS = 1150;
const FADE_START_MS = 950;
const FADE_MS = 400;

type Phase = "cover" | "intro" | "fading" | "gone";

export function IntroLoader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("cover");
  // Decided once and reused: StrictMode runs this effect twice, and re-reading
  // sessionStorage on the second pass would find the flag the first pass wrote
  // and skip the intro that was just starting.
  const playRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (playRef.current === null) {
      playRef.current =
        !sessionStorage.getItem(SEEN_KEY) &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (playRef.current) sessionStorage.setItem(SEEN_KEY, "1");
    }

    if (!playRef.current) {
      setPhase("gone");
      return;
    }

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
      {/* Hidden rather than unmounted through "intro", so images fetch and the
          page's own Reveal animations (IntersectionObserver-driven, so they
          fire regardless of visibility) finish quietly and are already
          settled once revealed. Hidden elements are skipped at paint time,
          which is what actually stops them competing with the intro for
          frames -- rendering them at full opacity underneath an opaque cover
          was invisible to the eye but not to the browser.
          "fading" is where the crossfade happens: visibility flips to visible
          the instant the cover starts dissolving, and opacity eases in over
          the same span, so the page appears gradually through the cover
          rather than snapping in the moment it's gone. */}
      <div
        style={{
          visibility: phase === "cover" || phase === "intro" ? "hidden" : "visible",
          opacity: phase === "cover" || phase === "intro" ? 0 : 1,
          transition:
            phase === "fading" ? `opacity ${FADE_MS}ms ease-out` : undefined,
        }}
      >
        {children}
      </div>

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
