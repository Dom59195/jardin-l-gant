/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window { initBlondelMap?: () => void }
}

// Localisation des communes, vérifiée via Google Geocoding le 3 novembre 2026.
const herin = { lat: 50.3570433, lng: 3.4535917 };
const valenciennes = { lat: 50.357113, lng: 3.518332 };

function mapColor(token: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  ctx.fillRect(0, 0, 1, 1);
  const pixel = ctx.getImageData(0, 0, 1, 1).data;
  return `#${Array.from(pixel).slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function SecteurMap({ compact = false }: { compact?: boolean } = {}) {
  const container = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const zoneBounds = useRef<google.maps.LatLngBounds | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let active = true;
    let script: HTMLScriptElement | undefined;
    let map: google.maps.Map | undefined;
    let marker: google.maps.Marker | undefined;
    let circle: google.maps.Circle | undefined;
    let zoneRing: google.maps.Circle | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const init = () => {
      if (!active) return;
      if (timeout) clearTimeout(timeout);
      const primary = mapColor("--primary");
      const background = mapColor("--background");
      const secondary = mapColor("--secondary");
      const muted = mapColor("--muted-foreground");
      const sage = mapColor("--sage");
      map = new google.maps.Map(element, {
        center: valenciennes,
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
        mapTypeControl: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: background }] },
          { elementType: "labels.text.fill", stylers: [{ color: muted }] },
          { elementType: "labels.text.stroke", stylers: [{ color: background }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: background }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: sage }] },
          { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: muted }] },
        ],
      });
      mapInstance.current = map;
      zoneRing = new google.maps.Circle({
        map, center: valenciennes, radius: 50_000,
        fillColor: primary, fillOpacity: 0,
        strokeColor: primary, strokeOpacity: 0.08, strokeWeight: 10,
        clickable: false, zIndex: 1,
      });
      circle = new google.maps.Circle({
        map, center: valenciennes, radius: 50_000,
        fillColor: primary, fillOpacity: 0.07,
        strokeColor: primary, strokeOpacity: 0.65, strokeWeight: 1.5,
        clickable: false, zIndex: 2,
      });
      const bounds = circle.getBounds();
      if (bounds) {
        zoneBounds.current = bounds;
        map.fitBounds(bounds, compact ? { top: 110, right: 32, bottom: 76, left: 32 } : 28);
      }
      marker = new google.maps.Marker({
        map, position: herin, title: "Blondel Jardin · Hérin",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="58" viewBox="0 0 48 58"><path d="M24 55C20 49 5 36 5 24a19 19 0 1 1 38 0c0 12-15 25-19 31Z" fill="${primary}" stroke="${background}" stroke-width="3"/><circle cx="24" cy="24" r="7" fill="${background}"/></svg>`)}`,
          scaledSize: new google.maps.Size(40, 48),
          anchor: new google.maps.Point(20, 46),
        },
      });
      setStatus("ready");
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      if (typeof google !== "undefined" && google.maps?.Map) { init(); return; }
      const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
      if (!key) { setStatus("error"); return; }
      window.initBlondelMap = init;
      script = document.createElement("script");
      const params = new URLSearchParams({ key, loading: "async", callback: "initBlondelMap", language: "fr", region: "FR", channel: import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID'] ?? "" });
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.onerror = () => { if (active) setStatus("error"); };
      timeout = setTimeout(() => { if (active) setStatus("error"); }, 20000);
      document.head.appendChild(script);
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => {
      active = false;
      observer.disconnect();
      if (timeout) clearTimeout(timeout);
      marker?.setMap(null);
      circle?.setMap(null);
      zoneRing?.setMap(null);
      if (map) google.maps.event.clearInstanceListeners(map);
      mapInstance.current = null;
      zoneBounds.current = null;
      script?.remove();
      delete window.initBlondelMap;
    };
  }, [compact]);

  const recenter = () => {
    if (mapInstance.current && zoneBounds.current) {
      mapInstance.current.fitBounds(zoneBounds.current, { top: 110, right: 32, bottom: 76, left: 32 });
    }
  };

  if (compact) {
    return (
      <div className="relative h-full min-h-[420px] overflow-hidden bg-secondary max-sm:min-h-[340px]">
        <div ref={container} className="absolute inset-0" role="region" aria-label="Carte de la zone d'intervention de Blondel Jardin : 50 km autour de Valenciennes" />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary text-sm text-muted-foreground" role="status">
            <MapPin className="mr-2 h-4 w-4 text-primary" /> {status === "loading" ? "Chargement de la carte…" : "Carte momentanément indisponible."}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-background/95 px-7 py-5 text-primary max-sm:px-5 max-sm:py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase">Notre zone d’intervention</p>
            <p className="mt-1 font-display text-3xl max-sm:text-2xl">Hérin <em>& le Valenciennois</em></p>
          </div>
          <Button variant="outline" size="icon" className="pointer-events-auto mt-1 shrink-0 rounded-full border-primary/20 bg-background text-primary hover:bg-secondary" onClick={recenter} disabled={status !== "ready"} aria-label="Recentrer la zone d’intervention" title="Recentrer la zone d’intervention">
            <LocateFixed />
          </Button>
        </div>
        <div className="absolute bottom-8 left-5 right-14 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl border border-primary/10 bg-background/95 px-4 py-3 text-xs text-primary max-sm:left-3 max-sm:px-3">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full border border-primary/60 bg-primary/10" /> Rayon de 50 km <span className="text-[10px] text-muted-foreground">· indicatif</span></span>
          <Button asChild variant="link" className="h-auto p-0 text-xs text-primary">
            <a href="https://www.google.com/maps/search/?api=1&query=38+rue+Auguste+Caron+59195+Herin" target="_blank" rel="noreferrer">Voir sur Google <ArrowUpRight /></a>
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary">
          <div ref={container} className="h-[480px] w-full max-sm:h-[370px]" role="region" aria-label="Carte du secteur de Blondel Jardin à Hérin et autour de Valenciennes" />
          {status === "ready" && (
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-primary/20 bg-background/90 px-4 py-2 text-xs font-semibold text-primary backdrop-blur max-sm:left-3 max-sm:top-3 max-sm:px-3 max-sm:text-[11px]">
              Zone d'intervention · 50 km autour de Valenciennes
            </div>
          )}
          {status !== "ready" && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary text-sm text-muted-foreground" role="status">
              {status === "loading" ? "Chargement de la carte…" : "La carte est momentanément indisponible."}
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Blondel Jardin · Hérin</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border-[1.5px] border-primary/70 bg-primary/15" /> Zone délimitée : rayon de plus de 50 km autour de Valenciennes · zone indicative</span>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground"><a className="underline underline-offset-2" href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noreferrer">Conditions Google Maps</a> · <a className="underline underline-offset-2" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Confidentialité Google</a></p>
      </div>
    </section>
  );
}