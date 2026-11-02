import { createFileRoute } from "@tanstack/react-router";
import { projets } from "@/lib/projets";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Nos projets — Blondel Jardin" },
      { name: "description", content: "Découvrez nos réalisations : créations de jardins, terrasses, bassins et entretien de parcs." },
      { property: "og:title", content: "Nos projets — Blondel Jardin" },
      { property: "og:description", content: "Découvrez nos réalisations de jardins et d'aménagements extérieurs." },
    ],
  }),
  component: Projets,
});

function Projets() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="eyebrow text-moss">Portfolio</p>
      <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">Nos projets</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Un aperçu des prestations réalisées.</p>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {projets.map((p) => (
          <article key={p.titre} className="group">
            <div className="overflow-hidden rounded-md">
              <img src={p.img} alt={p.titre} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-3xl text-primary">{p.titre}</h2>
              <span className="eyebrow text-moss">{p.lieu}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
