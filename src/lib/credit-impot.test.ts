import { describe, expect, it } from "vitest";
import { exempleCreditImmediate } from "./credit-impot";

describe("Crédit d’impôt immédiat", () => {
  it("laisse payer la moitié de la facture, sans avance", () => {
    expect(exempleCreditImmediate(100)).toEqual({ facture: 100, credit: 50, aPayer: 50 });
  });

  it("applique le même taux sur une autre facture", () => {
    expect(exempleCreditImmediate(240)).toEqual({ facture: 240, credit: 120, aPayer: 120 });
  });
});
