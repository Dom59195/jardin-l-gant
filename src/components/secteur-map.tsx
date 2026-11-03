import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IllustratedSectorMap } from "@/components/illustrated-sector-map";

export function SecteurMap({ compact = false }: { compact?: boolean } = {}) {
  const illustration = (
    <div className={compact ? "relative flex h-full min-h-[420px] flex-col overflow-hidden bg-background max-sm:min-h-[340px]" : "relative flex h-[480px] flex-col overflow-hidden rounded-3xl bg-background max-sm:h-[370px]"} role="region" aria-label="Carte de la zone d'intervention de Blondel Jardin : 50 km autour de Valenciennes">
      <div className="shrink-0 px-7 pt-6 text-primary max-sm:px-5 max-sm:pt-5">
        <p className="text-[11px] font-semibold uppercase">Notre zone d’intervention</p>
        <p className="mt-1 font-display text-3xl max-sm:text-2xl">Hérin <em>& le Valenciennois</em></p>
      </div>
      <div className="relative min-h-0 flex-1 px-2">
        <div className="absolute inset-0"><IllustratedSectorMap /></div>
      </div>
      <div className="mx-6 mb-5 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-primary/15 pt-3 text-xs text-primary max-sm:mx-4 max-sm:mb-4">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full border border-dashed border-primary/60 bg-primary/10" /> Rayon de 50 km <span className="text-[10px] text-muted-foreground">· carte indicative</span></span>
        <Button asChild variant="link" className="h-auto p-0 text-xs text-primary">
          <a href="https://www.google.com/maps/search/?api=1&query=38+rue+Auguste+Caron+59195+Herin" target="_blank" rel="noreferrer">Voir sur Google <ArrowUpRight /></a>
        </Button>
      </div>
    </div>
  );
  if (compact) return illustration;
  return (
    <section className="border-t border-border/50 py-20 max-sm:py-14" aria-labelledby="secteur-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-moss">Notre secteur</p>
            <h2 id="secteur-title" className="font-display text-5xl leading-tight text-primary md:text-6xl">À Hérin, <em className="text-moss">et autour.</em></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Blondel Jardin intervient dans un rayon de plus de 50 km autour de Valenciennes.</p>
        </div>
        {illustration}
      </div>
    </section>
  );
}
