"use client";

import { useState, type FormEvent } from "react";

const budgetOptions = [
  { value: "300-800", label: "€300 – €800" },
  { value: "800-2000", label: "€800 – €2000" },
  { value: "2000+", label: "€2000+" },
  { value: "unsure", label: "Nisam još siguran/na" },
];

const urgencyOptions = [
  { value: "hitno", label: "Hitno" },
  { value: "par-nedelja", label: "Par nedelja" },
  { value: "mesec-dana", label: "Mesec dana" },
  { value: "fleksibilan", label: "Fleksibilan rok" },
];

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[14px] sm:text-[16px] text-foreground placeholder:text-[#a2a2a2] transition-colors focus:border-foreground/40 focus:outline-none";

const labelClass = "mb-2 block text-[14px] sm:text-[16px] font-medium text-foreground";

function PillGroup({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-full border px-4 py-2 text-[14px] sm:text-[16px] font-medium transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-white text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!budget || !urgency) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setServerError(null);
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      budget: budgetOptions.find((o) => o.value === budget)?.label,
      urgency: urgencyOptions.find((o) => o.value === urgency)?.label,
      description: formData.get("description"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Surface the server's wording (rate limit, invalid email) so a blocked
        // visitor knows to wait rather than hammering the button.
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? null);
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setBudget(null);
      setUrgency(null);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-[#525252] bg-white p-8 text-left shadow-sm sm:p-10">
        <p className="text-[14px] sm:text-[16px] font-semibold text-foreground">Poruka je poslata!</p>
        <p className="mt-2 text-[14px] sm:text-[16px] text-[#525252]">
          Hvala vam, javićemo vam se u roku od 24h.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-md border border-[#525252] bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Honeypot: moved off-screen rather than display:none, which bots skip.
          Hidden from assistive tech and the tab order so no real visitor can
          reach it -- anything that fills it in is automated. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Ime i prezime
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Novak Đoković"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="novak@gmail.com"
            className={inputClass}
          />
        </div>

        <div>
          <span className={labelClass}>Budžet</span>
          <PillGroup options={budgetOptions} selected={budget} onSelect={setBudget} />
        </div>

        <div>
          <span className={labelClass}>Hitnost</span>
          <PillGroup options={urgencyOptions} selected={urgency} onSelect={setUrgency} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Kratak opis projekta
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Recite mi nešto više o projektu..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-[14px] sm:text-[16px] font-normal text-background transition-all hover:-translate-y-0.5 hover:bg-foreground/85 hover:shadow-md disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Šaljem..." : "Pošaljite poruku"}
        </button>

        {showValidation && (
          <p className="text-sm font-medium text-red-500">
            Izaberite budžet i hitnost pre slanja.
          </p>
        )}

        {status === "error" &&
          (serverError ? (
            <p className="text-sm font-medium text-red-500">{serverError}</p>
          ) : (
            <p className="text-sm font-medium text-red-500">
              Nešto nije u redu, pokušajte ponovo ili nam pišite direktno na{" "}
              <a href="mailto:vukasin.afera@gmail.com" className="underline">
                vukasin.afera@gmail.com
              </a>
              .
            </p>
          ))}

        <p className="text-left text-xs text-[#a2a2a2]">
          Nema pritiska, tu smo da pomognemo.
        </p>
      </div>
    </form>
  );
}
