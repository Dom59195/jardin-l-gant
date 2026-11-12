import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Leaf, MapPin, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export type ProjetLightbox = {
  img: string;
  photos: string[];
  description?: string;
  titre: string;
  lieu: string;
  type: string;
};

type Props = {
  projet: ProjetLightbox;
  onClose: () => void;
};

/**
 * Fenêtre affichant la photo d'un projet en grand. Elle se ferme avec la croix,
 * Échap ou un clic hors de la photo, et se parcourt avec les flèches.
 */
export function LightboxProjets({ projet, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const photos = projet.photos.length ? projet.photos : [projet.img];
  const total = photos.length;

  // La page ne doit plus défiler pendant que la fenêtre est ouverte.
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
      } else if (e.key === "ArrowRight") {
        setIndex((index + 1) % total);
      } else if (e.key === "ArrowLeft") {
        setIndex((index - 1 + total) % total);
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
  }, [index, total, onClose]);

  if (!projet) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo en grand : ${projet.titre}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10"
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-primary/90 backdrop-blur-sm animate-lb-fade" />

      <div className="relative max-h-[94dvh] w-full max-w-[1440px] overflow-y-auto rounded-3xl border border-primary-foreground/20 bg-primary p-4 text-primary-foreground animate-lb-zoom sm:p-6 lg:p-7">
      <Button
        ref={closeRef}
        variant="ghost"
        size="icon"
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-3 top-3 z-20 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary-foreground/10"
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <figure className="relative overflow-hidden rounded-2xl bg-forest">
            <img
              src={photos[index]}
              alt={projet.titre}
              className="aspect-[4/3] max-h-[66dvh] w-full object-cover sm:aspect-[3/2] lg:aspect-[4/3]"
            />
      {total > 1 && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setIndex((index - 1 + total) % total)}
          aria-label="Photo précédente"
          className="absolute left-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border border-primary-foreground/20 bg-primary/80 text-primary-foreground hover:bg-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {total > 1 && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setIndex((index + 1) % total)}
          aria-label="Photo suivante"
          className="absolute right-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border border-primary-foreground/20 bg-primary/80 text-primary-foreground hover:bg-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

          <figcaption className="absolute bottom-3 right-3 rounded-full bg-primary/85 px-3 py-1.5 text-xs font-medium text-primary-foreground">
            {index + 1} / {total}
          </figcaption>
          </figure>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Photos du projet">
            {photos.map((photo, i) => (
              <Button
                key={`${photo}-${i}`}
                variant="ghost"
                onClick={() => setIndex(i)}
                aria-label={`Voir la photo ${i + 1} de ${projet.titre}`}
                aria-pressed={i === index}
                className={`h-auto min-w-0 overflow-hidden rounded-xl border-2 p-0 hover:bg-transparent ${i === index ? "border-gold" : "border-transparent opacity-65 hover:opacity-100"}`}
              >
                <img src={photo} alt="" className="aspect-[4/3] w-full object-cover" />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-col pb-2 lg:pt-6">
          <div className="mb-4 flex items-center gap-4 text-sage">
            <span className="text-xs font-medium uppercase">Projet</span>
            <span className="h-px w-16 bg-sage/50" />
          </div>
          <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">{projet.titre}</h2>
          <p className="mt-5 flex items-start gap-2 text-sm text-primary-foreground/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{projet.lieu} · {projet.type}</span>
          </p>
          {projet.description && <p className="mt-5 text-base leading-relaxed text-primary-foreground/80">{projet.description}</p>}
          <div className="my-7 flex items-start gap-4 border-y border-primary-foreground/15 py-6">
            <Leaf className="h-6 w-6 shrink-0 text-sage" />
            <div>
              <p className="text-xs text-primary-foreground/65">Prestation</p>
              <p className="mt-1 text-lg font-medium">{projet.type}</p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <p className="font-display text-xl">Blondel Jardin</p>
            <Button asChild className="mt-5 h-12 w-full rounded-full bg-background text-foreground hover:bg-secondary">
              <Link to="/contact" onClick={onClose}>Demander un devis <ArrowUpRight /></Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>,
    document.body,
  );
}
