import p1 from "@/assets/projet-1.jpg";
import p2 from "@/assets/projet-2.jpg";
import p3 from "@/assets/projet-3.jpg";
import hero from "@/assets/hero-jardin.jpg";
import p1Detail2 from "@/assets/projet-1-detail-2.jpg.asset.json";
import p1Detail3 from "@/assets/projet-1-detail-3.jpg.asset.json";
import p2Detail2 from "@/assets/projet-2-detail-2.jpg.asset.json";
import p2Detail3 from "@/assets/projet-2-detail-3.jpg.asset.json";
import p3Detail2 from "@/assets/projet-3-detail-2.jpg.asset.json";
import p3Detail3 from "@/assets/projet-3-detail-3.jpg.asset.json";
import heroDetail2 from "@/assets/hero-jardin-detail-2.jpg.asset.json";
import heroDetail3 from "@/assets/hero-jardin-detail-3.jpg.asset.json";

export type Projet = {
  img: string;
  photos: string[];
  titre: string;
  lieu: string;
  type: string;
  description?: string;
  duree?: string;
  surface?: string;
  etapes?: { jour: string; texte: string }[];
  resultat?: string;
};

export const projets: Projet[] = [
  {
    img: p1,
    photos: [p1, p1Detail2.url, p1Detail3.url],
    titre: "Aménagement de massifs",
    lieu: "Hérin (59)",
    type: "Plantation & graminées",
    description:
      "Création et mise en valeur de massifs, plantation de vivaces et graminées, et intégration harmonieuse autour d'une terrasse bois pour un rendu moderne et naturel.",
    duree: "3 jours",
    surface: "85 m²",
    etapes: [
      { jour: "Jour 1", texte: "Préparation du sol et délimitation des massifs" },
      { jour: "Jour 2", texte: "Plantation des végétaux (vivaces, graminées, arbustes)" },
      { jour: "Jour 3", texte: "Finitions : paillage, nettoyage et mise en valeur de la terrasse" },
    ],
    resultat:
      "Un espace extérieur moderne, structuré et facile d'entretien, qui associe esthétisme et végétation durable.",
  },
  {
    img: p2,
    photos: [p2, p2Detail2.url, p2Detail3.url],
    titre: "Taille de haies & arbustes",
    lieu: "Valenciennois (59)",
    type: "Taille de précision",
    description:
      "Taille raisonnée et remise en forme de haies mixtes pour préserver l'intimité et la santé des végétaux.",
    duree: "2 jours",
    surface: "120 ml",
    etapes: [
      { jour: "Jour 1", texte: "Taille d'alignement et rabattage des hauteurs" },
      { jour: "Jour 2", texte: "Finitions des angles et évacuation complète des déchets verts" },
    ],
    resultat: "Une haie parfaitement rectiligne, aérée et stimulée pour une repousse homogène.",
  },
  {
    img: p3,
    photos: [p3, p3Detail2.url, p3Detail3.url],
    titre: "Entretien de massifs fleuris",
    lieu: "Valenciennes (59)",
    type: "Entretien saisonnier",
    description:
      "Désherbage manuel, taille des vivaces fanées et paillage minéral pour valoriser les abords de la maison.",
    duree: "1 jour",
    surface: "60 m²",
    etapes: [
      { jour: "Matin", texte: "Désherbage minutieux et griffage de surface" },
      { jour: "Après-midi", texte: "Apport de paillage protecteur et arrosage de reprise" },
    ],
    resultat: "Des massifs soignés et prêts pour la saison, avec une pousse d'adventices grandement limitée.",
  },
  {
    img: hero,
    photos: [hero, heroDetail2.url, heroDetail3.url],
    titre: "Tonte & entretien complet",
    lieu: "Hérin (59)",
    type: "Entretien régulier",
    description: "Tonte nette avec finitions au rotofil, désherbage sélectif et entretien global de la pelouse.",
    duree: "1 demi-journée",
    surface: "450 m²",
    etapes: [
      { jour: "Étape 1", texte: "Tonte mulching adaptée à la hauteur du gazon" },
      { jour: "Étape 2", texte: "Finitions des bordures le long des massifs et allées" },
    ],
    resultat: "Un gazon vert et dense, découpé proprement autour de chaque zone de vie.",
  },
];
