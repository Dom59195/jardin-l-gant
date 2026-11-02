import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
        <Link to="/" className="font-display text-2xl tracking-wide text-primary">
          Verdure <span className="italic text-moss">&amp; Jardins</span>
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
            className="eyebrow rounded-sm bg-primary px-5 py-3 text-primary-foreground transition-opacity hover:opacity-90"
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
          <p className="font-display text-3xl">Verdure &amp; Jardins</p>
          <p className="mt-3 text-sm opacity-75">
            Jardinier paysagiste — création, entretien et aménagement de jardins d'exception.
          </p>
        </div>
        <div className="text-sm opacity-85">
          <p className="eyebrow mb-3 opacity-70">Contact</p>
          <p>12 rue des Tilleuls, 69000 Lyon</p>
          <p>06 12 34 56 78</p>
          <p>contact@verdure-jardins.fr</p>
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
        © {new Date().getFullYear()} Verdure &amp; Jardins — Mentions légales
      </div>
    </footer>
  );
}
