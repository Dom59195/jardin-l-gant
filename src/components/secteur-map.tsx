/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { interventionZone, interventionTowns } from "@/lib/intervention-zone";

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
    const townLabels: google.maps.Marker[] = [];
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
      const pin = mapColor("--map-pin");
      map = new google.maps.Map(element, {
        center: valenciennes,
        zoom: 9,
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
      for (const town of interventionTowns) {
        const [lng, lat] = town.coordinates;
        if (lng === undefined || lat === undefined) continue;
        townLabels.push(new google.maps.Marker({
          map,
          position: { lng, lat },
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
          label: { text: town.name, color: primary, fontSize: "12px", fontWeight: "600", fontFamily: "Manrope, sans-serif" },
          clickable: false,
        }));
      }
      // Keep labels legible: reveal more towns when zooming in, rather than
      // stacking all names on the initial overview.
      google.maps.event.addListener(map, "idle", () => {
        if (!map) return;
        const bounds = map.getBounds();
        if (!bounds) return;
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        const occupied: { x: number; y: number; width: number }[] = [];
        townLabels.forEach((label, index) => {
          const position = label.getPosition();
          if (!position || !bounds.contains(position)) { label.setVisible(false); return; }
          const x = (position.lng() - southWest.lng()) / (northEast.lng() - southWest.lng()) * element.clientWidth;
          const y = (northEast.lat() - position.lat()) / (northEast.lat() - southWest.lat()) * element.clientHeight;
          const width = (interventionTowns[index]?.name.length ?? 12) * 7 + 16;
          const overlaps = occupied.some((other) => Math.abs(other.y - y) < 24 && Math.abs(other.x - x) < (other.width + width) / 2);
          label.setVisible(!overlaps);
          if (!overlaps) occupied.push({ x, y, width });
        });
      });
      marker = new google.maps.Marker({
        map, position: herin, title: "Blondel Jardin · Hérin",
        icon: {
          path: "M0 0C-5-7-14-16-14-25a14 14 0 1 1 28 0C14-16 5-7 0 0Z",
          fillColor: pin, fillOpacity: 1, strokeColor: primary, strokeWeight: 1.5,
          scale: 0.8, anchor: new google.maps.Point(0, 0),
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
      townLabels.forEach((label) => label.setMap(null));
      if (map) google.maps.event.clearInstanceListeners(map);
      script?.remove();
      delete window.initBlondelMap;
    };
  }, []);

  return (
    <div className={compact ? "relative flex h-full min-h-[420px] flex-col overflow-hidden bg-background max-sm:min-h-[340px]" : "relative flex h-[480px] flex-col overflow-hidden rounded-3xl bg-background max-sm:h-[370px]"} role="region" aria-label="Carte de la zone d'intervention de Blondel Jardin : 50 km autour de Valenciennes">
      <div className="shrink-0 border-b border-primary/10 px-7 pb-5 pt-6 text-primary max-sm:px-5 max-sm:pb-4 max-sm:pt-5">
        <h2 className="font-display text-3xl max-sm:text-2xl">Zone <em>d’intervention</em></h2>
        <p className="mt-2 text-sm text-muted-foreground max-sm:text-xs">Rayon de 50 kilomètres autour de <span className="font-semibold text-primary">Valenciennes</span></p>
      </div>
      <div className="relative min-h-0 flex-1 bg-secondary">
        <div ref={container} className="absolute inset-0" />
        {status !== "ready" && <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-sm text-muted-foreground" role="status">{status === "loading" ? "Chargement de la carte…" : "Carte momentanément indisponible."}</div>}
      </div>
    </div>
  );
}
