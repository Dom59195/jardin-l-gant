
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const PIXEL_ID = "1199490079176084";
const STORAGE_KEY = "blondel-jardin-cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

type Fbq = {
  (...args: any[]): void;
  queue?: any[][];
  callMethod?: (...args: any[]) => void;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __blondelMetaPixelInitialized?: boolean;
  }
}

function hasMarketingConsent(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const consent = JSON.parse(stored) as Partial<Consent>;
    return consent.marketing === true;
  } catch {
    return false;
  }
}

function loadMetaPixel() {
  if (!window.fbq) {
    const fbq: Fbq = function (...args: any[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        (fbq.queue ??= []).push(args);
      }
    };

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.id = "blondel-meta-pixel-script";
    document.head.appendChild(script);
  }

  if (!window.__blondelMetaPixelInitialized) {
    window.fbq("init", PIXEL_ID);
    window.__blondelMetaPixelInitialized = true;
  }
}

export function MetaPixel() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasMarketingConsent());

    const onConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<Consent>).detail;
      setAllowed(detail?.marketing === true);
    };

    window.addEventListener("blondel-cookie-consent", onConsentChange);

    return () => {
      window.removeEventListener("blondel-cookie-consent", onConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!allowed) return;

    loadMetaPixel();
    window.fbq?.("track", "PageView");
  }, [allowed, pathname]);

  return null;
}
