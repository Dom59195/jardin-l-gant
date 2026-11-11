import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

/**
 * Barre d'appel affichée uniquement sur téléphone : elle apparaît dès que le
 * visiteur a quitté le haut de page et s'efface quand le pied de page est
 * visible, puisqu'il contient déjà le numéro en gros.
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
            footerVisible = entry.isIntersecting;
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
    <a
      href="tel:+33783551969"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`call-bar fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-[0_14px_34px_-14px_color-mix(in_oklab,var(--forest)_70%,transparent)] transition-[opacity,transform] duration-300 ease-out md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Phone className="h-4.5 w-4.5" aria-hidden />
      <span className="text-sm font-semibold tracking-wide">Appeler</span>
    </a>
  );
}
