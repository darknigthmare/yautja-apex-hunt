/**
 * StargazerMagneticCraneCargoDropSector.js
 * Chantier 2 (v148) : Silo à missiles abandonné & grue de levage magnétique (The Predator 2018).
 * Hangar logistique du Projet Stargazer équipé de ponts roulants à électroaimants :
 * - Désactivation à distance des électroaimants par tir plasma ou surcharge d'interrupteur.
 * - Chute gravitationnelle de conteneurs blindés écrasant les escouades et tourelles au sol.
 * - Création instantanée d'un couvert lourd permanent et d'une onde de choc acoustique.
 */

export class StargazerMagneticCraneCargoDropSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'stargazer_missile_silo_crane_bay';
    this.crushRadiusMeters = options.crushRadiusMeters ?? 5.5;
    this.shockwaveStaggerRadiusMeters = options.shockwaveStaggerRadiusMeters ?? 12.0;
    this.directCrushDamage = options.directCrushDamage ?? 950;
    this.shockwaveDamage = options.shockwaveDamage ?? 65;

    this.cranes = (options.cranes ?? [
      { id: 'crane_alpha_north', position: { x: -12, y: 11.5, z: 8 }, magnetPowered: true, dropped: false, impactPosition: { x: -12, y: 0, z: 8 } },
      { id: 'crane_beta_center', position: { x: 0, y: 12.0, z: 18 }, magnetPowered: true, dropped: false, impactPosition: { x: 0, y: 0, z: 18 } },
      { id: 'crane_gamma_south', position: { x: 14, y: 11.0, z: 26 }, magnetPowered: true, dropped: false, impactPosition: { x: 14, y: 0, z: 26 } }
    ]).map((c) => ({ ...c }));

    this.deployedHeavyCovers = [];
    this.totalUnitsCrushed = 0;
  }

  disengageElectromagnet(craneId, groundUnits = [], audioSynthesizer = null) {
    const crane = this.cranes.find((c) => c.id === craneId);
    if (!crane) {
      return { dropped: false, reason: 'crane_not_found' };
    }
    if (crane.dropped || !crane.magnetPowered) {
      return { dropped: false, reason: 'already_dropped' };
    }

    crane.magnetPowered = false;
    crane.dropped = true;

    if (audioSynthesizer && typeof audioSynthesizer.playMagneticCraneElectromagnetRelease === 'function') {
      audioSynthesizer.playMagneticCraneElectromagnetRelease(1.0);
    }
    if (audioSynthesizer && typeof audioSynthesizer.playCargoContainerGroundCrushBoom === 'function') {
      audioSynthesizer.playCargoContainerGroundCrushBoom(1.15);
    }

    const crushedUnitIds = [];
    const staggeredUnitIds = [];

    for (const unit of groundUnits) {
      const dx = Number(unit.x ?? 0) - crane.impactPosition.x;
      const dz = Number(unit.z ?? 0) - crane.impactPosition.z;
      const dist = Math.hypot(dx, dz);

      if (dist <= this.crushRadiusMeters) {
        unit.health = Math.max(0, Number(unit.health ?? 200) - this.directCrushDamage);
        unit.crushedUnderContainer = true;
        crushedUnitIds.push(unit.id ?? 'unit');
        this.totalUnitsCrushed += 1;
      } else if (dist <= this.shockwaveStaggerRadiusMeters) {
        unit.health = Math.max(0, Number(unit.health ?? 100) - this.shockwaveDamage);
        unit.staggeredSeconds = 2.8;
        staggeredUnitIds.push(unit.id ?? 'unit');
      }
    }

    const coverNode = {
      coverId: `heavy_container_${crane.id}`,
      position: { ...crane.impactPosition },
      dimensions: { width: 6.2, height: 2.9, depth: 2.6 },
      ballisticProtection: 1.0,
      climbableVantageHeight: 2.9
    };
    this.deployedHeavyCovers.push(coverNode);

    return {
      dropped: true,
      craneId: crane.id,
      impactPosition: { ...crane.impactPosition },
      crushedUnitIds,
      staggeredUnitIds,
      createdCover: coverNode
    };
  }

  getSectorStatus() {
    return {
      sectorId: this.sectorId,
      activeCranesRemaining: this.cranes.filter((c) => !c.dropped).length,
      deployedHeavyCoversCount: this.deployedHeavyCovers.length,
      totalUnitsCrushed: this.totalUnitsCrushed
    };
  }
}
