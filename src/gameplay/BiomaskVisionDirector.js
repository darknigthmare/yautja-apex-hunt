// Directeur multispectral des modes visuels du Biomasque Yautja (Lore 1:1)
// Références canoniques : Predator (1987) (thermique), Predator 2 (1990) (tech EM), AVP (2004) (neuro-xéno)

import { audioSynth } from '../AudioSynthesizer.js';

export const BIOMASK_VISION_MODES = Object.freeze([
  Object.freeze({
    id: 'normal',
    label: 'VISION NATURELLE',
    sourceTier: 'SCREEN',
    paletteRamp: 'optical',
    optimalTargets: Object.freeze(['all']),
    description: 'Spectre visible standard sans amplification opto-électronique.',
  }),
  Object.freeze({
    id: 'thermal',
    label: 'VISION THERMIQUE INFRAROUGE',
    sourceTier: 'SCREEN',
    paletteRamp: 'rainbow_infrared',
    optimalTargets: Object.freeze(['human', 'endotherm', 'hellhound', 'wildlife']),
    description: 'Cartographie des gradients de chaleur corporelle ; révèle les proies à sang chaud à travers la canopée.',
  }),
  Object.freeze({
    id: 'tech',
    label: 'VISION ÉLECTROMAGNÉTIQUE (TECH)',
    sourceTier: 'SCREEN',
    paletteRamp: 'emerald_wireframe',
    optimalTargets: Object.freeze(['synthetic', 'armed_soldier', 'radio_relay', 'mine']),
    description: 'Détection des impulsions électriques, batteries d’armes, balises radio et androïdes Weyland-Yutani.',
  }),
  Object.freeze({
    id: 'neuro_alien',
    label: 'VISION NEURO-XÉNOMORPHE (AVP)',
    sourceTier: 'AVP_SCREEN',
    paletteRamp: 'crimson_ultraviolet',
    optimalTargets: Object.freeze(['xenomorph', 'facehugger', 'predalien', 'hive']),
    description: 'Spectre ultraviolet révélant la bio-luminescence des carapaces d’organismes à sang acide.',
  }),
]);

export function createBiomaskVisionState() {
  return {
    currentModeIndex: 1, // Thermal par défaut
    activeMode: BIOMASK_VISION_MODES[1],
    distortionEffect: 0,
    lockedTargetSignature: null,
  };
}

export function cycleBiomaskVision(state, audio = audioSynth) {
  if (!state) return BIOMASK_VISION_MODES[0];
  state.currentModeIndex = (state.currentModeIndex + 1) % BIOMASK_VISION_MODES.length;
  state.activeMode = BIOMASK_VISION_MODES[state.currentModeIndex];

  if (audio) {
    if (state.activeMode.id === 'neuro_alien' && typeof audio.playNeuroVisionSwitch === 'function') {
      audio.playNeuroVisionSwitch();
    } else if (state.activeMode.id === 'tech' && typeof audio.playTechVisionHum === 'function') {
      audio.playTechVisionHum();
    } else if (typeof audio.playThermalSwitch === 'function') {
      audio.playThermalSwitch();
    }
  }

  return state.activeMode;
}

export function getPreyVisibilityRating(visionModeId, enemyType = '') {
  const mode = visionModeId ?? 'thermal';
  const type = String(enemyType).toLowerCase();

  const isXeno = type.includes('xeno') || type.includes('alien') || type.includes('facehugger') || type.includes('predalien');
  const isSynth = type.includes('synth') || type.includes('android') || type.includes('cyborg');
  const isHuman = type.includes('jungle') || type.includes('commando') || type.includes('soldier') || type.includes('owlf') || type.includes('stargazer') || type.includes('human');

  if (mode === 'neuro_alien') {
    if (isXeno) return 1.0;   // Contraste maximal fluo rougeoyant
    if (isHuman) return 0.35; // Corps tiède secondaire
    return 0.2;
  }

  if (mode === 'tech') {
    if (isSynth) return 1.0;   // Émetteurs et câbles surlignés
    if (isHuman) return 0.85;  // Armes à feu et radios détectées
    if (isXeno) return 0.15;   // Xénomorphes purement organiques presque invisibles
    return 0.4;
  }

  if (mode === 'thermal') {
    if (isHuman) return 1.0;   // Chaleur métabolique éclatante
    if (isXeno) return 0.28;   // Ectothermes à sang acide froid masqués dans la nuit
    if (isSynth) return 0.45;  // Légère dissipation thermique interne
    return 0.6;
  }

  return 0.7; // Normal
}
