import { useEffect, useState } from "react";
import { MessageSquare, Phone } from "lucide-react";

/**
 * Barre d'actions affichée uniquement sur téléphone : elle apparaît dès que le
 * visiteur a quitté le haut de page et s'efface quand le pied de page est visible.
 */
export function CallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let footerVisible = false;

    const sync = () => setVisible(pastHero && !footerVisible);

    const onScroll = () => {
      const next = window.scrollY > 420;
      if (next !== pastHero) {
        pastHero = next;
        sync();
      }
    };
    onScroll();

    const footer = document.querySelector("footer");
    const obs = footer
      ? new IntersectionObserver(
          ([entry]) => {
            footerVisible = !!entry?.isIntersecting;
            sync();
          },
          { threshold: 0.06 },
        )
      : null;
    if (footer && obs) obs.observe(footer);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      obs?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`call-bar fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center gap-3 transition-[opacity,transform] duration-300 ease-out md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href="tel:+33783551969"
        tabIndex={visible ? 0 : -1}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
      >
        <Phone className="h-4 w-4" aria-hidden />
        Appeler
      </a>
      <a
        href="sms:+33783551969?body=Bonjour%20Blondel%20Jardin%2C%20voici%20des%20photos%20de%20mon%20jardin%20pour%20un%20devis%20%3A"
        tabIndex={visible ? 0 : -1}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-moss py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
        SMS / Photos
      </a>
    </div>
  );
}
