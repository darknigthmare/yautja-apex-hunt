// Système de Fouet Caudal Barbelé et Éclaboussures d'Acide Moléculaire (Lore 1:1)
// Référence canonique : AVP (2004) - L'Alien balafré (Grid / Nethead) décapitant et projetant du sang acide sous pression

import { audioSynth } from '../AudioSynthesizer.js';

export const ACID_TAIL_CONSTANTS = {
  WHIP_RANGE: 3.8,               // Allonge du fouet caudal articulé (m)
  WHIP_DAMAGE: 75.0,             // Tranchant de la pointe barbelée
  ACID_SPRAY_CONE_ANGLE: 1.05,   // Cône de projection d'acide sous pression (~60 degrés)
  ACID_SPRAY_RANGE: 5.5,         // Portée de la projection d'acide moléculaire
  ACID_POOL_DURATION: 6.0,       // Durée de corrosion de la flaque au sol (s)
  ACID_DPS: 28.0,                // Corrosion continue par seconde
  ARMOR_CORROSION_RATE: 0.35,    // Dégradation de l'armure Yautja au contact
};

export function createAcidTailWhipState() {
  return {
    isAttacking: false,
    attackCooldown: 0,
    acidPools: [],
    severedTails: [],
    totalAcidDissolvedTrophies: 0,
  };
}

export function executeTailWhipSlash(state, origin, forwardDir, entities = [], audio = audioSynth) {
  if (!state || state.attackCooldown > 0) return null;

  state.isAttacking = true;
  state.attackCooldown = 1.4;

  const len = Math.sqrt(forwardDir.x * forwardDir.x + forwardDir.z * forwardDir.z) || 1;
  const dirX = forwardDir.x / len;
  const dirZ = forwardDir.z / len;

  if (audio && typeof audio.playAcidTailSlice === 'function') {
    audio.playAcidTailSlice();
  }

  const struckTargets = [];

  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const dx = ex - origin.x;
    const dy = ey - origin.y;
    const dz = ez - origin.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= ACID_TAIL_CONSTANTS.WHIP_RANGE) {
      // Angle par rapport à la direction du coup de fouet
      const dot = (dx * dirX + dz * dirZ) / (dist || 1);
      if (dot > 0.3) {
        // Cible touchée par le tranchant caudal
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(ACID_TAIL_CONSTANTS.WHIP_DAMAGE, 'tail_blade_slash');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - ACID_TAIL_CONSTANTS.WHIP_DAMAGE);
        }

        ent.isBleeding = true;
        struckTargets.push(ent);

        // Si la cible meurt du coup de fouet, décapitation spectaculaire
        if ((ent.health <= 0 || ent.isDead) && !ent.isDecapitated) {
          ent.isDecapitated = true;
          ent.deathType = 'acid_tail_decapitation';
        }
      }
    }
  }

  // Projection sous pression de sang acide corrosif
  spawnAcidSprayCone(state, origin, dirX, dirZ, audio);

  return struckTargets;
}

export function spawnAcidSprayCone(state, origin, dirX, dirZ, audio = audioSynth) {
  if (!state) return;

  const sprayCount = 4;
  for (let i = 0; i < sprayCount; i++) {
    const angleOffset = (Math.random() - 0.5) * ACID_TAIL_CONSTANTS.ACID_SPRAY_CONE_ANGLE;
    const cos = Math.cos(angleOffset);
    const sin = Math.sin(angleOffset);
    const sprayDirX = dirX * cos - dirZ * sin;
    const sprayDirZ = dirX * sin + dirZ * cos;
    const dist = 1.5 + Math.random() * (ACID_TAIL_CONSTANTS.ACID_SPRAY_RANGE - 1.5);

    const pool = {
      id: `acid_pool_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x: origin.x + sprayDirX * dist,
      y: origin.y || 0,
      z: origin.z + sprayDirZ * dist,
      radius: 1.2 + Math.random() * 0.6,
      remainingTime: ACID_TAIL_CONSTANTS.ACID_POOL_DURATION,
    };
    state.acidPools.push(pool);
  }

  if (audio && typeof audio.playAcidEtchSizzle === 'function') {
    audio.playAcidEtchSizzle();
  }
}

export function updateAcidTailSystem(state, delta, entities = []) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.attackCooldown > 0) {
    state.attackCooldown = Math.max(0, state.attackCooldown - dt);
    if (state.attackCooldown === 0) state.isAttacking = false;
  }

  // Érosion des flaques d'acide et dégâts de zone résiduels
  state.acidPools = state.acidPools.filter(pool => {
    pool.remainingTime -= dt;
    if (pool.remainingTime <= 0) return false;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      // Les Xénomorphes sont naturellement immunisés contre leur propre sang acide
      if (ent.species === 'xenomorph' || ent.role?.includes('xeno')) continue;

      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - pool.x;
      const dz = ez - pool.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= pool.radius) {
        const damage = ACID_TAIL_CONSTANTS.ACID_DPS * dt;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(damage, 'molecular_acid_burn');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - damage);
        }

        if (ent.armorIntegrity !== undefined) {
          ent.armorIntegrity = Math.max(0, ent.armorIntegrity - ACID_TAIL_CONSTANTS.ARMOR_CORROSION_RATE * dt * 100);
        }
      }
    }

    return true;
  });
}
