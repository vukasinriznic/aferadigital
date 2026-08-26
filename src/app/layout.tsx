import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Cursor } from "@/components/Cursor";
import { IntroLoader } from "@/components/IntroLoader";
import { SITE_URL } from "@/lib/site";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const title = "Afera Digital | Web sajtovi i web aplikacije";
const description =
  "Afera Digital gradi brze i pristupačne web sajtove i web aplikacije. Recite nam o projektu, javljamo se u roku od 24h.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Afera Digital",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Afera Digital",
  url: SITE_URL,
  sameAs: [
    "https://www.instagram.com/afera.digital/",
    "https://www.vukasinriznic.me",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${syne.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col cursor-none bg-background text-foreground"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Cursor />
        {/* Wraps both pages so the intro plays once per session wherever the
            visitor lands, rather than replaying on the way to the form. */}
        <IntroLoader>{children}</IntroLoader>
        <Analytics />
      </body>
    </html>
  );
}
