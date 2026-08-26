import Image from "next/image";
import { CallButton } from "@/components/CallButton";
import { ContactForm } from "@/components/ContactForm";
import { IntroLoader } from "@/components/IntroLoader";
import { InstagramIcon } from "@/components/icons/social-icons";
import { Reveal } from "@/components/motion/Reveal";

const ANDREJ_URL = "https://www.andrejdostanic.me";
const VUKASIN_URL = "https://www.vukasinriznic.me";
const AFERA_IG_URL = "https://www.instagram.com/afera.digital/";

// Tighter type and padding below sm: two pills to a row on a phone leaves about
// 160px each, which the full-size pill overruns and the label wraps to two lines.
const pillBase =
  "flex items-center gap-2 sm:gap-2.5 rounded-full whitespace-nowrap py-2 pl-2 pr-3 sm:pr-4 text-sm sm:text-base font-normal shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

const pillClass = `${pillBase} border border-border bg-white text-foreground hover:border-foreground/20`;

const darkPillClass = `${pillBase} border border-white/10 bg-black py-1.5 pl-1.5 text-white`;

export default function Home() {
  return (
    <IntroLoader>
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
    </IntroLoader>
  );
}
