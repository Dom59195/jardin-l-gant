import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SecteurMap } from "@/components/secteur-map";
import { CreditImpot } from "@/components/credit-impot";
import {
  ArrowUpRight,
  Leaf,
  Scissors,
  Sprout,
  Trees,
  Star,
  Phone,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import hero from "@/assets/hero-jardin.jpg";
import p1 from "@/assets/projet-1.jpg";
import p2 from "@/assets/projet-2.jpg";
import p3 from "@/assets/projet-3.jpg";
import { avisGoogle } from "@/lib/avis";
import { getAvisGoogle, type AvisData } from "@/lib/avis.functions";

const secours: AvisData = {
  note: avisGoogle.note,
  total: avisGoogle.total,
  lien: avisGoogle.lien,
  laisserAvis: avisGoogle.lien,
  avis: avisGoogle.avis.map((a) => ({ nom: "Client Google", note: 5, texte: a.texte, date: a.date })),
};
const avisQuery = queryOptions({
  queryKey: ["avis-google"],
  queryFn: async () => (await getAvisGoogle()) ?? secours,
  staleTime: 3600_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blondel Jardin — Jardinier paysagiste à Hérin (Nord)" },
      {
        name: "description",
        content:
          "Entretien et aménagement de jardins à Hérin et dans le Valenciennois. Devis gratuit, 50 % de crédit d'impôt.",
      },
      { property: "og:title", content: "Blondel Jardin — Jardinier paysagiste à Hérin" },
      { property: "og:description", content: "Entretien et aménagement de jardins à Hérin et alentours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(avisQuery).catch(() => secours),
  component: Index,
});

import { Compteur } from "@/components/compteur";

const etapes = [
  { n: "01", t: "Premier contact", d: "Vous me contactez par téléphone ou par message pour exposer vos besoins." },
  { n: "02", t: "Visite & devis", d: "Je visite votre jardin et vous remets un devis gratuit et détaillé." },
  { n: "03", t: "Intervention", d: "Je réalise les travaux à la date convenue, avec un chantier laissé propre." },
  { n: "04", t: "Suivi", d: "Un entretien régulier est mis en place pour préserver votre jardin toute l'année." },
];

const faq = [
  {
    q: "À quelle période planter des arbustes ?",
    r: "L'automne (octobre – novembre) est la meilleure période : le sol est encore tiède et la pluie aide à l'enracinement. La plantation au printemps est aussi possible, en évitant les périodes de gel et de forte chaleur.",
  },
  {
    q: "Quand tailler ses arbustes ?",
    r: "Les arbustes qui fleurissent au printemps se taillent juste après la floraison ; ceux qui fleurissent en été se taillent à la fin de l'hiver. On commence toujours par retirer le bois mort, en coupant juste au-dessus d'un bourgeon.",
  },
  {
    q: "Comment entretenir ma pelouse ?",
    r: "Tondez régulièrement sans jamais couper plus d'un tiers de la hauteur, et gardez le gazon assez haut (7 à 8 cm) en période sèche. Une scarification au printemps et un apport d'engrais à l'automne suffisent à garder une pelouse dense et verte.",
  },
  {
    q: "Quand et comment arroser le jardin ?",
    r: "Arrosez tôt le matin ou le soir, peu souvent mais en profondeur : les racines descendent et les plantes résistent mieux à la sécheresse. Un paillage au pied des plantations limite l'évaporation et l'arrosage.",
  },
];

function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(n) ? "fill-current" : "opacity-30"}`} />
      ))}
    </div>
  );
}

function CarouselAvis({ items }: { items: AvisData["avis"] }) {
  const [autoScroll] = useState(() =>
    AutoScroll({
      speed: 1,
      startDelay: 0,
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    }),
  );
  const [carouselRef, carousel] = useEmblaCarousel({ loop: true, align: "start" }, [autoScroll]);
  useEffect(() => {
    if (!carousel) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Relance complète : le navigateur peut suspendre l'animation (onglet caché,
    // aperçu pas encore actif) sans que le module le sache ; on la redémarre.
    const relancer = () => {
      if (preference.matches) {
        autoScroll.stop();
        return;
      }
      autoScroll.stop();
      autoScroll.play(0);
    };
    relancer();

    // Surveillance : si le carrousel ne bouge plus, on le relance automatiquement.
    let derniere = carousel.internalEngine().location.get();
    let appui = false;
    const enAppui = () => {
      appui = true;
    };
    const relache = () => {
      appui = false;
    };
    carousel.on("pointerDown", enAppui).on("pointerUp", relache);
    const surveillance = window.setInterval(() => {
      if (preference.matches || document.hidden || appui) return;
      const actuelle = carousel.internalEngine().location.get();
      if (Math.abs(actuelle - derniere) < 0.5) {
        if (carousel.scrollSnapList().length <= 1) carousel.reInit();
        relancer();
      }
      derniere = actuelle;
    }, 800);

    // Relance dès que la section des avis apparaît à l'écran.
    const observateur = new IntersectionObserver((entrees) => {
      if (entrees.some((e) => e.isIntersecting)) relancer();
    });
    observateur.observe(carousel.rootNode());

    const visible = () => {
      if (!document.hidden) relancer();
    };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("focus", visible);
    window.addEventListener("pageshow", visible);
    preference.addEventListener("change", relancer);
    return () => {
      window.clearInterval(surveillance);
      carousel.off("pointerDown", enAppui).off("pointerUp", relache);
      observateur.disconnect();
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("focus", visible);
      window.removeEventListener("pageshow", visible);
      preference.removeEventListener("change", relancer);
    };
  }, [carousel, autoScroll]);

  return (
    <div className="relative min-w-0" role="region" aria-label="Avis Google" aria-roledescription="carrousel">
      <div ref={carouselRef} className="overflow-hidden">
        <div className="flex touch-pan-y gap-5 max-sm:gap-4 pb-2">
          {items.map((a, i) => (
            <figure
              key={i}
              data-carte
              className="flex min-w-0 flex-[0_0_22rem] flex-col justify-between rounded-3xl border border-border bg-card p-7 max-sm:flex-[0_0_72%] max-sm:p-5"
            >
              <div className="text-moss max-sm:[&>svg]:h-4 max-sm:[&>svg]:w-4">
                <Stars n={a.note} />
              </div>
              <blockquote className="mt-4 leading-relaxed text-foreground max-sm:mt-3 max-sm:text-sm">
                « {a.texte} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {a.nom.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {a.nom}
                  <span className="block text-xs font-normal text-muted-foreground">{a.date}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2 max-sm:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => carousel?.scrollPrev()}
          aria-label="Avis précédents"
          title="Avis précédents"
          className="h-11 w-11 rounded-full text-primary hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => carousel?.scrollNext()}
          aria-label="Avis suivants"
          title="Avis suivants"
          className="h-11 w-11 rounded-full text-primary hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function Index() {
  const { data: avis } = useSuspenseQuery(avisQuery);
  const noteTxt = avis.note.toFixed(1).replace(".", ",");

  return (
    <>
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pt-12 pb-16 max-sm:gap-8 max-sm:pt-8 max-sm:pb-12 md:grid-cols-12 md:gap-8 md:pt-20">
        <div className="flex flex-col justify-center md:col-span-6 animate-fade-up">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" /> Jardinier paysagiste · Hérin (59)
          </span>
          <h1 className="mt-6 font-display text-5xl max-sm:mt-5 max-sm:text-[2.75rem] text-primary md:text-5xl lg:text-[4rem]">
            Votre jardin,
            <br />
            <em className="text-moss">entre de bonnes</em>
            <br />
            mains.
          </h1>
          <p className="mt-8 max-sm:mt-6 max-sm:text-base max-w-md text-lg leading-relaxed text-muted-foreground">
            Entretien, taille et aménagement pour les particuliers du Valenciennois. Un travail propre, ponctuel et
            passionné.
          </p>
          <div className="mt-10 max-sm:mt-8 max-sm:grid max-sm:grid-cols-1 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex max-sm:justify-center items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Demander un devis gratuit
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <a
              href="tel:+33783551969"
              className="inline-flex max-sm:justify-center items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
            >
              <Phone className="h-4 w-4" /> 07 83 55 19 69
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {avis.avis.slice(0, 4).map((a, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-secondary text-sm font-semibold text-primary"
                >
                  {a.nom.charAt(0)}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 text-primary">
                <Stars n={avis.note} />
                <span className="font-semibold">{noteTxt}</span>
              </div>
              <p className="text-muted-foreground">{avis.total} avis Google</p>
            </div>
          </div>
        </div>

        <div className="relative md:col-span-6">
          <img
            src="https://images.unsplash.com/photo-1741308234369-8bdfb0520bdf?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="Jardin entretenu par Blondel Jardin"
            width={1920}
            height={1088}
            className="h-[460px] max-sm:h-[360px] w-full rounded-3xl object-cover md:h-[620px]"
          />
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-card p-5 shadow-xl md:left-10">
            <p className="font-display text-4xl text-primary">50 %</p>
            <p className="text-xs text-muted-foreground">
              de crédit d'impôt
              <br />
              service à la personne
            </p>
          </div>
          <div className="absolute top-6 right-6 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
            Devis gratuit
          </div>
        </div>
      </section>

      {/* SAVOIR-FAIRE */}
      <section className="border-y border-border/40 bg-secondary/50 py-20 max-sm:py-10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 text-center max-sm:grid-cols-3 max-sm:gap-2 max-sm:px-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/30">
          <div>
            <p className="font-display text-6xl max-sm:text-[2rem] leading-none text-primary md:text-7xl">
              <Compteur fin={2} duree={1200} />
            </p>
            <p className="mt-3 text-sm max-sm:mt-2 max-sm:text-[0.55rem] max-sm:leading-snug max-sm:tracking-[0.12em] font-semibold uppercase tracking-[0.2em] text-moss">
              ans d'expérience
            </p>
          </div>
          <div>
            <p className="font-display text-6xl max-sm:text-[2rem] leading-none text-primary md:text-7xl">
              <Compteur fin={30} prefixe="+" />
            </p>
            <p className="mt-3 text-sm max-sm:mt-2 max-sm:text-[0.55rem] max-sm:leading-snug max-sm:tracking-[0.12em] font-semibold uppercase tracking-[0.2em] text-moss">
              clients satisfaits
            </p>
          </div>
          <div>
            <p className="font-display text-6xl max-sm:text-[2rem] leading-none text-primary md:text-7xl">
              <Compteur fin={50} prefixe="+" suffixe=" km" />
            </p>
            <p className="mt-3 text-sm max-sm:mt-2 max-sm:text-[0.55rem] max-sm:leading-snug max-sm:tracking-[0.12em] font-semibold uppercase tracking-[0.2em] text-moss">
              rayon d'action autour de Valenciennes
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="mx-auto max-w-7xl px-6 py-28 max-sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-display text-5xl leading-tight text-primary md:text-6xl">
            Des prestations <em className="text-moss">sur mesure</em>, au fil des saisons.
          </h2>
        </div>

        <div className="mt-16 max-sm:mt-10 grid auto-rows-[260px] max-sm:auto-rows-auto max-sm:grid-cols-2 gap-4 max-sm:gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-3xl p-8 max-sm:col-span-2 max-sm:p-6 text-primary-foreground md:row-span-2 lg:col-span-2">
            {/* Photo en arrière-plan complet */}
            <img
              src="https://images.unsplash.com/photo-1689954088471-1760a666774d?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Entretien de jardin"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Voile sombre pour garantir la lisibilité du texte */}
            <div className="absolute inset-0 bg-primary/75 backdrop-blur-[1px]" />

            {/* Contenu au premier plan */}
            <div className="relative z-10">
              <Sprout className="h-10 w-10 text-accent" strokeWidth={1.5} />
              <h3 className="mt-8 font-display text-4xl">Entretien de jardin</h3>
              <ul className="mt-6 space-y-3 text-sm opacity-90">
                {["Tonte de pelouse", "Débroussaillage", "Ramassage de feuilles", "Nettoyage de fin de saison"].map(
                  (x) => (
                    <li key={x} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent" /> {x}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl max-sm:col-span-2 max-sm:h-56 lg:col-span-2">
            <img
              src={p2}
              alt="Taille de haies"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative flex h-full flex-col justify-end p-8 text-primary-foreground">
              <Scissors className="h-7 w-7 text-accent" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-3xl">Taille de haies & arbustes</h3>
            </div>
          </div>
          <div className="rounded-3xl bg-secondary p-8 max-sm:p-5">
            <Trees className="h-7 w-7 text-moss" strokeWidth={1.5} />
            <h3 className="mt-6 max-sm:mt-4 font-display text-2xl max-sm:text-xl text-primary">Travaux saisonniers</h3>
            <p className="mt-2 text-sm text-muted-foreground">Scarification, engrais, protection hivernale.</p>
          </div>
          <div className="rounded-3xl bg-accent p-8 max-sm:p-5 text-accent-foreground md:col-span-2 lg:col-span-1">
            <Leaf className="h-7 w-7" strokeWidth={1.5} />
            <h3 className="mt-6 max-sm:mt-4 font-display text-2xl max-sm:text-xl">Déchets verts évacués</h3>
            <p className="mt-2 text-sm opacity-80">Vous n'avez rien à gérer, le jardin est laissé propre.</p>
          </div>
        </div>
      </section>

      <CreditImpot />

      {/* PROCESS */}
      <section className="bg-secondary py-28 max-sm:py-16 lg:py-10">
        <div className="mx-auto max-w-7xl max-sm:px-4 lg:max-w-6xl px-6">
          <h2 className="font-display text-5xl max-sm:text-4xl text-primary md:text-6xl lg:text-5xl">
            Simple, <em className="text-moss">du début à la fin.</em>
          </h2>
          <div className="mt-16 max-sm:mt-10 lg:mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border max-sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e) => (
              <div key={e.n} className="bg-background p-8 max-sm:p-5 lg:p-7">
                <span className="font-display text-5xl max-sm:text-4xl text-moss lg:text-4xl">{e.n}</span>
                <h3 className="mt-8 max-sm:mt-4 text-lg max-sm:text-base font-semibold text-primary lg:text-base lg:mt-6">
                  {e.t}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="mx-auto max-w-7xl px-6 py-28 max-sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-moss">Avis Google</p>
            <div className="mt-3 flex items-baseline gap-4 font-display text-6xl max-sm:text-5xl leading-none text-primary">
              {noteTxt}
              <span className="text-primary">
                <Stars n={avis.note} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">Sur {avis.total} avis vérifiés</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={avis.laisserAvis}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Laisser un avis
            </a>
            <a
              href={avis.lien}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-primary hover:bg-secondary"
            >
              Voir sur Google <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="mt-12">
          <CarouselAvis items={avis.avis} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-sm:px-4 max-sm:pb-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 max-sm:gap-4 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem]">
            <img src={p3} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative flex flex-col items-start gap-8 px-8 py-20 max-sm:px-6 max-sm:py-14 text-primary-foreground md:px-16 md:py-24">
              <h2 className="max-w-2xl font-display text-4xl leading-tight md:text-5xl">
                Prêt à redonner vie à votre <em>jardin</em>&nbsp;?
              </h2>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 max-sm:w-full max-sm:justify-center"
              >
                Obtenir mon devis gratuit{" "}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] max-sm:aspect-square">
            <SecteurMap compact />
          </div>
        </div>
      </section>

      {/* FAQ / conseils d'entretien */}
      <section className="mx-auto max-w-4xl px-6 pb-28 max-sm:px-4 max-sm:pb-16">
        <div className="text-center">
          <p className="eyebrow text-moss">Conseils de jardinier</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-primary md:text-5xl">
            Les <em>bonnes pratiques</em> pour votre jardin
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 border-t border-border/70">
          {faq.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border/70">
              <AccordionTrigger className="py-5 text-left font-display text-xl text-primary hover:no-underline max-sm:text-lg md:text-2xl [&>svg]:h-5 [&>svg]:w-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                {f.r}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
