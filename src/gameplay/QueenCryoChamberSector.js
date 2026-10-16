// Secteur de Niveau : Chambre Cryogénique de la Reine Xénomorphe (Lore 1:1)
// Référence canonique : AVP (2004 - Pyramide de l'Île Bouvet) - Cryogénisation, chaînes de contention et réveil forcé

import { audioSynth } from '../AudioSynthesizer.js';

export const CRYO_CHAMBER_CONSTANTS = {
  CHAMBER_CENTER: { x: 0, y: -25.0, z: -40.0 }, // Profondeur souterraine sous le labyrinthe
  CHAMBER_RADIUS: 22.0,
  FROST_HAZARD_RADIUS: 14.0,
  NITROGEN_DRAIN_PER_SEC: 2.2,
  CHAIN_TENSION_MAX: 100.0,
  CONTAINMENT_BREACH_THRESHOLD: 0.0,
};

export const CRYO_STAGES = {
  DEEP_FREEZE: 'DEEP_FREEZE',
  THAWING: 'THAWING',
  AWAKENING: 'AWAKENING',
  BREACHED: 'BREACHED',
};

export function createQueenCryoChamberState() {
  return {
    stage: CRYO_STAGES.DEEP_FREEZE,
    liquidNitrogenLevel: 100.0,      // Pourcentage de réserve cryogénique
    chainIntegrity: 100.0,           // Intégrité des 6 chaînes de retenue
    temperatureCelsius: -196.0,      // Température de l'azote liquide
    cryoSteamActive: false,
    muffledRoarCooldown: 8.0,
    ambientChainRattleTimer: 4.0,
    queenHealth: 4500.0,
    isQueenReleased: false,
    nitrogenInjectorsActive: true,
  };
}

export function triggerDefrostCycle(state) {
  if (!state || state.stage === CRYO_STAGES.BREACHED) return;
  state.nitrogenInjectorsActive = false;
  state.stage = CRYO_STAGES.THAWING;
}

export function restoreCryoInflow(state) {
  if (!state || state.stage === CRYO_STAGES.BREACHED) return;
  state.nitrogenInjectorsActive = true;
}

export function updateQueenCryoChamber(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Évolution thermique et azote liquide
  if (!state.nitrogenInjectorsActive) {
    state.liquidNitrogenLevel = Math.max(0, state.liquidNitrogenLevel - CRYO_CHAMBER_CONSTANTS.NITROGEN_DRAIN_PER_SEC * dt);
    state.temperatureCelsius = Math.min(22.0, state.temperatureCelsius + dt * 2.8);
    state.cryoSteamActive = true;
  } else {
    state.liquidNitrogenLevel = Math.min(100.0, state.liquidNitrogenLevel + dt * 4.0);
    state.temperatureCelsius = Math.max(-196.0, state.temperatureCelsius - dt * 5.0);
    state.cryoSteamActive = state.liquidNitrogenLevel < 80.0;
  }

  // Transitions de phase
  if (state.stage === CRYO_STAGES.THAWING) {
    if (state.temperatureCelsius > -60.0) {
      state.stage = CRYO_STAGES.AWAKENING;
    }
  }

  if (state.stage === CRYO_STAGES.AWAKENING) {
    // Les soubresauts de la Reine affaiblissent les anneaux de contention
    const strain = (state.temperatureCelsius + 60.0) * 0.15 * dt;
    state.chainIntegrity = Math.max(0, state.chainIntegrity - strain);

    state.ambientChainRattleTimer -= dt;
    if (state.ambientChainRattleTimer <= 0) {
      state.ambientChainRattleTimer = 3.5 + Math.random() * 2.5;
      if (audio && typeof audio.playChainRattleHeavy === 'function') {
        audio.playChainRattleHeavy();
      }
    }

    state.muffledRoarCooldown -= dt;
    if (state.muffledRoarCooldown <= 0) {
      state.muffledRoarCooldown = 7.0 + Math.random() * 4.0;
      if (audio && typeof audio.playQueenRoarMuffled === 'function') {
        audio.playQueenRoarMuffled();
      }
    }

    if (state.chainIntegrity <= CRYO_CHAMBER_CONSTANTS.CONTAINMENT_BREACH_THRESHOLD) {
      state.stage = CRYO_STAGES.BREACHED;
      state.isQueenReleased = true;
      if (audio && typeof audio.playQueenRoarMuffled === 'function') {
        audio.playQueenRoarMuffled();
      }
    }
  }

  // Danger cryogénique environnemental : vapeurs d'azote liquide gelant les intrus
  if (state.cryoSteamActive) {
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.x;
      const dy = ey - CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.y;
      const dz = ez - CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= CRYO_CHAMBER_CONSTANTS.FROST_HAZARD_RADIUS) {
        const frostDPS = 18.0 * dt;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(frostDPS, 'cryogenic_freeze');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - frostDPS);
        }
        ent.isChilled = true;
        ent.moveSpeedModifier = 0.55; // Ralentissement extrême par le froid
      }
    }
  }
}
