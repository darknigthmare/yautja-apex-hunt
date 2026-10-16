// Protocole de bombe d'autodestruction détachée et leurre micro-nucléaire (Lore 1:1)
// Références canoniques : Predator (1987) & AVP (2004) - Pose du gantelet explosif en piège tactique dans la ruche

import { audioSynth } from '../AudioSynthesizer.js';

export const BOMB_CONSTANTS = {
  MIN_COUNTDOWN: 10.0,
  MAX_COUNTDOWN: 30.0,
  BLAST_RADIUS: 35.0,
  BLAST_DAMAGE: 550.0,
  SAFE_RETREAT_DISTANCE: 40.0,
};

export function createSelfDestructDecoyState() {
  return {
    plantedBomb: null,
    isBombActive: false,
    bombDetonated: false,
  };
}

export function deployDetachedBomb(state, position, countdown = 15.0, audio = audioSynth) {
  if (!state || state.isBombActive) return false;

  state.isBombActive = true;
  state.bombDetonated = false;
  state.plantedBomb = {
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    countdown: Math.max(BOMB_CONSTANTS.MIN_COUNTDOWN, Math.min(BOMB_CONSTANTS.MAX_COUNTDOWN, countdown)),
    initialCountdown: countdown,
    beepInterval: 1.0,
    beepTimer: 0,
  };

  if (audio && typeof audio.playDecoyBeepFast === 'function') {
    audio.playDecoyBeepFast();
  }
  return true;
}

export function updateDetachedBomb(state, delta, entities = [], audio = audioSynth) {
  if (!state || !state.isBombActive || !state.plantedBomb) return;
  const dt = Math.max(0, Number(delta) || 0);
  const bomb = state.plantedBomb;

  bomb.countdown -= dt;
  bomb.beepTimer += dt;

  // Accélération de la fréquence de bip à l'approche de zéro
  const currentInterval = Math.max(0.12, (bomb.countdown / bomb.initialCountdown) * 0.8);
  if (bomb.beepTimer >= currentInterval) {
    bomb.beepTimer = 0;
    if (audio && typeof audio.playDecoyBeepFast === 'function') {
      audio.playDecoyBeepFast();
    }
  }

  // Détonation
  if (bomb.countdown <= 0) {
    state.isBombActive = false;
    state.bombDetonated = true;

    for (const entity of entities) {
      const dx = entity.x - bomb.x;
      const dy = (entity.y || 0) - bomb.y;
      const dz = entity.z - bomb.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= BOMB_CONSTANTS.BLAST_RADIUS) {
        const falloff = 1.0 - (dist / BOMB_CONSTANTS.BLAST_RADIUS);
        const dmg = BOMB_CONSTANTS.BLAST_DAMAGE * falloff;
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(dmg, 'micro_nuclear_detonation');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - dmg);
        }
      }
    }

    if (audio && typeof audio.playMicroNuclearBlast === 'function') {
      audio.playMicroNuclearBlast();
    }
  }
}
