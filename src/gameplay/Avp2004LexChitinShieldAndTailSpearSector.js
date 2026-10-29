/**
 * Avp2004LexChitinShieldAndTailSpearSector (v228)
 *
 * Implements iconic 1:1 canonical set-pieces from Alien vs. Predator (2004):
 * 1. Scar butchering the carcass of a freshly slain Xenomorph warrior in the sacrificial chamber.
 * 2. Carving and shaping the dorsal head carapace into a curved, lightweight acid-proof shield (pH 0.2 acid immunity).
 * 3. Affixing the serrated tail stinger barb onto an alloy shaft to forge the Xenomorph tail spear (length 2.1m).
 * 4. Bestowing and binding the chitin armament to Lex Woods for mutual survival against the Matriarch (+400 Honor).
 */
export class Avp2004LexChitinShieldAndTailSpearSector {
  constructor() {
    this.sectorId = 'AVP_2004_LEX_CHITIN_SHIELD_AND_TAIL_SPEAR';
    this.filmReference = 'Alien vs. Predator (2004) - Xenomorph Carapace Acid-Proof Shield & Tail Stinger Spear Crafting';
    this.reset();
  }

  reset() {
    this.carcassChitinHarvested = false;
    this.acidProofShieldCarved = false;
    this.tailStingerSpearForged = false;
    this.chitinArmamentBestowedToLex = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  harvestSlainXenomorphChitin({
    carapaceThicknessMm = 14,
    fleshyTissueDissolvedConfirmed = true
  } = {}) {
    const thickness = Math.max(0, Number(carapaceThicknessMm) || 0);
    this.carcassChitinHarvested = thickness >= 10 && fleshyTissueDissolvedConfirmed === true;
    this.eventLog.push({
      step: 'CARCASS_CHITIN_HARVESTED',
      carapaceThicknessMm: thickness,
      carcassChitinHarvested: this.carcassChitinHarvested
    });
    return {
      carcassChitinHarvested: this.carcassChitinHarvested
    };
  }

  carveAcidProofHeadDomeShield({
    shieldCurvatureRadiusCm = 38,
    acidResistancePhScore = 0.2
  } = {}) {
    if (!this.carcassChitinHarvested) {
      throw new Error('Must harvest chitin before carving acid-proof shield.');
    }
    const rad = Math.max(0, Number(shieldCurvatureRadiusCm) || 0);
    const ph = Number(acidResistancePhScore) || 0;
    this.acidProofShieldCarved = rad >= 30 && ph <= 0.5;
    this.eventLog.push({
      step: 'ACID_PROOF_SHIELD_CARVED',
      shieldCurvatureRadiusCm: rad,
      acidResistancePhScore: ph,
      acidProofShieldCarved: this.acidProofShieldCarved
    });
    return {
      acidProofShieldCarved: this.acidProofShieldCarved
    };
  }

  forgeTailStingerSpear({
    spearShaftLengthMeters = 2.1,
    stingerBarbSharpnessMohs = 8.5
  } = {}) {
    if (!this.acidProofShieldCarved) {
      throw new Error('Must carve shield before forging tail stinger spear.');
    }
    const len = Math.max(0, Number(spearShaftLengthMeters) || 0);
    const mohs = Number(stingerBarbSharpnessMohs) || 0;
    this.tailStingerSpearForged = len >= 1.8 && mohs >= 8.0;
    this.eventLog.push({
      step: 'TAIL_STINGER_SPEAR_FORGED',
      spearShaftLengthMeters: len,
      stingerBarbSharpnessMohs: mohs,
      tailStingerSpearForged: this.tailStingerSpearForged
    });
    return {
      tailStingerSpearForged: this.tailStingerSpearForged
    };
  }

  bestowChitinArmamentToLex({
    lexCombatPactConfirmed = true,
    warriorKinshipEstablished = true
  } = {}) {
    if (!this.tailStingerSpearForged) {
      throw new Error('Must forge tail spear before bestowing armament.');
    }
    this.chitinArmamentBestowedToLex = lexCombatPactConfirmed === true && warriorKinshipEstablished === true;
    if (this.chitinArmamentBestowedToLex) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CHITIN_ARMAMENT_BESTOWED_TO_LEX',
      lexCombatPactConfirmed,
      warriorKinshipEstablished,
      chitinArmamentBestowedToLex: this.chitinArmamentBestowedToLex,
      honorAwarded: this.honorAwarded
    });
    return {
      chitinArmamentBestowedToLex: this.chitinArmamentBestowedToLex,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.carcassChitinHarvested &&
      this.acidProofShieldCarved &&
      this.tailStingerSpearForged &&
      this.chitinArmamentBestowedToLex &&
      this.honorAwarded === 400
    );
  }
}
