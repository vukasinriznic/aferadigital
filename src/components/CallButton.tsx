"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Phone } from "lucide-react";

const PHONE = "+381655339481";
const PHONE_DISPLAY = "+381 65 5339481";

export function CallButton() {
  const [qrOpen, setQrOpen] = useState(false);

  // On a desktop pointer, dialling a tel: link is useless -- show the QR so the
  // visitor can call from their phone instead. On touch, let the link dial.
  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (canHover()) {
      e.preventDefault();
      setQrOpen((v) => !v);
    }
  };

  return (
    <div className="relative inline-block">
      <a
        href={`tel:${PHONE}`}
        onClick={handleClick}
        onMouseEnter={() => canHover() && setQrOpen(true)}
        onMouseLeave={() => canHover() && setQrOpen(false)}
        className="flex items-center gap-2.5 rounded-full border border-border bg-white py-2 pl-2 pr-4 text-base font-normal text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ghost">
          <Phone size={13} strokeWidth={2} />
        </span>
        Pozovite nas
      </a>

      <AnimatePresence>
        {qrOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-1/2 z-30 mb-3 w-[180px] -translate-x-1/2 rounded-2xl border border-border bg-white p-4 text-center shadow-lg"
          >
            <Image
              src="/qr-phone.png"
              alt="QR kod za poziv"
              width={140}
              height={140}
              className="mx-auto h-[140px] w-[140px]"
            />
            <p className="mt-2 text-xs font-medium text-muted">
              Skenirajte da pozovete
            </p>
            <p className="text-xs font-semibold text-foreground">
              {PHONE_DISPLAY}
            </p>
            <div className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b border-r border-border bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
