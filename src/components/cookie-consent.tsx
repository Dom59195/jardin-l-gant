
import { useEffect, useState } from "react";

const STORAGE_KEY = "blondel-jardin-cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    necessary: true,
    analytics,
    marketing,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

  window.dispatchEvent(
    new CustomEvent("blondel-cookie-consent", {
      detail: consent,
    })
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const consent = JSON.parse(stored) as Consent;
        setAnalytics(consent.analytics === true);
        setMarketing(consent.marketing === true);
        setVisible(false);
      } catch {
        setVisible(true);
      }
    } else {
      setVisible(true);
    }
  }, []);

  function acceptAll() {
    saveConsent(true, true);
    setAnalytics(true);
    setMarketing(true);
    setVisible(false);
    setCustomizing(false);
  }

  function rejectAll() {
    saveConsent(false, false);
    setAnalytics(false);
    setMarketing(false);
    setVisible(false);
    setCustomizing(false);
  }

  function savePreferences() {
    saveConsent(analytics, marketing);
    setVisible(false);
    setCustomizing(false);
  }

  function reopenPreferences() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const consent = JSON.parse(stored) as Consent;
        setAnalytics(consent.analytics === true);
        setMarketing(consent.marketing === true);
      } catch {
        setAnalytics(false);
        setMarketing(false);
      }
    }

    setCustomizing(true);
    setVisible(true);
  }

  return (
    <>
      {visible && (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-3xl rounded-xl border border-[#dce8df] bg-white p-5 shadow-2xl">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-[#20543b]">
              Votre confidentialité compte pour nous
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#78917f]">
              Blondel Jardin utilise des cookies nécessaires au fonctionnement
              du site. Avec votre accord, nous pouvons également mesurer
              l’audience et améliorer nos publicités.
            </p>

            <a
              href="/politique-confidentialite"
              className="mt-2 inline-block text-xs text-[#20543b] underline"
            >
              En savoir plus sur la confidentialité
            </a>
          </div>

          {customizing && (
            <div className="my-4 space-y-3 border-y border-[#e5eee7] py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#20543b]">
                    Cookies nécessaires
                  </p>
                  <p className="text-xs text-gray-500">
                    Indispensables au fonctionnement du site.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#20543b]">
                  Toujours actifs
                </span>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#20543b]">
                    Cookies analytiques
                  </p>
                  <p className="text-xs text-gray-500">
                    Nous aident à comprendre la fréquentation du site.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#20543b]">
                    Cookies publicitaires
                  </p>
                  <p className="text-xs text-gray-500">
                    Permettent de mesurer et d’améliorer nos publicités.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={rejectAll}
              className="rounded-full border border-[#b9d2c1] px-4 py-2 text-xs font-medium text-[#20543b] hover:bg-[#f3f8f4]"
            >
              Tout refuser
            </button>

            {!customizing && (
              <button
                onClick={() => setCustomizing(true)}
                className="rounded-full border border-[#b9d2c1] px-4 py-2 text-xs font-medium text-[#20543b] hover:bg-[#f3f8f4]"
              >
                Personnaliser
              </button>
            )}

            {customizing && (
              <button
                onClick={savePreferences}
                className="rounded-full border border-[#b9d2c1] px-4 py-2 text-xs font-medium text-[#20543b] hover:bg-[#f3f8f4]"
              >
                Enregistrer mes choix
              </button>
            )}

            <button
              onClick={acceptAll}
              className="rounded-full bg-[#286447] px-4 py-2 text-xs font-medium text-white hover:bg-[#1d4e36]"
            >
              Tout accepter
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={reopenPreferences}
        className="fixed bottom-3 left-3 z-[9998] text-[10px] text-[#20543b] hover:underline"
      >
        Préférences cookies
      </button>
    </>
  );
}
