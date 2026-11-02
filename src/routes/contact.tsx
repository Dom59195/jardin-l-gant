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

const field = "w-full rounded-sm border border-input bg-card px-4 py-3 text-foreground outline-none focus:border-ring";

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
    <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-5">
      <div className="md:col-span-2">
        <p className="eyebrow text-moss">Contact</p>
        <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">Parlons de votre projet</h1>
        <p className="mt-6 text-muted-foreground">Devis gratuit et sans engagement. 50 % de crédit d'impôt.</p>
        <div className="mt-12 space-y-8 text-sm">
          <div><p className="eyebrow mb-2 text-moss">Adresse</p><p>38 rue Auguste Caron, 59195 Hérin</p></div>
          <div><p className="eyebrow mb-2 text-moss">Téléphone</p><p><a href="tel:+33783551969">07 83 55 19 69</a></p></div>
          <div><p className="eyebrow mb-2 text-moss">Zone</p><p>Hérin et alentours (Valenciennois)</p></div>
          <div><p className="eyebrow mb-2 text-moss">Horaires</p><p>Lundi – Vendredi : 8h30 – 12h / 13h – 16h30</p><p>Samedi – Dimanche : fermé</p></div>
        </div>
      </div>
      <div className="rounded-md border border-border bg-card p-8 md:col-span-3 md:p-12">
        {sent ? (
          <div className="py-16 text-center">
            <h2 className="font-display text-4xl text-primary">Merci !</h2>
            <p className="mt-4 text-muted-foreground">Votre message a bien été reçu. Nous revenons vers vous très vite.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {([
              ["nom", "Nom", "text"],
              ["email", "Email", "email"],
              ["telephone", "Téléphone (facultatif)", "tel"],
            ] as const).map(([n, l, t]) => (
              <div key={n}>
                <label htmlFor={n} className="eyebrow mb-2 block text-muted-foreground">{l}</label>
                <input id={n} name={n} type={t} className={field} />
                {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="eyebrow mb-2 block text-muted-foreground">Votre projet</label>
              <textarea id="message" name="message" rows={5} className={field} value={message} onChange={(e) => { setMessage(e.target.value); setSugg(null); setConfirme(null); }} placeholder="Décrivez votre jardin : surface, état, ce que vous souhaitez…" />
              {errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
            </div>
            <div className="rounded-md border border-border bg-secondary/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Pas sûr de la prestation ? Laissez-nous vous en suggérer une.</p>
                <button type="button" onClick={suggerer} disabled={chargement || message.trim().length < 10} className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40">
                  {chargement ? "Analyse…" : "Suggérer une prestation"}
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
            <button type="submit" className="eyebrow w-full rounded-sm bg-primary px-6 py-4 text-primary-foreground hover:opacity-90">Envoyer ma demande</button>
          </form>
        )}
      </div>
    </section>
  );
}
