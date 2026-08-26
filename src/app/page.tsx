import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { InstagramIcon } from "@/components/icons/social-icons";
import { Reveal } from "@/components/motion/Reveal";

const ANDREJ_URL = "https://andrej-dostanic-portfolio.vercel.app";
const VUKASIN_URL = "https://www.vukasinriznic.me";
const AFERA_IG_URL = "https://www.instagram.com/afera.digital/";

const pillClass =
  "flex items-center gap-2.5 rounded-full border border-border bg-white py-2 pl-2 pr-4 text-base font-normal text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md";

const darkPillClass =
  "flex items-center gap-2.5 rounded-full border border-white/10 bg-black py-1.5 pl-1.5 pr-4 text-base font-normal text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-surface">
      <Image
        src="/cta-waves.svg"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none object-cover"
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20">
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

      <Reveal className="relative mx-auto w-full max-w-3xl px-5 pb-16 pt-8 sm:px-10 sm:pb-24">
        <ul className="flex flex-row flex-wrap items-center justify-around gap-3">
          <li>
            <a href={VUKASIN_URL} target="_blank" rel="noopener noreferrer" className={darkPillClass}>
              <Image
                src="/images/profile.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
              Vukašin Riznić
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
              />
              Andrej Dostanić
            </a>
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
