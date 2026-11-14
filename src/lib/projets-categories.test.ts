import { describe, expect, it } from "vitest";
import { categorieTaille, filtrerProjets } from "./projets-categories";

const projets = [
  { titre: "Taille de haies & arbustes", type: "Taille de précision" },
  { titre: "Taille d’arbustes", type: "Entretien" },
  { titre: "Tonte & entretien complet", type: "Entretien régulier" },
  { titre: "Aménagement de massifs", type: "Plantation & graminées" },
];

describe("Catégorie taille de haies et arbustes", () => {
  it("regroupe les projets de taille sans les tontes ni les plantations", () => {
    expect(filtrerProjets(projets, categorieTaille)).toEqual([projets[0], projets[1]]);
  });

  it("conserve tous les projets sans catégorie sélectionnée", () => {
    expect(filtrerProjets(projets)).toEqual(projets);
  });
});