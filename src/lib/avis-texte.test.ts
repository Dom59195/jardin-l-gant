import { describe, expect, it } from "vitest";
import { nettoyerAvis } from "./avis-texte";

describe("Texte des avis Google", () => {
  it("garde le texte d'origine et retire la traduction de Google", () => {
    expect(
      nettoyerAvis(
        "(Translated by Google) Great work, very professional.\n(Original) Travail impeccable, je recommande.",
      ),
    ).toBe("Travail impeccable, je recommande.");
  });

  it("retire la traduction placée après le texte français", () => {
    expect(
      nettoyerAvis("Jardin tout propre.\n\n(Translated by Google) Very clean garden."),
    ).toBe("Jardin tout propre.");
  });

  it("laisse un avis déjà en français", () => {
    expect(nettoyerAvis("Ponctuel et soigné.")).toBe("Ponctuel et soigné.");
  });

  it("ne jamais citer le prénom du gérant", () => {
    expect(
      nettoyerAvis("Clément Blondel est un jeune homme qui vient de créer sa société. Il est sérieux."),
    ).toBe("Blondel Jardin est une jeune entreprise. Il est sérieux.");
    expect(nettoyerAvis("Monsieur Blondel est ponctuel.")).toBe("Blondel Jardin est ponctuel.");
  });
});
