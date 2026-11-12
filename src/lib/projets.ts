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

// Brouillon : chaque tableau contient uniquement les photos de cette réalisation.
// Remplacer img (couverture), photos et les détails par les vrais contenus du projet.
export const projets = [
  { img: p1, photos: [p1, p1Detail2.url, p1Detail3.url], titre: "Aménagement de massifs", lieu: "Hérin", type: "Plantation & graminées", description: "Plantation et mise en valeur des massifs avec des végétaux et des graminées." },
  { img: p2, photos: [p2, p2Detail2.url, p2Detail3.url], titre: "Taille de haies & arbustes", lieu: "Valenciennois", type: "Taille de précision", description: "Taille des haies et des arbustes pour entretenir leur forme et préserver un aspect soigné." },
  { img: p3, photos: [p3, p3Detail2.url, p3Detail3.url], titre: "Entretien de massifs fleuris", lieu: "Nord", type: "Entretien saisonnier", description: "Entretien des massifs fleuris et soin des plantations au fil des saisons." },
  { img: hero, photos: [hero, heroDetail2.url, heroDetail3.url], titre: "Tonte & entretien complet", lieu: "Hérin", type: "Entretien régulier", description: "Tonte de la pelouse et entretien des espaces verts pour un jardin propre et entretenu." },
];
