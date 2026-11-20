import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check,
  ChevronRight, Code2, ExternalLink, FolderOpen, Github,
  Heart, Instagram, Laptop2, Mail, MapPin, Menu, Monitor,
  MousePointer2, Music2, Pause, Play, Power, Sparkles,
  Volume2, VolumeX, WandSparkles, X,
} from 'lucide-react';
import PixelComputer from './components/PixelComputer.jsx';
import CreativeShowcase from './components/CreativeShowcase.jsx';
import SkillsShowcase from './components/SkillsShowcase.jsx';
import WelcomeAvatar from './components/WelcomeAvatar.jsx';
import { portfolio } from './data/portfolio.js';
import {
  playEntranceSound, playInterfaceClick, startAmbience, stopAmbience, ambienceIsAvailable, configureSound,
} from './audio/aeroSound.js';


const bubblePositions = [
  { x: '8%', y: '17%', s: 56, delay: '-1.8s', duration: '9.5s' },
  { x: '91%', y: '19%', s: 95, delay: '-4.2s', duration: '12.8s' },
  { x: '74%', y: '42%', s: 24, delay: '-0.9s', duration: '7.7s' },
  { x: '17%', y: '66%', s: 30, delay: '-5.6s', duration: '8.4s' },
  { x: '79%', y: '76%', s: 53, delay: '-3.1s', duration: '10.5s' },
  { x: '39%', y: '12%', s: 17, delay: '-2.2s', duration: '9.5s' },
  { x: '96%', y: '63%', s: 22, delay: '-3.6s', duration: '10.8s' },

  // Nouvelles bulles en bas
  { x: '5%', y: '85%', s: 75, delay: '-2s', duration: '7s' },
  { x: '92%', y: '87%', s: 55, delay: '-4s', duration: '7s' },
];


function Atmosphere({ subtle = false }) {
  return (
    <div className={`atmosphere ${subtle ? 'atmosphere--subtle' : ''}`} aria-hidden="true">
      <div className="sun-halo" />
      <div className="scene-image" />
      <div className="aero-bubbles">
        {bubblePositions.map((bubble, index) => (
          <span
            className="aero-bubble"
            key={index}
            style={{ left: bubble.x, top: bubble.y, width: bubble.s, height: bubble.s,
              animationDelay: bubble.delay, animationDuration: bubble.duration }}
          />
        ))}
      </div>
      <div className="air-grain" />
    </div>
  );
}

function GlassWindow({ title, icon: Icon = FolderOpen, children, className = '', toolbar, id }) {
  return (
    <section id={id} className={`glass-window ${className}`}>
      <div className="window-toolbar">
        <div className="window-toolbar__name"><span className="window-toolbar__icon"><Icon size={14} strokeWidth={2.1}/></span>{title}</div>
        <div className="window-toolbar__end">{toolbar}<span className="window-controls" aria-hidden="true"><i /><i /><i /></span></div>
      </div>
      {children}
    </section>
  );
}

function GlossButton({ children, href, onClick, secondary = false, icon: Icon = ArrowUpRight, className = '', target }) {
  const classes = `gloss-button ${secondary ? 'gloss-button--secondary' : ''} ${className}`;
  if (href) return <a className={classes} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>{children}<Icon size={17} strokeWidth={2.4}/></a>;
  return <button type="button" className={classes} onClick={onClick}>{children}<Icon size={17} strokeWidth={2.4}/></button>;
}

function Intro({ onEnter, entering }) {
  return (
    <div className={`intro ${entering ? 'intro--entering' : ''}`}>
      <Atmosphere />
      <div className="intro-topbar">
        <div className="intro-brand"><span className="brand-orb" />aero<span className="intro-brand__light">.space</span></div>
        <span className="intro-status"><span className="status-led"/> TRANSMISSION REÇUE · 2005 — 2026</span>
      </div>
      <main className="intro-main">
        <div className="intro-copy">
          <h1>Tout commence <em>par un clic.</em></h1>
        </div>
        <div className="computer-stage">
          <div className="stage-orbit stage-orbit--one"/>
          <div className="stage-orbit stage-orbit--two"/>
          <div className="stage-shine"/>
          <button type="button" className="pc-entry" onClick={onEnter} disabled={entering} aria-label="Cliquer pour entrer dans le portfolio">
            <PixelComputer />
            <span className="pc-hotspot" aria-hidden="true"><MousePointer2 size={15}/> cliquer sur l’écran</span>
          </button>
          <WelcomeAvatar />
        </div>
        <div className="intro-enter-row">
          <button onClick={onEnter} type="button" disabled={entering} className="enter-main">
            <span className="enter-main__icon"><Power size={19}/></span>
            <span>ALLUMER LE PC</span>
            <ArrowRight size={17}/>
          </button>
         <span className="intro-hint">
  <Volume2 size={17}/> Une ambiance sonore t’attend, pense à régler le volume. ♫
</span>
        </div>
      </main>
      <div className="intro-footer">
  <span>© 2026 — Léa | Portfolio créatif</span>
</div>
      <div className="portal-wipe" aria-hidden="true"/>
    </div>
  );
}

function AeroOrb() {
  return (
    <div className="orb-scene" aria-hidden="true">
      <span className="orb-sparkle orb-sparkle--one">✧</span>
      <span className="orb-sparkle orb-sparkle--two">✦</span>
      <span className="orb-small orb-small--one"/>
      <span className="orb-small orb-small--two"/>
      <span className="orb-ring orb-ring--back"/>
      <div className="main-orb">
        <span className="main-orb__cloud"/>
        <span className="main-orb__hill"/>
        <span className="main-orb__highlight"/>
        <span className="main-orb__shine"/>
      </div>
      <span className="orb-ring orb-ring--front"/>
      <div className="orb-floating-label"><span>✿</span> dreaming in pixels</div>
    </div>
  );
}

function ProjectArtwork({ project }) {
  if (project.image) {
    return <div className={`project-visual project-visual--${project.color}`}><img alt={`Aperçu du projet ${project.title}`} src={project.image} loading="lazy" className="project-custom-image"/></div>;
  }
  return (
    <div className={`project-visual project-visual--${project.color}`} aria-hidden="true">
      <span className="project-float project-float--one"/><span className="project-float project-float--two"/>
      {project.icon === 'orbit' && <div className="artwork-orbit"><div className="artwork-orbit__planet"/><div className="artwork-orbit__ring"/><div className="artwork-orbit__star">✳</div></div>}
      {project.icon === 'window' && <div className="artwork-window"><div className="artwork-window__bar"><i/><i/><i/></div><div className="artwork-window__content"><span className="aw-orb"/><div><b/><b/><b/></div></div><span className="aw-chip">ACTIVE</span></div>}
      {project.icon === 'sparkle' && <div className="artwork-sparkle"><div className="artwork-sparkle__bubble"><span>✳</span></div><span className="artwork-sparkle__sm one">✧</span><span className="artwork-sparkle__sm two">✦</span></div>}
      <span className="project-visual__id">EXP_{project.id}.EXE</span>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="project-modal glass-window" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <div className="window-toolbar"><div className="window-toolbar__name"><FolderOpen size={14}/> {project.id === '01' ? 'beat_and_drink.exe' : `project_${project.id}.exe`}</div><button ref={closeRef} type="button" onClick={onClose} className="modal-close" aria-label="Fermer la fiche du projet"><X size={19}/></button></div>
        <ProjectArtwork project={project}/>
        <div className="project-modal__body">
          <span className="section-index">DOSSIER {project.id} · {project.type}</span>
          <h2 id="project-modal-title">{project.title}</h2>
{project.demo && (
  <a
    className="placeholder-alert project-demo-link"
    href={project.demo}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>Découvrir mon projet</span>
    <ExternalLink size={18} />
  </a>
)}          <details className="project-description">
  <summary className="gloss-button">
    Contexte & démarche du projet
    <span aria-hidden="true">⌄</span>
  </summary>

  <div className="project-description__content">
    
{project.longDescription
  .split(/\n\s*\n/)
  .map((paragraph, index) => (
    <p key={index}>{paragraph.trim()}</p>
  ))}

  </div>
</details>
          <div className="tag-row">{project.stack.map((item) => <span className="tech-tag" key={item}>{item}</span>)}</div>
          <div className="modal-links">
            {project.source && <GlossButton href={project.source} target="_blank" icon={Github} secondary>Code source</GlossButton>}
            {!project.demo && !project.source && <span className="modal-empty-links">Les liens du projet apparaîtront ici une fois renseignés.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button type="button" className="project-card" onClick={() => onOpen(project)} aria-label={`Ouvrir la fiche ${project.title}`}>
      <ProjectArtwork project={project}/>
      <div className="project-card__content">
        <div className="project-card__meta"><span>{project.type}</span><span>{project.id} / 0{portfolio.projects.length}</span></div>
        <div className="project-card__title"><h3>{project.title}</h3><span className="project-arrow"><ArrowUpRight size={19}/></span></div>
        <p>{project.description}</p>
        <div className="tag-row">{project.stack.slice(0, 3).map((item) => <span className="tech-tag" key={item}>{item}</span>)}</div>
      </div>
    </button>
  );
}

function SiteClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);
  return <span className="site-clock" aria-label="Heure actuelle">{time.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>;
}

const sections = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'apropos', label: 'À propos' },
  { id: 'projets', label: 'Projets' },
  { id: 'competences', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

function Portfolio({ onHome, musicOn, onMusicToggle }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
  const handleClick = (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest('button, a, summary')
    ) {
      playInterfaceClick();
    }
  };

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
}, []);
  const { identity, contact, skills, projects } = portfolio;
  const socials = [
    { name: 'GitHub', url: contact.github, Icon: Github },
    { name: 'LinkedIn', url: contact.linkedin, Icon: ExternalLink },
    { name: 'Instagram', url: contact.instagram, Icon: Instagram },
  ].filter(({ url }) => Boolean(url));

  async function copyMail() {
    if (!contact.email) return;
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  return (
    <div className="portfolio-screen">
      <Atmosphere subtle />
      <header className="aero-taskbar">
        <div className="taskbar-inner">
          <a href="#accueil" className="taskbar-brand" onClick={() => setMenuOpen(false)}><span className="brand-orb"/><span>{identity.name.toLowerCase().replace(/\s+/g, '')}<b>.exe</b></span></a>
          <nav className={`desktop-nav ${menuOpen ? 'desktop-nav--open' : ''}`} aria-label="Navigation principale">
            {sections.map((item) => <a key={item.id} onClick={() => setMenuOpen(false)} href={`#${item.id}`}>{item.label}</a>)}
          </nav>
          <div className="taskbar-actions">
            <span className="taskbar-online"><span className="status-led"/> online</span>
            <button type="button" onClick={onMusicToggle} className="icon-control" aria-label={musicOn ? 'Couper la musique' : 'Activer la musique'} title={musicOn ? 'Couper la musique' : 'Activer la musique'}>{musicOn ? <Volume2 size={19}/> : <VolumeX size={19}/>}</button>
            <button type="button" onClick={onHome} className="icon-control home-control" aria-label="Retourner au PC" title="Retour au PC"><Monitor size={18}/></button>
            <SiteClock />
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="icon-control mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
          </div>
        </div>
      </header>

      <main className="portfolio-main" id="accueil">
        <div className="desktop-overline"><span className="desktop-overline__dot"/> AERO DESKTOP <ChevronRight size={13}/> <strong>BIENVENUE</strong></div>
        <div className="hero-layout">
          <GlassWindow title="presentation.exe" icon={Sparkles} className="hero-window">
            <div className="hero-window__body">
              <span className="hero-pill"><span className="status-led"/> {identity.eyebrow}</span>
<div className="hero-title-wrap">
  <span className="hero-hi">Salut ! Je suis...</span>
  <h1>
    {identity.name}
    <span className="hero-title__cursor">_</span>
  </h1>
</div>              <h2>{identity.headlineBefore}<br/><em>{identity.headlineAccent}</em></h2>
              <p className="hero-description">{identity.intro}</p>
              <div className="hero-cta">
                <GlossButton href="#projets" icon={ArrowDownRight}>Explorer mes projets</GlossButton>
                <GlossButton href="#apropos" secondary icon={ArrowRight}>Me découvrir</GlossButton>
              </div>
              <div className="hero-bottomline"><span><Code2 size={15}/> {identity.role}</span><span><MapPin size={15}/>{identity.location}</span></div>
            </div>
          </GlassWindow>
        <GlassWindow
  title="univers.exe"
  icon={WandSparkles}
  className="orb-window"
>
  <CreativeShowcase />
</GlassWindow>
        </div>


        <section className="section-block" id="apropos">
          <div className="section-heading"><div><span className="section-index">01 / PRÉSENTATION</span><h2>Un peu plus <em>sur moi.</em></h2></div></div>
          <div className="about-grid">
            <GlassWindow title="profil.txt" icon={FolderOpen} className="about-story">
              <div className="about-story__body"><span className="about-sticker">HELLO! <span>✦</span></span><h3>{identity.aboutTitle}</h3><p>{identity.about}</p><div className="about-note"><Heart size={17} fill="currentColor"/> Apprendre, expérimenter et créer.</div></div>
            </GlassWindow>
            <GlassWindow title="status.widget" icon={Laptop2} className="about-status">
              <div className="about-status__body"><div className="status-blob"><span>✳</span></div><div className="status-text"><span>STATUT ACTUEL</span><h3>{identity.availability}</h3><p>Marketing, communication visuelle & design digital.</p></div><div className="signal-lines"><i/><i/><i/><i/><i/><i/><i/></div></div>
            </GlassWindow>
          </div>
        </section>

        <section className="section-block" id="projets">
          <div className="section-heading"><div><span className="section-index">02 / RÉALISATIONS</span><h2>Mes <em>projets.</em></h2></div></div>          <div className="project-grid">{projects.map(project => <ProjectCard key={project.id} project={project} onOpen={setSelectedProject}/>)}</div>
        </section>

        <section className="section-block" id="competences">

  <div className="section-heading">
    <div>
      <span className="section-index">
        03 / COMPÉTENCES
      </span>

      <h2>
        Outils et <em>compétences.</em>
      </h2>
    </div>
  </div>

  <GlassWindow
    title="outils.exe"
    icon={Code2}
    className="skills-window"
  >
    <SkillsShowcase />
  </GlassWindow>

</section>

        <section className="section-block contact-section" id="contact">
          <div className="section-heading"><div><span className="section-index">04 / LET'S CONNECT</span><h2>Me <em>contacter ?</em></h2></div></div>
          <GlassWindow title="new_message.eml" icon={Mail} className="contact-window"><div className="contact-window__body"><div className="contact-copy"><span className="contact-eyebrow">✧ A NEW CONNECTION</span><h3>La prochaine bonne idée<br/>commence peut-être <em>ici.</em></h3><p>Un projet, une collab ou juste envie de discuter créa et frontend ? Ma boîte de réception est ouverte.</p><div className="contact-buttons">{contact.email ? <><GlossButton href={`mailto:${contact.email}`} icon={Mail}>M’envoyer un e-mail</GlossButton><button type="button" onClick={copyMail} className="copy-mail">{copied ? <Check size={17}/> : <Mail size={17}/>} {copied ? 'Copié !' : 'Copier mon adresse'}</button></> : <div className="contact-setup"><Mail size={18}/> Ajoute ton adresse e-mail dans <code>src/data/portfolio.js</code> pour activer le contact.</div>}</div><div className="social-links">{socials.map(({name, url, Icon}) => <a key={name} href={url} target="_blank" rel="noopener noreferrer"><Icon size={18}/>{name}<ArrowUpRight size={15}/></a>)}</div></div><div className="contact-art" aria-hidden="true"><div className="contact-envelope"><span>✦</span><div className="contact-envelope__flap"/></div><span className="contact-art__sparkle">✳</span><span className="contact-art__bubble"/></div></div></GlassWindow>
        </section>
      </main>

      <footer className="desktop-footer"><div><span className="brand-orb"/> aeroOS <span className="footer-divider">|</span> {identity.name} © {new Date().getFullYear()} <span className="footer-divider">|</span> MADE WITH ♡ & REACT</div><div><button type="button" onClick={onHome}><ArrowLeft size={15}/> Retour au bureau</button><span>✳ thanks for visiting</span></div></footer>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)}/>}
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState('intro'); // intro | entering | portfolio
  const [musicOn, setMusicOn] = useState(true);
  const entranceTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (entranceTimer.current) clearTimeout(entranceTimer.current);
      stopAmbience();
    };
  }, []);

  const enter = () => {
    if (stage !== 'intro') return;
    configureSound(portfolio.sound);
    playEntranceSound();
    if (musicOn) startAmbience();
    setStage('entering');
    entranceTimer.current = window.setTimeout(() => {
      setStage('portfolio');
      window.scrollTo(0, 0);
    }, 960);
  };
  const goHome = () => {
    stopAmbience();
    setStage('intro');
    window.scrollTo(0, 0);
  };
  const toggleMusic = () => {
    if (musicOn) stopAmbience();
    else if (ambienceIsAvailable()) startAmbience();
    setMusicOn(!musicOn);
  };
  return stage === 'portfolio' ? <Portfolio onHome={goHome} musicOn={musicOn} onMusicToggle={toggleMusic} /> : <Intro onEnter={enter} entering={stage === 'entering'}/>;
}
