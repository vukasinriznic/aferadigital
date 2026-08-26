import { NextResponse } from "next/server";
import { Resend } from "resend";

// TODO: add Andrej's email here once we split leads between us, e.g. [TO_EMAIL, "andrej@..."]
const TO_EMAIL = "vukasin.afera@gmail.com";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, budget, description, urgency } = body as {
    name?: string;
    email?: string;
    budget?: string;
    description?: string;
    urgency?: string;
  };

  if (!name || !email || !description) {
    return NextResponse.json(
      { error: "Ime, email i opis projekta su obavezni." },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "Afera Digital kontakt <onboarding@resend.dev>",
      to: TO_EMAIL,
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Slanje nije uspelo." }, { status: 500 });
  }
}
