// Secteur de Niveau : Château d'Eau de Toiture et Court-Circuit du Camouflage (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Rupture du réservoir d'eau sur le toit de Los Angeles neutralisant le camouflage du City Hunter

import { audioSynth } from '../AudioSynthesizer.js';

export const WATER_TOWER_CONSTANTS = {
  TANK_MAX_HEALTH: 120.0,
  DELUGE_RANGE: 12.0,             // Portée du cône de déversement torrentiel (m)
  DELUGE_CONE_ANGLE: 1.15,         // Angle du flot d'eau d'évacuation (~65°)
  CLOAK_SHORT_CIRCUIT_TIME: 8.0,   // Durée d'inhibition électrique du camouflage optique (s)
  ROOFTOP_SLIPPERINESS: 1.8,       // Multiplicateur de glissance des tuiles mouillées
};

export function createWaterTowerSectorState() {
  return {
    tanks: [
      { id: 'rooftop_tank_north', x: 0.0, y: 15.0, z: -18.0, health: WATER_TOWER_CONSTANTS.TANK_MAX_HEALTH, isBreached: false },
      { id: 'rooftop_tank_south', x: 8.0, y: 15.0, z: 12.0,  health: WATER_TOWER_CONSTANTS.TANK_MAX_HEALTH, isBreached: false },
    ],
    activeDeluges: [],
    shortCircuitedEntities: [],
  };
}

export function damageWaterTank(state, tankId, damageAmount, forwardDirection = { x: 0, z: 1 }, audio = audioSynth) {
  if (!state) return false;
  const tank = state.tanks.find(t => t.id === tankId);
  if (!tank || tank.isBreached) return false;

  tank.health = Math.max(0, tank.health - damageAmount);

  if (tank.health <= 0) {
    tank.isBreached = true;

    const len = Math.sqrt(forwardDirection.x * forwardDirection.x + forwardDirection.z * forwardDirection.z) || 1;
    const deluge = {
      id: `deluge_${Date.now()}`,
      origin: { x: tank.x, y: 0, z: tank.z },
      dirX: forwardDirection.x / len,
      dirZ: forwardDirection.z / len,
      durationRemaining: 3.5,
    };

    state.activeDeluges.push(deluge);

    if (audio && typeof audio.playWaterDelugeGush === 'function') {
      audio.playWaterDelugeGush();
    }

    return true;
  }

  return false;
}

export function updateWaterTowerSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Écoulement du déferlement d'eau et court-circuitage des camouflages
  state.activeDeluges = state.activeDeluges.filter(deluge => {
    deluge.durationRemaining -= dt;
    if (deluge.durationRemaining <= 0) return false;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - deluge.origin.x;
      const dz = ez - deluge.origin.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= WATER_TOWER_CONSTANTS.DELUGE_RANGE) {
        // Vérification de présence dans le cône de flot
        const dot = (dx * deluge.dirX + dz * deluge.dirZ) / (dist || 1);
        if (dot > 0.35) {
          // L'eau courcircuite immédiatement les bobines de camouflage optique
          if (ent.isCloaked || ent.hasCamouflage) {
            ent.isCloaked = false;
            ent.hasCamouflage = false;
            ent.isCloakShortCircuited = true;
            ent.shortCircuitTimer = WATER_TOWER_CONSTANTS.CLOAK_SHORT_CIRCUIT_TIME;

            if (!state.shortCircuitedEntities.includes(ent.id || 'hunter')) {
              state.shortCircuitedEntities.push(ent.id || 'hunter');
            }

            if (audio && typeof audio.playCloakShortCircuitFizz === 'function') {
              audio.playCloakShortCircuitFizz();
            }
          }

          // Rinçage de la boue thermique
          if (ent.isMudCovered) {
            ent.isMudCovered = false;
            ent.mudLayerThickness = 0;
            ent.thermalSignature = 1.0;
          }

          ent.isDrenched = true;
          ent.footingStability = WATER_TOWER_CONSTANTS.ROOFTOP_SLIPPERINESS;
        }
      }
    }

    return true;
  });
}
