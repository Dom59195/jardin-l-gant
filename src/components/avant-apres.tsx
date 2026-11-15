import { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

import avantAsset from "@/assets/jardin-avant.png.asset.json";
import apresAsset from "@/assets/jardin-apres.png.asset.json";

const avant = avantAsset.url;
const apres = apresAsset.url;

export function AvantApres() {
  const [pos, setPos] = useState(50);
  const zone = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const deplacer = (clientX: number) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-28 max-sm:px-4 max-sm:pb-16">
      <h2 className="font-display text-4xl leading-tight text-primary md:text-5xl">
        Nos <em className="text-moss">réalisations</em>
      </h2>
      <div
        ref={zone}
        className="relative mx-auto mt-10 w-full max-w-2xl select-none overflow-hidden rounded-3xl max-sm:mt-6 aspect-[4/3] sm:aspect-[3/4] touch-pan-y"
        onPointerDown={(e) => {
          isDragging.current = true;
          deplacer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging.current && e.buttons === 1) {
            deplacer(e.clientX);
          }
        }}
        onPointerUp={() => {
          isDragging.current = false;
        }}
      >
        {/* Vue Après */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <img
            src={apres}
            alt="Jardin après l'intervention"
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Après
          </span>
        </div>

        {/* Vue Avant */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img
            src={avant}
            alt="Jardin avant l'intervention"
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary">
            Avant
          </span>
        </div>

        {/* Séparateur et curseur */}
        <div className="absolute inset-y-0 w-0.5 bg-background pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-primary shadow-lg">
            <ChevronsLeftRight className="h-5 w-5" />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Comparer avant et après"
          className="sr-only"
        />
      </div>
    </section>
  );
}
