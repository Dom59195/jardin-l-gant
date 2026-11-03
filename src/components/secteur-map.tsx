/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

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

export function SecteurMap() {
  const container = useRef<HTMLDivElement>(null);
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
          { featureType: "road", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: muted }] },
        ],
      });
      zoneRing = new google.maps.Circle({
        map, center: valenciennes, radius: 50_000,
        fillColor: primary, fillOpacity: 0,
        strokeColor: primary, strokeOpacity: 0.16, strokeWeight: 8,
        clickable: false, zIndex: 1,
      });
      circle = new google.maps.Circle({
        map, center: valenciennes, radius: 50_000,
        fillColor: primary, fillOpacity: 0.12,
        strokeColor: primary, strokeOpacity: 0.7, strokeWeight: 1.5,
        clickable: false, zIndex: 2,
      });
      const bounds = circle.getBounds();
      if (bounds) map.fitBounds(bounds, 28);
      marker = new google.maps.Marker({
        map, position: herin, title: "Blondel Jardin · Hérin",
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: primary, fillOpacity: 1, strokeColor: background, strokeWeight: 3 },
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
      script?.remove();
      delete window.initBlondelMap;
    };
  }, []);

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