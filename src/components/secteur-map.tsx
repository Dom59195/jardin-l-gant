import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

export function SecteurMap({ compact = false }: { compact?: boolean } = {}) {
  const adresseQuery = encodeURIComponent("Blondel Jardin, 38 Rue Auguste Caron, 59195 Hérin");
  const embedUrl = `https://maps.google.com/maps?q=50.360294,3.450394&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${adresseQuery}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        compact
          ? "relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-2xl bg-card border border-border/60 max-sm:min-h-[300px]"
          : "relative flex h-[350px] flex-col overflow-hidden rounded-2xl bg-card border border-border/60 max-sm:h-[300px]"
      }
      role="region"
      aria-label="Localisation de Blondel Jardin à Hérin"
    >
      <div className="flex items-center justify-between bg-primary px-6 py-4 text-primary-foreground max-sm:px-4 max-sm:py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-moss shrink-0" />
          <h2 className="font-display text-xl font-light leading-tight">Blondel Jardin · Hérin (59195)</h2>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
        >
          <span>Ouvrir dans Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="relative flex-1 w-full bg-secondary">
        {shouldLoad ? (
          <iframe
            title="Carte de localisation Blondel Jardin à Hérin"
            src={embedUrl}
            tabIndex={-1}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            Chargement de la carte...
          </div>
        )}
      </div>
    </div>
  );
}
