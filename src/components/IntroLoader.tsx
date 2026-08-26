"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const SEEN_KEY = "afera-intro-seen";

type Phase = "pending" | "intro" | "done";

export function IntroLoader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase("done");
    } else {
      sessionStorage.setItem(SEEN_KEY, "1");
      setPhase("intro");
    }
  }, []);

  return (
    <>
      <div style={{ visibility: phase === "done" ? "visible" : "hidden" }}>
        {children}
      </div>

      {phase === "pending" && (
        <div className="fixed inset-0 z-50 bg-surface" />
      )}

      {phase === "intro" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, times: [0, 0.25, 0.55, 1], ease: "linear" }}
          onAnimationComplete={() => setPhase("done")}
        >
          <motion.div
            className="w-40 sm:w-56"
            initial={{ scale: 0.55 }}
            animate={{ scale: [0.55, 1.05, 1.05, 3.4] }}
            transition={{
              duration: 1.1,
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
        </motion.div>
      )}
    </>
  );
}
