import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import logo from "@/assets/logo-blondel-jardin-detoure.png.asset.json";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/projets", label: "Projets" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLogoClick = (e: { preventDefault: () => void }) => {
    if (pathname === "/") {
      e.preventDefault();
      setOpen(false);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" onClick={onLogoClick} className="group flex items-center gap-4" aria-label="Blondel Jardin — revenir en haut de la page">

          <img
            src={logo.url}
            alt="Blondel Jardin"
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden h-10 w-px bg-border sm:block" aria-hidden />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-xl italic text-moss">Jardinier paysagiste</span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Hérin · Valenciennois
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="eyebrow text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 max-md:px-4"
          >
            Demander un devis
          </Link>
        </nav>
        <button
          className="text-primary md:hidden"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-6 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-forest text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16">
        <p className="font-display text-4xl md:text-5xl">
          Blondel Jardin <em className="text-primary-foreground/70">— jardinier paysagiste</em>
        </p>

        <div className="mt-10 grid gap-8 border-t border-primary-foreground/10 pt-10 text-sm md:grid-cols-4">
          <div>
            <p className="eyebrow mb-3 text-primary-foreground/40">Contact</p>
            <p><a href="tel:+33783551969" className="transition-colors hover:text-primary-foreground/70">07 83 55 19 69</a></p>
            <p className="mt-1 text-primary-foreground/70">38 rue Auguste Caron, 59195 Hérin</p>
            <p className="mt-1 text-primary-foreground/70">Lun – Ven · 8h30–12h / 13h–16h30</p>
          </div>
          <div>
            <p className="eyebrow mb-3 text-primary-foreground/40">Navigation</p>
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="w-fit text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3 text-primary-foreground/40">Réseaux sociaux</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/blondel_jardin/" target="_blank" rel="noreferrer" aria-label="Instagram Blondel Jardin" className="inline-flex w-fit items-center gap-2.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@blondel.jardin" target="_blank" rel="noreferrer" aria-label="TikTok Blondel Jardin" className="inline-flex w-fit items-center gap-2.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3 text-primary-foreground/40">Zone d'intervention</p>
            <p className="text-primary-foreground/70">Hérin et le Valenciennois, dans un rayon de 50 km autour de Valenciennes.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/45 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Blondel Jardin — SIREN 987 914 991</span>
          <span>Devis gratuit · 50 % de crédit d'impôt</span>
        </div>
      </div>
    </footer>
  );
}
