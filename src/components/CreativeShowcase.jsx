import React from 'react';
import ui from './creative-assets/ui.webp';
import graphic from './creative-assets/graphic.webp';
import communication from './creative-assets/communication.webp';
import model from './creative-assets/model.webp';
import web from './creative-assets/web.webp';

const domains = [
  ['ui', ui, 'UI / UX Design'],
  ['graphic', graphic, 'Design graphique'],
  ['communication', communication, 'Communication visuelle'],
  ['model', model, '3D / Modélisation'],
  ['web', web, 'Développement web'],
];
function Planet() {
  const id = React.useId().replace(/:/g, '');
  return <svg viewBox="0 0 240 210" className="cs-planet-svg" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-sea`} cx="28%" cy="16%" r="88%">
        <stop stopColor="#f7ffff"/><stop offset=".29" stopColor="#a8eaff"/><stop offset=".62" stopColor="#22b9df"/><stop offset="1" stopColor="#068c9e"/>
      </radialGradient>
      <linearGradient id={`${id}-land`} x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#d4ff9a"/><stop offset=".45" stopColor="#73db64"/><stop offset="1" stopColor="#0c9b88"/></linearGradient>
      <linearGradient id={`${id}-ring`}><stop stopColor="#eaffff"/><stop offset=".55" stopColor="#f3ffff"/><stop offset="1" stopColor="#39bedb"/></linearGradient>
      <clipPath id={`${id}-clip`}><circle cx="120" cy="105" r="79"/></clipPath>
    </defs>
    <ellipse cx="120" cy="105" rx="115" ry="37" transform="rotate(-31 120 105)" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="9"/>
    <circle cx="120" cy="105" r="79" fill={`url(#${id}-sea)`} stroke="#f0ffff" strokeWidth="2"/>
    <g clipPath={`url(#${id}-clip)`}>
      <path d="M36 139 Q117 89 205 121 V189 H36Z" fill={`url(#${id}-land)`}/>
      <path d="M56 68 Q78 31 134 35" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="11" strokeLinecap="round"/>
      <path d="M149 173 Q192 158 178 151" fill="none" stroke="#daffe7" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <path d="M218.57 45.77 A115 37 -31 0 1 21.43 164.23" fill="none" stroke="#eaffff" strokeWidth="8" strokeLinecap="round" opacity=".90"/>
  </svg>;
}

export default function CreativeShowcase() {
  return (
    <div className="cs-showcase">
      <style>{css}</style>
      <div className="cs-heading">
        <span className="cs-heading-star" aria-hidden="true">✧</span>
        <div><h2>Mon univers créatif</h2>
        <p>À la croisée du design, du web et de la création numérique.</p></div>
      </div>
      <div className="cs-orbit" aria-label="Domaines créatifs">
        <div className="cs-orbit-line" aria-hidden="true" />
        <div className="cs-planet"><Planet /></div>
        {domains.map(([key, image, label]) => (
          <div className={`cs-domain cs-domain--${key}`} key={key}>
            <div className="cs-domain-float"><img src={image} alt=""/><span>{label}</span></div>
          </div>
        ))}
        {['a','b','c','d','e'].map(key => <span key={key} className={`cs-spark cs-spark--${key}`} aria-hidden="true">✦</span>)}
      </div>
<div className="cs-footer">
  <span>MES COMPÉTENCES</span>
</div>    </div>
  );
}

const css = `
.cs-showcase, .cs-showcase * { box-sizing: border-box; }
.cs-showcase { container-type:inline-size; width:100%; min-width:0; flex:1; display:flex; flex-direction:column; align-items:stretch; padding:clamp(16px,2vw,25px); gap:20px; min-height:525px; background:radial-gradient(ellipse at 50% 45%,#ffffffa6,transparent 65%),linear-gradient(165deg,#c7f5fa9c,#c8ffce8c); color:#176d87; position:relative; z-index:1; font-family:'Segoe UI',Arial,sans-serif; }
.cs-heading { display:flex; align-items:flex-start; gap:10px; padding:4px 3px 0; }
.cs-heading-star { flex:none; font-size:30px; line-height:1; color:#efffff; text-shadow:0 1px 1px #2eb9dd,0 2px 8px #45bcdf; }
.cs-heading h2 { margin:0; color:#086d94; font-family:'Trebuchet MS','Segoe UI',sans-serif; font-size:clamp(20px,5.8cqw,29px); line-height:1.12; font-weight:900; letter-spacing:-.6px; }
.cs-heading p { margin:8px 0 0; font-size:clamp(11px,3cqw,14px); font-weight:500; color:#246e87; line-height:1.4; }
.cs-footer {display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:7px 12px; margin-top:auto; padding-top:16px; border-top:1px solid #ffffffba; font-size:clamp(9px,2.5cqw,11px); font-weight:800; color:#387e90; letter-spacing:.35px;}
.cs-orbit {position:relative; width:100%; aspect-ratio:1.02; margin:auto 0; isolation:isolate; }
.cs-orbit-line {position:absolute; width:77%; height:80%; border:2px solid #efffff; border-radius:50%; top:10%; left:11.5%; opacity:.9; }
.cs-planet {
  position: absolute;
  width: 38%;
  left: 31%;
  top: 33%;
  filter: drop-shadow(0 8px 10px rgba(39, 141, 160, 0.22));
  animation: csPlanet 6s ease-in-out infinite;
}
.cs-planet-svg {display:block;width:100%;overflow:visible;}
.cs-domain {position:absolute; width:31%; transform:translate(-50%,-50%); z-index:2; text-align:center;}
.cs-domain--ui {left:50%;top:12%;} .cs-domain--graphic {left:16.5%;top:32%;} .cs-domain--communication {left:83.5%;top:32%;} .cs-domain--model {left:24%;top:78%;} .cs-domain--web {left:76%;top:78%;}
.cs-domain-float {display:flex;flex-direction:column;align-items:center; gap:0; animation:csFloat 5s ease-in-out infinite; transition:filter .25s; }
.cs-domain:hover {z-index:3;} .cs-domain:hover .cs-domain-float {filter:brightness(1.04) drop-shadow(0 3px 4px #258a9826);}
.cs-domain--graphic .cs-domain-float {animation-delay:-1s;} .cs-domain--communication .cs-domain-float {animation-delay:-2s;} .cs-domain--model .cs-domain-float {animation-delay:-3s;} .cs-domain--web .cs-domain-float {animation-delay:-4s;}
..cs-domain img {
  width: 72%;
  aspect-ratio: 1.05;
  object-fit: cover;
  border-radius: 35%;
  border: 1px solid #eaffff;
  display: block;

  filter: saturate(0.85) contrast(1.12) brightness(1.02);

  box-shadow:
    inset 0 1px 3px #ffffff80,
    0 4px 8px #3099a620;
;}
.cs-domain span {position:relative; margin-top:-3px; min-height:27px; max-width:100%; display:grid; place-items:center; padding:6px 9px; color:#095a78; font-size:clamp(9px,2.8cqw,13px); line-height:1.15; font-weight:800; background:linear-gradient(#f9ffff,#d4f5f5 65%,#b8e9ed); border:1px solid #f3ffff; border-radius:24px; box-shadow:0 6px 10px #27899c30; text-wrap:balance;}
.cs-spark {position:absolute; color:#fff; font-size:clamp(14px,5cqw,24px); text-shadow:0 1px 6px #2cb8ce; pointer-events:none;}
.cs-spark--a {left:22%;top:10%;} .cs-spark--b {right:22%;top:10%;} .cs-spark--c {left:9%;top:52%;} .cs-spark--d {right:9%;top:52%;} .cs-spark--e {left:48%;bottom:7%;}
@keyframes csFloat {50% {transform:translateY(-5px);}} @keyframes csPlanet {50% {transform:translateY(-4px);}}
@media(max-width:560px){.cs-showcase {padding:16px;gap:16px;min-height:0;} .cs-domain span{padding:5px 6px;} }
@media(prefers-reduced-motion:reduce){.cs-showcase *, .cs-showcase *::before, .cs-showcase *::after {animation:none!important;transition:none!important;}}
`;
