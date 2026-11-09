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
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-12 md:py-14 lg:gap-20 lg:py-16">
        <div className="min-w-0">
          <div className="mb-4 flex justify-end md:hidden">
            <LogosServicesPersonne logo="services" />
          </div>
          <h2 id="credit-impot-titre" className="mt-4 font-display text-[26px] font-semibold leading-tight text-primary sm:mt-8 sm:text-3xl lg:mt-12 lg:text-[44px]">
            50 % de crédit d’impôt
            <span className="credit-immediate mt-3 flex w-fit items-center gap-2 rounded-full px-3 py-2 text-lg sm:gap-3 sm:px-4 sm:py-3 sm:text-2xl lg:gap-4 lg:px-6 lg:text-[40px]">
              <Zap aria-hidden="true" className="h-5 w-5 shrink-0 fill-current text-moss sm:h-7 sm:w-7 lg:h-9 lg:w-9" />
              <span>avec avance immédiate</span>
            </span>
          </h2>
          <p className="mt-4 font-display text-lg font-semibold leading-snug text-primary sm:mt-5 sm:text-xl lg:text-[26px]">Vous ne payez que la moitié de votre facture.</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary/90 sm:mt-4 sm:text-base lg:text-lg">
            Grâce à l’avance immédiate du crédit d’impôt, vous bénéficiez directement de <strong className="font-semibold">50 % de réduction</strong>, sans avance ni remboursement.
          </p>

          <div className="mt-6">
            <Button asChild className="h-auto whitespace-normal rounded-full px-5 py-3 text-sm font-semibold shadow-none sm:px-6 sm:py-4 sm:text-base lg:px-7">
              <Link to="/contact">En parler pour mon devis<ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="hidden items-center justify-between gap-4 md:flex md:min-h-16 lg:min-h-20">
            <span aria-hidden="true" />
            <LogosServicesPersonne logo="services" />
          </div>

          <figure className="credit-invoice mt-4 rounded-3xl border border-primary/8 p-4 sm:mt-5 sm:rounded-[30px] sm:p-7 lg:rounded-[32px]">
            <figcaption className="flex items-baseline justify-between gap-4">
              <span className="eyebrow text-primary">Facture</span>
              <span className="text-xs text-primary sm:text-sm lg:text-base">Entretien de jardin</span>
            </figcaption>

            <div className="mt-4 space-y-2" aria-hidden="true">
              <span className="block h-2.5 w-full rounded-full bg-primary/10" />
              <span className="block h-2.5 w-4/5 rounded-full bg-primary/7" />
              <span className="block h-2.5 w-2/3 rounded-full bg-primary/5" />
            </div>

            <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-primary/10 sm:mt-5 sm:rounded-3xl">
              <div className="credit-payment px-3 py-3 text-primary-foreground sm:px-4 sm:py-4 lg:px-5">
                <p className="font-display text-2xl font-semibold leading-none sm:text-3xl">{euros(exemple.aPayer)}</p>
                <p className="mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm">à votre charge<br />(paiement immédiat)</p>
              </div>
              <div className="bg-secondary/50 px-3 py-3 text-primary sm:px-4 sm:py-4 lg:px-5">
                <p className="font-display text-2xl font-semibold leading-none sm:text-3xl">{euros(exemple.credit)}</p>
                <p className="mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm">pris en charge<br />par le crédit d’impôt</p>
              </div>
            </div>

            <div className="mt-3 border-t border-primary/10 pt-3 sm:mt-4 sm:pt-4">
              <span className="text-sm text-primary sm:text-base">{euros(exemple.facture)} facturés</span>
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
