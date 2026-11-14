import { describe, expect, it } from "vitest";
import { devisSchema } from "./devis";

describe("Données des demandes de devis", () => {
  it("conserve les prestations choisies et la suggestion confirmée", () => {
    const data = devisSchema.parse({ id: "11000000-0000-4000-8000-000000000001", nom: "Test", email: "test@example.com", telephone: "", message: "Taille de ma haie", prestations: ["Taille de haies"], prestationConfirmee: "Taille de haies" });
    expect(data.prestations).toEqual(["Taille de haies"]);
    expect(data.prestationConfirmee).toBe("Taille de haies");
  });
  it("refuse une demande sans adresse e-mail valide", () => {
    expect(devisSchema.safeParse({ id: "11000000-0000-4000-8000-000000000001", nom: "Test", email: "invalide", telephone: "", message: "Mon jardin", prestations: [], prestationConfirmee: "" }).success).toBe(false);
  });
});