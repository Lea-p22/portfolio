import React, { useState } from 'react';
import { Code2, Palette, Megaphone, ChevronDown, X } from 'lucide-react';
import './SkillsShowcase.css';

const categories = [
  {
    id: 'web',
    title: 'Développement web',
    icon: Code2,
    skills: [
      'React',
      'JavaScript',
      'HTML & CSS',
      'Responsive UI',
      'Animations CSS',
      'Git / GitHub',
      'VS Code'
    ]
  },
  {
    id: 'design',
    title: 'Design & création numérique',
    icon: Palette,
    skills: [
      'Figma',
      'UI/UX Design',
      'Blender',
      'Photoshop',
      'Illustrator',
      'InDesign',
      'Lightroom',
      'Procreate'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & communication',
    icon: Megaphone,
    skills: [
      'Communication visuelle',
      'Identité visuelle',
      'Branding',
      'Création de contenu',
      'Canva',
      'Veille créative',
      'Communication digitale',
      'Notions de marketing digital'
    ]
  }
];

export default function SkillsShowcase() {
  const [active, setActive] = useState(null);

  const selected = categories.find(
    category => category.id === active
  );

  return (
    <div className="ss-showcase">

      <p className="ss-intro">
        Les outils et compétences que je mobilise dans mes
        projets, entre création, développement et communication.
      </p>

      <div className="ss-grid">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = active === category.id;

          return (
            <button
              key={category.id}
              type="button"
              className={`ss-card ss-${category.id} ${isActive ? 'is-active' : ''}`}
              aria-expanded={isActive}
              aria-controls="ss-details"
              onClick={() =>
                setActive(isActive ? null : category.id)
              }
            >
              <div className="ss-icon">
                <Icon size={45} strokeWidth={1.8} />
              </div>

              <h3>{category.title}</h3>

              <ChevronDown
                size={20}
                className="ss-chevron"
              />
            </button>
          );
        })}
      </div>

      <div id="ss-details" hidden={!selected}>
        {selected && (
          <div className={`ss-details ss-${selected.id}`}>
            <div className="ss-details-header">
              <h3>{selected.title}</h3>

              <button
                type="button"
                className="ss-close"
                aria-label="Fermer les compétences"
                onClick={() => setActive(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ss-pills">
              {selected.skills.map(skill => (
                <span className="ss-pill" key={skill}>
                  <span aria-hidden="true">✦</span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {!selected && (
        <p className="ss-hint">
          Sélectionnez une catégorie pour découvrir mes compétences.
        </p>
      )}

    </div>
  );
}