import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Portrait voxel en vraie 3D, sans image ni dépendance supplémentaire.
export default function WelcomeAvatar() {
  const hostRef = useRef(null);
  const labelRef = useRef(null);
  const wrapperRef = useRef(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const label = labelRef.current;
    const wrapper = wrapperRef.current;
    if (!host || !label || !wrapper) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-16, 16, 16, -16, .1, 150);
    camera.position.set(12, 12, 65);
    camera.lookAt(0, 3, 0);
    scene.add(new THREE.HemisphereLight(0xfff7ef, 0xb0cbd4, 1.65));
    const key = new THREE.DirectionalLight(0xffeee1, 2.0);
    key.position.set(-25, 35, 40);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe1faff, .65);
    fill.position.set(25, 8, 18);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xf5ffff, 1.0);
    rim.position.set(10, 18, -22);
    scene.add(rim);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    const bust = new THREE.Group();
    scene.add(bust);
    const head = new THREE.Group();
    bust.add(head);

    const palette = {
      skin: '#e7bda2', skinLight: '#efcbb1', skinShade: '#d8a58d',
      hair: '#38251e', hairLight: '#51372b', hairShade: '#2b1d19',
      shirt: '#69b982', shirtLight: '#9bd9a2', shirtDark: '#458c68',
      starMint: '#a6f4bd', starSky: '#95dfff',
      starLime: '#e5ffa7', starLilac: '#d8c8ff',
      starShine: '#f5ffff',
      brow: '#422d25', lash: '#36251f', white: '#fff4e5',
      iris: '#4e8d50', irisLight: '#9bc36c', pupil: '#202b20',
      lip: '#a35a56', blush: '#dcaa98', freckle: '#ba8a70',
    };
    const material = new THREE.MeshStandardMaterial({roughness: .86, metalness: 0});
    const cube = new THREE.BoxGeometry(1, 1, 1);
    const color = new THREE.Color();
    const matrix = new THREE.Matrix4();

    const cells = () => new Map();
    const put = (grid, x, y, z, shade) => grid.set(`${x},${y},${z}`, {x,y,z,shade});
    const volume = (grid, xmin, xmax, ymin, ymax, zmin, zmax, shade) => {
      for (let y=ymin;y<=ymax;y++) for(let x=xmin;x<=xmax;x++) for(let z=zmin;z<=zmax;z++) put(grid,x,y,z,shade);
    };
    const hash = (x,y,z) => { const k = Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453; return k-Math.floor(k); };
    // Uniquement les cubes visibles : rendu léger même sur ordinateur portable.
    function build(grid, parent, variation = .07) {
      const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
      const surface = [...grid.values()].filter(({x,y,z})=>dirs.some(([a,b,c])=>!grid.has(`${x+a},${y+b},${z+c}`)));
      const mesh = new THREE.InstancedMesh(cube, material, surface.length);
      surface.forEach(({x,y,z,shade},i)=>{
        matrix.makeTranslation(x,y,z);
        mesh.setMatrixAt(i,matrix);
        color.set(palette[shade] || shade).multiplyScalar(1+(hash(x,y,z)-.5)*variation);
        mesh.setColorAt(i,color);
      });
      mesh.instanceMatrix.needsUpdate=true;
      if(mesh.instanceColor) mesh.instanceColor.needsUpdate=true;
      mesh.computeBoundingSphere();
      parent.add(mesh);
    }
    // Pixels en relief pour les détails fins du visage et des barrettes.
    const detailMaterials = new Map();
    function pixel(parent, shade, x,y,z,w,h,d) {
      if(!detailMaterials.has(shade)) detailMaterials.set(shade,new THREE.MeshStandardMaterial({color:palette[shade]||shade,roughness:.8}));
      const m=new THREE.Mesh(cube,detailMaterials.get(shade));
      m.position.set(x,y,z); m.scale.set(w,h,d); parent.add(m); return m;
    }

    // Haut du buste compact, ligne d'épaules en marches, pas de jambes ni bras.
    const clothing=cells();
    for(let y=-10;y<=-3;y++) {
      const half = y<=-7 ? 9 : (y===-6?8:y===-5?7:y===-4?5:3);
      for(let x=-half;x<=half;x++) for(let z=-3;z<=3;z++) {
        if(Math.abs(x)===half && Math.abs(z)===3) continue;
        if(y>=-5 && Math.abs(x)<=2 && z>=1) continue;
        put(clothing,x,y,z,y===-10?'shirtDark':(y===-6&&Math.abs(x)>5?'shirtLight':'shirt'));
      }
    }
    build(clothing,bust,.08);
    const neck=cells();
    volume(neck,-2,2,-5,1,-2,2,'skin');
    build(neck,bust,.04);
    for(const side of [-1,1]) {
      pixel(bust,'shirtLight',side*2.6,-5.3,3.2,1,.55,.35);
      pixel(bust,'shirtLight',side*1.65,-6,3.2,1,.55,.35);
    }

    // Visage voxel plus ovale : joues douces, mâchoire affinée et menton arrondi.
    const face=cells();
    const halfWidths=[2,3,4,5,5,6,6,6,6,6,6,6,5,5,4];
    for(let y=0;y<=14;y++) {
      const half=halfWidths[y];
      const front=y===0?3:y===1?4:y>=13?4:5;
      for(let x=-half;x<=half;x++) {
        const ax=Math.abs(x);
        const edge=ax===half;
        const zMax=front-(edge?1:(ax>=5?1:0));
        const zMin=-4+(edge?1:0);
        for(let z=zMin;z<=zMax;z++) {
          // Sous le menton et sur les arêtes latérales, une marche supplémentaire.
          if(y===0 && edge && (z===zMax||z===zMin)) continue;
          put(face,x,y,z,y<=1?'skinShade':'skin');
        }
      }
    }
    for(const side of [-1,1]) volume(face,side===1?6:-6,side===1?6:-6,5,7,-1,1,'skin');
    build(face,head,.035);

    // Cheveux longs : raie centrale, sommet texturé et deux longueurs latérales.
    // Aucun bloc de cheveux devant les yeux (y=7 à 9, z=5).
    const hair=cells();
    for(let y=-7;y<=15;y++) {
      const half=y===15?5:y===14?6:7;
      for(let x=-half;x<=half;x++) for(let z=-5;z<=-2;z++) {
        if(y<10 && Math.abs(x)===half && z===-5) continue;
        put(hair,x,y,z,hash(x,0,z)>.8?'hairLight':'hair');
      }
    }
    for(const side of [-1,1]) {
      for(let y=-7;y<=14;y++) {
        const outer=y>=14?6:(y===-7?6:7);
        const inner=y>=11?4:(y>=1?6:5);
        const front=y>=10?5:(y>=2?4:3);
        for(let ax=inner;ax<=outer;ax++) for(let z=-1;z<=front;z++) {
          if(y===-7 && (ax===outer||z===front)) continue;
          put(hair,side*ax,y,z,(ax===6||hash(ax,0,z)>.91)?'hairLight':'hair');
        }
      }
      // Deux mèches plaquées vers les tempes, raie centrale visible.
      for(let ax=1;ax<=6;ax++) {
        const bottom= ax<=1?13:ax<=3?12:ax<=5?11:10;
        for(let y=bottom;y<=14;y++) put(hair,side*ax,y,5,ax%3===0?'hairLight':'hair');
      }
    }
    volume(hair,-5,5,14,15,-4,4,'hair');
    volume(hair,-4,-1,16,16,-3,3,'hair');
    volume(hair,1,4,16,16,-3,3,'hair');
    // Petites variations de hauteur façon figurine voxel, sans coiffure bouclée.
    for(const side of [-1,1]) for(let ax=2;ax<=4;ax++) for(let z=-2;z<=2;z++) {
      if(hash(ax,2,z)>.66) put(hair,side*ax,17,z,'hairLight');
    }
    build(hair,head,.085);

    // Quatre mini barrettes étoilées, deux de chaque côté, façon bijoux voxel.
    // Chaque étoile est composée de petits cubes : pas de texture ni d'image externe.
    const starPattern=[
      '0001000',
      '0001000',
      '1111111',
      '0111110',
      '0011100',
      '0110110',
      '0100010',
    ];
    function starClip(x,y,z,shade,size,angle) {
      const group=new THREE.Group();
      group.position.set(x,y,z);
      group.rotation.z=angle;
      head.add(group);
      const unit=size/7;
      // Petite attache discrète sous l'étoile, en plastique pastel.
      pixel(group,shade,0,0,-.13,size*.93,unit*.85,.28);
      starPattern.forEach((row,r)=>{
        [...row].forEach((cell,c)=>{
          if(cell==='1') pixel(group,shade,(c-3)*unit,(3-r)*unit,0,unit,unit,.36);
        });
      });
      pixel(group,'starShine',-unit,unit,.21,unit*.72,unit*.72,.09);
    }
    for(const side of [-1,1]) {
      starClip(side*5.12,12.65,5.68,side===-1?'starSky':'starMint',1.64,side*.10);
      starClip(side*5.78,10.98,5.7,side===-1?'starLime':'starLilac',1.42,-side*.16);
    }

    // Yeux verts en pixels, sourcils, nez et sourire discret.
    const eyes=[];
    for(const side of [-1,1]) {
      const eye=new THREE.Group();
      eye.position.set(side*2.85,7.6,5.53); head.add(eye); eyes.push(eye);
      pixel(eye,'white',0,0,.02,2.7,1.6,.18);
      pixel(eye,'iris',-side*.12,0,.16,1.32,1.55,.16);
      pixel(eye,'irisLight',-side*.32,-.37,.25,.68,.58,.08);
      pixel(eye,'pupil',-side*.12,.12,.27,.68,1.05,.12);
      pixel(eye,'white',-.27,.48,.36,.36,.33,.08);
      pixel(eye,'lash',0,.92,.20,2.95,.35,.25);
      pixel(eye,'lash',side*1.32,.38,.19,.34,.88,.24);
      pixel(head,'brow',side*2.9,9.55,5.58,2.55,.46,.22);
      pixel(head,'brow',side*3.94,9.34,5.59,.52,.40,.22);
      pixel(head,'blush',side*4.0,5.35,5.56,1.1,.48,.14);
    }
    pixel(head,'skinLight',0,5.7,5.78,.94,1.22,.65);
    pixel(head,'skinShade',0,5.05,5.99,1.08,.38,.43);
    // Quelques taches de rousseur délicates, réparties sur les deux joues.
    for(const side of [-1,1]) {
      pixel(head,'freckle',side*2.16,5.65,5.59,.30,.25,.13);
      pixel(head,'freckle',side*3.05,5.94,5.59,.32,.30,.13);
      pixel(head,'freckle',side*3.57,5.05,5.68,.27,.25,.13);
      pixel(head,'freckle',side*4.13,5.70,5.59,.26,.26,.13);
    }
    // Sourire légèrement plus marqué, sans changer son expression.
    pixel(head,'lip',0,3.22,5.57,1.90,.45,.16);
    for(const side of [-1,1]) pixel(head,'lip',side*1.03,3.47,5.57,.40,.40,.16);

    // Animation indépendante de la fréquence d'affichage : tête souple et regards.
    let targetX=0, targetY=0, raf=0, previous=null, start=null, blinkAt=2.8;
   const move = (e) => {
  const r = wrapper.getBoundingClientRect();

  const centerX = r.left + r.width / 2;
  const centerY = r.top + r.height / 2;

  const x = (e.clientX - centerX) / Math.max(window.innerWidth / 2, 1);
  const y = (e.clientY - centerY) / Math.max(window.innerHeight / 2, 1);

  targetY = Math.max(-1, Math.min(1, x)) * 0.54;
  targetX = Math.max(-1, Math.min(1, y)) * 0.22;
};

const leave = () => {
  targetX = 0;
  targetY = 0;
};

window.addEventListener('pointermove', move);
document.documentElement.addEventListener('pointerleave', leave);
    const resize=()=>{
      const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
      const aspect=w/h,halfH=Math.max(16,13/aspect);
      camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;
      camera.updateProjectionMatrix();renderer.setSize(w,h,false);
    };
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate=(now)=>{
      if(start===null) start=now;
      const t=(now-start)/1000,dt=previous===null?1/60:Math.min(.05,(now-previous)/1000);previous=now;
      const ease=1-Math.exp(-dt*5);
      if(!reduced.matches) {
        head.rotation.y+=(targetY+.025*Math.sin(t*.85)-head.rotation.y)*ease;
        head.rotation.x+=(targetX+.015*Math.sin(t*1.1)-head.rotation.x)*ease;
        head.rotation.z=.014*Math.sin(t*.65);
        bust.rotation.y+=(targetY*.25-bust.rotation.y)*ease;
        if(t>blinkAt+.18) blinkAt=t+3.2+Math.random()*2.4;
        const blink=t>=blinkAt?1-.94*Math.sin(Math.PI*Math.min(1,(t-blinkAt)/.18)):1;
        eyes.forEach(e=>{e.scale.y=blink;});
      } else {
        head.rotation.set(0,0,0);bust.rotation.set(0,0,0);eyes.forEach(e=>{e.scale.y=1;});
      }
      // Le titre reprend les angles déjà lissés du portrait, sans animation séparée.
      const yaw=head.rotation.y+bust.rotation.y;
      const pitch=head.rotation.x;
      label.style.transform=`perspective(450px) translate3d(${yaw*16}px,${pitch*14}px,0) rotateX(${pitch}rad) rotateY(${yaw}rad) rotateZ(${head.rotation.z}rad)`;
      renderer.render(scene,camera);raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return ()=>{
      cancelAnimationFrame(raf);observer.disconnect();
      window.removeEventListener('pointermove', move);
document.documentElement.removeEventListener('pointerleave', leave);
      scene.traverse(o=>{if(o.isInstancedMesh) o.dispose();});
      cube.dispose();material.dispose();detailMaterials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();
    };
  },[]);

  return (
    <div ref={wrapperRef} className="welcome-voxel-v5">
      <style>{`
        .welcome-voxel-v5{position:absolute;z-index:3;left:-20%;top:28%;width:185px;display:flex;flex-direction:column;align-items:center;gap:2px;}
        .welcome-voxel-v5__label{display:block;white-space:nowrap;font:900 29px/1.05 'Trebuchet MS','Segoe UI',sans-serif;letter-spacing:-.8px;color:#e4ffb2;-webkit-text-stroke:.45px #f8ffdc;text-shadow:0 1px 0 #95bb78,0 3px 0 #287c85,0 5px 9px #145c8090;transform-origin:50% 75%;will-change:transform;}
        .welcome-voxel-v5__canvas{width:100%;aspect-ratio:1 / 1;filter:drop-shadow(0 9px 8px #176b7740);}
        .intro--entering .welcome-voxel-v5{opacity:0;pointer-events:none;transition:opacity .25s;}
        @media(max-width:1150px){.welcome-voxel-v5{left:-1%;width:137px;top:24%;}}
        @media(max-width:820px){.computer-stage:has(.welcome-voxel-v5){flex-wrap:wrap;}.welcome-voxel-v5{position:relative;left:auto;top:auto;width:122px;flex-shrink:0;}.welcome-voxel-v5__label{font-size:22px;}}
      `}</style>
      <span ref={labelRef} className="welcome-voxel-v5__label">Welcome !</span>
      <div ref={hostRef} className="welcome-voxel-v5__canvas" role="img" aria-label="Portrait voxel 3D, cheveux bruns et yeux verts">
        {unavailable && <span style={{color:'white'}}>Portrait 3D indisponible</span>}
      </div>
    </div>
  );
}
