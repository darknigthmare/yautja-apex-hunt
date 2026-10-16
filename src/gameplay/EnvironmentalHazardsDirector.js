// Gestionnaire des dangers environnementaux : Flaques d'acide moléculaire et évents de vapeur (Lore 1:1)
// Références canoniques : AVP (2004), AVP:R (2007) - Sang acide xénomorphe & solvant bleu Yautja ; Predator 2 (1990) - Conduits de vapeur

import { audioSynth } from '../AudioSynthesizer.js';

export const HAZARD_CONSTANTS = {
  ACID_CORROSION_DPS: 45.0,        // Dégâts par seconde infligés par l'acide xénomorphe
  ACID_DEFAULT_LIFETIME: 25.0,     // Durée de corrosion active avant dissipation
  ACID_SPLASH_RADIUS: 2.2,         // Rayon de projection
  STEAM_BURST_INTERVAL: 4.5,       // Période d'éjection des jets de vapeur
  STEAM_BLINDING_FACTOR: 0.9,      // Perturbation du spectre thermique infrarouge
};

export function createEnvironmentalHazardsState() {
  return {
    acidPools: [],
    steamVents: [],
    activeThermalDistortions: 0,
  };
}

export function spawnAcidPool(state, position, options = {}, audio = audioSynth) {
  if (!state || !position) return null;
  const pool = {
    id: `acid_pool_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    radius: Number(options.radius) || HAZARD_CONSTANTS.ACID_SPLASH_RADIUS,
    remainingLifetime: Number(options.lifetime) || HAZARD_CONSTANTS.ACID_DEFAULT_LIFETIME,
    isNeutralized: false,
    corrosionPower: Number(options.corrosionPower) || HAZARD_CONSTANTS.ACID_CORROSION_DPS,
  };

  state.acidPools.push(pool);

  if (audio && typeof audio.playAcidPoolBubble === 'function') {
    audio.playAcidPoolBubble();
  }
  return pool;
}

export function neutralizeAcidPool(state, poolId, audio = audioSynth) {
  if (!state || !state.acidPools) return false;
  const pool = state.acidPools.find(p => p.id === poolId);
  if (!pool || pool.isNeutralized) return false;

  pool.isNeutralized = true;
  pool.remainingLifetime = 0;

  if (audio && typeof audio.playAcidPoolBubble === 'function') {
    audio.playAcidPoolBubble();
  }
  return true;
}

export function addSteamVent(state, vent) {
  if (!state || !vent) return null;
  const steamVent = {
    id: vent.id || `steam_vent_${state.steamVents.length + 1}`,
    x: Number(vent.x) || 0,
    y: Number(vent.y) || 0,
    z: Number(vent.z) || 0,
    radius: Number(vent.radius) || 3.0,
    cycleTimer: 0,
    burstInterval: Number(vent.burstInterval) || HAZARD_CONSTANTS.STEAM_BURST_INTERVAL,
    isErupting: false,
    eruptDuration: 1.8,
  };
  state.steamVents.push(steamVent);
  return steamVent;
}

export function updateEnvironmentalHazards(state, delta, entity, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // 1. Mise à jour des flaques d'acide
  state.acidPools = state.acidPools.filter(pool => {
    if (pool.isNeutralized) return false;
    pool.remainingLifetime -= dt;

    if (pool.remainingLifetime > 0 && entity) {
      const dx = entity.x - pool.x;
      const dz = entity.z - pool.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= pool.radius) {
        const damage = pool.corrosionPower * dt;
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(damage, 'molecular_acid');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - damage);
        }
      }
    }
    return pool.remainingLifetime > 0;
  });

  // 2. Mise à jour des évents de vapeur
  let thermalObscurity = 0;
  for (const vent of state.steamVents) {
    vent.cycleTimer += dt;
    if (vent.cycleTimer >= vent.burstInterval) {
      vent.isErupting = true;
      if (vent.cycleTimer >= vent.burstInterval + vent.eruptDuration) {
        vent.cycleTimer = 0;
        vent.isErupting = false;
      }
    }

    if (vent.isErupting && entity) {
      const dx = entity.x - vent.x;
      const dy = (entity.y || 0) - vent.y;
      const dz = entity.z - vent.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist <= vent.radius) {
        thermalObscurity = Math.max(thermalObscurity, HAZARD_CONSTANTS.STEAM_BLINDING_FACTOR);
        if (audio && typeof audio.playSteamVentHiss === 'function') {
          audio.playSteamVentHiss();
        }
      }
    }
  }

  state.activeThermalDistortions = thermalObscurity;
}
