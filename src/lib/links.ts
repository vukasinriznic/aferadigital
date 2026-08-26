export const ANDREJ_URL = "https://www.andrejdostanic.me";
export const VUKASIN_URL = "https://www.vukasinriznic.me";
export const AFERA_IG_URL = "https://www.instagram.com/afera.digital/";

// Tighter type and padding below sm: two pills to a row on a phone leaves about
// 160px each, which the full-size pill overruns and the label wraps to two lines.
const pillBase =
  "flex items-center gap-2 sm:gap-2.5 rounded-full whitespace-nowrap py-2 pl-2 pr-3 sm:pr-4 text-sm sm:text-base font-normal shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

export const pillClass = `${pillBase} border border-border bg-white text-foreground hover:border-foreground/20`;

export const darkPillClass = `${pillBase} border border-white/10 bg-black py-1.5 pl-1.5 text-white`;
