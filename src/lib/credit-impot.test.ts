import { describe, expect, it } from "vitest";
import { exempleCreditImpot } from "./credit-impot";

describe("Crédit d’impôt jardinage", () => {
  it("applique un crédit de 50 % à une dépense éligible de 100 €", () => {
    expect(exempleCreditImpot(100)).toEqual({ depense: 100, credit: 50, coutFinal: 50 });
  });
});