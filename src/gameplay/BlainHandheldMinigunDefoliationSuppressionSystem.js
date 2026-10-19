/**
 * BlainHandheldMinigunDefoliationSuppressionSystem.js
 * Chantier 5 (v151) : Minigun M134 portatif "Old Painless" de Blain & défoliation de la jungle (Predator 1987).
 * Mitrailleuse rotative à 6 canons 7.62mm NATO alimentée par batterie et sac à dos :
 * - Cadence de tir dévastatrice qui fauche les arbres, fougères et barricades légères sur un cône large.
 * - Supprime les couverts végétaux au sol et blesse le Jungle Hunter s'il ne rejoint pas immédiatement
 *   une perche de haute canopée hors de la ligne de tir horizontale.
 */

export class BlainHandheldMinigunDefoliationSuppressionSystem {
  constructor(options = {}) {
    this.maxAmmoBelt = options.maxAmmoBelt ?? 600;
    this.roundsPerBurst = options.roundsPerBurst ?? 150;
    this.suppressionConeDamage = options.suppressionConeDamage ?? 95;

    this.state = {
      ammoRemaining: this.maxAmmoBelt,
      barrelsSpinning: false,
      totalFoliageNodesShredded: 0,
      totalBurstsFired: 0
    };
  }

  fireDefoliatingSuppressionBurst(foliageNodes = [], targetsInCone = [], audioSynthesizer = null) {
    if (this.state.ammoRemaining < this.roundsPerBurst) {
      return { fired: false, reason: 'ammo_belt_depleted' };
    }

    this.state.ammoRemaining -= this.roundsPerBurst;
    this.state.barrelsSpinning = true;
    this.state.totalBurstsFired += 1;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playBlainMinigunOldPainlessBrrrrt === 'function') {
        audioSynthesizer.playBlainMinigunOldPainlessBrrrrt(1.1);
      }
      if (typeof audioSynthesizer.playMinigunJungleCanopySplinterCrack === 'function') {
        audioSynthesizer.playMinigunJungleCanopySplinterCrack(1.0);
      }
    }

    const shreddedFoliageIds = [];
    for (const node of foliageNodes) {
      if (!node.shredded) {
        node.shredded = true;
        node.coverValue = 0;
        shreddedFoliageIds.push(node.id ?? 'foliage');
        this.state.totalFoliageNodesShredded += 1;
      }
    }

    const grazedTargetIds = [];
    for (const target of targetsInCone) {
      // Une cible perchée en haute canopée (> 6m) évite le balayage horizontal au niveau du sol
      if (Number(target.elevationMeters ?? 0) <= 5.0) {
        target.health = Math.max(1, Number(target.health ?? 200) - this.suppressionConeDamage);
        target.isBleedingGreenLuminescentBlood = true;
        grazedTargetIds.push(target.id ?? 'target');
      }
    }

    return {
      fired: true,
      ammoRemaining: this.state.ammoRemaining,
      shreddedFoliageIds,
      grazedTargetIds
    };
  }

  getStatus() {
    return {
      ammoRemaining: this.state.ammoRemaining,
      barrelsSpinning: this.state.barrelsSpinning,
      totalFoliageNodesShredded: this.state.totalFoliageNodesShredded,
      totalBurstsFired: this.state.totalBurstsFired
    };
  }
}
