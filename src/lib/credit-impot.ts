// Example only: eligibility, subsidies and annual ceilings are assessed separately.
export const TAUX_CREDIT_IMPOT = 0.5;

export function exempleCreditImpot(depenseEligible: number) {
  if (!Number.isFinite(depenseEligible) || depenseEligible < 0) {
    throw new RangeError("La dépense doit être un montant positif ou nul.");
  }
  const credit = Math.round(depenseEligible * TAUX_CREDIT_IMPOT * 100) / 100;
  return { depense: depenseEligible, credit, coutFinal: depenseEligible - credit };
}