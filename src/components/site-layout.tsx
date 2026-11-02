import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-blondel-jardin-detoure.png.asset.json";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/projets", label: "Projets" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-4" aria-label="Blondel Jardin — accueil">
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
        <nav className="hidden items-center gap-10 md:flex">
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
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
    <footer className="mx-auto max-w-[88rem] px-4 pb-4 md:px-6">
      <div className="overflow-hidden rounded-[2.5rem] bg-forest text-primary-foreground">
        {/* Appel à l'action */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-primary-foreground/10 px-8 py-14 md:flex-row md:items-end md:px-16">
          <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">
            Un jardin entretenu
            <br />
            <em className="opacity-90">au fil des saisons.</em>
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Demander un devis gratuit
          </Link>
        </div>

        {/* Coordonnées */}
        <div className="grid gap-10 px-8 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-16">
          <div>
            <p className="font-display text-3xl">Blondel Jardin</p>
            <p className="mt-2 text-sm text-primary-foreground/60">
              Jardinier paysagiste à Hérin (Nord)
            </p>
          </div>
          <div className="text-sm">
            <p className="eyebrow mb-4 text-primary-foreground/40">Contact</p>
            <p><a href="tel:+33783551969" className="transition-colors hover:text-primary-foreground/70">07 83 55 19 69</a></p>
            <p className="mt-1 text-primary-foreground/75">38 rue Auguste Caron, 59195 Hérin</p>
            <p className="mt-1 text-primary-foreground/75">Lun – Ven · 8h30–12h / 13h–16h30</p>
          </div>
          <div className="text-sm">
            <p className="eyebrow mb-4 text-primary-foreground/40">Navigation</p>
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="w-fit text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mentions */}
        <div className="flex flex-col gap-1 border-t border-primary-foreground/10 px-8 py-5 text-xs text-primary-foreground/45 md:flex-row md:items-center md:justify-between md:px-16">
          <span>© {new Date().getFullYear()} Blondel Jardin — SIREN 987 914 991</span>
          <span>Interventions dans un rayon de 50 km autour de Valenciennes</span>
        </div>
      </div>
    </footer>
  );
}
