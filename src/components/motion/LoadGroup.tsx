"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { staggerContainer } from "@/lib/motion";

export function LoadGroup(props: HTMLMotionProps<"div">) {
  return (
    <motion.div initial="hidden" animate="show" variants={staggerContainer} {...props} />
  );
}
