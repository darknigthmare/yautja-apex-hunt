/**
 * ThermalReflectiveFoilBivouacSniperCounterSystem.js
 * Chantier 2 (v150) : Manteau de camouflage thermique d'élite des Tireurs d'élite (Predators 2010 / The Predator 2018).
 * Bâche isolante multi-spectre réfléchissante déployée par les snipers humains :
 * - Supprime 95% de la signature infrarouge face au mode thermique standard du Bio-Masque.
 * - Oblige le chasseur Yautja à basculer sur le spectre électromagnétique (reflet métallique de la lunette)
 *   ou l'écholocation acoustique cardiaque pour révéler la position exacte du tireur embusqué.
 */

export class ThermalReflectiveFoilBivouacSniperCounterSystem {
  constructor(options = {}) {
    this.thermalSignatureSuppression = options.thermalSignatureSuppression ?? 0.95;
    this.muzzleFlashRevealDurationSeconds = options.muzzleFlashRevealDurationSeconds ?? 2.4;

    this.snipers = (options.snipers ?? [
      { id: 'sniper_alpha_ridge', x: -24, z: 32, foilDeployed: true, muzzleFlashTimer: 0, revealedToHunter: false },
      { id: 'sniper_beta_canopy', x: 18, z: -28, foilDeployed: true, muzzleFlashTimer: 0, revealedToHunter: false }
    ]).map((s) => ({ ...s }));
  }

  deployFoilBivouac(sniperId, audioSynthesizer = null) {
    const sniper = this.snipers.find((s) => s.id === sniperId);
    if (!sniper) {
      return { deployed: false, reason: 'sniper_not_found' };
    }

    sniper.foilDeployed = true;
    sniper.revealedToHunter = false;

    if (audioSynthesizer && typeof audioSynthesizer.playThermalFoilBlanketUnfoldRustle === 'function') {
      audioSynthesizer.playThermalFoilBlanketUnfoldRustle(0.9);
    }

    return {
      deployed: true,
      sniperId: sniper.id,
      thermalVisibilityRatio: Number((1 - this.thermalSignatureSuppression).toFixed(2))
    };
  }

  evaluateBioMaskScan(visionMode = 'THERMAL_IR') {
    const mode = String(visionMode).toUpperCase();
    const detectedSniperIds = [];

    for (const sniper of this.snipers) {
      if (!sniper.foilDeployed || sniper.muzzleFlashTimer > 0) {
        sniper.revealedToHunter = true;
        detectedSniperIds.push(sniper.id);
      } else if (mode === 'ELECTROMAGNETIC_TECH' || mode === 'ACOUSTIC_HEARTBEAT') {
        sniper.revealedToHunter = true;
        detectedSniperIds.push(sniper.id);
      } else {
        // En mode THERMAL_IR pur, la bâche réfléchissante dissimule le tireur
        sniper.revealedToHunter = false;
      }
    }

    return {
      visionMode: mode,
      detectedCount: detectedSniperIds.length,
      detectedSniperIds
    };
  }

  registerSniperShotFired(sniperId) {
    const sniper = this.snipers.find((s) => s.id === sniperId);
    if (!sniper) return { fired: false };

    sniper.muzzleFlashTimer = this.muzzleFlashRevealDurationSeconds;
    sniper.revealedToHunter = true;
    return {
      fired: true,
      sniperId: sniper.id,
      temporarilyRevealedInThermal: true
    };
  }

  getStatus() {
    return {
      snipers: this.snipers.map((s) => ({ ...s }))
    };
  }
}
