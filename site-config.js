// =====================================================================
//  INFORMATIONS DU SITE — tout se modifie ici.
//  Les valeurs ci-dessous sont PROVISOIRES (site en construction) :
//  elles seront remplacées par les vraies informations.
// =====================================================================
window.SITE = {
  // Bandeau « site en construction » en haut des pages (false pour le retirer)
  enConstruction: true,

  // 1. Le cabinet et le médium
  cabinet: "La Pleine Lune",
  nomComplet: "Cabinet de naturopathie et d'élévation spirituelle « La Pleine Lune »",
  nom: "Adam Souabirou",
  slogan: "Médium voyant · Adam Souabirou",
  photo: "", // ex. "photo-maitre.jpg" (fichier placé dans le dossier du site)

  // 2. Contact
  telephone: "+225 07 97 26 12 42", // appels directs
  whatsapp: "2250797261242", // format international, sans + ni espaces
  whatsappAffiche: "+225 07 97 26 12 42",
  email: "contact@exemple.fr",

  // 3. Cabinet
  ville: "Bouaké",
  pays: "Côte d'Ivoire",
  adresseCabinet: "Siège : Bouaké, Côte d'Ivoire · Annexe : Bénin",
  horaires: [
    ["Lundi", "8 h – 19 h"],
    ["Mardi", "8 h – 17 h"],
    ["Mercredi", "8 h – 17 h"],
    ["Jeudi", "8 h – 18 h"],
    ["Vendredi", "15 h – 20 h"],
    ["Samedi", "8 h – 18 h"],
    ["Dimanche", "8 h – 18 h"],
  ],
  langues: "Français",
  annees: "10",
  delaiReponse: "24 h",

  // 4. Mentions légales
  legal: {
    editeur: "Adam Souabirou — Cabinet « La Pleine Lune »",
    statut: "[Statut juridique — à compléter]",
    rccm: "[N° RCCM — à compléter]",
    adresse: "Siège social : Bouaké, Côte d'Ivoire — Annexe : Bénin",
    directeur: "Adam Souabirou",
    conservation: "3 ans",
  },
  hebergeur: "GitHub, Inc. — 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis — github.com",

  // 5. Témoignages réels (avec l'accord des clients). Tant que la liste est vide,
  //    des emplacements « Témoignage à venir » sont affichés.
  //    Exemple : { texte: "…", auteur: "A. D.", ville: "Paris" }
  temoignages: [],

  // 6. Nom de domaine (optionnel) — ex. "maitre-xxx.com" ; à relier sur GitHub Pages
  domaine: "",
};
