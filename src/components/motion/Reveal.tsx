"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Reveal(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      {...props}
    />
  );
}
