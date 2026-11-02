import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { suggererPrestation, type Suggestion } from "@/lib/prestation.functions";
import heroImg from "@/assets/projet-2.jpg";

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

  const infos = [
    { t: "Téléphone", v: "07 83 55 19 69", href: "tel:+33783551969", s: "Appel ou SMS" },
    { t: "Adresse", v: "38 rue Auguste Caron", s: "59195 Hérin" },
    { t: "Horaires", v: "Lun – Ven", s: "8h30 – 12h · 13h – 16h30" },
    { t: "Zone", v: "+50 km", s: "autour de Valenciennes" },
  ];

  return (
    <div className="pb-24">
      <section className="relative mx-4 mt-4 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground md:mx-6">
        <img src={heroImg} alt="Jardin entretenu par Blondel Jardin" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" />
        <div className="relative mx-auto max-w-7xl px-6 pb-40 pt-20 md:pb-48 md:pt-28">
          <p className="eyebrow text-accent">Contact & devis gratuit</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            Parlons de votre <em className="text-accent">jardin</em>.
          </h1>
          <p className="mt-6 max-w-xl text-primary-foreground/80 md:text-lg">
            Racontez-nous votre projet : nous revenons vers vous rapidement avec un devis clair, gratuit et sans engagement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {["Devis gratuit", "50 % de crédit d'impôt", "Réponse rapide"].map((b) => (
              <span key={b} className="rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 backdrop-blur">✓ {b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-28 grid max-w-7xl gap-8 px-6 md:-mt-32 lg:grid-cols-5">
        <aside className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {infos.map((i) => {
              const inner = (
                <>
                  <p className="eyebrow text-moss">{i.t}</p>
                  <p className="mt-3 font-display text-2xl leading-tight text-primary md:text-3xl">{i.v}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.s}</p>
                </>
              );
              return i.href ? (
                <a key={i.t} href={i.href} className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary md:p-6">{inner}</a>
              ) : (
                <div key={i.t} className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">{inner}</div>
              );
            })}
          </div>
          <div className="rounded-3xl bg-accent p-6 text-accent-foreground md:p-8">
            <p className="font-display text-3xl leading-tight">Plus rapide&nbsp;? <em>Appelez-nous.</em></p>
            <p className="mt-2 text-sm opacity-80">Du lundi au vendredi, nous répondons directement.</p>
            <a href="tel:+33783551969" className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">07 83 55 19 69</a>
          </div>
          <ol className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="eyebrow mb-5 text-moss">Comment ça se passe</p>
            {["Vous décrivez votre jardin", "Nous vous recontactons", "Visite & devis gratuit"].map((s, n) => (
              <li key={s} className="flex items-center gap-4 border-t border-border py-3 first:border-t-0">
                <span className="font-display text-3xl italic text-moss">0{n + 1}</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl md:p-12 lg:col-span-3">
          {sent ? (
            <div className="py-20 text-center">
              <p className="font-display text-6xl italic text-moss">Merci&nbsp;!</p>
              <p className="mt-4 text-muted-foreground">Votre demande a bien été reçue. Blondel Jardin revient vers vous très vite.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div>
                <h2 className="font-display text-4xl text-primary md:text-5xl">Votre demande de <em className="text-moss">devis</em></h2>
                <p className="mt-2 text-sm text-muted-foreground">Quelques informations suffisent. Champs obligatoires sauf mention.</p>
              </div>
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
              <p className="text-center text-xs text-muted-foreground">Devis gratuit et sans engagement · 50 % de crédit d'impôt</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
