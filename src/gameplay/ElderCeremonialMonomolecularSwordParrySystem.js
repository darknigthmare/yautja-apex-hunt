/**
 * ElderCeremonialMonomolecularSwordParrySystem.js
 * Chantier 3 (v150) : Épée rituelle rétractable d'Ancien (Elder Sword) & parade de plasma (Predator 2 / AVP).
 * Lame monomoléculaire cérémonielle forgée dans un alliage Yautja résistant à l'acide et au plasma :
 * - Frappe lourde chargée tranchant net l'exosquelette chitineux d'un Praetorian ou un bouclier balistique.
 * - Parade directionnelle au timing parfait (< 0.22s avant impact) permettant de dévier un tir
 *   de Plasmacaster ennemi et de le renvoyer vers l'assaillant.
 */

export class ElderCeremonialMonomolecularSwordParrySystem {
  constructor(options = {}) {
    this.perfectParryWindowSeconds = options.perfectParryWindowSeconds ?? 0.22;
    this.cleaveBaseDamage = options.cleaveBaseDamage ?? 185;
    this.deflectedPlasmaDamage = options.deflectedPlasmaDamage ?? 140;

    this.state = {
      bladeExtended: false,
      acidProofIntegrity: 1.0,
      totalPraetorianCarapacesCleaved: 0,
      totalPlasmaBoltsDeflected: 0
    };
  }

  extendCeremonialBlade(audioSynthesizer = null) {
    this.state.bladeExtended = true;
    if (audioSynthesizer && typeof audioSynthesizer.playElderCeremonialSwordExtendRing === 'function') {
      audioSynthesizer.playElderCeremonialSwordExtendRing(1.0);
    }
    return {
      bladeExtended: true,
      acidProofIntegrity: this.state.acidProofIntegrity
    };
  }

  executeMonomolecularCleave(target = null, audioSynthesizer = null) {
    if (!this.state.bladeExtended) {
      this.extendCeremonialBlade(audioSynthesizer);
    }
    if (!target) {
      return { cleaved: false, reason: 'no_target' };
    }

    const hadHeavyCarapace = Boolean(target.isPraetorian || target.carapaceArmor > 0);
    if (hadHeavyCarapace) {
      target.carapaceArmor = 0;
      this.state.totalPraetorianCarapacesCleaved += 1;
    }

    target.health = Math.max(0, Number(target.health ?? 200) - this.cleaveBaseDamage);

    return {
      cleaved: true,
      targetId: target.id ?? 'target',
      carapaceBypassedAndSplit: hadHeavyCarapace,
      damageDealt: this.cleaveBaseDamage,
      remainingHealth: target.health
    };
  }

  attemptTimedPlasmaParry(timingDeltaSeconds = 0.1, incomingShooter = null, audioSynthesizer = null) {
    if (!this.state.bladeExtended) {
      return { parried: false, reason: 'blade_retracted' };
    }

    const absDelta = Math.abs(Number(timingDeltaSeconds) || 0);
    if (absDelta > this.perfectParryWindowSeconds) {
      return {
        parried: false,
        reason: 'outside_perfect_parry_window',
        timingDeltaSeconds: absDelta
      };
    }

    this.state.totalPlasmaBoltsDeflected += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playElderSwordPlasmaBoltDeflectZap === 'function') {
      audioSynthesizer.playElderSwordPlasmaBoltDeflectZap(1.1);
    }

    if (incomingShooter) {
      incomingShooter.health = Math.max(0, Number(incomingShooter.health ?? 150) - this.deflectedPlasmaDamage);
      incomingShooter.struckByDeflectedPlasma = true;
    }

    return {
      parried: true,
      deflectedBackToShooter: Boolean(incomingShooter),
      deflectedDamage: incomingShooter ? this.deflectedPlasmaDamage : 0
    };
  }

  getStatus() {
    return {
      bladeExtended: this.state.bladeExtended,
      acidProofIntegrity: this.state.acidProofIntegrity,
      totalPraetorianCarapacesCleaved: this.state.totalPraetorianCarapacesCleaved,
      totalPlasmaBoltsDeflected: this.state.totalPlasmaBoltsDeflected
    };
  }
}
