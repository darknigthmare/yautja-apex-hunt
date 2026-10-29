/**
 * AvpRequiem2007NationalGuardArmoryAndDualPistolStandSector (v221)
 *
 * Implements iconic 1:1 canonical set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Wolf breaching the fortified National Guard armory in Gunnison amidst heavy thunderstorm.
 * 2. Converting dual shoulder plasma casters into a converged high-velocity handheld plasma rifle.
 * 3. Firing armor-piercing micro-bursts vaporizing advancing xenomorph swarms through concrete barricades.
 * 4. Stripping off damaged bio-mask for bare-knuckle mandible-to-jaw honor duel against Predalien on the roof.
 */
export class AvpRequiem2007NationalGuardArmoryAndDualPistolStandSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_NATIONAL_GUARD_ARMORY_AND_DUAL_PISTOL_STAND';
    this.filmReference = 'AVP: Requiem (2007) - National Guard Armory Stand, Dual Plasma Conversion & Bare-Knuckle Clash';
    this.reset();
  }

  reset() {
    this.armoryPerimeterBreached = false;
    this.dualPistolConversionCompleted = false;
    this.armorPiercingSwarmVaporized = false;
    this.rooftopBareKnuckleClashWon = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  breachNationalGuardArmoryPerimeter({
    reinforcedDoorThicknessMm = 65,
    breachTimeSeconds = 3.2
  } = {}) {
    const thick = Math.max(0, Number(reinforcedDoorThicknessMm) || 0);
    const time = Math.max(0, Number(breachTimeSeconds) || 0);
    this.armoryPerimeterBreached = thick >= 50 && time <= 5.0;
    this.eventLog.push({
      step: 'ARMORY_PERIMETER_BREACHED',
      reinforcedDoorThicknessMm: thick,
      breachTimeSeconds: time,
      armoryPerimeterBreached: this.armoryPerimeterBreached
    });
    return {
      armoryPerimeterBreached: this.armoryPerimeterBreached
    };
  }

  convertDualCastersToHandheldRifle({
    casterAlignmentAngleDeg = 0,
    capacitorChargePercent = 100
  } = {}) {
    if (!this.armoryPerimeterBreached) {
      throw new Error('Must breach armory perimeter before converting dual casters.');
    }
    const angle = Number(casterAlignmentAngleDeg) || 0;
    const charge = Math.max(0, Number(capacitorChargePercent) || 0);
    this.dualPistolConversionCompleted = angle === 0 && charge === 100;
    this.eventLog.push({
      step: 'DUAL_PISTOL_CONVERSION_COMPLETED',
      casterAlignmentAngleDeg: angle,
      capacitorChargePercent: charge,
      dualPistolConversionCompleted: this.dualPistolConversionCompleted
    });
    return {
      dualPistolConversionCompleted: this.dualPistolConversionCompleted
    };
  }

  fireArmorPiercingSwarmMicroBursts({
    plasmaBoltVelocityMs = 1850,
    concretePenetrationDepthCm = 35
  } = {}) {
    if (!this.dualPistolConversionCompleted) {
      throw new Error('Must convert dual casters before firing armor-piercing micro-bursts.');
    }
    const vel = Math.max(0, Number(plasmaBoltVelocityMs) || 0);
    const depth = Math.max(0, Number(concretePenetrationDepthCm) || 0);
    this.armorPiercingSwarmVaporized = vel >= 1500 && depth >= 25;
    this.eventLog.push({
      step: 'ARMOR_PIERCING_SWARM_VAPORIZED',
      plasmaBoltVelocityMs: vel,
      concretePenetrationDepthCm: depth,
      armorPiercingSwarmVaporized: this.armorPiercingSwarmVaporized
    });
    return {
      armorPiercingSwarmVaporized: this.armorPiercingSwarmVaporized
    };
  }

  engageRooftopBareKnuckleDuelWithPredalien({
    maskStrippedHonorCode = true,
    grapplePunchForceNewtons = 8900
  } = {}) {
    if (!this.armorPiercingSwarmVaporized) {
      throw new Error('Must vaporize swarm before engaging in rooftop bare-knuckle duel.');
    }
    const force = Math.max(0, Number(grapplePunchForceNewtons) || 0);
    this.rooftopBareKnuckleClashWon = maskStrippedHonorCode === true && force >= 7000;
    if (this.rooftopBareKnuckleClashWon) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'ROOFTOP_BARE_KNUCKLE_CLASH_WON',
      maskStrippedHonorCode,
      grapplePunchForceNewtons: force,
      rooftopBareKnuckleClashWon: this.rooftopBareKnuckleClashWon,
      honorAwarded: this.honorAwarded
    });
    return {
      rooftopBareKnuckleClashWon: this.rooftopBareKnuckleClashWon,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.armoryPerimeterBreached &&
      this.dualPistolConversionCompleted &&
      this.armorPiercingSwarmVaporized &&
      this.rooftopBareKnuckleClashWon &&
      this.honorAwarded === 400
    );
  }
}
