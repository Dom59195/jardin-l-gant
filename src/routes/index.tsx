import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Scissors, TreeDeciduous, Shovel } from "lucide-react";
import hero from "@/assets/hero-jardin.jpg";
import { projets } from "@/lib/projets";
import { avisGoogle } from "@/lib/avis";
import { getAvisGoogle, type AvisData } from "@/lib/avis.functions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const secours: AvisData = { note: avisGoogle.note, total: avisGoogle.total, lien: avisGoogle.lien, laisserAvis: avisGoogle.lien, avis: avisGoogle.avis.map((a) => ({ nom: "Client Google", note: 5, texte: a.texte, date: a.date })) };
const avisQuery = queryOptions({ queryKey: ["avis-google"], queryFn: async () => (await getAvisGoogle()) ?? secours, staleTime: 3600_000 });
import { Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blondel Jardin — Jardinier paysagiste à Hérin (Nord)" },
      { name: "description", content: "Entretien et aménagement de jardins à Hérin et dans le Valenciennois. Devis gratuit, 50 % de crédit d'impôt." },
      { property: "og:title", content: "Blondel Jardin — Jardinier paysagiste à Hérin" },
      { property: "og:description", content: "Entretien et aménagement de jardins à Hérin et alentours." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(avisQuery).catch(() => secours),
  component: Index,
});

const services = [
  { icon: Sprout, t: "Entretien de jardin", d: "Tonte, débroussaillage, ramassage de feuilles." },
  { icon: Shovel, t: "Travaux saisonniers", d: "Nettoyage de printemps et d'automne, scarification, engrais." },
  { icon: Scissors, t: "Taille de haies", d: "Haies, arbustes et conifères taillés avec soin." },
  { icon: TreeDeciduous, t: "Aménagement", d: "Massifs, plantations, engazonnement et évacuation des déchets verts." },
];

function Index() {
  const { data: avis } = useSuspenseQuery(avisQuery);
  const noteTxt = avis.note.toFixed(1).replace(".", ",");
  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Jardin paysager au coucher du soleil" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 text-primary-foreground animate-fade-up">
          <p className="eyebrow opacity-80">Jardinier paysagiste · Hérin (59)</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            L'art de sublimer <em>votre jardin</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-85">
            Clément Blondel met sa passion du végétal au service de vos extérieurs, avec soin et dans le respect de votre budget.
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
          [`${noteTxt} ★`, `note moyenne sur Google (${avis.total} avis)`],
          ["50 %", "de crédit d'impôt (service à la personne)"],
          ["Gratuit", "devis rapide et sans engagement"],
        ].map(([n, t]) => (
          <div key={n} className="border-t border-border pt-6">
            <p className="font-display text-6xl text-primary">{n}</p>
            <p className="mt-2 text-muted-foreground">{t}</p>
          </div>
        ))}
      </section>

      <section className="bg-secondary py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-moss">Avis Google</p>
              <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Ils m'ont fait confiance</h2>
              <div className="mt-4 flex items-center gap-2 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < Math.round(avis.note) ? "h-5 w-5 fill-current" : "h-5 w-5"} />)}
                <span className="ml-2 text-sm text-muted-foreground">{noteTxt} / 5 · {avis.total} avis</span>
              </div>
            </div>
            <a href={avis.laisserAvis} target="_blank" rel="noreferrer" className="eyebrow text-primary underline-offset-8 hover:underline">Laisser un avis</a>
            <a href={avis.lien} target="_blank" rel="noreferrer" className="eyebrow text-primary underline-offset-8 hover:underline">Voir sur Google →</a>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avis.avis.map((a, i) => (
              <figure key={i} className="flex flex-col rounded-md border border-border bg-card p-8">
                <div className="flex gap-1 text-moss">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={j < a.note ? "h-4 w-4 fill-current" : "h-4 w-4"} />)}</div>
                <blockquote className="mt-5 flex-1 font-display text-xl leading-snug text-primary">« {a.texte} »</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {a.photo && <img src={a.photo} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" />}
                  <span className="text-sm text-primary">{a.nom}<span className="block text-xs text-muted-foreground">{a.date}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-24 text-center text-primary-foreground">
        <h2 className="mx-auto max-w-2xl px-6 font-display text-4xl md:text-5xl">Parlons de votre futur jardin</h2>
        <Link to="/contact" className="eyebrow mt-10 inline-block rounded-sm bg-background px-8 py-4 text-primary hover:opacity-90">Prendre contact</Link>
      </section>
    </>
  );
}
