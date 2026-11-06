import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const exemple = exempleCreditImmediate(100);
const euros = (montant: number) => `${montant} €`;

export function CreditImpot() {
  return (
    <section aria-labelledby="credit-impot-titre" className="border-y border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-20">
        <div>
          <p className="text-sm font-semibold text-moss">Services à la personne · Particuliers</p>
          <p className="mt-5 flex items-start gap-3 font-display text-7xl leading-none text-primary md:text-8xl">
            50 %<ArrowDownRight aria-hidden="true" className="mt-2 h-8 w-8 text-moss" strokeWidth={1.5} />
          </p>
          <h2 id="credit-impot-titre" className="mt-4 max-w-sm font-display text-3xl leading-tight text-primary md:text-4xl">
            de crédit d’impôt
            <span className="mt-2 block text-5xl leading-none tracking-tight text-moss md:text-6xl">immédiat</span>
          </h2>
          <div className="mt-7">
            <LogosServicesPersonne />
          </div>
        </div>

        <div className="min-w-0">
          <p className="max-w-xl font-display text-2xl leading-snug text-primary md:text-3xl">Vous n’avancez pas l’argent.</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary">
            Le crédit d’impôt est déduit tout de suite : vous réglez directement <strong className="font-semibold">50 % de la facture</strong>,
            pas la totalité à faire rembourser ensuite.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
            Tonte, taille de haies, désherbage… L’entretien courant, pas la création de jardin.
          </p>

          <div className="my-7 border-y border-border py-5">
            <p className="mb-4 text-xs font-semibold text-muted-foreground">SUR UNE FACTURE DE {euros(exemple.facture)}</p>
            <dl className="grid grid-cols-3 gap-3">
              <div>
                <dd className="font-display text-3xl text-primary sm:text-4xl">{euros(exemple.facture)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">facturés</dt>
              </div>
              <div>
                <dd className="font-display text-3xl text-moss sm:text-4xl">{euros(exemple.credit)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">de crédit immédiat</dt>
              </div>
              <div>
                <dd className="font-display text-3xl text-primary sm:text-4xl">{euros(exemple.aPayer)}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">payés, rien à avancer</dt>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <Button asChild className="h-auto whitespace-normal rounded-full px-6 py-3 shadow-none">
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
