/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { initBlondelMap?: () => void }
}

// Coordinates previously verified through Google Geocoding.
const herin = { lat: 50.3570433, lng: 3.4535917 };
const valenciennes = { lat: 50.357113, lng: 3.518332 };

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
      map = new google.maps.Map(element, {
        center: valenciennes,
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        clickableIcons: false,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
      });
      marker = new google.maps.Marker({ map, position: herin, title: "Blondel Jardin · Hérin" });
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
      <div className="shrink-0 px-7 pb-5 pt-6 text-primary max-sm:px-5 max-sm:pb-4 max-sm:pt-5">
        <h2 className="font-display text-3xl max-sm:text-2xl">Zone d’intervention</h2>
        <p className="mt-2 text-sm text-muted-foreground max-sm:text-xs">Rayon de 50 kilomètres autour de Valenciennes</p>
      </div>
      <div className="relative min-h-0 flex-1 bg-secondary">
        <div ref={container} className="absolute inset-0" />
        {status !== "ready" && <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-sm text-muted-foreground" role="status">{status === "loading" ? "Chargement de la carte…" : "Carte momentanément indisponible."}</div>}
      </div>
    </div>
  );
}
