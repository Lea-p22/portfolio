/**
 * Frutiger Aero — ambiance originale, optimisée pour être audible sur PC portable.
 * Aucun son externe nécessaire. Les sons démarrent après le premier clic.
 * Remplace uniquement src/audio/aeroSound.js par ce fichier.
 */

// Ces deux valeurs peuvent être ajustées facilement (0 = muet, 1 = maximum conseillé).
const VOLUME_MUSIQUE = 0.78;
const VOLUME_CLIC = 0.90;

const melody = [
  523.25, null, 659.25, 783.99, null, 659.25, 587.33, null,
  523.25, null, 440, 523.25, 659.25, null, null, null,
  440, null, 523.25, 659.25, null, 783.99, 659.25, null,
  587.33, null, 523.25, 440, 392, null, 523.25, null,
];
const chords = [
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 261.63, 329.63, 440.0],
  [196.0, 293.66, 392.0, 493.88],
];

let ctx;
let master;
let compressor;
let interval;
let nextBeat = 0;
let stepIndex = 0;
let running = false;
let customTrack = null;
let customMusicFile = '';
let customVolume = 0.35;
const beatDuration = 0.46;

function setup() {
  if (ctx) return true;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  ctx = new AudioContextClass();

  master = ctx.createGain();
  master.gain.value = 0;

  // Les fréquences moyennes et les harmoniques passent mieux sur les petits HP de PC.
  const clarity = ctx.createBiquadFilter();
  clarity.type = 'peaking';
  clarity.frequency.value = 1500;
  clarity.Q.value = 0.85;
  clarity.gain.value = 2.5;

  const smooth = ctx.createBiquadFilter();
  smooth.type = 'lowpass';
  smooth.frequency.value = 4900;

  // Limite les pics lors de la superposition du clic et de la musique.
  compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 12;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.19;

  master.connect(clarity);
  clarity.connect(smooth);
  smooth.connect(compressor);
  compressor.connect(ctx.destination);
  return true;
}

function tone(frequency, time, duration, gain, type = 'sine', destination = master) {
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), time + Math.min(0.06, duration / 4));
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  oscillator.connect(envelope);
  envelope.connect(destination);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.02);
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
  };
}

function schedulePad(time, chordIndex) {
  const chord = chords[chordIndex % chords.length];
  chord.forEach((note, index) => {
    // Fond doux + harmonique plus claire (nettement plus audible sur portable).
    tone(note / 2, time, 7.2, 0.032, 'sine');
    tone(note, time + 0.02, 5.9, 0.016, 'triangle');
    if (index === 0) tone(note / 4, time, 6.2, 0.010, 'sine');
  });
}

function scheduleBeat(time, beat) {
  if (beat % 16 === 0) schedulePad(time, Math.floor(beat / 16));
  const note = melody[beat % melody.length];
  if (note) {
    tone(note, time, beat % 4 === 0 ? 1.12 : 0.72, 0.13, 'sine');
    tone(note * 2, time + 0.008, 0.29, 0.025, 'triangle');
  }
  if (beat % 11 === 4) tone(1046.5, time + 0.13, 1.2, 0.027, 'sine');
}

function tick() {
  if (!ctx || !running) return;
  // Évite de rattraper trop de notes après mise en veille d'un onglet.
  if (nextBeat < ctx.currentTime - 1) nextBeat = ctx.currentTime + 0.08;
  while (nextBeat < ctx.currentTime + 0.36) {
    scheduleBeat(nextBeat, stepIndex);
    nextBeat += beatDuration;
    stepIndex += 1;
  }
}

export function playEntranceSound() {
  if (!setup()) return;
  ctx.resume().catch(() => {});
  const now = ctx.currentTime + 0.015;
  const clickGain = ctx.createGain();
  clickGain.gain.value = VOLUME_CLIC;
  clickGain.connect(compressor);
  // Son d'ouverture plus plein, mais toujours léger et brillant.
  tone(520, now, 0.09, 0.24, 'triangle', clickGain);
  tone(750, now + 0.015, 0.12, 0.30, 'triangle', clickGain);
  tone(1180, now + 0.075, 0.39, 0.23, 'sine', clickGain);
  tone(1567.98, now + 0.17, 0.74, 0.15, 'sine', clickGain);
  window.setTimeout(() => clickGain.disconnect(), 1500);
}

export function configureSound({ musicFile = '', volume = 0.35 } = {}) {
  customVolume = Math.max(0, Math.min(1, Number(volume) || 0));
  if (musicFile !== customMusicFile) {
    if (customTrack) { customTrack.pause(); customTrack = null; }
    customMusicFile = musicFile;
    if (musicFile) {
      customTrack = new Audio(musicFile);
      customTrack.loop = true;
      customTrack.preload = 'auto';
    }
  }
  if (customTrack) customTrack.volume = customVolume;
}

export function startAmbience() {
  if (customTrack) {
    customTrack.volume = customVolume;
    customTrack.play().catch(() => {});
    return;
  }
  if (!setup()) return;
  ctx.resume().catch(() => {});
  if (running) return;
  running = true;
  nextBeat = ctx.currentTime + 0.22;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(VOLUME_MUSIQUE, ctx.currentTime, 0.4);
  tick();
  interval = window.setInterval(tick, 120);
}

export function stopAmbience() {
  if (customTrack) customTrack.pause();
  running = false;
  if (interval) window.clearInterval(interval);
  interval = undefined;
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.00001, ctx.currentTime, 0.15);
  }
}

export function ambienceIsAvailable() {
  return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);
}

/* SON DE CLIC SUR LES BOUTONS ET PROJETS */

export function playInterfaceClick() {
  if (!setup()) return;

  ctx.resume().catch(() => {});

  const now = ctx.currentTime + 0.01;

  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.98;
  clickGain.connect(ctx.destination);

  tone(780, now, 0.055, 0.23, 'triangle', clickGain);
  tone(1175, now + 0.045, 0.12, 0.12, 'sine', clickGain);

  setTimeout(() => {
    clickGain.disconnect();
  }, 400);
}

