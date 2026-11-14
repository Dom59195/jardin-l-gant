export const categorieTaille = "taille-haies-arbustes" as const;

export function filtrerProjets<T extends { titre: string; type: string }>(
  projets: T[],
  categorie?: typeof categorieTaille,
): T[] {
  if (!categorie) return projets;
  return projets.filter((projet) =>
    /\btaill(?:e|es)\b/i.test(`${projet.titre} ${projet.type}`),
  );
}