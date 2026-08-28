import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend's shared onboarding@resend.dev sender may only deliver to the address
// the Resend account is registered under; any other recipient makes the whole
// request 403 and no one gets the enquiry. So the recipient has to move in step
// with RESEND_API_KEY -- keeping it in the environment lets both change in one
// go, instead of leaving the form broken between a key swap and a deploy.
// Comma-separated once a verified domain lifts the single-recipient limit.
const TO_EMAILS = (process.env.CONTACT_TO_EMAIL ?? "vukasin.afera@gmail.com")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

// Set CONTACT_FROM_EMAIL (e.g. "Afera Digital <kontakt@afera.digital>") once a
// domain is verified in Resend. Until then we're on the shared sender, which
// cannot mail visitors at all -- so the confirmation stays switched off rather
// than firing a request that is guaranteed to 403.
const VERIFIED_FROM = process.env.CONTACT_FROM_EMAIL;
const FROM = VERIFIED_FROM ?? "Afera Digital kontakt <onboarding@resend.dev>";

const MAX = { name: 100, email: 200, description: 5000, choice: 60 };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
// Best-effort only: serverless instances don't share memory, so this throttles
// bursts against a warm instance rather than acting as a global rate limit.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();

  for (const [key, times] of hits) {
    const live = times.filter((t) => now - t < WINDOW_MS);
    if (live.length) hits.set(key, live);
    else hits.delete(key);
  }

  const recent = hits.get(ip) ?? [];
  if (recent.length >= MAX_PER_WINDOW) return true;

  hits.set(ip, [...recent, now]);
  return false;
}

const clean = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

// The confirmation email is HTML, and every value below comes from the
// visitor's own form submission -- escape before it lands in markup, or a
// name like "<img src=x onerror=...>" runs in whoever's inbox reads it.
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function confirmationHtml(fields: {
  name: string;
  budget: string;
  urgency: string;
  description: string;
}) {
  const name = escapeHtml(fields.name);
  const budget = escapeHtml(fields.budget || "nije naveden");
  const urgency = escapeHtml(fields.urgency || "nije navedena");
  // Line breaks are the one thing worth preserving from a textarea; everything
  // else is escaped first so this can't reopen the tags around it.
  const description = escapeHtml(fields.description).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="sr">
  <body style="margin:0;padding:32px 16px;background:#F6F6F6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;">
            <tr>
              <td align="center" style="padding:32px 32px 8px;">
                <img src="https://www.aferadigital.rs/images/logo-mark.png" width="72" alt="Afera Digital" style="display:block;width:72px;height:auto;">
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Zdravo ${name},</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hvala na poruci! Primili smo vaš upit i javljamo se u roku od 24h.</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 8px;">Ukratko, ovo ste nam poslali:</p>
                <p style="font-size:14px;line-height:1.6;margin:0 0 16px;color:#525252;">
                  &bull; Budžet: ${budget}<br>
                  &bull; Hitnost: ${urgency}
                </p>
                <p style="font-size:14px;line-height:1.6;margin:0 0 24px;padding:12px 16px;background:#F6F6F6;border-radius:8px;color:#111111;">${description}</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Ako u međuvremenu želite nešto da dodate, samo odgovorite na ovaj mejl.</p>
                <p style="font-size:16px;line-height:1.6;margin:0;">Vukašin i Andrej<br><span style="color:#525252;">Afera Digital</span></p>
              </td>
            </tr>
            <tr>
              <td style="height:32px;"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  // Hidden field no human ever sees. Report success so bots don't learn to
  // work around it, but drop the submission.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Previše pokušaja. Sačekajte minut pa probajte ponovo." },
      { status: 429 },
    );
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const description = clean(body.description, MAX.description);
  const budget = clean(body.budget, MAX.choice);
  const urgency = clean(body.urgency, MAX.choice);

  if (!name || !email || !description) {
    return NextResponse.json(
      { error: "Ime, email i opis projekta su obavezni." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Email adresa nije ispravna." },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO_EMAILS,
      replyTo: email,
      subject: `Novi upit sa sajta — ${name}`,
      text: [
        `Ime i prezime: ${name}`,
        `Email: ${email}`,
        `Budžet: ${budget || "nije naveden"}`,
        `Hitnost: ${urgency || "nije navedena"}`,
        "",
        "Opis projekta:",
        description,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json({ error: "Slanje nije uspelo." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Slanje nije uspelo." }, { status: 500 });
  }

  // The enquiry is already delivered at this point, so a failed confirmation
  // must never turn a successful submission into an error for the visitor.
  if (VERIFIED_FROM) {
    try {
      await resend.emails.send({
        from: FROM,
        to: [email],
        replyTo: TO_EMAILS[0],
        subject: "Primili smo vaš upit — Afera Digital",
        html: confirmationHtml({ name, budget, urgency, description }),
        // Plain-text fallback for clients that don't render HTML.
        text: [
          `Zdravo ${name},`,
          "",
          "Hvala na poruci! Primili smo vaš upit i javljamo se u roku od 24h.",
          "",
          "Ukratko, ovo ste nam poslali:",
          `• Budžet: ${budget || "nije naveden"}`,
          `• Hitnost: ${urgency || "nije navedena"}`,
          "",
          description,
          "",
          "Ako u međuvremenu želite nešto da dodate, samo odgovorite na ovaj mejl.",
          "",
          "Vukašin i Andrej",
          "Afera Digital",
        ].join("\n"),
      });
    } catch {
      // Logged by Resend; the visitor still saw their submission succeed.
    }
  }

  return NextResponse.json({ ok: true });
}
