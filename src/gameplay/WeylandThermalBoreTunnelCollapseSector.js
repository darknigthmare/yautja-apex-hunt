// Tunnel de la Foreuse Thermique Weyland & Effondrement de Voûte Glaciaire (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Le puits incliné à 30 degrés creusé à travers 600 mètres de glace antarctique jusqu'à la pyramide, dont la voûte gelée peut être fracturée pour ensevelir une meute d'Aliens.

import { audioSynth } from '../AudioSynthesizer.js';

export const BORE_TUNNEL_CONSTANTS = {
  AVALANCHE_CRUSH_DAMAGE: 260,       // Dégâts d'ensevelissement sous les blocs de glace
  TUNNEL_COLLAPSE_RADIUS_M: 9.0,     // Longueur de la section de tunnel ensevelie
};

export function createThermalBoreTunnelState() {
  return {
    isVaultIntact: true,
    buriedHostilesCount: 0,
  };
}

export function triggerIceTunnelVaultCollapse(state, collapsePos = { x: 0, z: 0 }, hostilesInTunnel = [], audio = audioSynth) {
  if (!state || !state.isVaultIntact) {
    return { collapsed: false, buriedCount: 0 };
  }

  state.isVaultIntact = false;

  if (audio && typeof audio.playWeylandIceTunnelAvalancheRumble === 'function') {
    audio.playWeylandIceTunnelAvalancheRumble();
  }

  let buriedCount = 0;
  if (Array.isArray(hostilesInTunnel)) {
    for (const enemy of hostilesInTunnel) {
      if (!enemy) continue;
      const dist = Math.hypot((enemy.x || 0) - (collapsePos.x || 0), (enemy.z || 0) - (collapsePos.z || 0));
      if (dist <= BORE_TUNNEL_CONSTANTS.TUNNEL_COLLAPSE_RADIUS_M) {
        enemy.isBuriedUnderGlacialIce = true;
        enemy.canMove = false;
        buriedCount++;
        state.buriedHostilesCount++;

        if (typeof enemy.takeDamage === 'function') {
          enemy.takeDamage(BORE_TUNNEL_CONSTANTS.AVALANCHE_CRUSH_DAMAGE);
        } else if (typeof enemy.health === 'number') {
          enemy.health = Math.max(0, enemy.health - BORE_TUNNEL_CONSTANTS.AVALANCHE_CRUSH_DAMAGE);
        }
      }
    }
  }

  return {
    collapsed: true,
    buriedCount,
  };
}
