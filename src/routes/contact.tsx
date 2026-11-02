import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & devis — Verdure & Jardins" },
      { name: "description", content: "Contactez votre jardinier paysagiste pour un devis gratuit et sans engagement." },
      { property: "og:title", content: "Contact & devis — Verdure & Jardins" },
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
        <p className="mt-6 text-muted-foreground">Devis gratuit, réponse sous 48 h.</p>
        <div className="mt-12 space-y-8 text-sm">
          <div><p className="eyebrow mb-2 text-moss">Adresse</p><p>12 rue des Tilleuls, 69000 Lyon</p></div>
          <div><p className="eyebrow mb-2 text-moss">Téléphone</p><p>06 12 34 56 78</p></div>
          <div><p className="eyebrow mb-2 text-moss">Email</p><p>contact@verdure-jardins.fr</p></div>
          <div><p className="eyebrow mb-2 text-moss">Horaires</p><p>Lundi – Vendredi : 8h – 18h</p><p>Samedi : 9h – 12h</p></div>
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
            {[
              ["nom", "Nom", "text"],
              ["email", "Email", "email"],
              ["telephone", "Téléphone (facultatif)", "tel"],
            ].map(([n, l, t]) => (
              <div key={n}>
                <label htmlFor={n} className="eyebrow mb-2 block text-muted-foreground">{l}</label>
                <input id={n} name={n} type={t} className={field} />
                {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="eyebrow mb-2 block text-muted-foreground">Votre projet</label>
              <textarea id="message" name="message" rows={5} className={field} />
              {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
            </div>
            <button type="submit" className="eyebrow w-full rounded-sm bg-primary px-6 py-4 text-primary-foreground hover:opacity-90">Envoyer ma demande</button>
          </form>
        )}
      </div>
    </section>
  );
}
