import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Leaf, MapPin, Maximize2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export type ProjetLightbox = {
  img: string;
  photos: string[];
  titre: string;
  lieu: string;
  type: string;
  description?: string;
  duree?: string;
  surface?: string;
  etapes?: { jour: string; texte: string }[];
  resultat?: string;
};

type Props = {
  projet: ProjetLightbox;
  onClose: () => void;
};

export function LightboxProjets({ projet, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);

  const photos = projet?.photos && projet.photos.length > 0 ? projet.photos : [projet?.img].filter(Boolean);
  const total = photos.length;

  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = avant;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && total > 1) {
        setIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowLeft" && total > 1) {
        setIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Tab") {
        const boutons = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        const premier = boutons?.[0];
        const dernier = boutons?.[boutons.length - 1];
        if (!premier || !dernier) return;
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, onClose]);

  if (!projet) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo en grand : ${projet.titre}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-8"
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-primary/90 backdrop-blur-sm animate-lb-fade" />

      <div className="relative max-h-[94dvh] w-full max-w-[1560px] overflow-y-auto rounded-3xl border border-primary-foreground/20 bg-primary p-4 text-primary-foreground animate-lb-zoom sm:p-6 lg:p-10">
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon"
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-20 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary-foreground/10 sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
          {/* Colonne gauche : Galerie photos */}
          <div className="min-w-0">
            <figure className="relative overflow-hidden rounded-2xl bg-forest">
              <img
                src={photos[index]}
                alt={projet.titre}
                className="aspect-[4/3] max-h-[62dvh] w-full object-cover sm:aspect-[3/2] lg:aspect-[4/3]"
              />

              {total > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIndex((index - 1 + total) % total)}
                    aria-label="Photo précédente"
                    className="absolute left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-primary-foreground/20 bg-primary/80 text-primary-foreground hover:bg-primary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIndex((index + 1) % total)}
                    aria-label="Photo suivante"
                    className="absolute right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-primary-foreground/20 bg-primary/80 text-primary-foreground hover:bg-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <figcaption className="absolute bottom-3 right-3 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    {index + 1} / {total}
                  </figcaption>
                </>
              )}
            </figure>

            {total > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3" aria-label="Photos du projet">
                {photos.map((photo, i) => (
                  <Button
                    key={`${photo}-${i}`}
                    variant="ghost"
                    onClick={() => setIndex(i)}
                    aria-label={`Voir la photo ${i + 1} de ${projet.titre}`}
                    aria-pressed={i === index}
                    className={`h-auto min-w-0 overflow-hidden rounded-xl border-2 p-0 hover:bg-transparent ${
                      i === index ? "border-gold" : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img src={photo} alt="" className="aspect-[4/3] w-full object-cover" />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite : Détails du projet */}
          <div className="flex min-w-0 flex-col pb-2">
            {/* Surtitre PROJET */}
            <div className="flex items-center gap-3 text-sage">
              <span className="text-xs font-semibold tracking-widest uppercase">PROJET</span>
              <span className="h-px w-16 bg-sage/40" />
            </div>

            {/* Titre et localisation */}
            <h2 className="mt-4 font-display text-2xl text-primary-foreground sm:text-3xl lg:text-4xl">
              {projet.titre}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/80">
              <MapPin className="h-4 w-4 shrink-0 text-gold" />
              <span>{projet.lieu}</span>
            </p>

            {projet.description && (
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                {projet.description}
              </p>
            )}

            {/* Bandeau 3 spécifications */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-primary-foreground/15 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 py-3 text-center sm:px-3 sm:text-left">
              <div className="flex items-center gap-2.5 px-2">
                <Leaf className="hidden h-5 w-5 shrink-0 text-moss sm:block" />
                <div>
                  <p className="text-[11px] text-primary-foreground/60 uppercase">Prestation</p>
                  <p className="text-xs font-medium leading-tight sm:text-sm">{projet.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-2">
                <Calendar className="hidden h-5 w-5 shrink-0 text-moss sm:block" />
                <div>
                  <p className="text-[11px] text-primary-foreground/60 uppercase">Durée</p>
                  <p className="text-xs font-medium leading-tight sm:text-sm">{projet.duree || "3 jours"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-2">
                <Maximize2 className="hidden h-5 w-5 shrink-0 text-moss sm:block" />
                <div>
                  <p className="text-[11px] text-primary-foreground/60 uppercase">Surface</p>
                  <p className="text-xs font-medium leading-tight sm:text-sm">{projet.surface || "85 m²"}</p>
                </div>
              </div>
            </div>

            {/* Déroulement du projet (frise) */}
            {projet.etapes && projet.etapes.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-primary-foreground">Déroulement du projet</h3>
                <div className="mt-3 space-y-3">
                  {projet.etapes.map((etape, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      {i < projet.etapes!.length - 1 && (
                        <div className="absolute bottom-[-12px] left-[7px] top-4 w-0.5 bg-moss/50" />
                      )}
                      <span className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-moss" />
                      <div className="flex flex-col gap-0.5 text-xs sm:flex-row sm:items-baseline sm:gap-3 sm:text-sm">
                        <span className="font-semibold whitespace-nowrap text-moss">{etape.jour}</span>
                        <span className="text-primary-foreground/80">{etape.texte}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encadré Résultat */}
            {projet.resultat && (
              <div className="flex items-center select-none pointer-events-none">
                <img
                  src="/__l5e/assets-v1/fa269db7-45e7-4a2a-a6fa-7259a1be5936/logo-blondel-jardin-detoure.png"
                  alt="Blondel Jardin"
                  className="h-12 w-12 shrink-0 object-contain brightness-0 invert opacity-95"
                />
              </div>
            )}

            {/* Bas de fiche : Signature Logo à gauche + Bouton Devis à droite */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-5 sm:flex-row">
              <div className="flex items-center gap-3 select-none pointer-events-none">
                <img
                  src="/__l5e/assets-v1/fa269db7-45e7-4a2a-a6fa-7259a1be5936/logo-blondel-jardin-detoure.png"
                  alt="Blondel Jardin"
                  className="h-16 w-16 object-contain brightness-0 invert opacity-95 sm:h-20 sm:w-20"
                />
              </div>

              <Button
                asChild
                className="h-12 w-full rounded-full bg-background px-8 font-medium text-foreground transition-colors duration-300 ease-out hover:bg-moss hover:text-white sm:w-auto"
              >
                <Link to="/contact" onClick={onClose}>
                  Demander un devis <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
