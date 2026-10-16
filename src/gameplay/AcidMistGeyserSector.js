// Secteur de Niveau : Geysers de Vapeur Acide et Éruptions Volatiles (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2022) — Les entrailles de la station coloniale Epsilon rongées par les émanations d'acide sulfurique

import { audioSynth } from '../AudioSynthesizer.js';

export const GEYSER_CONSTANTS = {
  ERUPTION_INTERVAL: 4.2,          // Intervalle entre les éruptions de geysers (s)
  ERUPTION_DURATION: 1.6,          // Durée du jet d'aérosol corrosif (s)
  MIST_RADIUS: 3.2,                // Périmètre de diffusion du gaz acide
  MIST_DPS: 32.0,                  // Dommages continus de brûlure
  IGNITE_EXPLOSION_DAMAGE: 88.0,   // Dégâts de déflagration si touché par plasma ou feu
  IGNITE_RADIUS: 4.5,
};

export function createAcidMistGeyserState() {
  return {
    geysers: [
      { id: 'geyser_alpha', x: -6.0, y: 0, z: -15.0, isErupting: false, cycleTimer: 1.0, isIgnited: false },
      { id: 'geyser_beta',  x: 8.0,  y: 0, z: -25.0, isErupting: false, cycleTimer: 3.0, isIgnited: false },
      { id: 'geyser_gamma', x: 0.0,  y: 0, z: -38.0, isErupting: false, cycleTimer: 0.5, isIgnited: false },
    ],
    triggeredExplosions: [],
  };
}

export function updateAcidMistGeysers(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (const g of state.geysers) {
    g.cycleTimer -= dt;

    if (!g.isErupting && g.cycleTimer <= 0) {
      g.isErupting = true;
      g.cycleTimer = GEYSER_CONSTANTS.ERUPTION_DURATION;

      if (audio && typeof audio.playAcidGeyserEruption === 'function') {
        audio.playAcidGeyserEruption();
      }
    } else if (g.isErupting && g.cycleTimer <= 0) {
      g.isErupting = false;
      g.cycleTimer = GEYSER_CONSTANTS.ERUPTION_INTERVAL;
      g.isIgnited = false;
    }

    // Effet corrosif pendant l'éruption
    if (g.isErupting) {
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        // Les Xénomorphes purs sont immunisés contre l'acide standard
        if (ent.species === 'xenomorph' || ent.role?.includes('xeno')) continue;

        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);

        const dx = ex - g.x;
        const dz = ez - g.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= GEYSER_CONSTANTS.MIST_RADIUS) {
          const dmg = GEYSER_CONSTANTS.MIST_DPS * dt;
          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(dmg, 'acid_mist_geyser');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - dmg);
          }

          if (ent.armorIntegrity !== undefined) {
            ent.armorIntegrity = Math.max(0, ent.armorIntegrity - dt * 25.0);
          }
        }
      }
    }
  }
}

export function igniteGeyserVolatiles(state, geyserId, entities = [], audio = audioSynth) {
  if (!state) return false;
  const g = state.geysers.find(item => item.id === geyserId);
  if (!g || !g.isErupting || g.isIgnited) return false;

  g.isIgnited = true;
  state.triggeredExplosions.push({ x: g.x, y: 0, z: g.z });

  // Déflagration secondaire
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const dx = ex - g.x;
    const dz = ez - g.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= GEYSER_CONSTANTS.IGNITE_RADIUS) {
      if (typeof ent.takeDamage === 'function') {
        ent.takeDamage(GEYSER_CONSTANTS.IGNITE_EXPLOSION_DAMAGE, 'volatile_acid_blast');
      } else if (typeof ent.health === 'number') {
        ent.health = Math.max(0, ent.health - GEYSER_CONSTANTS.IGNITE_EXPLOSION_DAMAGE);
      }
      ent.isKnockedProne = true;
    }
  }

  if (audio && typeof audio.playAcidGeyserEruption === 'function') {
    audio.playAcidGeyserEruption();
  }

  return true;
}
