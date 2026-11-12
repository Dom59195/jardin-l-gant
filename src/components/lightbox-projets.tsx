import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type ProjetLightbox = {
  img: string;
  titre: string;
  lieu: string;
  type: string;
};

type Props = {
  projets: ProjetLightbox[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

/**
 * Fenêtre affichant la photo d'un projet en grand. Elle se ferme avec la croix,
 * Échap ou un clic hors de la photo, et se parcourt avec les flèches.
 */
export function LightboxProjets({ projets, index, onClose, onIndexChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = projets.length;
  const projet = projets[index];

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
        onIndexChange((index + 1) % total);
      } else if (e.key === "ArrowLeft") {
        onIndexChange((index - 1 + total) % total);
      } else if (e.key === "Tab") {
        const boutons = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!boutons?.length) return;
        const premier = boutons[0];
        const dernier = boutons[boutons.length - 1];
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
  }, [index, total, onClose, onIndexChange]);

  if (!projet) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo en grand : ${projet.titre}`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-16 sm:px-12"
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-primary/90 backdrop-blur-sm animate-lb-fade" />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 rounded-full border border-primary-foreground/25 p-2.5 text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + total) % total)}
          aria-label="Projet précédent"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/25 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {total > 1 && (
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % total)}
          aria-label="Projet suivant"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/25 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <figure className="relative flex flex-col items-center gap-4 animate-lb-zoom">
        <img
          src={projet.img}
          alt={projet.titre}
          className="max-h-[68vh] w-auto max-w-full rounded-3xl object-contain ring-1 ring-primary-foreground/15"
        />
        <figcaption className="text-center">
          <h2 className="font-display text-2xl text-primary-foreground sm:text-3xl">{projet.titre}</h2>
          <p className="eyebrow mt-2 text-sage">
            {projet.lieu} · {projet.type}
          </p>
          <p className="mt-3 text-xs tracking-widest text-primary-foreground/55">
            {index + 1} / {total}
          </p>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
