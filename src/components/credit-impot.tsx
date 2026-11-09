import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const exemple = exempleCreditImmediate(100);
const euros = (montant: number) => `${montant} €`;

export function CreditImpot() {
  return (
    <section aria-labelledby="credit-impot-titre" className="credit-section text-primary">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-12 md:py-14 lg:gap-20 lg:py-16">
        <div className="min-w-0">
          <h2 id="credit-impot-titre" className="mt-8 font-display text-3xl font-semibold leading-tight text-primary lg:mt-12 lg:text-[44px]">
            50 % de crédit d’impôt
            <span className="credit-immediate mt-3 flex w-fit items-center gap-3 rounded-full px-4 py-3 text-2xl sm:text-3xl lg:gap-4 lg:px-6 lg:text-[40px]">
              <Zap aria-hidden="true" className="h-7 w-7 shrink-0 fill-current text-moss lg:h-9 lg:w-9" />
              <span>avec avance immédiate</span>
            </span>
          </h2>
          <p className="mt-5 font-display text-xl font-semibold leading-snug text-primary lg:text-[26px]">Vous ne payez que la moitié de votre facture.</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary/90 lg:text-lg">
            Grâce à l’avance immédiate du crédit d’impôt, vous bénéficiez directement de <strong className="font-semibold">50 % de réduction</strong>, sans avance ni remboursement.
          </p>

          <div className="mt-6">
            <Button asChild className="h-auto whitespace-normal rounded-full px-6 py-4 text-base font-semibold shadow-none lg:px-7">
              <Link to="/contact">En parler pour mon devis<ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex min-h-16 items-center justify-between gap-4 lg:min-h-20">
            <span aria-hidden="true" />
            <LogosServicesPersonne logo="services" />
          </div>

          <figure className="credit-invoice mt-5 rounded-[30px] border border-primary/8 p-5 sm:p-7 lg:rounded-[32px]">
            <figcaption className="flex items-baseline justify-between gap-4">
              <span className="eyebrow text-primary">Facture</span>
              <span className="text-sm text-primary lg:text-base">Entretien de jardin</span>
            </figcaption>

            <div className="mt-4 space-y-2" aria-hidden="true">
              <span className="block h-2.5 w-full rounded-full bg-primary/10" />
              <span className="block h-2.5 w-4/5 rounded-full bg-primary/7" />
              <span className="block h-2.5 w-2/3 rounded-full bg-primary/5" />
            </div>

            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-3xl border border-primary/10">
              <div className="credit-payment px-4 py-4 text-primary-foreground lg:px-5">
                <p className="font-display text-3xl font-semibold leading-none">{euros(exemple.aPayer)}</p>
                <p className="mt-2 text-sm leading-snug">à votre charge<br />(paiement immédiat)</p>
              </div>
              <div className="bg-secondary/50 px-4 py-4 text-primary lg:px-5">
                <p className="font-display text-3xl font-semibold leading-none">{euros(exemple.credit)}</p>
                <p className="mt-2 text-sm leading-snug">pris en charge<br />par le crédit d’impôt</p>
              </div>
            </div>

            <div className="mt-4 border-t border-primary/10 pt-4">
              <span className="text-base text-primary">{euros(exemple.facture)} facturés</span>
            </div>
          </figure>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground md:col-span-2 lg:mt-12 lg:text-sm">
          Sous conditions d’éligibilité aux services à la personne et dans les plafonds légaux.{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="https://www.impots.gouv.fr/particulier/emploi-domicile" target="_blank" rel="noreferrer">
            Conditions officielles
          </a>
        </p>
      </div>
    </section>
  );
}
