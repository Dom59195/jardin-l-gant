import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoEmbleme from "@/assets/logo-blondel-embleme.png.asset.json";

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
        <Link to="/" className="group flex items-center gap-3" aria-label="Blondel Jardin — accueil">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-transform group-hover:scale-105">
            <img src={logoEmbleme.url} alt="Logo Blondel Jardin" className="h-5 w-auto" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.7rem] tracking-tight text-primary">
              Blondel <em className="text-moss">Jardin</em>
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Paysagiste · Hérin
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
    <footer className="bg-forest text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">Blondel Jardin</p>
          <p className="mt-3 text-sm opacity-75">
            Jardinier paysagiste à Hérin (Nord). Entretien et aménagement de jardins pour particuliers.
          </p>
        </div>
        <div className="text-sm opacity-85">
          <p className="eyebrow mb-3 opacity-70">Contact</p>
          <p>38 rue Auguste Caron, 59195 Hérin</p>
          <p><a href="tel:+33783551969">07 83 55 19 69</a></p>
          <p>Lun – Ven : 8h30 – 16h30</p>
          <p className="mt-2 opacity-75">Interventions dans un rayon de 50 km autour de Valenciennes.</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3 opacity-70">Navigation</p>
          <div className="flex flex-col gap-1 opacity-85">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="hover:opacity-100">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-6 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Blondel Jardin — SIREN 987 914 991
      </div>
    </footer>
  );
}
