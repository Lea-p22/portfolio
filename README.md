# ✳ Aero Space — Portfolio React / JavaScript

Un portfolio frontend **Frutiger Aero** : ordinateur CRT crème en pixel art 2.5D, transition vers l'écran, fenêtres façon Windows Aero, nuages, nature, bulles, pages projets et ambiance sonore originale.

> Version de départ prête à personnaliser. Les projets, le nom, les textes et les compétences sont des **exemples**, pas un profil réel.

## 1. Lancer le site

Installe **Node.js 20.19+ ou 22.12+**, puis dans un terminal :

```bash
npm install
npm run dev
```

Ouvre l'adresse donnée par Vite (généralement **http://localhost:5173**).

Pour préparer la mise en ligne :

```bash
npm run build
npm run preview
```

Le site statique prêt pour l'hébergement est dans `dist/`. Tu peux le déployer sur Vercel, Netlify ou GitHub Pages (en adaptant `base` pour un sous-chemin GitHub Pages).

## 2. Modifier tes informations

**Tout est centralisé dans `src/data/portfolio.js`.**

- `identity.name` : ton nom ou ton pseudo.
- `identity.role`, `intro`, `about`, `aboutTitle`, `location` : ta présentation.
- `contact.email`, `github`, `linkedin`, `instagram` : tes vrais liens (les liens vides restent masqués).
- `skills` : tes véritables compétences, en supprimant ce qui ne te correspond pas.
- `projects` : remplace les trois projets exemples par tes projets. Mets `isPlaceholder: false` pour supprimer l'alerte dans la fiche.
- `projects[].demo` et `source` : liens facultatifs vers les démos et GitHub.
- `projects[].image` : un chemin comme `"/projects/mon-projet.webp"` après avoir ajouté ton image dans `public/projects/`.

La section **Contact** affiche une consigne tant qu'aucun e-mail n'est renseigné : aucun faux lien ne sera activé.

## 3. Changer la musique et le son

La musique initiale est une **composition algorithmique originale** créée par Web Audio dans `src/audio/aeroSound.js`. Elle est volontairement douce, ne requiert aucun fichier MP3 ni service externe, et commence après le **premier clic** sur le PC. Le clic d'entrée est également synthétisé localement.

Pour remplacer l'ambiance par ton propre fichier musical (dont tu possèdes les droits ou une licence d'utilisation) :

1. Crée le dossier `public/audio/`.
2. Ajoute ton fichier, par exemple `public/audio/mon-ambiance.mp3`.
3. Dans `src/data/portfolio.js`, modifie :

   ```js
   sound: {
     musicFile: '/audio/mon-ambiance.mp3',
     volume: 0.16, // discret : entre 0 et 1
   },
   ```

Le bouton 🔊 dans la barre du haut permet de couper / réactiver la musique. Les navigateurs bloquent la lecture auto **avant** une interaction : le clic d'entrée sert justement à autoriser la musique.

⚠️ Une musique virale / de tendance peut être soumise à des droits d'auteur : elle **n'est pas incluse** dans ce ZIP.

## 4. Personnaliser la direction artistique

| Élément | Fichier |
| --- | --- |
| Les couleurs, typographies, animations, adaptabilité mobile | `src/styles.css` |
| Le PC rétro dessiné en SVG / React | `src/components/PixelComputer.jsx` |
| Le ciel, les nuages et les collines (SVG original) | `public/landscape.svg` |
| Les fenêtres, sections, cartes et interactions | `src/App.jsx` |
| Les données de projets et de profil | `src/data/portfolio.js` |
| Le son original et le bruit de clic | `src/audio/aeroSound.js` |
| L'icône de l'onglet | `public/favicon.svg` |

**Palette principale :** bleu ciel `#1c98dc`, bleu profond `#175e7e`, aqua `#a3e5f5`, vert `#87d98a`, blanc givré `#faffff`.

La typographie utilise des polices système (*Segoe UI*, *Trebuchet MS*, Arial) : aucune ressource externe n'est nécessaire pour afficher le site. Toutes les illustrations sont incluses (SVG et CSS) : **pas d'image externe obligatoire**.

## 5. Comment le site est organisé

```text
aero-portfolio-react/
├── index.html
├── package.json
├── public/
│   ├── favicon.svg
│   └── landscape.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── audio/
    │   └── aeroSound.js
    ├── components/
    │   └── PixelComputer.jsx
    └── data/
        └── portfolio.js   ← À ÉDITER EN PREMIER
```

### Navigation et interactions

- **Accueil** : ordinateur rétro cliquable, avec effet d'entrée.
- **Portfolio** : navigation fluide par ancres, sections À propos / Projets / Compétences / Contact.
- **Projets** : clic sur une carte pour ouvrir une fiche en fenêtre modale ; touche Échap ou croix pour fermer.
- **Musique** : démarrage après le clic, bouton muet, volume doux.
- **Retour au bureau** : permet de revenir sur l'ordinateur et de recommencer.
- **Mobile** : écran adapté aux petits formats, menu dédié, animations limitées si `prefers-reduced-motion` est activé.

## 6. À faire pour une vraie mise en ligne

- Renseigner le nom, les textes, l'adresse e-mail et les liens.
- Remplacer les fiches de démonstration par tes vrais projets et visuels.
- Ajouter ton titre SEO et ta description dans `index.html`.
- Tester sur téléphone et avec le son coupé.
- Mettre ton site en ligne via Vercel ou Netlify.

---

**Stack :** React, JavaScript, Vite, CSS natif, SVG et Web Audio API. Aucun backend, aucune base de données, aucun compte nécessaire.
