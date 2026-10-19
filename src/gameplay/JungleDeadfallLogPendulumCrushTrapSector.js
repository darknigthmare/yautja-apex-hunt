/**
 * JungleDeadfallLogPendulumCrushTrapSector.js
 * Chantier 8 (v150) : Piège à rondins suspendus & balancier écraseur de Dutch (Predator 1987).
 * Tronc d'arbre massif suspendu par des lianes au-dessus d'un goulet rocheux de Val Verde :
 * - Déclenchable par rupture du câble végétal ou par chute directe du contrepoids.
 * - Frappe cinétique colossale ignorant le camouflage optique et brisant le bio-masque ou
 *   écrasant mortellement un adversaire sous sa masse.
 */

export class JungleDeadfallLogPendulumCrushTrapSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_canyon_deadfall_pendulum';
    this.impactZoneCenter = options.impactZoneCenter ?? { x: 0, z: 0 };
    this.sweepZoneRadiusMeters = options.sweepZoneRadiusMeters ?? 3.8;
    this.crushLethalDamage = options.crushLethalDamage ?? 320;

    this.state = {
      vineTetherIntact: true,
      pendulumReleased: false,
      totalTargetsCrushed: 0
    };
  }

  cutHoldingVineAndReleaseLog(entitiesInGorge = [], audioSynthesizer = null) {
    if (!this.state.vineTetherIntact || this.state.pendulumReleased) {
      return { released: false, reason: 'already_released' };
    }

    this.state.vineTetherIntact = false;
    this.state.pendulumReleased = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playDeadfallLogVineSnapTwang === 'function') {
        audioSynthesizer.playDeadfallLogVineSnapTwang(1.0);
      }
      if (typeof audioSynthesizer.playDeadfallLogPendulumCrushImpact === 'function') {
        audioSynthesizer.playDeadfallLogPendulumCrushImpact(1.2);
      }
    }

    const crushedTargets = [];
    for (const entity of entitiesInGorge) {
      const dist = Math.hypot(
        (entity.x ?? 0) - this.impactZoneCenter.x,
        (entity.z ?? 0) - this.impactZoneCenter.z
      );
      if (dist <= this.sweepZoneRadiusMeters) {
        entity.health = Math.max(0, Number(entity.health ?? 250) - this.crushLethalDamage);
        entity.cloakActive = false;
        entity.pinnedUnderDeadfallLog = true;
        this.state.totalTargetsCrushed += 1;

        crushedTargets.push({
          entityId: entity.id ?? 'target',
          damageDealt: this.crushLethalDamage,
          remainingHealth: entity.health,
          pinnedUnderDeadfallLog: true
        });
      }
    }

    return {
      released: true,
      crushedCount: crushedTargets.length,
      crushedTargets
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      vineTetherIntact: this.state.vineTetherIntact,
      pendulumReleased: this.state.pendulumReleased,
      totalTargetsCrushed: this.state.totalTargetsCrushed
    };
  }
}
