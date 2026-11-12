import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { projets as projetsParDefaut, type Projet } from "@/lib/projets";
import { LightboxProjets } from "@/components/lightbox-projets";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Nos projets — Blondel Jardin" },
      {
        name: "description",
        content: "Découvrez nos réalisations : créations de jardins, terrasses, bassins et entretien de parcs.",
      },
      { property: "og:title", content: "Nos projets — Blondel Jardin" },
      {
        property: "og:description",
        content: "Découvrez nos réalisations de jardins et d'aménagements extérieurs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projets,
});

function Projets() {
  const [listeProjets, setListeProjets] = useState<Projet[]>(projetsParDefaut);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const declencheur = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    (supabase as any)
      .from("projets")
      .select("*")

      .order("ordre", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setListeProjets(data as unknown as Projet[]);
        }
      });
  }, []);

  // Le focus revient sur la carte d'où la fenêtre a été ouverte
  useEffect(() => {
    if (ouvert === null) declencheur.current?.focus({ preventScroll: true });
  }, [ouvert]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="eyebrow text-moss">Portfolio</p>
      <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">Nos projets</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Un aperçu des prestations réalisées. Cliquez sur un projet pour voir la photo en grand.
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {listeProjets.map((p, i) => (
          <article key={p.titre}>
            <button
              type="button"
              onClick={(e) => {
                declencheur.current = e.currentTarget;
                setOuvert(i);
              }}
              aria-label={`Agrandir la photo : ${p.titre}`}
              className="group block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={p.img}
                  alt={p.titre}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary/80 px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Agrandir
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-3xl text-primary">{p.titre}</h2>
                <span className="eyebrow text-moss">{p.lieu}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.type}</p>
            </button>
          </article>
        ))}
      </div>

      {ouvert !== null && listeProjets[ouvert] && (
        <LightboxProjets key={ouvert} projet={listeProjets[ouvert]} onClose={() => setOuvert(null)} />
      )}
    </section>
  );
}
