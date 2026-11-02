import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Phone, MapPin, Clock, ArrowUpRight, Sparkles } from "lucide-react";
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

const field =
  "peer w-full border-0 border-b border-input bg-transparent px-0 pb-3 pt-6 text-lg text-foreground outline-none transition placeholder:text-transparent focus:border-primary";
const floating =
  "pointer-events-none absolute left-0 top-6 text-muted-foreground transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]";

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
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <div className="grid overflow-hidden rounded-[2.5rem] border border-border bg-background lg:grid-cols-[0.9fr_1.1fr]">
        {/* Panneau gauche */}
        <div className="relative flex flex-col justify-between gap-12 overflow-hidden bg-primary p-8 text-primary-foreground md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-1.5 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-sage" /> Devis gratuit · sans engagement
            </span>
            <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-7xl">
              Parlons de votre <em className="text-primary-foreground">jardin</em>.
            </h1>
            <p className="mt-6 max-w-sm text-primary-foreground/70">
              Racontez-nous votre projet, Blondel Jardin vous recontacte rapidement.
            </p>
          </div>

          <div className="relative space-y-3">
            <a
              href="tel:+33783551969"
              className="group flex items-center justify-between rounded-2xl bg-sage px-6 py-5 text-primary transition hover:opacity-90"
            >
              <span className="flex items-center gap-4">
                <Phone className="h-5 w-5" />
                <span className="font-display text-3xl">07 83 55 19 69</span>
              </span>
              <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-primary-foreground/15 p-4 text-sm">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>Lun – Ven<br /><span className="text-primary-foreground/60">8h30–12h · 13h–16h30</span></span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-primary-foreground/15 p-4 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>Hérin (59)<br /><span className="text-primary-foreground/60">+50 km autour de Valenciennes</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-8 md:p-14">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <p className="font-display text-6xl italic text-primary">Merci&nbsp;!</p>
              <p className="mt-4 text-muted-foreground">Votre demande a bien été reçue. Blondel Jardin revient vers vous très vite.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex h-full flex-col gap-8" noValidate>
              <div>
                <p className="eyebrow text-primary">Votre demande</p>
                <h2 className="mt-2 font-display text-4xl text-primary">Quelques mots suffisent.</h2>
              </div>
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                {([
                  ["nom", "Nom", "text", "md:col-span-2"],
                  ["email", "Email", "email", ""],
                  ["telephone", "Téléphone (facultatif)", "tel", ""],
                ] as const).map(([n, l, t, c]) => (
                  <div key={n} className={`relative ${c}`}>
                    <input id={n} name={n} type={t} placeholder={l} className={field} />
                    <label htmlFor={n} className={floating}>{l}</label>
                    {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
                  </div>
                ))}
              </div>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Votre projet"
                  className={`${field} resize-none`}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setSugg(null); setConfirme(null); }}
                />
                <label htmlFor="message" className={floating}>Votre projet (surface, état, envies…)</label>
                {errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
              </div>

              <div>
                <button
                  type="button"
                  onClick={suggerer}
                  disabled={chargement || message.trim().length < 10}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  {chargement ? "Analyse…" : "Suggérer la prestation adaptée"}
                </button>
                {sugg && "erreur" in sugg && <p className="mt-2 text-sm text-destructive">{sugg.erreur}</p>}
                {sugg && "prestation" in sugg && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-background px-5 py-4">
                    <div className="mr-auto">
                      <p className="font-display text-2xl text-primary">{sugg.prestation}</p>
                      <p className="text-sm text-muted-foreground">{sugg.raison}</p>
                    </div>
                    {confirme ? (
                      <span className="text-sm font-medium text-primary">✓ Confirmée</span>
                    ) : (
                      <>
                        <button type="button" onClick={() => setConfirme(sugg.prestation)} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Confirmer</button>
                        <button type="button" onClick={() => setSugg(null)} className="text-sm text-muted-foreground hover:text-primary">Ignorer</button>
                      </>
                    )}
                  </div>
                )}
                <input type="hidden" name="prestation" value={confirme ?? ""} />
              </div>

              <button
                type="submit"
                className="group mt-auto inline-flex items-center justify-between rounded-full bg-primary py-2 pl-8 pr-2 font-medium text-primary-foreground transition hover:opacity-95"
              >
                Envoyer ma demande
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-primary transition group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
