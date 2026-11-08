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
            Le crédit d’impôt est déduit tout de suite : vous réglez directement <strong className="font-semibold">50 % de la facture</strong>,
            pas la totalité à faire rembourser ensuite.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
            Tonte, taille de haies, désherbage… L’entretien courant, pas la création de jardin.
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
            <div className="relative mx-auto my-6 grid h-44 w-44 place-items-center sm:h-48 sm:w-48" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" fill="none">
                <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="14" className="text-sage/50" />
                <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="14" strokeDasharray="251 516" strokeLinecap="round" className="text-moss" />
              </svg>
              <span className="font-display text-4xl text-primary">50 %</span>
            </div>
            <dl className="grid grid-cols-2 gap-5">
              <div className="border-t-2 border-moss pt-3">
                <dd className="font-display text-3xl text-primary">{euros(exemple.aPayer)}</dd>
                <dt className="mt-1 text-sm leading-relaxed text-primary">payés, rien à avancer</dt>
              </div>
              <div className="border-t-2 border-sage pt-3">
                <dd className="font-display text-3xl text-moss">{euros(exemple.credit)}</dd>
                <dt className="mt-1 text-sm leading-relaxed text-muted-foreground">de crédit immédiat</dt>
              </div>
              <div className="col-span-2 flex items-baseline justify-between gap-4 border-t border-primary/15 pt-3">
                <dd className="text-base text-primary">{euros(exemple.facture)}</dd>
                <dt className="text-sm text-muted-foreground">facturés</dt>
              </div>
            </dl>
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
