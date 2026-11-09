import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const exemple = exempleCreditImmediate(100);
const euros = (montant: number) => `${montant} €`;

export function CreditImpot() {
  return (
    <section aria-labelledby="credit-impot-titre" className="border-y border-border bg-secondary/60 text-primary">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12 md:py-14 lg:gap-20">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">Services à la personne · Particuliers</p>
          <h2 id="credit-impot-titre" className="mt-5 font-display text-3xl leading-tight text-primary lg:text-4xl">
            50 % de crédit d’impôt
            <span className="mt-1 block text-4xl text-moss lg:text-5xl">immédiat</span>
          </h2>
          <p className="mt-6 font-display text-xl leading-snug text-primary">Vous n’avancez pas l’argent.</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-primary/80">
            Le crédit d’impôt est appliqué immédiatement : vous ne réglez que <strong className="font-semibold">50 % de la facture</strong>, sans avoir à avancer la totalité puis à attendre un remboursement.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
            Tonte, taille de haies, désherbage.
          </p>

          <div className="mt-6">
            <Button asChild className="h-auto whitespace-normal rounded-full px-5 py-3 shadow-none">
              <Link to="/contact">En parler pour mon devis<ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 border-b border-primary/15 pb-4">
            <p className="text-xs font-semibold text-muted-foreground">SUR UNE FACTURE DE {euros(exemple.facture)}</p>
            <LogosServicesPersonne logo="services" compact />
          </div>

          <figure className="paper-shadow mt-6 rounded-3xl border border-primary/12 bg-card p-5 sm:p-6">
            <figcaption className="flex items-baseline justify-between gap-4">
              <span className="eyebrow text-muted-foreground">Facture</span>
              <span className="text-xs text-muted-foreground">Entretien courant</span>
            </figcaption>

            <div className="mt-4 space-y-2" aria-hidden="true">
              <span className="block h-2 w-full rounded-full bg-sage/45" />
              <span className="block h-2 w-5/6 rounded-full bg-sage/30" />
              <span className="block h-2 w-2/3 rounded-full bg-sage/20" />
            </div>

            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-primary/12">
              <div className="bg-moss px-4 py-4 text-primary-foreground">
                <p className="font-display text-2xl leading-none">{euros(exemple.credit)}</p>
                <p className="mt-2 text-xs leading-snug">crédit immédiat</p>
              </div>
              <div className="border-l border-dashed border-primary/25 bg-background px-4 py-4 text-primary">
                <p className="font-display text-2xl leading-none">{euros(exemple.aPayer)}</p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">ce que vous payez</p>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-dashed border-primary/20 pt-3">
              <span className="text-sm text-primary">{euros(exemple.facture)} facturés</span>
              <span className="text-xs text-muted-foreground">rien à avancer</span>
            </div>
          </figure>
        </div>

        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground md:col-span-2">
          Sous conditions d’éligibilité aux services à la personne et dans les plafonds légaux. Exemple indicatif, sans aides
          déduites.{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="https://www.impots.gouv.fr/particulier/emploi-domicile" target="_blank" rel="noreferrer">
            Conditions officielles
          </a>
        </p>
      </div>
    </section>
  );
}
