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
- Vercel projekat: `aferadigital` — production domen je **`www.aferadigital.rs`** (apex `aferadigital.rs` 308-redirect-uje na `www`, tako ga je Vercel sam postavio). `aferadigital.vercel.app` i dalje radi kao fallback.
- `src/lib/site.ts` → `SITE_URL = "https://www.aferadigital.rs"` (ažurirano kad je domen proradio)
- Domen kupljen kod **Mint (mint.rs)**, ~1.495 din prva godina (popust), obnova ~2.699 din/god. Nameserveri: **`ns20.mint.rs` / `ns21.mint.rs`** (NE podrazumevani `ns1-4.mint.rs` koje RNIDS dodeli pri registraciji — vidi gotcha ispod ako se ikad menja DNS zona).
- Google Search Console: verifikovan (`URL prefix`, HTML fajl metoda — `public/google6e65d3afa07b4e39.html`, NE brisati taj fajl ili se gubi verifikacija), sitemap.xml predat i obrađen (2/2 stranice otkrivene).
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
- **DNS zona kod Mint-a (mint.rs) NIJE ista stvar kao nameserveri koje RNIDS dodeli pri registraciji.** Pri registraciji domena, RNIDS automatski delegira na `ns1-4.mint.rs` (legacy/default). Ali kad se u Mint-ovom "Upravljanje DNS zonama" panelu napravi nova zona (zeleno "+" dugme), ona živi na SASVIM DRUGOM paru nameservera (`ns20.mint.rs`/`ns21.mint.rs` u ovom slučaju — verovatno se dodeljuju dinamički/nasumično po zoni). Uneti A/CNAME zapisi u toj zoni su "mrtvi" dok se domenu ručno ne promene nameserveri (Moji domeni → Podešavanje nameservera) da pokazuju TAČNO na te iste `ns20/ns21`. Simptom bez ovog fix-a: `SERVFAIL` na javnim resolverima (Google/Cloudflare), ne obično "not found" — jer `ns1-4.mint.rs` ni ne znaju za tu zonu. Provera: `nslookup -type=NS <domen> a.nic.rs` (šta RNIDS misli) vs. koji NS zapisi zapravo postoje u kreiranoj zoni — moraju da se poklapaju.
- **RNIDS zahteva potvrdu vlasništva mejlom posle registracije** (link u automatskom mejlu) pre nego što DNS zona uopšte postane vidljiva/aktivna kod registra — bez te potvrde, "Upravljanje DNS zonama" panel prikazuje prazno ("Ništa nije pronađeno") iako je porudžbina uspešno završena i domen "Aktivan" u "Moji domeni".
- **Promena nameservera kod `.rs` TLD-a propagira BRŽE nego što izgleda da bi trebalo** — u ovoj sesiji je puna propagacija (svi javni resolveri + HTTPS/SSL sertifikat generisan) prošla za manje od sat vremena, ne obećanih 2-24h. Lokalni ISP/ruter keš na strani korisnika i dalje može duže da drži staru "ne postoji" informaciju nezavisno od toga — testirati sa mobilnih podataka (ne WiFi) za nezavisnu proveru.

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
- Link u bio-u: `www.aferadigital.rs` (ažurirano)

## Rešeno (nekad otvoreno pitanje, sad zatvoreno)

- **Andrejev broj telefona:** dugme "Pozovite nas" NAMERNO zove samo Vukašinov broj (isti kao na portfoliju) — korisnikova odluka, jer zajednički `kontakt.afera@gmail.com` mejl (oba imaju pristup) već pokriva da Andrej vidi svaki upit. Ne treba drugo dugme/broj.
- **Resend domain verifikacija** — ZAVRŠENO. `aferadigital.rs` verifikovan (DKIM TXT `resend._domainkey`, SPF CNAME `rsend`/`send`, DMARC TXT `_dmarc` — svi u istoj Mint `ns20/ns21` DNS zoni). `CONTACT_FROM_EMAIL="Afera Digital <kontakt@aferadigital.rs>"` postavljen u Vercel (Production). Auto-odgovor posetiocu radi, i Reply-To na oba mejla (upit → posetiočev mejl, potvrda → `kontakt.afera@gmail.com`) potvrđeno testirano u Gmail-u (Reply dugme tačno popuni pravu adresu). `CONTACT_TO_EMAIL` OSTAJE samo `kontakt.afera@gmail.com` (korisnikova odluka, ne oba mejla).
  - **Mint DNS gotcha:** TXT zapisi MORAJU biti pod navodnicima (`"p=MIGf..."`) — bez njih panel baca "This record must contain a quoted string". Name/Content polja ne smeju da se završavaju tačkom (`.`) — panel baca "must contain a valid hostname, do not end with a dot".
  - **Pažnja za sledeći put:** lako je pobrkati `CONTACT_TO_EMAIL` (primalac upita) sa `CONTACT_FROM_EMAIL` (pošiljalac auto-odgovora) u Vercel panelu — dešava se da se prava vrednost jedne slučajno upiše u drugu. Uvek proveriti da su OBE ispravno postavljene pre Redeploy-a.

- **HTML potvrda posetiocu (sa logom) + Gravatar avatar pošiljaoca** — ZAVRŠENO. Auto-odgovor u `route.ts` (`confirmationHtml()`) sad šalje HTML mejl sa logom (`https://www.aferadigital.rs/images/logo-mark.png`, javno hostovana slika, ne CID attachment) umesto samo plain-text; sva korisnička polja (ime, opis, budžet, hitnost) prolaze kroz `escapeHtml()` pre ubacivanja u markup — bez ovoga bi ime tipa `<img onerror=...>` moglo da izvrši kod u tuđem inbox-u. `text` fallback je zadržan za klijente koji ne prikazuju HTML.
  - **Ikonica pošiljaoca pored imena (avatar) — Gravatar nalog JESTE napravljen i ispravno podešen** (`kontakt@aferadigital.rs`, verifikovan preko ImprovMX prosleđivanja, slika potvrđena preko `https://www.gravatar.com/avatar/<md5(email)>?d=404` → 200 + tačna slika), ALI **Gmail nativno ne podržava Gravatar uopšte** — ovo je otkriveno TEK nakon što je sve podešeno i testirano (pogrešna polazna pretpostavka, ispravljeno prekasno). Gravatar avatar RADI u drugim klijentima (Thunderbird, Superhuman, Spark, Airmail, Mimestream), samo ne u Gmail-u. Za Gmail specifično bi trebalo **BIMI** (poseban DNS zapis + SVG logo + stroža DMARC politika `p=quarantine`/`p=reject` umesto trenutnog `p=none`, istorijski i plaćen VMC sertifikat ~1000$/god iako je to možda ublaženo za lične naloge — NIJE POTVRĐENO svežom proverom). Korisnik je odlučio da NE ide dalje u BIMI za sada — kozmetička sitnica, cena/komplikacija nije vredna toga. Ne trošiti vreme na "sačekaj Gmail keš" savet za ovo — uzrok nije keš, Gmail prosto ne čita Gravatar.
  - **Gravatar image gotcha (i dalje validno, samo ne rešava Gmail problem):** krug u avataru seče uglove kvadratne slike ako dizajn ide do ivice kvadrata (kao `logo-mark.png`). Rešenje: `public/images/logo-gravatar.png` — canvas izračunat tako da najudaljenija tačka dizajna od centra bude unutar upisanog kruga (ne samo kvadrata), ~18% dodatne margine. Gravatar ne dozvoljava umanjenje ispod 100% u editoru — margina MORA biti već u fajlu.
  - Ako se ikad vrati na ovo (BIMI): prvo sveže proveriti tačne 2026 Gmail zahteve (VMC obavezan ili ne) pre nego što se bilo šta menja u DMARC politici — promena `p=none` na `p=quarantine`/`p=reject` bez pažnje nosi rizik da se legitimni mejlovi počnu odbijati.

## Otvoreno / sledeći koraci

Nema otvorenih stavki. Jedina preostala napomena: rate-limit u `route.ts` je po instanci, ne globalan — ako ikad zatreba pravi globalni limit, treba Upstash/Redis ili Vercel KV. `public/images/Logo.PNG` (neiskorišćen original) je obrisan.

Nema više otvorenih stavki van ove dve sitnice — sajt je potpuno funkcionalan (domen, forma, mejl sa HTML potvrdom i logom, Gravatar avatar, SEO indeksiranje).
