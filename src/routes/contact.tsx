import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { suggererPrestation, type Suggestion } from "@/lib/prestation.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & devis — Blondel Jardin" },
      { name: "description", content: "Contactez votre jardinier paysagiste pour un devis gratuit et sans engagement." },
      { property: "og:title", content: "Contact & devis — Blondel Jardin" },
      { property: "og:description", content: "Demandez votre devis gratuit pour votre jardin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  nom: z.string().trim().min(1, "Indiquez votre nom").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30),
  message: z.string().trim().min(1, "Écrivez un message").max(1000),
});

const field = "w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-accent/50";

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sugg, setSugg] = useState<Suggestion | null>(null);
  const [confirme, setConfirme] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const suggererFn = useServerFn(suggererPrestation);

  async function suggerer() {
    setChargement(true);
    setConfirme(null);
    try {
      setSugg(await suggererFn({ data: { description: message } }));
    } catch {
      setSugg({ erreur: "Impossible de proposer une prestation pour le moment." });
    } finally {
      setChargement(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <div className="text-center">
        <p className="eyebrow text-moss">Contact</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-primary md:text-7xl">
          Parlons de votre <em className="text-moss">jardin</em>
        </h1>
        <p className="mt-5 text-muted-foreground">Devis gratuit et sans engagement.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          <a href="tel:+33783551969" className="font-medium text-primary underline-offset-4 hover:underline">07 83 55 19 69</a>
          <span className="mx-2">·</span>Lun – Ven, 8h30 – 16h30
        </p>
      </div>
      <div className="mt-12 rounded-[2rem] border border-border bg-card p-6 md:p-10">
          {sent ? (
            <div className="py-20 text-center">
              <p className="font-display text-6xl italic text-moss">Merci&nbsp;!</p>
              <p className="mt-4 text-muted-foreground">Votre demande a bien été reçue. Blondel Jardin revient vers vous très vite.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                {([
                  ["nom", "Nom", "text", "md:col-span-2"],
                  ["email", "Email", "email", ""],
                  ["telephone", "Téléphone (facultatif)", "tel", ""],
                ] as const).map(([n, l, t, c]) => (
                  <div key={n} className={c}>
                    <label htmlFor={n} className="eyebrow mb-2 block text-muted-foreground">{l}</label>
                    <input id={n} name={n} type={t} className={field} />
                    {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="message" className="eyebrow mb-2 block text-muted-foreground">Votre projet</label>
                <textarea id="message" name="message" rows={5} className={field} value={message} onChange={(e) => { setMessage(e.target.value); setSugg(null); setConfirme(null); }} placeholder="Décrivez votre jardin : surface, état, ce que vous souhaitez…" />
                {errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
              </div>
              <div className="rounded-2xl border border-dashed border-moss/40 bg-secondary/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">Pas sûr de la prestation ? Laissez-nous vous en suggérer une.</p>
                  <button type="button" onClick={suggerer} disabled={chargement || message.trim().length < 10} className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40">
                    {chargement ? "Analyse…" : "✦ Suggérer une prestation"}
                  </button>
                </div>
                {sugg && "erreur" in sugg && <p className="mt-3 text-sm text-destructive">{sugg.erreur}</p>}
                {sugg && "prestation" in sugg && (
                  <div className="mt-4">
                    <p className="eyebrow text-moss">Suggestion</p>
                    <p className="mt-1 font-display text-2xl text-primary">{sugg.prestation}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{sugg.raison}</p>
                    {confirme ? (
                      <p className="mt-3 text-sm font-medium text-primary">✓ Prestation confirmée : {confirme}</p>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => setConfirme(sugg.prestation)} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Confirmer</button>
                        <button type="button" onClick={() => setSugg(null)} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-card">Ignorer</button>
                      </div>
                    )}
                  </div>
                )}
                <input type="hidden" name="prestation" value={confirme ?? ""} />
              </div>
              <button type="submit" className="w-full rounded-full bg-primary px-6 py-4 font-medium text-primary-foreground transition hover:opacity-90">Envoyer ma demande →</button>
            </form>
          )}
      </div>
    </section>
  );
}
