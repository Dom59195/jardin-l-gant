import { describe, expect, it } from "vitest";
import { exempleCreditImmediate } from "./credit-impot";

describe("Crédit d’impôt immédiat", () => {
  it("laisse payer la moitié de la facture, sans avance", () => {
    expect(exempleCreditImmediate(100)).toEqual({ facture: 100, credit: 50, aPayer: 50 });
  });

  it("applique le même taux sur une autre facture", () => {
    expect(exempleCreditImmediate(240)).toEqual({ facture: 240, credit: 120, aPayer: 120 });
  });

  it("calcule 150 € à régler immédiatement pour une facture de 300 €", () => {
    expect(exempleCreditImmediate(300)).toEqual({ facture: 300, credit: 150, aPayer: 150 });
  });

  it("conserve des montants arrondis au centime", () => {
    expect(exempleCreditImmediate(100.1)).toEqual({ facture: 100.1, credit: 50.05, aPayer: 50.05 });
  });

  it("ne calcule pas de crédit pour un montant invalide", () => {
    for (const montant of [-1, NaN, Infinity]) {
      expect(() => exempleCreditImmediate(montant)).toThrow(RangeError);
    }
  });
});
