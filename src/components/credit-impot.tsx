import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const exemple = exempleCreditImmediate(100);
const euros = (montant: number) => `${montant} €`;

export function CreditImpot() {
  return (
    <section aria-labelledby="credit-impot-titre" className="border-y border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-9 px-6 py-14 md:grid-cols-[0.85fr_1.15fr] md:gap-12 md:py-16 lg:gap-20">
        <div className="flex flex-col md:border-r md:border-primary/15 md:pr-10 lg:pr-16">
          <p className="text-sm font-semibold text-moss">Services à la personne · Particuliers</p>
          <p className="mt-7 font-display text-8xl leading-none text-primary lg:text-9xl">
            50 %
          </p>
          <h2 id="credit-impot-titre" className="mt-3 font-display text-3xl leading-tight text-primary lg:text-4xl">
            de crédit d’impôt
            <span className="mt-1 block text-5xl leading-none text-moss lg:text-6xl">immédiat</span>
          </h2>
          <div className="mt-8 border-t border-primary/15 pt-6 md:mt-auto md:pt-7">
            <LogosServicesPersonne logo="services" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="max-w-xl font-display text-2xl leading-snug text-primary lg:text-3xl">Vous n’avancez pas l’argent.</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary">
            Le crédit d’impôt est déduit tout de suite : vous réglez directement <strong className="font-semibold">50 % de la facture</strong>,
            pas la totalité à faire rembourser ensuite.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
            Tonte, taille de haies, désherbage… L’entretien courant, pas la création de jardin.
          </p>

          <div className="my-7 border-y border-primary/15 py-6">
            <p className="mb-4 text-xs font-semibold text-muted-foreground">SUR UNE FACTURE DE {euros(exemple.facture)}</p>
            <dl className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2 sm:gap-3">
              <div>
                <dd className="font-display text-3xl text-primary sm:text-4xl">{euros(exemple.facture)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">facturés</dt>
              </div>
              <ArrowRight aria-hidden="true" className="mt-3 h-4 w-4 text-moss/60" />
              <div>
                <dd className="font-display text-3xl text-moss sm:text-4xl">{euros(exemple.credit)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">de crédit immédiat</dt>
              </div>
              <ArrowRight aria-hidden="true" className="mt-3 h-4 w-4 text-moss/60" />
              <div className="border-l-2 border-moss pl-3">
                <dd className="font-display text-3xl text-primary sm:text-4xl">{euros(exemple.aPayer)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">payés, rien à avancer</dt>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <Button asChild className="h-auto whitespace-normal rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-none">
              <Link to="/contact">En parler pour mon devis<ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Sous conditions d’éligibilité aux services à la personne et dans les plafonds légaux. Exemple indicatif, sans aides
            déduites.{" "}
            <a className="underline underline-offset-4 hover:text-primary" href="https://www.impots.gouv.fr/particulier/emploi-domicile" target="_blank" rel="noreferrer">
              Conditions officielles
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
