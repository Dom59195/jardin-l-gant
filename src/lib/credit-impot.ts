// Exemple indicatif : éligibilité, aides et plafonds annuels s'apprécient séparément.
export const TAUX_CREDIT_IMPOT = 0.5;

export function exempleCreditImmediate(facture: number) {
  if (!Number.isFinite(facture) || facture < 0) {
    throw new RangeError("La facture doit être un montant positif ou nul.");
  }
  const credit = Math.round(facture * TAUX_CREDIT_IMPOT * 100) / 100;
  return { facture, credit, aPayer: facture - credit };
}
