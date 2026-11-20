/**
 * ✏️ MODIFIE CE FICHIER POUR PERSONNALISER TON PORTFOLIO.
 * Tout le contenu éditorial est centralisé ici.
 * Les projets ci-dessous sont des EXEMPLES, pas des réalisations réelles.
 */
export const portfolio = {
  identity: {
    name: 'Léa',
    initials: 'TN',
    role: 'Création visuelle & design digital',
    eyebrow: 'Bienvenue sur mon portfolio',
    headlineBefore: `J'imagine, je conçois`,
    headlineAccent: 'je crée.',
    intro: 'Passionnée par la création visuelle et le numérique, j’aime explorer différents domaines, du design à la communication en passant par le web. Curieuse et polyvalente, j’aime apprendre, expérimenter et donner vie à de nouvelles idées.',
    aboutTitle: 'Créativité et curiosité.',
about: "Issue d’un parcours en arts appliqués, je m’intéresse aussi bien à la création visuelle qu’à l’informatique. Du design graphique au développement web, en passant par la conception d’interfaces et la modélisation 3D, j’aime explorer différents outils et associer créativité et technique dans mes projets personnels.",    location: 'Paris',
    availability: `En recherche d'alternance`,
  },
  sound: {
    // Optionnel : mets un MP3 à toi dans public/audio/ et indique « /audio/mon-son.mp3 ».
    // Laisse vide pour l'ambiance synthétique originale intégrée.
    musicFile: '/audio/mon-son.mp3',
    volume: 50,
  },
  contact: {
    // Renseigne ton adresse et tes vrais liens. Une valeur vide masque le lien.
    email: 'leaprea.x@gmail.com',
    github: '',
    linkedin: '',
    instagram: '',
  },
  skills: [
    { name: 'React', icon: '⚛', category: 'Frontend' },
    { name: 'JavaScript', icon: '✦', category: 'Frontend' },
    { name: 'HTML & CSS', icon: '◈', category: 'Frontend' },
    { name: 'Responsive UI', icon: '▧', category: 'Design' },
    { name: 'Animations CSS', category: 'Design' },
    { name: 'Git / GitHub', icon: '⌘', category: 'Outils' },
  ],
  // Ces fiches sont des placeholders à remplacer avec TES projets.
  projects: [
    {
      id: '01',
      title: 'Beat & Drink',
type: 'UI/UX Design · Prototype interactif',
      description: 'Un espace pour présenter un projet dont tu es fier·ère : son concept, ton rôle et ce que tu as réalisé.',
      longDescription: `Beat & Drink est un concept d'application dédié à l'univers des soirées techno. Elle permet de découvrir différents événements, leurs styles musicaux, les artistes programmés et les lieux, tout en proposant un parcours de réservation.

Sa particularité réside dans la fonctionnalité « Proposer un DJ set », pensée pour donner davantage de visibilité aux DJs débutants ou émergents. Ils peuvent soumettre leurs sets afin de se faire connaître auprès de clubs et d'organisateurs, avec la possibilité d'être contactés pour de futures performances.

L'un de mes principaux défis a été de concevoir une navigation intuitive et de maintenir une cohérence entre les différentes pages, fonctionnalités et interactions de l'application. J'ai également accordé une attention particulière à l'expérience utilisateur (UX), en cherchant à simplifier les parcours, à rendre les informations facilement accessibles et à proposer une interface claire et agréable à utiliser, sans compromettre son identité visuelle.

Pour l'identité visuelle, j'ai choisi une esthétique inspirée des clubs techno : des fonds sombres, des couleurs néon violettes et vertes, des faisceaux lumineux et des typographies affirmées. L'objectif était de créer une interface immersive et dynamique, reflétant l'énergie de la musique électronique tout en restant lisible et fonctionnelle.`,
      stack: [
  'Figma',
  'UI Design',
  'UX Design',
  'Prototypage interactif',
  'Communication visuelle'
],
      color: 'blue',
      icon: 'orbit',
      image: '', // facultatif : « /projects/mon-projet.jpg » si ajouté dans public/
      demo: 'https://www.figma.com/proto/fsmXyt5qJkRxxCoIlARxfx/BEAT---DRINK?node-id=163-1772&p=f&viewport=696%2C277%2C0.18&t=9HXJIORoRyYLwztE-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=157%3A1765&page-id=0%3A1',
      source: '',
      isPlaceholder: false,
    },
    {
      id: '02',
      title: 'Mon application créative',
      type: 'Application frontend',
      description: 'Une fiche idéale pour une application interactive, avec une vraie démonstration et un peu de storytelling.',
      longDescription: 'Décris en quelques lignes le problème que résout ton application, la manière dont tu as conçu l’interface et les fonctionnalités que tu as développées.',
      stack: ['JavaScript', 'UI / UX'],
      color: 'green',
      icon: 'window',
      image: '',
      demo: '{project.isPlaceholder && <div className="placeholder-alert"><WandSparkles size={15}/> Fiche exemple : remplace-la avec un vrai projet dans <code>src/data/portfolio.js</code>.</div>}',
      source: '',
      isPlaceholder: true,
    },
    {
      id: '03',
      title: 'Mon laboratoire visuel',
      type: 'Exploration design',
      description: 'Un endroit pour montrer des expérimentations visuelles, des animations et des idées qui sortent du cadre.',
      longDescription: 'Parle de tes inspirations, des expérimentations faites, des interactions créées et de ce que tu as appris en explorant ce concept.',
      stack: ['Creative coding', 'CSS'],
      color: 'purple',
      icon: 'sparkle',
      image: '',
      demo: '{project.isPlaceholder && <div className="placeholder-alert"><WandSparkles size={15}/> Fiche exemple : remplace-la avec un vrai projet dans <code>src/data/portfolio.js</code>.</div>}',
      source: '',
      isPlaceholder: true,
    },
  ],
};
