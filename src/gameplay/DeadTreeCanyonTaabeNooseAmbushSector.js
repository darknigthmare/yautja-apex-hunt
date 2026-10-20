import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 4 (v157) — Canyon des Arbres Morts & Piège à Collet Équestre de Taabe (*Prey 2022*)
 * Reproduit l'embuscade équestre menée par Taabe contre le Feral Predator :
 * - Galop rapide dans le canyon rocheux balayé par les vents et jalonné de troncs d'arbres calcinés.
 * - Taabe jette un lasso en cuir renforcé au cou et aux épaules du Feral pour le contraindre et créer une ligne de tir pour Naru.
 * - Le Yautja doit briser la prise par impulsion de force brute ou déployer son bouclier rétractable à bords tranchants pour cisailler le lien avant d'être harponné.
 */
export class DeadTreeCanyonTaabeNooseAmbushSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'dead_tree_canyon_taabe_equestrian_standoff';
    this.nooseTensionActive = false;
    this.snareIntegrityKn = options.snareIntegrityKn ?? 14.5;
    this.flankingArrowHits = 0;
  }

  castEquestrianLassoSnare(feralState = {}) {
    this.nooseTensionActive = true;
    feralState.snaredInNoose = true;
    feralState.movementSpeedMultiplier = 0.3;

    audioSynth.playTaabeEquestrianNooseWhistle?.();

    return {
      snared: true,
      nooseTensionActive: true,
      snareIntegrityKn: this.snareIntegrityKn,
      feralMovementDebuff: 0.7
    };
  }

  severNooseWithExpandingShield(feralState = {}) {
    if (!this.nooseTensionActive) {
      return { severed: false, reason: 'not_snared' };
    }

    this.nooseTensionActive = false;
    feralState.snaredInNoose = false;
    feralState.movementSpeedMultiplier = 1.0;

    audioSynth.playDeadTreeCanyonLassoSnareSnap?.();

    return {
      severed: true,
      usedExpandingShield: true,
      feralFreed: true
    };
  }

  registerFlankingBowShot(feralState = {}) {
    this.flankingArrowHits += 1;
    const damage = this.nooseTensionActive ? 38 : 18;
    feralState.health = Math.max(0, Number(feralState.health ?? 200) - damage);

    return {
      arrowLanded: true,
      damageDealt: damage,
      flankingArrowHits: this.flankingArrowHits,
      remainingHealth: feralState.health
    };
  }
}
