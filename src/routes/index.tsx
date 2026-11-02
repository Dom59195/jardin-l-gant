import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Scissors, TreeDeciduous, Shovel } from "lucide-react";
import hero from "@/assets/hero-jardin.jpg";
import { projets } from "@/lib/projets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdure & Jardins — Jardinier paysagiste" },
      { name: "description", content: "Création, entretien et aménagement de jardins d'exception par un jardinier paysagiste passionné." },
      { property: "og:title", content: "Verdure & Jardins — Jardinier paysagiste" },
      { property: "og:description", content: "Création, entretien et aménagement de jardins d'exception." },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Sprout, t: "Création de jardins", d: "Conception sur mesure, du plan à la plantation." },
  { icon: Shovel, t: "Entretien", d: "Tonte, désherbage et soins au fil des saisons." },
  { icon: Scissors, t: "Taille & élagage", d: "Haies, arbustes et arbres taillés avec précision." },
  { icon: TreeDeciduous, t: "Aménagement extérieur", d: "Terrasses, allées, bassins et éclairage." },
];

function Index() {
  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Jardin paysager au coucher du soleil" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 text-primary-foreground animate-fade-up">
          <p className="eyebrow opacity-80">Jardinier paysagiste</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            L'art de sublimer <em>votre jardin</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-85">
            Des espaces verts pensés avec soin, créés et entretenus dans le respect du vivant.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="eyebrow rounded-sm bg-background px-7 py-4 text-primary transition-opacity hover:opacity-90">Demander un devis</Link>
            <Link to="/projets" className="eyebrow rounded-sm border border-primary-foreground/60 px-7 py-4 transition-colors hover:bg-primary-foreground/10">Nos réalisations</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-moss">Nos savoir-faire</p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Un accompagnement complet</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.t} className="rounded-md border border-border bg-card p-8 transition-transform hover:-translate-y-1">
              <s.icon className="h-8 w-8 text-moss" strokeWidth={1.3} />
              <h3 className="mt-6 font-display text-2xl text-primary">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-moss">Réalisations</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Projets récents</h2>
            </div>
            <Link to="/projets" className="eyebrow text-primary underline-offset-8 hover:underline">Voir tous les projets →</Link>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {projets.slice(0, 3).map((p) => (
              <article key={p.titre} className="group">
                <div className="overflow-hidden rounded-md">
                  <img src={p.img} alt={p.titre} loading="lazy" width={1024} height={1024} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-primary">{p.titre}</h3>
                <p className="text-sm text-muted-foreground">{p.lieu} · {p.type}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:grid-cols-3">
        {[
          ["15 ans", "d'expérience au service des jardins"],
          ["300+", "projets réalisés avec passion"],
          ["100 %", "devis gratuits et sans engagement"],
        ].map(([n, t]) => (
          <div key={n} className="border-t border-border pt-6">
            <p className="font-display text-6xl text-primary">{n}</p>
            <p className="mt-2 text-muted-foreground">{t}</p>
          </div>
        ))}
      </section>

      <section className="bg-forest py-24 text-center text-primary-foreground">
        <h2 className="mx-auto max-w-2xl px-6 font-display text-4xl md:text-5xl">Parlons de votre futur jardin</h2>
        <Link to="/contact" className="eyebrow mt-10 inline-block rounded-sm bg-background px-8 py-4 text-primary hover:opacity-90">Prendre contact</Link>
      </section>
    </>
  );
}
