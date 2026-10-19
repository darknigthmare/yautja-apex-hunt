// Surcharge du Cœur de Propulsion du Vaisseau Scout & Purge Radiative (Predator 2 / AVP:R — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le réacteur central embrumé de la salle du vaisseau sous Los Angeles émettant des bouffées thermiques et radiatives qui repoussent les intrus et rechargent l'armement Yautja.

import { audioSynth } from '../AudioSynthesizer.js';

export const SCOUT_REACTOR_CONSTANTS = {
  VENT_RADIUS_M: 9.0,                // Rayon de la chambre du cœur de propulsion
  INTRUDER_RADIATION_DAMAGE: 145,    // Dégâts radiatifs infligés aux non-Yautja
  HUNTER_OVERCHARGE_ENERGY: 100,     // Recharge complète des condensateurs du chasseur
};

export function createScoutReactorSectorState() {
  return {
    ventCyclesTriggered: 0,
    isCoreVenting: false,
  };
}

export function triggerScoutReactorRadiationVent(state, hunter = null, intruders = [], audio = audioSynth) {
  if (!state) return { vented: false, irradiatedCount: 0 };

  state.isCoreVenting = true;
  state.ventCyclesTriggered++;

  if (audio) {
    if (typeof audio.playScoutReactorCoreVentRoar === 'function') {
      audio.playScoutReactorCoreVentRoar();
    }
    if (typeof audio.playRadiationPulseShieldDrainHum === 'function') {
      audio.playRadiationPulseShieldDrainHum();
    }
  }

  if (hunter) {
    hunter.energy = SCOUT_REACTOR_CONSTANTS.HUNTER_OVERCHARGE_ENERGY;
    hunter.isCoreOvercharged = true;
  }

  let irradiatedCount = 0;
  if (Array.isArray(intruders)) {
    for (const intr of intruders) {
      if (!intr) continue;
      intr.isIrradiatedByCore = true;
      irradiatedCount++;

      if (typeof intr.takeDamage === 'function') {
        intr.takeDamage(SCOUT_REACTOR_CONSTANTS.INTRUDER_RADIATION_DAMAGE);
      } else if (typeof intr.health === 'number') {
        intr.health = Math.max(0, intr.health - SCOUT_REACTOR_CONSTANTS.INTRUDER_RADIATION_DAMAGE);
      }
    }
  }

  return {
    vented: true,
    irradiatedCount,
  };
}
