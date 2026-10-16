// Système de constriction mécanique et cisaillement du Lance-filet Yautja (Lore 1:1)
// Références canoniques : Predator 2 (1990) (scène de la ruelle et de l'abattoir) et AVP (2004)

import { audioSynth } from '../AudioSynthesizer.js';

export const NET_CONSTRICTION_STAGES = Object.freeze({
  LATCHED: 'latched',           // Filet déployé et ancré aux extrémités
  CONSTRICTING: 'constricting', // Micro-treuils tirant les câbles, début d'incision
  DEEP_SLICING: 'deep_slicing', // Câbles de titane s'enfonçant dans les chairs et armures
  CRUSH_TERMINAL: 'crush_terminal', // Pression maximale écrasant la boîte thoracique
  SEVERED: 'severed',           // Filet tranché ou dissous par l'acide
});

export function createNetCapture(target, options = {}) {
  return {
    target,
    stage: NET_CONSTRICTION_STAGES.LATCHED,
    elapsedDuration: 0,
    totalDamageDealt: 0,
    isAnchoredToWall: Boolean(options.isAnchoredToWall),
    anchorCount: Number(options.anchorCount) || 8,
    soundCooldown: 0,
    maxDuration: Number(options.maxDuration) || 8.0,
  };
}

export function updateNetConstriction(capture, delta, audio = audioSynth) {
  if (!capture || capture.stage === NET_CONSTRICTION_STAGES.SEVERED) {
    return { damageThisFrame: 0, stage: capture?.stage ?? NET_CONSTRICTION_STAGES.SEVERED };
  }

  const dt = Math.max(0, Number(delta) || 0);
  capture.elapsedDuration += dt;
  capture.soundCooldown = Math.max(0, capture.soundCooldown - dt);

  let dps = 0;
  if (capture.elapsedDuration < 1.2) {
    capture.stage = NET_CONSTRICTION_STAGES.LATCHED;
    dps = 8;
  } else if (capture.elapsedDuration < 3.8) {
    capture.stage = NET_CONSTRICTION_STAGES.CONSTRICTING;
    dps = 22;
  } else if (capture.elapsedDuration < 6.5) {
    capture.stage = NET_CONSTRICTION_STAGES.DEEP_SLICING;
    dps = 42;
  } else {
    capture.stage = NET_CONSTRICTION_STAGES.CRUSH_TERMINAL;
    dps = 65;
  }

  const damageThisFrame = dps * dt;
  capture.totalDamageDealt += damageThisFrame;

  if (capture.target) {
    if (typeof capture.target.takeDamage === 'function') {
      capture.target.takeDamage(damageThisFrame);
    } else if (typeof capture.target.health === 'number') {
      capture.target.health = Math.max(0, capture.target.health - damageThisFrame);
      if (capture.target.health <= 0) capture.target.isDead = true;
    }
  }

  if (capture.soundCooldown <= 0 && (capture.stage === NET_CONSTRICTION_STAGES.CONSTRICTING || capture.stage === NET_CONSTRICTION_STAGES.DEEP_SLICING)) {
    if (audio && typeof audio.playNetConstrictSqueak === 'function') {
      audio.playNetConstrictSqueak();
      capture.soundCooldown = 1.6;
    }
  }

  return {
    damageThisFrame,
    stage: capture.stage,
    totalDamage: capture.totalDamageDealt,
    isRestrained: true,
  };
}

export function attemptSeverNet(capture, cuttingSource) {
  if (!capture) return false;

  // L'acide xénomorphe dissout instantanément le maillage de titane (comme dans AVP)
  if (cuttingSource === 'xeno_acid' || cuttingSource === 'acid_blood') {
    capture.stage = NET_CONSTRICTION_STAGES.SEVERED;
    return true;
  }

  // Les lames Yautja à haute fréquence ou épée d'Ancien coupent le maillage
  if (cuttingSource === 'wristblades' || cuttingSource === 'father_sword' || cuttingSource === 'smart_disc') {
    capture.stage = NET_CONSTRICTION_STAGES.SEVERED;
    return true;
  }

  // Un couteau humain standard ou des mains nues échouent face aux filaments renforcés
  return false;
}
