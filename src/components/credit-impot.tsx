import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exempleCreditImmediate } from "@/lib/credit-impot";
import { LogosServicesPersonne } from "@/components/logos-services-personne";

const euros = (montant: number) => new Intl.NumberFormat("fr-FR", {
  style: "currency", currency: "EUR", maximumFractionDigits: 2,
  minimumFractionDigits: Number.isInteger(montant) ? 0 : 2,
}).format(montant);

export function CreditImpot() {
  const [montant, setMontant] = useState("100");
  const valeur = Number(montant);
  const valide = montant.trim() !== "" && Number.isFinite(valeur) && valeur >= 0;
  const exemple = valide ? exempleCreditImmediate(valeur) : null;
  return (
    <section aria-labelledby="credit-impot-titre" className="credit-section text-primary">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-12 md:py-14 lg:gap-20 lg:py-16">
        <div className="min-w-0">
          <div className="mb-4 flex justify-end md:hidden">
            <LogosServicesPersonne logo="services" />
          </div>
          <h2
            id="credit-impot-titre"
            className="mt-4 font-display text-[26px] font-semibold leading-tight text-primary sm:mt-8 sm:text-3xl lg:mt-12 lg:text-[44px]"
          >
            50 % de crédit d’impôt
            <span className="credit-immediate mt-3 flex w-fit items-center gap-2 rounded-full px-3 py-2 text-lg sm:gap-3 sm:px-4 sm:py-3 sm:text-2xl lg:gap-4 lg:px-6 lg:text-[40px]">
              <Zap aria-hidden="true" className="h-5 w-5 shrink-0 fill-current text-moss sm:h-7 sm:w-7 lg:h-9 lg:w-9" />
              <span>avec avance immédiate</span>
            </span>
          </h2>
          <p className="mt-4 font-display text-lg font-semibold leading-snug text-primary sm:mt-5 sm:text-xl lg:text-[26px]">
            Vous ne payez que la moitié de votre facture.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary/90 sm:mt-4 sm:text-base lg:text-lg">
            Grâce à l’avance immédiate du crédit d’impôt, vous bénéficiez directement de{" "}
            <strong className="font-semibold">50 % de réduction</strong>, sans avance ni remboursement.
          </p>

          <div className="mt-6">
            <Button
              asChild
              className="h-auto whitespace-normal rounded-full px-5 py-3 text-sm font-semibold shadow-none sm:px-6 sm:py-4 sm:text-base lg:px-7"
            >
              <Link to="/contact">
                En parler pour mon devis
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="hidden items-center justify-between gap-4 md:flex md:min-h-16 lg:min-h-20">
            <span aria-hidden="true" />
            <LogosServicesPersonne logo="services" />
          </div>

          <figure className="credit-invoice mt-4 rounded-3xl border border-primary/8 p-4 sm:mt-5 sm:rounded-[30px] sm:p-5 lg:rounded-[32px] lg:p-7">
            <figcaption className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary whitespace-nowrap lg:text-xs lg:tracking-[0.22em]">
                Facture : BLONDEL JARDIN
              </span>
              <span className="shrink-0 text-[11px] text-primary whitespace-nowrap lg:text-sm">Taille arbuste</span>
            </figcaption>

            <div className="mt-5">
              <label htmlFor="montant-facture" className="text-sm font-medium text-primary">Montant de votre facture</label>
              <div className="relative mt-2">
                <Input
                  id="montant-facture"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={montant}
                  onChange={(event) => setMontant(event.target.value)}
                  aria-invalid={!valide && montant !== ""}
                  aria-describedby={!valide && montant !== "" ? "montant-erreur" : undefined}
                  className="h-12 rounded-xl border-primary/20 bg-background/60 pr-10 font-display text-xl text-primary shadow-none md:text-xl"
                />
                <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary">€</span>
              </div>
              {!valide && montant !== "" && <p id="montant-erreur" className="mt-2 text-xs text-destructive">Indiquez un montant positif ou nul.</p>}
            </div>

            <div aria-live="polite" aria-atomic="true" className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-primary/10 sm:mt-5 sm:rounded-3xl">
              <div className="credit-payment px-3 py-3 text-primary-foreground sm:px-4 sm:py-4 lg:px-5">
                <p className="min-h-8 break-words font-display text-2xl font-semibold leading-tight sm:text-3xl">{exemple ? euros(exemple.aPayer) : "— €"}</p>
                <p className="mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm">
                  à votre charge
                  <br />
                  (paiement immédiat)
                </p>
              </div>
              <div className="bg-secondary/50 px-3 py-3 text-primary sm:px-4 sm:py-4 lg:px-5">
                <p className="min-h-8 break-words font-display text-2xl font-semibold leading-tight sm:text-3xl">{exemple ? euros(exemple.credit) : "— €"}</p>
                <p className="mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm">
                  pris en charge
                  <br />
                  par le crédit d’impôt
                </p>
              </div>
            </div>

            <div className="mt-3 border-t border-primary/10 pt-3 sm:mt-4 sm:pt-4">
              <span className="text-sm text-primary sm:text-base">{exemple ? `${euros(exemple.facture)} facturés` : "— € facturés"}</span>
              <p className="mt-1 text-xs text-muted-foreground">Simulation indicative, sous conditions d’éligibilité.</p>
            </div>
          </figure>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground md:col-span-2 lg:mt-12 lg:text-sm">
          Sous conditions d’éligibilité aux services à la personne et dans les plafonds légaux.{" "}
          <a
            className="underline underline-offset-4 hover:text-primary"
            href="https://www.impots.gouv.fr/particulier/emploi-domicile"
            target="_blank"
            rel="noreferrer"
          >
            Conditions officielles
          </a>
        </p>
      </div>
    </section>
  );
}
