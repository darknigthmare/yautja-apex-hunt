// Système de Fusées Éclairantes Pyrotechniques au Magnésium (Predator 2 / AVP 2004 — Lore 1:1)
// Référence canonique : Predator 2 & AVP (2004) — Torche au magnésium à 2200°C aveuglant la vision nocturne et calcinant les nids de résine

import { audioSynth } from '../AudioSynthesizer.js';

export const FLARE_CONSTANTS = {
  BURN_DURATION: 25.0,                 // Durée de combustion vive (s)
  LIGHT_RADIUS: 18.0,                  // Rayon d'illumination des cryptes et sous-sols (m)
  BLINDING_RADIUS: 8.0,                // Rayon d'éblouissement des optiques de nuit (m)
  IGNITE_RADIUS: 3.8,                  // Rayon d'inflammation des résines xénomorphes (m)
  FIRE_DPS: 35.0,                      // Dégâts thermiques continus aux ennemis en contact
};

export function createMagnesiumFlareState(initialAmmo = 4) {
  return {
    flaresCarried: Math.max(0, parseInt(initialAmmo, 10) || 4),
    activeFlares: [],
    resinsIgnitedCount: 0,
    blindedEntitiesCount: 0,
    humAudioTimer: 0.0,
  };
}

export function igniteMagnesiumFlare(state, originPos, throwDirAngle = 0, throwSpeed = 12.0, audio = audioSynth) {
  if (!state || state.flaresCarried <= 0) {
    return null;
  }

  state.flaresCarried--;
  const flare = {
    id: `flare_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: originPos?.x || 0,
    y: originPos?.y || 1.0,
    z: originPos?.z || 0,
    vx: Math.cos(throwDirAngle) * throwSpeed,
    vz: Math.sin(throwDirAngle) * throwSpeed,
    burnTimer: FLARE_CONSTANTS.BURN_DURATION,
    isBurntOut: false,
  };

  state.activeFlares.push(flare);

  if (audio && typeof audio.playMagnesiumFlareIgnite === 'function') {
    audio.playMagnesiumFlareIgnite();
  }

  return flare;
}

export function updateMagnesiumFlares(state, delta, entities = [], resins = [], audio = audioSynth) {
  if (!state || state.activeFlares.length === 0) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance du sifflement lumineux continu
  state.humAudioTimer += dt;
  if (state.humAudioTimer >= 3.0) {
    state.humAudioTimer = 0;
    if (audio && typeof audio.playMagnesiumFlareBurnHum === 'function') {
      audio.playMagnesiumFlareBurnHum();
    }
  }

  for (let i = state.activeFlares.length - 1; i >= 0; i--) {
    const flare = state.activeFlares[i];
    flare.burnTimer -= dt;

    // Décélération du jet
    flare.x += flare.vx * dt;
    flare.z += flare.vz * dt;
    flare.vx *= Math.pow(0.2, dt);
    flare.vz *= Math.pow(0.2, dt);

    if (flare.burnTimer <= 0) {
      flare.isBurntOut = true;
      state.activeFlares.splice(i, 1);
      continue;
    }

    // Éblouissement des entités aux alentours
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dx = ex - flare.x;
      const dz = ez - flare.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= FLARE_CONSTANTS.BLINDING_RADIUS) {
        if (ent.hasNightVisionGear || ent.species === 'human_mercenary') {
          ent.isBlinded = true;
          ent.blindDuration = 2.0;
          state.blindedEntitiesCount++;
        }
      }

      // Brûlure directe si l'entité marche sur la torche
      if (dist <= 1.2) {
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(FLARE_CONSTANTS.FIRE_DPS * dt, 'magnesium_burn');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - FLARE_CONSTANTS.FIRE_DPS * dt);
        }
        ent.isOnFire = true;
      }
    }

    // Embrasement des toiles de résine xénomorphes à proximité
    for (const res of resins) {
      if (!res || res.isBurning || res.isDestroyed) continue;
      const rx = res.x || 0;
      const rz = res.z || 0;
      const dx = rx - flare.x;
      const dz = rz - flare.z;
      if (Math.sqrt(dx * dx + dz * dz) <= FLARE_CONSTANTS.IGNITE_RADIUS) {
        res.isBurning = true;
        res.burnTimer = 4.0;
        state.resinsIgnitedCount++;
      }
    }
  }
}
