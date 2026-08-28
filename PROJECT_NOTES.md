# Afera Digital — linktree + kontakt stranica — Beleške za nastavak rada

Ovaj fajl postoji da nova sesija (posle prebacivanja zbog tokena) razume šta je projekat, šta je urađeno i šta je sledeće. Piši/ažuriraj ga kad god se nešto bitno promeni.

## O projektu

Zajednički brend **Vukašina Riznića** i **Andreja Dostanića** za izradu web sajtova i web aplikacija. Instagram nalog `@afera.digital` (username u kodu/URL-ovima: `aferadigital`). Ovo je **treći, potpuno odvojen brend** od dva lična portfolija (`vukasinriznic.me`, `andrejdostanic.me`) i od `@dajpeticu` (NFC kartice za recenzije, poseban nalog — namerno odvojen jer je publika drugačija; pomiwe se u Afera bio-u samo kao "sestrinski nalog", nikad kao usluga Afere).

**Namerna odluka korisnika:** ova stranica NE prikazuje projekte/usluge — to živi na ličnim portfolijima i na Instagramu (reklame). Jedini posao ove stranice je da **olakša kontakt** pored Instagram DM-a: linktree hub → forma, uz oba portfolija, IG i poziv kao alternative.

## Struktura sajta

- **`/`** — linktree hub. Logo (Syne "AFERA"), "Želite sajt?" → veliko dugme ka `/kontakt`, "Naš tim" → kartice ka oba portfolija. Intro animacija se pušta OVDE (jednom po sesiji), ne na `/kontakt`.
- **`/kontakt`** — kontakt forma (prebačena sa `/`, ranije je forma BILA početna stranica dok se nije odlučilo da treba pravi linktree hub). Dugme "Nazad" ka `/`. Ispod forme: red bedževa (Vukašin, Afera Digital IG, Andrej, Pozovi) — na mobilnom 2×2 grid (Vukašin+Andrej leva kolona, Afera+Poziv desna), na desktopu jedan red `justify-between`.

## Tech stack

Next.js (App Router, Turbopack) + TypeScript + Tailwind v4 + `motion` (Framer Motion naslednik). Kopirano/pojednostavljeno iz PORTFOLIO šablona — GSAP/Lenis namerno IZOSTAVLJENI (ovo je laka stranica, ne treba joj scroll-pinning). `@vercel/analytics` dodat.

Fontovi: **Syne 800** — koristi se ISKLJUČIVO za reč "AFERA" na hub-u (`font-display`). Sve ostalo (uključujući ostale naslove sa `font-extrabold`) je **Inter**, sa dodatom težinom **800** (originalni portfolio-šablon je učitavao samo 400/500/600, pa je `font-extrabold` na naslovima bio browser-sintetizovano podebljanje — vizuelno "muljavo"; dodavanje prave 800 težine to rešava, bez menjanja izgleda koji korisnik traži).

## Deployment

- GitHub: `vukasinriznic/aferadigital` (repo korisnik sam napravio)
- Vercel projekat: `aferadigital`, live na `https://aferadigital.vercel.app`
- `src/lib/site.ts` → `SITE_URL` = trenutno Vercel URL, **promeniti na pravi domen** kad se kupi (gradi canonical/sitemap/OG linkove)
- Lokalni dev: `npm run dev -- -p 3100` (port 3000 često zauzet drugom sesijom/projektom)

## Mejl (Resend) — VAŽNO, lako se pokvari

- `.env.local`: `RESEND_API_KEY` + `CONTACT_TO_EMAIL=kontakt.afera@gmail.com` (novi, poseban Resend nalog — VIŠE NE deli ključ sa PORTFOLIO projektom, koji i dalje šalje na `vukasin.afera@gmail.com` sa svog starog naloga).
- **Resend-ovo pravilo (potvrđeno testom, 403 `validation_error`): dok se šalje sa deljenim `onboarding@resend.dev` senderom, sme se slati SAMO na adresu na koju je taj Resend nalog registrovan.** Dodavanje DRUGE adrese u `to` obara CEO zahtev (ne samo tu adresu) — testirano i potvrđeno da tada NIKO ne dobije mejl.
- Zato je `CONTACT_TO_EMAIL` u `src/app/api/contact/route.ts` čitan iz env varijable (ne hardkodovan) — ključ i primalac MORAJU da se menjaju ZAJEDNO u istom Vercel redeploy-u, inače forma privremeno puca.
- Vercel: `RESEND_API_KEY` je na *Production and Preview*, `CONTACT_TO_EMAIL` samo na *Production* — ako se ikad napravi preview deploy, tražiće 403 (nije hitno, preview se ne koristi).
- **`CONTACT_FROM_EMAIL`** env varijabla još NIJE postavljena — auto-odgovor korisniku je NAPISAN u kodu ali namerno UGAŠEN (`VERIFIED_FROM ?? undefined` grana) dok ne postoji verifikovan domen u Resend-u, jer bi inače SVAKI submit vraćao 403 (deljeni sender ne sme da šalje POSETIOCIMA uopšte, samo nalogu-vlasniku). Čim se doda ta varijabla (posle domen+Resend verifikacije), auto-odgovor se sam uključi.
- Kad domen bude verifikovan: `TO_EMAILS`/`CONTACT_TO_EMAIL` može da primi VIŠE adresa razdvojenih zarezom (kod to već podržava) — vratiti i `vukasin.afera@gmail.com` i `kontakt.afera@gmail.com` zajedno ako se odluči da oba dobijaju.

## Zaštita forme (`src/app/api/contact/route.ts`)

Honeypot polje (`website`, vizuelno van ekrana + `tabIndex={-1}` + `aria-hidden`, NE `display:none` jer to botovi filtriraju), rate-limit (3/min po IP-u, **u memoriji procesa — nije globalan preko Vercel instanci**, samo koči nalete na jednu toplu instancu), validacija email regex-a, trim+cap dužina polja. Budžet/hitnost u formi su OPCIONI (ranije bili obavezni — smanjuje trenje za nekog ko dolazi sa Instagrama i ne zna odmah budžet).

## Poznati "gotcha"-ovi otkriveni ove sesije

- **Favicon.ico mora biti PNG-enkodiran unutar ICO kontejnera.** `Image.save(path, format='ICO')` BEZ eksplicitnog `sizes=` liste je kod Pillow-a pao na stari BMP/DIB encoding za mali single-size fajl → Next.js-ov strogi Rust dekoder ga odbija ("PNG is not in RGBA format"). Fix: uvek graditi iz 256px baze i eksplicitno navesti `sizes=[(256,256)]` (ili listu veličina) — to primorava Pillow da koristi PNG kompresiju.
- **React StrictMode dvostruko pokreće `useEffect`** — u `IntroLoader.tsx` je prvi prolaz upisivao `sessionStorage` zastavicu, drugi prolaz je ČITAO tu istu zastavicu i mislio da je intro već viđen, pa ga je preskočio. Fix: odluka se donosi jednom i čuva u `useRef`, ne re-čita se iz storage-a na drugom prolazu.
- **Browser pane u ovom alatu ne kompozituje frejmove dok korisnik eksplicitno ne otvori/prikaže panel na svojoj strani** — `document.visibilityState` ostaje `"hidden"` čak i posle `tabs_select` (fronting). Dok je tako: `computer{screenshot}` baca grešku, CSS tranzicije/rAF-animacije ostaju vizuelno "zaleđene" (getComputedStyle vraća staru vrednost čak i uz `!important` force), `setInterval`/`setTimeout` se throttluju na ~1/sec. **Rešenje: ne veruj vizuelnim proverama dok korisnik eksplicitno ne potvrdi da je panel otvoren.** Kad JESTE otvoren (korisnik potvrdio), screenshot i animacije rade normalno — više uzastopnih `computer{screenshot}` poziva u istom `browser_batch` uspešno je uhvatilo intro animaciju i crossfade uživo.
- **`visibility:hidden` na wrapper-u oko `{children}` je NUŽAN dok intro overlay traje** — bez toga se cela stranica ispod (pozadinska slika, avatari, sopstvene `Reveal` fade-up animacije) renderuje i animira NEVIDLJIVO ispod neprozirnog overlay-a, trošeći frame-budžet i praveći sečkanje. `visibility:hidden` elementi se preskaču pri crtanju (paint), ali se slike i dalje učitavaju i `whileInView` (IntersectionObserver-driven, ne mari za `visibility`) animacije i dalje odrade svoj posao — spremno čim se otkrije.
- **Crossfade sadržaja:** `visibility` prelazi u `visible` TAČNO u trenutku kad overlay počinje da se gasi (`phase === "fading"`), sa `opacity` tranzicijom od 400ms paralelno sa overlay-evim fade-om — daje utisak da sadržaj "izranja" ispod loga koji nestaje, umesto da iskoči instant.

## Dizajn odluke (i zašto)

- **Pozadina:** originalni sivi SVG talasi (`public/cta-waves.svg`, `#F6F6F6`→`#D4D4D8`). Probano i odbačeno: CSS radijalni gradijent u brend crvenoj (`brand-glow`), generisana tekstura oblaka u brend tonu (inspirisano `dymasalfin.web.id`, ali NIJE preuzeta njihova slika — nacrtana lokalno proceduralnim šumom). Korisnik se na kraju vratio na originalne talase — "tako mi se najviše sviđa".
- **Avatari u bedževima:** `object-cover` sa `object-position: center 10%` — bez toga se glava seče (fotke su portret-orijentacije, centar-crop default pogađa vrat/ramena). Andrejeva slika je namerno malo umanjena u odnosu na Vukašinovu (glave iste širine u pikselima nakon merenja, pa Vukašinova opet za nijansu uvećana — korisnik je tražio fino podešavanje "za nijansu").
- **Logo (`public/images/logo-mark.png`, `public/og.png`, favicon):** vektorski rekonstruisan iz originalnog `Logo.PNG` (dva preklopljena trougla, `mix-blend-mode: multiply` za tamniji preklop) pošto je original bio raster sa cirkularnom kremastom pozadinom. `Logo.PNG` (original, korisnikov upload) VIŠE SE NIGDE NE KORISTI u kodu — kandidat za brisanje ako se ne čuva namerno kao arhiva.
- Bio i ime IG naloga su finalizovani (videti Instagram sekciju ispod).

## Instagram

- Ime naloga: `Afera Digital | Web sajtovi`
- Bio (finalna verzija, ~147/150 karaktera):
  ```
  Web sajtovi i web aplikacije.
  Dizajn, izrada i održavanje.
  Recite nam o projektu, javljamo se u roku od 24h.

  NFC kartice za recenzije 👉 @dajpeticu
  ```
- Link u bio-u: `aferadigital.vercel.app` (promeniti kad domen bude gotov)

## Otvoreno / sledeći koraci

1. **Domen** — u toku. `afera.rs` i `aferadigital.rs` su SLOBODNI (provereno WHOIS-om na RNIDS); `afera.digital` i `afera.com` su ZAUZETI. Preporuka je bila `afera.rs` (kraći, lakši za mejl). Cene nisu pouzdano provereno (registrari blokiraju/JS-render-uju cenovnike) — korisnik treba sam da uporedi 2-3 RNIDS ovlašćena registra.
2. Kad domen stigne: Vercel Domains → DNS zapisi → `SITE_URL` u `site.ts` → Resend domain verifikacija (DNS zapisi) → `CONTACT_FROM_EMAIL` env varijabla (uključuje auto-odgovor) → eventualno vratiti oba mejla u `CONTACT_TO_EMAIL`.
3. Andrejev broj telefona — dugme "Pozovite nas" trenutno zove SAMO Vukašinov broj (`+381655339481`, isti kao na portfoliju). Pitanje da li treba i Andrejev/zajednički još nije rešeno.
4. `public/images/Logo.PNG` — verovatno može da se obriše (neiskorišćen), ali nije brisan bez eksplicitnog "da".
5. Rate-limit je po instanci, ne globalan — ako ikad zatreba pravi globalni limit, treba Upstash/Redis ili Vercel KV.
