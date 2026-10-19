/**
 * NolanScavengedYautjaCamouflageRigSystem.js
 * Chantier 7 (v151) : Harnais de camouflage Yautja récupéré et instable de Ronald Nolan (Predators 2010).
 * Équipement Yautja endommagé récupéré sur un chasseur déchu dans la réserve de chasse :
 * - Confère un camouflage optique actif à un survivant humain, mais les condensateurs vétustes
 *   accumulent une instabilité électrique.
 * - Tout sprint ou dépassement du seuil d'instabilité déclenche un grésillement sonore et des arcs
 *   visibles qui trahissent la position du porteur auprès des Super Predators.
 */

export class NolanScavengedYautjaCamouflageRigSystem {
  constructor(options = {}) {
    this.maxCapacitorStability = 100;
    this.stabilityDrainPerSecondWalk = options.stabilityDrainPerSecondWalk ?? 8;
    this.stabilityDrainPerSecondSprint = options.stabilityDrainPerSecondSprint ?? 34;

    this.state = {
      cloakEngaged: false,
      capacitorStability: this.maxCapacitorStability,
      glitchingAndAudible: false,
      totalGlitchFailures: 0
    };
  }

  engageScavengedCloak() {
    if (this.state.capacitorStability < 20) {
      return { engaged: false, reason: 'capacitor_unstable' };
    }
    this.state.cloakEngaged = true;
    this.state.glitchingAndAudible = false;
    return {
      engaged: true,
      capacitorStability: this.state.capacitorStability
    };
  }

  updateRigStability(dt = 1.0, isSprinting = false, audioSynthesizer = null) {
    const safeDt = Math.max(0, Number(dt) || 0);
    if (!this.state.cloakEngaged) {
      this.state.capacitorStability = Math.min(
        this.maxCapacitorStability,
        this.state.capacitorStability + safeDt * 18
      );
      return this.getStatus();
    }

    const drainRate = isSprinting ? this.stabilityDrainPerSecondSprint : this.stabilityDrainPerSecondWalk;
    this.state.capacitorStability = Math.max(0, this.state.capacitorStability - safeDt * drainRate);

    if (this.state.capacitorStability <= 25) {
      this.state.glitchingAndAudible = true;
      if (audioSynthesizer && typeof audioSynthesizer.playNolanScavengedCloakGlitchBuzz === 'function') {
        audioSynthesizer.playNolanScavengedCloakGlitchBuzz(1.0);
      }
    }

    if (this.state.capacitorStability === 0) {
      this.state.cloakEngaged = false;
      this.state.totalGlitchFailures += 1;
    }

    return this.getStatus();
  }

  getStatus() {
    return {
      cloakEngaged: this.state.cloakEngaged,
      capacitorStability: Math.round(this.state.capacitorStability),
      glitchingAndAudible: this.state.glitchingAndAudible,
      totalGlitchFailures: this.state.totalGlitchFailures
    };
  }
}
