/**
 * DutchImprovisedExplosiveTippedBowSystem.js
 * Chantier 5 (v149) : Arc artisanal à flèches explosives improvisées de Dutch (Predator 1987).
 * Arc de survie en bois souple fabriqué dans la jungle de Val Verde :
 * - Tir silencieux sans signature thermique initiale au départ du coup.
 * - Pointes explosives bricolées à partir d'ogives de grenade 40mm : la détonation à l'impact
 *   court-circuite le camouflage optique du Jungle Hunter et sature sa vision thermique.
 */

export class DutchImprovisedExplosiveTippedBowSystem {
  constructor(options = {}) {
    this.maxExplosiveArrows = options.maxExplosiveArrows ?? 5;
    this.blastRadiusMeters = options.blastRadiusMeters ?? 4.8;
    this.directHitDamage = options.directHitDamage ?? 115;
    this.splashBlastDamage = options.splashBlastDamage ?? 68;

    this.state = {
      explosiveArrowsRemaining: this.maxExplosiveArrows,
      currentDrawTensionRatio: 0,
      totalShotsFired: 0,
      totalCloaksShortCircuited: 0
    };
  }

  drawAndReleaseExplosiveArrow(impactPosition = { x: 0, z: 0 }, entities = [], drawTension = 1.0, audioSynthesizer = null) {
    if (this.state.explosiveArrowsRemaining <= 0) {
      return { fired: false, reason: 'no_explosive_arrows_remaining' };
    }

    this.state.explosiveArrowsRemaining -= 1;
    this.state.currentDrawTensionRatio = Math.min(1.0, Math.max(0.25, Number(drawTension) || 1.0));
    this.state.totalShotsFired += 1;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playDutchExplosiveArrowBowTwang === 'function') {
        audioSynthesizer.playDutchExplosiveArrowBowTwang(0.95);
      }
      if (typeof audioSynthesizer.playExplosiveArrowDelayedDetonation === 'function') {
        audioSynthesizer.playExplosiveArrowDelayedDetonation(1.15);
      }
    }

    const hitEntities = [];
    for (const entity of entities) {
      const dist = Math.hypot((entity.x ?? 0) - (impactPosition.x ?? 0), (entity.z ?? 0) - (impactPosition.z ?? 0));
      if (dist <= this.blastRadiusMeters) {
        const isDirect = dist <= 1.2;
        const damage = isDirect ? this.directHitDamage : this.splashBlastDamage;
        entity.health = Math.max(0, Number(entity.health ?? 150) - damage);

        let cloakDisrupted = false;
        if (entity.cloakActive) {
          entity.cloakActive = false;
          entity.cloakShortCircuitedSeconds = 6.0;
          cloakDisrupted = true;
          this.state.totalCloaksShortCircuited += 1;
        }
        entity.thermalVisionDazzled = true;

        hitEntities.push({
          entityId: entity.id ?? 'target',
          damageDealt: damage,
          cloakDisrupted,
          remainingHealth: entity.health
        });
      }
    }

    return {
      fired: true,
      silentLaunchNoMuzzleFlash: true,
      explosiveArrowsRemaining: this.state.explosiveArrowsRemaining,
      hitEntities
    };
  }

  getStatus() {
    return {
      explosiveArrowsRemaining: this.state.explosiveArrowsRemaining,
      totalShotsFired: this.state.totalShotsFired,
      totalCloaksShortCircuited: this.state.totalCloaksShortCircuited
    };
  }
}
