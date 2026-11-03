/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { interventionZone } from "@/lib/intervention-zone";

declare global {
  interface Window { initBlondelMap?: () => void }
}

// Coordinates previously verified through Google Geocoding.
const herin = { lat: 50.3570433, lng: 3.4535917 };
const valenciennes = { lat: 50.357113, lng: 3.518332 };

// Maps styling expects sRGB hex values; resolve the site's semantic CSS tokens.
function mapColor(token: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return "";
  context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  context.fillRect(0, 0, 1, 1);
  return `#${Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3).map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function SecteurMap({ compact = false }: { compact?: boolean } = {}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let active = true;
    let script: HTMLScriptElement | undefined;
    let map: google.maps.Map | undefined;
    let marker: google.maps.Marker | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const init = () => {
      if (!active) return;
      if (timeout) clearTimeout(timeout);
      const background = mapColor("--background");
      const card = mapColor("--card");
      const secondary = mapColor("--secondary");
      const primary = mapColor("--primary");
      const muted = mapColor("--muted-foreground");
      const sage = mapColor("--sage");
      map = new google.maps.Map(element, {
        center: valenciennes,
        // Sur téléphone, on dézoome pour que tout le rayon reste visible.
        zoom: window.matchMedia("(max-width: 640px)").matches ? 8 : 9,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: background }] },
          { elementType: "labels.text.fill", stylers: [{ color: muted }] },
          { elementType: "labels.text.stroke", stylers: [{ color: background }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: muted }] },
          { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: card }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: secondary }] },
          { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: sage }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      });
      map.data.addGeoJson(interventionZone);
      map.data.setStyle({ fillColor: sage, fillOpacity: 0.32, strokeColor: primary, strokeOpacity: 0.35, strokeWeight: 1, clickable: false });
      // Simple teardrop marker, using the site's semantic palette.
      const markerSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='42' height='54' viewBox='0 0 42 54'>
        <path d='M21 52.5C21 52.5 3 33.5 3 19.5A18 18 0 1 1 39 19.5C39 33.5 21 52.5 21 52.5Z' fill='${primary}'/>
        <circle cx='21' cy='19.5' r='14' fill='${background}'/>
      </svg>`;
      marker = new google.maps.Marker({
        map, position: herin, title: "Blondel Jardin · Hérin",
        icon: { url: `data:image/svg+xml,${encodeURIComponent(markerSvg)}`, anchor: new google.maps.Point(21, 53) },
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
      if (map) google.maps.event.clearInstanceListeners(map);
      script?.remove();
      delete window.initBlondelMap;
    };
  }, []);

  return (
    <div className={compact ? "relative flex h-full min-h-[420px] flex-col overflow-hidden bg-background max-sm:min-h-[340px]" : "relative flex h-[480px] flex-col overflow-hidden rounded-3xl bg-background max-sm:h-[370px]"} role="region" aria-label="Carte de la zone d'intervention de Blondel Jardin : 50 km autour de Valenciennes">
      <div className="w-full shrink-0 bg-primary px-8 py-5 text-primary-foreground max-sm:px-5 max-sm:py-4">
        <h2 className="font-display text-[32px] font-light leading-tight max-sm:text-[28px]">Zone d’intervention</h2>
      </div>
      <div className="relative min-h-0 flex-1 bg-secondary">
        <div ref={container} className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/15 to-transparent" />
        {status !== "ready" && <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-sm text-muted-foreground" role="status">{status === "loading" ? "Chargement de la carte…" : "Carte momentanément indisponible."}</div>}
      </div>
    </div>
  );
}
