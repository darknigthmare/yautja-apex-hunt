import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 4 (v158) — Feu de Camp des Trappeurs & Piège à Mâchoires d'Acier (*Prey 2022*)
 * Reproduit la clairière de campement nocturne des trappeurs français :
 * - Braises rougeoyantes et carcasses de bisons servant d'appât thermique pour attirer le prédateur.
 * - Des pièges à ours géants en acier denté sont dissimulés sous les fougères sèches.
 * - Si le Feral Predator y pose le pied, les mâchoires se referment avec une force de 12 kN ; il peut les ouvrir à mains nues grâce à sa force colossale ou déclencher la détente au préalable avec sa lance télescopique.
 */
export class FrenchVoyageurCampfireBearTrapBaitSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'voyageur_forest_campfire_bear_trap_perimeter';
    this.trapSprung = false;
    this.clampingForceKn = options.clampingForceKn ?? 12.0;
    this.campfireEmbersHot = true;
  }

  approachCampfireThermalBait() {
    audioSynth.playVoyageurCampfireEmbersCrackle?.();
    return {
      campfireActive: this.campfireEmbersHot,
      thermalSignatureContrast: 0.9,
      baitInvestigated: true
    };
  }

  triggerBearTrapStep(targetHunter = {}) {
    if (this.trapSprung) {
      return { triggered: false, reason: 'trap_already_sprung' };
    }

    this.trapSprung = true;
    targetHunter.snaredInBearTrap = true;
    targetHunter.movementSpeedMultiplier = 0.2;
    const damage = 55;
    targetHunter.health = Math.max(0, Number(targetHunter.health ?? 220) - damage);

    audioSynth.playBearTrapSteelJawSnappingCrash?.();

    return {
      triggered: true,
      damageDealt: damage,
      clampingForceKn: this.clampingForceKn,
      remainingHealth: targetHunter.health,
      snaredInBearTrap: true
    };
  }

  pryOpenSteelJawsWithBruteStrength(targetHunter = {}) {
    if (!this.trapSprung || !targetHunter.snaredInBearTrap) {
      return { freed: false, reason: 'not_snared' };
    }

    targetHunter.snaredInBearTrap = false;
    targetHunter.movementSpeedMultiplier = 1.0;

    return {
      freed: true,
      jawsForcedOpen: true,
      strengthRequiredKn: this.clampingForceKn
    };
  }
}
