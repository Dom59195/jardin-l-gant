
import { useEffect, useState } from "react";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

const STORAGE_KEY = "blondel-jardin-cookie-consent-v1";

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Consent;
        setConsent(parsed);
        setAnalytics(parsed.analytics);
        setMarketing(parsed.marketing);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  function save(next: { analytics: boolean; marketing: boolean }) {
    const value: Consent = {
      necessary: true,
      ...next,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setShowBanner(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent("blondel-cookie-consent", { detail: value }));
  }

  return (
    <>
      {!showBanner && (
        <button
          type="button"
          onClick={() => {
            setAnalytics(consent?.analytics ?? false);
            setMarketing(consent?.marketing ?? false);
            setShowSettings(true);
            setShowBanner(true);
          }}
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-[#d8cfbd] bg-[#f7f3e9] px-3 py-2 text-xs font-medium text-[#244333] shadow-lg"
        >
          Préférences cookies
        </button>
      )}

      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#d8cfbd] bg-[#f7f3e9] px-4 py-5 text-[#243b30] shadow-lg sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-base font-semibold">Votre confidentialité compte pour nous</p>
            <p className="mt-1 text-sm leading-relaxed text-[#526257]">
              Blondel Jardin utilise des cookies nécessaires au fonctionnement du site.
              Avec votre accord, nous pouvons aussi mesurer l’audience et améliorer nos publicités.
            </p>
            <a href="/politique-confidentialite" className="mt-2 inline-block text-xs underline">
              En savoir plus sur la confidentialité
            </a>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-md border border-[#315440] px-4 py-2.5 text-sm font-semibold">
                Tout refuser
              </button>
              <button type="button" onClick={() => setShowSettings(!showSettings)} className="rounded-md border border-[#315440] px-4 py-2.5 text-sm font-semibold">
                Personnaliser
              </button>
              <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="rounded-md bg-[#244333] px-4 py-2.5 text-sm font-semibold text-white">
                Tout accepter
              </button>
            </div>

            {showSettings && (
              <div className="mt-5 grid gap-3 border-t border-[#d8cfbd] pt-4 sm:grid-cols-3">
                <div className="text-sm">
                  <p className="font-semibold">Cookies nécessaires</p>
                  <p className="text-xs">Toujours actifs.</p>
                </div>
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} />
                  Mesure d’audience
                </label>
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
                  Publicité (Pixel Meta)
                </label>
                <button type="button" onClick={() => save({ analytics, marketing })} className="rounded-md bg-[#244333] px-5 py-2.5 text-sm font-semibold text-white sm:col-span-3 sm:justify-self-start">
                  Enregistrer mes choix
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

