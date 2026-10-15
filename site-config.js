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
  photo: "images/consultation-cauris.webp", // photo de la section « Le Médium »

  // Diaporama en haut de page : une diapositive par photo, avec sa légende.
  // Pour ajouter une photo : placez-la dans le dossier images/ et ajoutez une ligne.
  diaporama: [
    { image: "images/consultation-cauris.webp", titre: "Consultation d'un client", texte: "Lecture des cauris pour éclairer la situation et répondre aux questions du consultant." },
    { image: "images/remise-plantes.webp", titre: "Remise d'une préparation", texte: "Un sachet de plantes et de cauris, préparé spécialement pour un client." },
    { image: "images/preparation-savons.webp", titre: "Préparation des savons", texte: "Savons de chance et de protection préparés à base de plantes, de feuilles et d'écorces." },
    { image: "images/rituel-purification.webp", titre: "Rituel de purification", texte: "Fumigation de plantes sacrées pour purifier, protéger et lever les blocages." },
    { image: "images/huiles-parfums.webp", titre: "Huiles et parfums", texte: "Préparations à base de plantes et de graines naturelles, mises en flacon." },
    { image: "images/statuettes-couple.webp", titre: "Harmonie du couple", texte: "Statuettes préparées pour l'union et l'entente du couple." },
    { image: "images/bain-purification.webp", titre: "Bain de purification", texte: "Canaris de plantes préparés pour le bain de purification d'un client." },
    { image: "images/ceremonie-mer.webp", titre: "Cérémonie au bord de la mer", texte: "Offrandes et rituel collectif au bord de l'océan." },
    { image: "images/rituel-fleuve.webp", titre: "Rituel au bord du fleuve", texte: "Bain rituel dans le fleuve, avec offrandes présentées dans une calebasse." },
    { image: "images/rencontre-cabinet.webp", titre: "Rencontre au cabinet", texte: "Adam Souabirou reçoit des visiteurs venus le rencontrer." },
    { image: "images/offrandes-divinites.webp", titre: "Offrandes aux divinités", texte: "Kola, huile de palme et boissons déposées devant l'autel pour consulter les divinités." },
    { image: "images/preparation-ceremonie.webp", titre: "Préparation d'une cérémonie", texte: "Poudres, graines, chasse-mouches et fagots disposés avant le rituel." },
  ],

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
  temoignages: [
    {
      texte: "J'ai connu Adam Souabirou grâce à des témoignages sur Facebook. Un vrai marabout n'a pas besoin de faire de la publicité : ce sont les témoignages qui le prouvent. Il intervient dans plusieurs domaines : retour d'affection, attirance de clientèle, savons et parfums de chance… Je suis fière, car ce maître est venu effacer mes larmes. Je suis remplie de joie au moment où j'écris ce témoignage.",
      auteur: "Une cliente",
      ville: "",
    },
    {
      texte: "J'étais dans une situation très difficile : me nourrir et couvrir mes besoins n'était pas facile. J'avais consulté plusieurs marabouts, sans résultat. Un jour, en faisant des recherches sur Internet, j'ai découvert Adam Souabirou. Je lui ai expliqué mon cas ; il m'a fait une consultation puis des rituels. À ce moment-là, mes candidatures d'emploi étaient toujours rejetées. Quelques jours après les rituels, une des entreprises qui avait refusé mon dossier m'a rappelé pour me dire de venir prendre service. Aujourd'hui, j'ai mon emploi, tout a commencé à marcher pour moi et je ne manque de rien.",
      auteur: "Un client",
      ville: "",
    },
    {
      texte: "Je partage mon expérience pour aider ceux qui souffrent. Après plusieurs échecs en amour et au travail, j'ai contacté Adam Souabirou. En quelques jours, ma situation a changé : retour de mon partenaire et déblocage financier. Un travail discret et rapide. Merci du fond du cœur.",
      auteur: "Témoignage client",
      ville: "",
    },
    {
      texte: "Merci infiniment, maître, de m'avoir aidé à sortir de la misère et d'avoir redonné le sourire à toute ma famille. Vous êtes le premier marabout féticheur honnête et sérieux que j'ai connu. Vous m'avez redonné confiance dans le culte vodoun du Bénin et avez installé la joie de vivre dans ma famille. Gardez ce sérieux dans votre travail.",
      auteur: "Témoignage client",
      ville: "",
    },
  ],

  // 6. Nom de domaine (optionnel) — ex. "maitre-xxx.com" ; à relier sur GitHub Pages
  domaine: "",
};
