/**
 * HarriganCompressedNitrogenCryoSprayCounterSystem.js
 * Chantier 5 (v150) : Extincteur à azote liquide cryogénique de Harrigan dans l'abattoir (Predator 2).
 * Lance cryogénique industrielle projetant un brouillard d'azote liquide (-196 °C) :
 * - Forme un écran de givre qui masque l'utilisateur face au mode thermique infrarouge du City Hunter.
 * - Tout Yautja camouflé pris dans le cône cryogénique voit son manteau optique givrer et court-circuiter,
 *   révélant sa silhouette complète tout en ralentissant ses mouvements.
 */

export class HarriganCompressedNitrogenCryoSprayCounterSystem {
  constructor(options = {}) {
    this.maxCryoTankCharge = options.maxCryoTankCharge ?? 100;
    this.sprayConeRangeMeters = options.sprayConeRangeMeters ?? 9.5;
    this.cloakFreezeDurationSeconds = options.cloakFreezeDurationSeconds ?? 7.5;

    this.state = {
      cryoTankCharge: this.maxCryoTankCharge,
      activeCryoCloud: false,
      totalCloaksFrozenAndRevealed: 0
    };
  }

  dischargeCryoNitrogenBurst(targetsInCone = [], shooter = {}, audioSynthesizer = null) {
    if (this.state.cryoTankCharge < 20) {
      return { discharged: false, reason: 'cryo_tank_depleted' };
    }

    this.state.cryoTankCharge = Math.max(0, this.state.cryoTankCharge - 25);
    this.state.activeCryoCloud = true;
    shooter.maskedByCryoFog = true;

    if (audioSynthesizer && typeof audioSynthesizer.playHarriganNitrogenCryoSprayHiss === 'function') {
      audioSynthesizer.playHarriganNitrogenCryoSprayHiss(1.0);
    }

    const frozenTargets = [];
    for (const target of targetsInCone) {
      const dist = Number(target.distanceMeters ?? 5.0);
      if (dist <= this.sprayConeRangeMeters) {
        let cloakRevealed = false;
        if (target.cloakActive) {
          target.cloakActive = false;
          target.cloakFrozenTimer = this.cloakFreezeDurationSeconds;
          cloakRevealed = true;
          this.state.totalCloaksFrozenAndRevealed += 1;

          if (audioSynthesizer && typeof audioSynthesizer.playCryoFrostCloakShortCircuitCrack === 'function') {
            audioSynthesizer.playCryoFrostCloakShortCircuitCrack(1.1);
          }
        }

        target.movementSpeedMultiplier = 0.6;
        target.frostbiteDamageTaken = 22;
        target.health = Math.max(1, Number(target.health ?? 150) - 22);

        frozenTargets.push({
          targetId: target.id ?? 'target',
          cloakRevealed,
          movementSpeedMultiplier: target.movementSpeedMultiplier
        });
      }
    }

    return {
      discharged: true,
      cryoTankCharge: this.state.cryoTankCharge,
      shooterMaskedByCryoFog: true,
      frozenTargets
    };
  }

  getStatus() {
    return {
      cryoTankCharge: this.state.cryoTankCharge,
      activeCryoCloud: this.state.activeCryoCloud,
      totalCloaksFrozenAndRevealed: this.state.totalCloaksFrozenAndRevealed
    };
  }
}
