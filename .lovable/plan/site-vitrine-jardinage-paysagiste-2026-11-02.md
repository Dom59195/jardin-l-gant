# Site vitrine — Jardinage & Paysagiste

Site épuré, haut de gamme, 3 pages : Accueil, Projets, Contact.

## Direction visuelle
- Palette Forêt & Mousse : vert forêt profond #1a3c2a, vert #2d5a3d, mousse #5a8a5c, vert tendre #a0c49d, fond crème clair.
- Typographie luxe : Cormorant Garamond (titres, élégant) + Karla (texte).
- Beaucoup d'espace, photos plein cadre, coins légèrement arrondis, animations douces.

## Pages
- **En-tête commun** : nom de l'entreprise, menu (Accueil, Projets, Contact), bouton "Demander un devis". Menu repliable sur mobile.
- **Accueil** : grande photo de jardin avec accroche + bouton devis ; cartes services (Création de jardins, Entretien, Taille & élagage, Aménagement extérieur) ; aperçu de 3 projets ; bandeau "Pourquoi nous choisir" ; appel à l'action.
- **Projets** : grille de réalisations en cartes (photo, titre, lieu, type de travaux).
- **Contact** : formulaire (nom, email, téléphone, message) avec message de confirmation, coordonnées, horaires.
- **Pied de page** : coordonnées, liens, mentions.

## Contenu
Nom, textes, coordonnées et horaires provisoires (à remplacer par les vôtres). Photos générées pour l'accueil et les projets.

## Détails techniques
- Routes : `index.tsx`, `projets.tsx`, `contact.tsx`, en-tête/pied dans `__root.tsx`, head() unique par page.
- Tokens de couleur oklch dans `styles.css`, polices via `<link>`.
- Formulaire sans envoi réel pour l'instant (confirmation affichée) ; l'envoi par email pourra être ajouté ensuite.
