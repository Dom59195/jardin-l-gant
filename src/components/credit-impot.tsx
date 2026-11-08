import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const exemple = exempleCreditImmediate(100);
const euros = (montant: number) => `${montant} €`;

export function CreditImpot() {
  return (
    <section aria-labelledby="credit-impot-titre" className="bg-forest text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-between gap-6 border-b border-primary-foreground/20 pb-6">
          <p className="text-sm font-semibold text-primary-foreground/75">Services à la personne · Particuliers</p>
          <div className="shrink-0"><LogosServicesPersonne logo="services" compact /></div>
        </div>
        <div className="grid gap-4 py-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 md:py-10 lg:gap-12">
          <p className="font-display text-8xl leading-none text-accent sm:text-9xl lg:text-[10rem]">
            50 %
          </p>
          <h2 id="credit-impot-titre" className="font-display text-3xl leading-tight text-primary-foreground md:text-4xl">
            de crédit d’impôt
            <span className="mt-2 block text-5xl leading-none text-accent md:text-6xl lg:text-7xl">immédiat</span>
          </h2>
        </div>

        <div className="grid gap-9 border-t border-primary-foreground/20 pt-8 md:grid-cols-2 md:gap-12 lg:gap-20">
          <div className="min-w-0">
          <p className="max-w-xl font-display text-2xl leading-snug text-primary-foreground lg:text-3xl">Vous n’avancez pas l’argent.</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Le crédit d’impôt est déduit tout de suite : vous réglez directement <strong className="font-semibold">50 % de la facture</strong>,
            pas la totalité à faire rembourser ensuite.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-primary-foreground/65">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Tonte, taille de haies, désherbage… L’entretien courant, pas la création de jardin.
          </p>

          <div className="mt-7">
            <Button asChild className="h-auto whitespace-normal rounded-full bg-accent px-6 py-3 text-accent-foreground shadow-none hover:bg-accent/90">
              <Link to="/contact">En parler pour mon devis<ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
          </div>

          <div className="min-w-0 md:border-l md:border-primary-foreground/20 md:pl-10 lg:pl-12">
            <p className="mb-5 text-xs font-semibold text-primary-foreground/65">SUR UNE FACTURE DE {euros(exemple.facture)}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <dd className="font-display text-3xl text-primary-foreground sm:text-4xl">{euros(exemple.facture)}</dd>
                <dt className="mt-1 text-sm leading-relaxed text-primary-foreground/65">facturés</dt>
              </div>
              <div>
                <dd className="font-display text-3xl text-primary-foreground sm:text-4xl">{euros(exemple.credit)}</dd>
                <dt className="mt-1 text-sm leading-relaxed text-primary-foreground/65">de crédit immédiat</dt>
              </div>
              <div className="col-span-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-primary-foreground/20 pt-5">
                <dd className="font-display text-5xl text-accent sm:text-6xl">{euros(exemple.aPayer)}</dd>
                <dt className="text-base text-primary-foreground">payés, rien à avancer</dt>
              </div>
            </dl>
          </div>
        </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-primary-foreground/55">
            Sous conditions d’éligibilité aux services à la personne et dans les plafonds légaux. Exemple indicatif, sans aides
            déduites.{" "}
            <a className="underline underline-offset-4 hover:text-primary-foreground" href="https://www.impots.gouv.fr/particulier/emploi-domicile" target="_blank" rel="noreferrer">
              Conditions officielles
            </a>
          </p>
      </div>
    </section>
  );
}
