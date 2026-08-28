import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CallButton } from "@/components/CallButton";
import { ContactForm } from "@/components/ContactForm";
import { InstagramIcon } from "@/components/icons/social-icons";
import { Reveal } from "@/components/motion/Reveal";
import {
  AFERA_IG_URL,
  ANDREJ_URL,
  VUKASIN_URL,
  darkPillClass,
  pillClass,
} from "@/lib/links";

export const metadata: Metadata = {
  title: "Kontakt | Afera Digital",
  description:
    "Recite nam više o projektu i javljamo se u roku od 24h. Web sajtovi i web aplikacije.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <div className="brand-glow relative flex flex-1 flex-col overflow-hidden">
      <div className="relative mx-auto w-full max-w-3xl px-5 pt-7 sm:px-10 sm:pt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-white py-3 pl-4 pr-5 text-[15px] font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Nazad
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-10">
        <Reveal className="text-center">
          <h1 className="font-sans text-[32px] font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-[56px]">
            Hajde da napravimo vaš sajt
          </h1>
          <p className="mt-1 text-[16px] leading-relaxed text-[#525252] sm:text-[20px]">
            Recite nam više o projektu, javljamo se brzo.
          </p>
        </Reveal>

        <Reveal className="mt-4">
          <ContactForm />
        </Reveal>
      </div>

      {/* Wider than the form: four pills in a single row need more room than
          the form's width leaves, and squeezing them there wrapped the text. */}
      <Reveal className="relative mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:px-10 sm:pb-24">
        {/* Two columns until the row genuinely fits: Vukašin and Andrej on the
            left, Afera Digital and the call button on the right. */}
        <ul className="grid grid-cols-2 items-center justify-items-center gap-3 lg:flex lg:flex-row lg:justify-between lg:gap-2">
          <li>
            <a href={VUKASIN_URL} target="_blank" rel="noopener noreferrer" className={darkPillClass}>
              <Image
                src="/images/profile.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
                style={{ objectPosition: "center 10%" }}
              />
              {/* One flex item, or the pill's gap lands between the first name
                  and the surname on top of the space. Surname only shows once
                  the column is wide enough; narrower, it overflows the pill. */}
              <span>Vukašin<span className="hidden min-[372px]:inline">&nbsp;Riznić</span></span>
            </a>
          </li>
          <li>
            <a href={AFERA_IG_URL} target="_blank" rel="noopener noreferrer" className={pillClass}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ghost">
                <InstagramIcon size={13} strokeWidth={2} />
              </span>
              Afera Digital
            </a>
          </li>
          <li>
            <a href={ANDREJ_URL} target="_blank" rel="noopener noreferrer" className={darkPillClass}>
              <Image
                src="/images/andrej-avatar.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
                style={{ objectPosition: "center 10%" }}
              />
              <span>Andrej<span className="hidden min-[372px]:inline">&nbsp;Dostanić</span></span>
            </a>
          </li>
          <li>
            <CallButton />
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
