import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * VRAI mini-ordinateur 3D : tous les volumes sont construits en Three.js.
 * Compatible avec l'ancien <PixelComputer /> placé dans le bouton d'entrée.
 * Installer d'abord : npm.cmd install three
 */
export default function PixelComputer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const holder = containerRef.current;
    if (!holder) return;

    const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 80);
    camera.position.set(4.3, 3.35, 8.95);
    camera.lookAt(0, 1.72, 0.35);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none;';
    holder.appendChild(renderer.domElement);

    const metal = (color, roughness = 0.45, metalness = 0.03) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const ivory = metal('#eae8dc', 0.52);
    const cream = metal('#fffdf0', 0.4);
    const shadedIvory = metal('#b6c3b9', 0.55);
    const shadowIvory = metal('#a6b6ae', 0.65);
    const darkTrim = metal('#365b67', 0.42);
    const blueTrim = metal('#8aaeb6', 0.32, 0.11);
    const mint = metal('#51dda1', 0.25, 0.13);
    const ledMaterial = new THREE.MeshStandardMaterial({ color: '#7effb8', emissive: '#40ec96', emissiveIntensity: 1.3 });

    // Ensemble du PC : légèrement animé, pour un rendu « mini-maquette 3D ».
    const pc = new THREE.Group();
    scene.add(pc);

    const rounded = (parent, w, h, d, radius, material, x, y, z) => {
      const obj = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, radius), material);
      obj.position.set(x, y, z);
      obj.castShadow = true;
      obj.receiveShadow = true;
      parent.add(obj);
      return obj;
    };

    const box = (parent, w, h, d, material, x, y, z) => {
      const obj = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      obj.position.set(x, y, z);
      obj.castShadow = true;
      obj.receiveShadow = true;
      parent.add(obj);
      return obj;
    };

    // --- ÉCRAN CATHODIQUE : arrière profond, coque épaisse, façade bombée ---
    rounded(pc, 3.22, 2.83, 1.14, 0.28, shadowIvory, 0, 2.43, -1.11);
    rounded(pc, 3.75, 3.18, 1.74, 0.23, ivory, 0, 2.43, -0.12);
    rounded(pc, 3.66, 3.09, 0.15, 0.17, cream, 0, 2.43, 0.79);

    // Arête de moulage sur le côté droit (visible grâce à la vraie perspective).
    box(pc, 0.045, 2.80, 1.13, shadedIvory, 1.85, 2.42, -0.27);

    // Grilles de ventilation moulées sur la tranche du boîtier.
    for (let i = 0; i < 9; i++) {
      box(pc, 0.018, 0.046, 0.62, darkTrim, 1.889, 2.80 - i * 0.115, -0.27);
    }

    // Contour profond de l'écran : plusieurs cadres à différentes profondeurs.
    rounded(pc, 3.30, 2.31, 0.16, 0.095, blueTrim, 0, 2.70, 0.91);
    rounded(pc, 3.12, 2.13, 0.09, 0.04, darkTrim, 0, 2.70, 1.012);

    // Texture dessinée sur un petit canvas, façon Windows / Frutiger Aero.
    // La texture n'est PAS une image plaquée du PC : seulement l'interface dans son écran 3D.
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 350;
    const ctx = screenCanvas.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, 350);
    sky.addColorStop(0, '#84d1ff');
    sky.addColorStop(0.7, '#49a9e8');
    sky.addColorStop(1, '#a0edba');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 350);
    ctx.fillStyle = '#94e773';
    ctx.beginPath();
    ctx.moveTo(0, 274);
    ctx.bezierCurveTo(120, 205, 200, 230, 315, 255);
    ctx.bezierCurveTo(415, 276, 456, 208, 512, 216);
    ctx.lineTo(512, 350);
    ctx.lineTo(0, 350);
    ctx.fill();
    ctx.fillStyle = '#40c77e';
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.bezierCurveTo(120, 260, 225, 327, 330, 290);
    ctx.bezierCurveTo(407, 264, 468, 290, 512, 277);
    ctx.lineTo(512, 350);
    ctx.lineTo(0, 350);
    ctx.fill();
    ctx.strokeStyle = '#bbf4a5';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 324);
    ctx.bezierCurveTo(130, 289, 330, 308, 512, 330);
    ctx.stroke();

    // Fenêtre du système, panneau bleu glossy, petites icônes.
    const panel = ctx.createLinearGradient(0, 55, 0, 233);
    panel.addColorStop(0, 'rgba(239,255,255,.96)');
    panel.addColorStop(1, 'rgba(190,246,247,.86)');
    ctx.fillStyle = panel;
    ctx.beginPath();
    ctx.roundRect(47, 54, 400, 195, 15);
    ctx.fill();
    const titleBar = ctx.createLinearGradient(0, 54, 0, 94);
    titleBar.addColorStop(0, '#a3eeff');
    titleBar.addColorStop(0.46, '#45b5ec');
    titleBar.addColorStop(0.5, '#128ac9');
    titleBar.addColorStop(1, '#0a8ac6');
    ctx.fillStyle = titleBar;
    ctx.beginPath();
    ctx.roundRect(47, 54, 400, 40, [15, 15, 0, 0]);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.font = 'bold 19px Segoe UI, Arial';
    ctx.fillText('welcome.exe', 66, 80);
    ctx.font = 'bold 25px Arial';
    ctx.fillText('×', 410, 82);
    ctx.fillStyle = '#57c7ef';
    ctx.beginPath();
    ctx.roundRect(72, 113, 78, 95, 13);
    ctx.fill();
    ctx.strokeStyle = '#e9ffff';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(83, 184);
    ctx.bezierCurveTo(99, 136, 122, 136, 139, 186);
    ctx.stroke();
    ctx.fillStyle = '#3a8eac';
    ctx.beginPath();
    ctx.roundRect(170, 120, 228, 19, 9);
    ctx.fill();
    ctx.fillStyle = '#78c1cd';
    ctx.beginPath();
    ctx.roundRect(170, 154, 171, 12, 6);
    ctx.fill();
    ctx.fillStyle = '#a6dbd6';
    ctx.beginPath();
    ctx.roundRect(170, 178, 204, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#38ca91';
    ctx.beginPath();
    ctx.roundRect(170, 208, 126, 27, 14);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Trebuchet MS, Arial';
    ctx.fillText('ENTER  ↗', 194, 227);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 1.99), screenMat);
    screen.position.set(0, 2.70, 1.075);
    pc.add(screen);

    // Verre / reflet discret devant l'écran.
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.96, 1.99),
      new THREE.MeshPhysicalMaterial({ color: '#b1efff', transparent: true, opacity: 0.09, roughness: 0.09, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.03, depthWrite: false })
    );
    glass.position.set(0, 2.70, 1.079);
    pc.add(glass);

    // Façade basse, lecteur CD et voyant lumineux.
    rounded(pc, 3.51, 0.45, 0.10, 0.035, cream, 0, 1.30, 0.88);
    rounded(pc, 1.24, 0.038, 0.013, 0.008, shadedIvory, -0.62, 1.37, 0.942);
    rounded(pc, 0.80, 0.035, 0.013, 0.008, shadedIvory, -0.84, 1.25, 0.942);
    rounded(pc, 0.38, 0.15, 0.025, 0.025, mint, 1.21, 1.31, 0.95);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.056, 16, 12), ledMaterial);
    light.position.set(1.52, 1.31, 0.94);
    pc.add(light);

    // Pied + socle, tous deux modélisés en volume.
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.46, 0.65, 8), ivory);
    neck.position.set(0, 0.60, -0.1);
    neck.castShadow = true;
    pc.add(neck);
    rounded(pc, 1.73, 0.20, 1.18, 0.09, ivory, 0, 0.23, -0.06);

    // --- CLAVIER : véritable coque 3D + 61 touches en relief ---
    const keyboard = new THREE.Group();
    keyboard.position.set(0, 0.10, 2.32);
    keyboard.rotation.x = 0.105;
    pc.add(keyboard);
    rounded(keyboard, 4.55, 0.26, 1.48, 0.13, ivory, 0, 0, 0);
    rounded(keyboard, 4.33, 0.045, 1.22, 0.08, shadedIvory, 0, 0.142, -0.03);
    const keyIvory = metal('#f8f8ef', 0.55);
    const keyGray = metal('#d8e2db', 0.60);
    const rowCount = [14, 14, 13, 13, 11];
    for (let row = 0; row < rowCount.length; row++) {
      const count = rowCount[row];
      const pitch = 0.29;
      const offset = -((count - 1) * pitch) / 2;
      const z = -0.46 + row * 0.22;
      for (let col = 0; col < count; col++) {
        // Grande barre d'espace, les autres touches restent bien dans le clavier.
        if (row === 4 && col > 3 && col < 7) continue;
        const isSpace = row === 4 && col === 3;
        rounded(
          keyboard,
          isSpace ? 1.10 : 0.242,
          0.090,
          0.158,
          0.023,
          (row === 0 || col === 0) ? keyGray : keyIvory,
          offset + col * pitch + (isSpace ? 0.435 : 0),
          0.218,
          z
        );
      }
    }

    // --- SOURIS : coque ovoïde modélisée et son câble ---
    const mouseBody = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), ivory);
    mouseBody.scale.set(0.32, 0.18, 0.46);
    mouseBody.position.set(2.9, 0.18, 2.4);
    mouseBody.castShadow = true;
    pc.add(mouseBody);
    rounded(pc, 0.048, 0.016, 0.18, 0.008, shadowIvory, 2.9, 0.353, 2.16);
    const cablePoints = [
      new THREE.Vector3(2.9, 0.13, 1.96),
      new THREE.Vector3(3.08, 0.12, 1.58),
      new THREE.Vector3(2.85, 0.10, 1.18),
      new THREE.Vector3(2.38, 0.11, 0.85),
    ];
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePoints), 28, 0.018, 7, false),
      metal('#929cbd', 0.77)
    );
    cable.castShadow = true;
    pc.add(cable);

    // Lumières de studio, matériaux et ombre au sol.
    scene.add(new THREE.HemisphereLight('#effbff', '#67a19a', 2.55));
    const keyLight = new THREE.DirectionalLight('#fff8e9', 4.1);
    keyLight.position.set(-4, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.normalBias = 0.025;
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight('#79e6ff', 2.0);
    rimLight.position.set(4, 3, -5);
    scene.add(rimLight);
    const shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ color: '#174d5f', opacity: 0.21 })
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.032;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Très léger mouvement au survol (sans bloquer le clic React parent).
    let mouseTarget = 0;
    const move = (event) => {
      const bounds = holder.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      mouseTarget = (x - 0.5) * 0.14;
    };
    const leave = () => { mouseTarget = 0; };
    holder.addEventListener('pointermove', move);
    holder.addEventListener('pointerleave', leave);

    const resize = () => {
      const width = Math.max(1, holder.clientWidth);
      const height = Math.max(1, holder.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(holder);
    window.addEventListener('resize', resize);
    resize();

    let frame;
    const start = performance.now();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const animate = (now) => {
      const t = (now - start) / 1000;
      pc.rotation.y += (mouseTarget - pc.rotation.y) * 0.035;
      if (!reducedMotion) pc.position.y = Math.sin(t * 0.65) * 0.024;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
      holder.removeEventListener('pointermove', move);
      holder.removeEventListener('pointerleave', leave);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) {
          for (const mat of (Array.isArray(object.material) ? object.material : [object.material])) mat.dispose();
        }
      });
      screenTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pixel-computer pixel-computer--3d"
      style={{ width: '100%', aspectRatio: '820 / 650', position: 'relative', pointerEvents: 'auto' }}
      aria-hidden="true"
    />
  );
}
