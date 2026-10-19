/**
 * CelticReversibleBladeNetLauncherGrappleSystem.js
 * Chantier 5 (v152) : Dague réversible de Celtic & lutte au corps à corps contre Grid Alien (AVP 2004).
 * Style de combat lourd du leader Celtic dans la salle aux piliers :
 * - Retournement mécanique à 180° des Wristblades (Reversible Blade Flip) pour frapper en revers.
 * - Prise d'étranglement et projection brutale (Chokeslam) à travers les colonnes sacrificielles en pierre.
 */

export class CelticReversibleBladeNetLauncherGrappleSystem {
  constructor(options = {}) {
    this.pillarSmashDamage = options.pillarSmashDamage ?? 140;
    this.reverseBladeStrikeDamage = options.reverseBladeStrikeDamage ?? 95;

    this.state = {
      bladesReversed: false,
      wristbladesCorrodedByAcid: false,
      ceremonialDaggerDrawn: false,
      pillarsShatteredCount: 0
    };
  }

  flipReversibleWristblades(audioSynthesizer = null) {
    if (this.state.wristbladesCorrodedByAcid) {
      this.state.ceremonialDaggerDrawn = true;
      return {
        flipped: false,
        reason: 'wristblades_corroded_dagger_drawn',
        ceremonialDaggerDrawn: true
      };
    }

    this.state.bladesReversed = !this.state.bladesReversed;
    if (audioSynthesizer && typeof audioSynthesizer.playCelticReversibleWristbladeFlipClick === 'function') {
      audioSynthesizer.playCelticReversibleWristbladeFlipClick(1.0);
    }

    return {
      flipped: true,
      bladesReversed: this.state.bladesReversed
    };
  }

  executePillarChokeslamThrow(target = {}, pillar = { intact: true }, audioSynthesizer = null) {
    if (audioSynthesizer && typeof audioSynthesizer.playCelticPillarChokeslamStoneSmash === 'function') {
      audioSynthesizer.playCelticPillarChokeslamStoneSmash(1.15);
    }

    if (pillar.intact !== false) {
      pillar.intact = false;
      this.state.pillarsShatteredCount += 1;
    }

    target.health = Math.max(0, Number(target.health ?? 200) - this.pillarSmashDamage);
    target.thrownThroughStonePillar = true;

    return {
      executed: true,
      damageDealt: this.pillarSmashDamage,
      pillarShattered: true,
      remainingHealth: target.health
    };
  }

  getStatus() {
    return {
      bladesReversed: this.state.bladesReversed,
      ceremonialDaggerDrawn: this.state.ceremonialDaggerDrawn,
      pillarsShatteredCount: this.state.pillarsShatteredCount
    };
  }
}
