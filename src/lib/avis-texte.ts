// Nettoyage des avis Google : l'API renvoie parfois la traduction anglaise
// devant le texte d'origine, avec les mentions « (Translated by Google) » et « (Original) ».
export function nettoyerAvis(t: string) {
  let texte = t;

  // Récupère uniquement le texte d'origine en français
  if (/\((?:Original|Avis d['’]origine)\)/i.test(texte)) {
    const parts = texte.split(/\((?:Original|Avis d['’]origine)\)/i);
    if (parts[1]?.trim()) {
      texte = parts[1];
    }
  }

  return texte
    .split(/\n\n\((?:Translated by Google|Traduit par Google)\)/i)[0]!
    .replace(/\((?:Translated by Google|Traduit par Google)\)\s*/gi, "")
    .replace(/Cl[ée]ment Blondel est un jeune homme qui vient de créer sa société\.?/gi, "Blondel Jardin est une jeune entreprise.")
    .replace(/(Monsieur |M\. )?Cl[ée]ment Blondel|Monsieur Blondel/gi, "Blondel Jardin")
    .trim();
}
