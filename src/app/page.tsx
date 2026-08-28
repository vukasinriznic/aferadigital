import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CallButton } from "@/components/CallButton";
import { IntroLoader } from "@/components/IntroLoader";
import { InstagramIcon } from "@/components/icons/social-icons";
import { Reveal } from "@/components/motion/Reveal";
import { AFERA_IG_URL, ANDREJ_URL, VUKASIN_URL, pillClass } from "@/lib/links";

const teamCardClass =
  "group flex items-center gap-4 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md";

export default function Home() {
  return (
    // Only the hub plays the intro: it is where the bio link lands, and the
    // form should open straight away for anyone linked to it directly.
    <IntroLoader>
      <div className="relative flex flex-1 flex-col overflow-hidden bg-surface">
        <Image
          src="/clouds.jpg"
          alt=""
          fill
          aria-hidden
          className="pointer-events-none object-cover"
        />

        <div className="relative mx-auto flex w-full max-w-xl flex-col px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
          <Reveal className="flex flex-col items-center text-center">
            <Image
              src="/images/logo-mark.png"
              alt=""
              width={900}
              height={789}
              priority
              className="h-auto w-20 sm:w-24"
            />
            <h1 className="mt-5 font-display text-[40px] font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-[56px]">
              Afera
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-[#525252] sm:text-[17px]">
              Web sajtovi i web aplikacije
            </p>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-center font-sans text-[22px] font-extrabold uppercase tracking-tight text-foreground sm:text-[26px]">
              Želite sajt?
            </h2>
            <Link
              href="/kontakt"
              className="group mt-4 flex w-full items-center justify-between gap-4 rounded-2xl bg-foreground px-6 py-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-md"
            >
              <span>
                <span className="block text-[17px] font-semibold sm:text-[19px]">
                  Pošaljite upit
                </span>
                <span className="mt-0.5 block text-[13px] text-white/60 sm:text-[14px]">
                  Javljamo se u roku od 24h
                </span>
              </span>
              <ArrowRight
                size={22}
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-center font-sans text-[22px] font-extrabold uppercase tracking-tight text-foreground sm:text-[26px]">
              Naš tim
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href={VUKASIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={teamCardClass}
              >
                <Image
                  src="/images/profile.png"
                  alt=""
                  width={52}
                  height={52}
                  className="shrink-0 rounded-full object-cover"
                  style={{
                    height: 52,
                    width: 52,
                    objectPosition: "center 10%",
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-semibold text-foreground sm:text-[18px]">
                    Vukašin Riznić
                  </span>
                  <span className="mt-0.5 block text-[13px] text-[#525252] sm:text-[14px]">
                    Pogledajte radove
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-[#525252] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              <a
                href={ANDREJ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={teamCardClass}
              >
                <Image
                  src="/images/andrej-avatar.png"
                  alt=""
                  width={52}
                  height={52}
                  className="shrink-0 rounded-full object-cover"
                  style={{
                    height: 52,
                    width: 52,
                    objectPosition: "center 10%",
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-semibold text-foreground sm:text-[18px]">
                    Andrej Dostanić
                  </span>
                  <span className="mt-0.5 block text-[13px] text-[#525252] sm:text-[14px]">
                    Pogledajte radove
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-[#525252] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={AFERA_IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={pillClass}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ghost">
                <InstagramIcon size={13} strokeWidth={2} />
              </span>
              Afera Digital
            </a>
            <CallButton />
          </Reveal>
        </div>
      </div>
    </IntroLoader>
  );
}
