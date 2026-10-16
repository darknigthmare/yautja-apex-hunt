// Système de Mine à Disruption Sonique / Ultrasons (Lore 1:1)
// Référence canonique : AVP:R (2007 - Arsenal Wolf) & Prey (2022) - Onde acoustique déstabilisatrice de membrane tympanique

import { audioSynth } from '../AudioSynthesizer.js';

export const SONIC_MINE_CONSTANTS = {
  TRIGGER_RADIUS: 3.5,            // Rayon de déclenchement du détecteur de proximité (m)
  DISRUPTION_RADIUS: 8.0,         // Rayon d'effet de l'onde de choc sonore (m)
  ACOUSTIC_DAMAGE: 30.0,          // Dommages directs de l'impulsion de surpression
  DISORIENTATION_DURATION: 4.5,   // Durée d'étourdissement pour cibles biologiques humaines/synthétiques (s)
  XENO_ANTENNA_STUN_MULT: 1.8,    // Multiplicateur de paralysie sur les Xénomorphes (récepteurs crâniens hypersensibles)
  ARMING_DELAY: 1.0,              // Délai d'armement après déploiement (s)
};

export function createSonicMineState() {
  return {
    mines: [],
    reserveCount: 4,
    tinnitusEffectActive: false,
    tinnitusTimer: 0,
  };
}

export function deploySonicMine(state, position, normal = { x: 0, y: 1, z: 0 }) {
  if (!state || state.reserveCount <= 0) return null;

  state.reserveCount -= 1;
  const mine = {
    id: `sonic_mine_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: position.x,
    y: position.y,
    z: position.z,
    normal: { x: normal.x, y: normal.y, z: normal.z },
    isArmed: false,
    armTimer: SONIC_MINE_CONSTANTS.ARMING_DELAY,
    isDetonated: false,
    shockwaveRadius: 0,
    shockwaveTimer: 0,
  };

  state.mines.push(mine);
  return mine;
}

export function updateSonicMines(state, delta, entities = [], playerPos = null, audio = audioSynth) {
  if (!state) return [];
  const dt = Math.max(0, Number(delta) || 0);
  const detonations = [];

  // Mise à jour de l'effet d'acouphène joueur
  if (state.tinnitusEffectActive) {
    state.tinnitusTimer -= dt;
    if (state.tinnitusTimer <= 0) {
      state.tinnitusEffectActive = false;
    }
  }

  for (const mine of state.mines) {
    if (mine.isDetonated) {
      if (mine.shockwaveTimer > 0) {
        mine.shockwaveTimer -= dt;
        mine.shockwaveRadius += dt * 25.0;
      }
      continue;
    }

    // Armement progressif
    if (!mine.isArmed) {
      mine.armTimer -= dt;
      if (mine.armTimer <= 0) {
        mine.isArmed = true;
      }
      continue;
    }

    // Détection de proximité des entités vivantes
    let shouldTrigger = false;
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = mine.x - ex;
      const dy = mine.y - ey;
      const dz = mine.z - ez;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= SONIC_MINE_CONSTANTS.TRIGGER_RADIUS) {
        shouldTrigger = true;
        break;
      }
    }

    if (shouldTrigger) {
      mine.isDetonated = true;
      mine.shockwaveTimer = 0.5;
      mine.shockwaveRadius = 0.1;
      detonations.push({ x: mine.x, y: mine.y, z: mine.z });

      if (audio && typeof audio.playSonicMinePulse === 'function') {
        audio.playSonicMinePulse();
      }

      // Application des effets de choc acoustique dans la sphère
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);

        const dx = mine.x - ex;
        const dy = mine.y - ey;
        const dz = mine.z - ez;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist <= SONIC_MINE_CONSTANTS.DISRUPTION_RADIUS) {
          const falloff = 1 - (dist / SONIC_MINE_CONSTANTS.DISRUPTION_RADIUS);
          const isXeno = ent.species === 'xenomorph' || ent.role?.includes('xeno') || ent.type?.includes('xeno');
          const stunDuration = SONIC_MINE_CONSTANTS.DISORIENTATION_DURATION * (isXeno ? SONIC_MINE_CONSTANTS.XENO_ANTENNA_STUN_MULT : 1.0);

          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(SONIC_MINE_CONSTANTS.ACOUSTIC_DAMAGE * falloff, 'sonic_disruption');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - SONIC_MINE_CONSTANTS.ACOUSTIC_DAMAGE * falloff);
          }

          ent.isStunned = true;
          ent.stunTimer = Math.max(ent.stunTimer || 0, stunDuration);
          ent.disorientationLevel = (ent.disorientationLevel || 0) + 1.0 * falloff;
        }
      }

      // Si le joueur est à proximité, déclencher le sifflement d'acouphène
      if (playerPos) {
        const pdx = mine.x - playerPos.x;
        const pdy = mine.y - playerPos.y;
        const pdz = mine.z - playerPos.z;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy + pdz * pdz);
        if (pdist <= SONIC_MINE_CONSTANTS.DISRUPTION_RADIUS) {
          state.tinnitusEffectActive = true;
          state.tinnitusTimer = 3.5;
          if (audio && typeof audio.playTinnitusRinging === 'function') {
            audio.playTinnitusRinging();
          }
        }
      }
    }
  }

  // Nettoyage des mines consommées
  state.mines = state.mines.filter(m => !m.isDetonated || m.shockwaveTimer > 0);
  return detonations;
}
