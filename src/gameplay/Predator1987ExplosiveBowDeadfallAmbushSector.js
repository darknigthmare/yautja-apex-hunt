/**
 * Predator1987ExplosiveBowDeadfallAmbushSector (v234)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Dutch crafting crude ash-wood bow and mounting 40mm grenade warhead onto bamboo arrow shaft.
 * 2. Rigging 250kg Ceiba counterweight deadfall log suspended by jungle vine tripwire.
 * 3. Firing explosive bow shot into canopy foliage, detonating adjacent to Jungle Hunter and stunning his optical camouflage.
 * 4. Jungle Hunter unmasking, flaring mandibles with iconic clicking roar, and triggering the deadfall drop (+350 Honor).
 */
export class Predator1987ExplosiveBowDeadfallAmbushSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_EXPLOSIVE_BOW_DEADFALL_AMBUSH';
    this.filmReference = 'Predator (1987) - Explosive Bamboo Arrow, Canopy Deadfall Rig & Unmasked Mandible Roar';
    this.reset();
  }

  reset() {
    this.explosiveArrowCrafted = false;
    this.counterweightDeadfallRigged = false;
    this.canopyExplosiveBowFired = false;
    this.unmaskedMandibleRoarEndured = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  craftExplosiveBambooArrow({
    bambooShaftLengthCm = 85,
    grenadeWarheadYieldGrams = 180,
    flightStabilizationScore = 0.95
  } = {}) {
    const len = Math.max(0, Number(bambooShaftLengthCm) || 0);
    const yieldG = Math.max(0, Number(grenadeWarheadYieldGrams) || 0);
    const stab = Number(flightStabilizationScore) || 0;

    this.explosiveArrowCrafted = len >= 70 && yieldG >= 120 && stab >= 0.90;
    this.eventLog.push({
      step: 'EXPLOSIVE_BAMBOO_ARROW_CRAFTED',
      bambooShaftLengthCm: len,
      grenadeWarheadYieldGrams: yieldG,
      flightStabilizationScore: stab,
      explosiveArrowCrafted: this.explosiveArrowCrafted
    });
    return {
      explosiveArrowCrafted: this.explosiveArrowCrafted
    };
  }

  rigCounterweightDeadfall({
    deadfallLogWeightKg = 250,
    vineTripwireTensionNewtons = 1200,
    deadfallDropElevationMeters = 7.5
  } = {}) {
    if (!this.explosiveArrowCrafted) {
      throw new Error('Must craft explosive arrow before rigging deadfall.');
    }
    const wt = Math.max(0, Number(deadfallLogWeightKg) || 0);
    const tens = Math.max(0, Number(vineTripwireTensionNewtons) || 0);
    const elev = Math.max(0, Number(deadfallDropElevationMeters) || 0);

    this.counterweightDeadfallRigged = wt >= 200 && tens >= 800 && elev >= 5.0;
    this.eventLog.push({
      step: 'COUNTERWEIGHT_DEADFALL_RIGGED',
      deadfallLogWeightKg: wt,
      vineTripwireTensionNewtons: tens,
      deadfallDropElevationMeters: elev,
      counterweightDeadfallRigged: this.counterweightDeadfallRigged
    });
    return {
      counterweightDeadfallRigged: this.counterweightDeadfallRigged
    };
  }

  fireCanopyExplosiveBow({
    arrowDrawForceLbs = 65,
    canopyDetonationRadiusMeters = 3.5,
    camouflageDisruptionDurationSec = 4.2
  } = {}) {
    if (!this.counterweightDeadfallRigged) {
      throw new Error('Must rig counterweight deadfall before firing bow.');
    }
    const draw = Math.max(0, Number(arrowDrawForceLbs) || 0);
    const rad = Math.max(0, Number(canopyDetonationRadiusMeters) || 0);
    const dur = Number(camouflageDisruptionDurationSec) || 0;

    this.canopyExplosiveBowFired = draw >= 50 && rad >= 2.5 && dur >= 3.0;
    this.eventLog.push({
      step: 'CANOPY_EXPLOSIVE_BOW_FIRED',
      arrowDrawForceLbs: draw,
      canopyDetonationRadiusMeters: rad,
      camouflageDisruptionDurationSec: dur,
      canopyExplosiveBowFired: this.canopyExplosiveBowFired
    });
    return {
      canopyExplosiveBowFired: this.canopyExplosiveBowFired
    };
  }

  endureUnmaskedMandibleRoar({
    bioMaskPneumaticHissDb = 82,
    mandibleSpreadDegrees = 78,
    gutturalChallengeAcousticDb = 114
  } = {}) {
    if (!this.canopyExplosiveBowFired) {
      throw new Error('Must fire explosive bow before unmasking sequence.');
    }
    const hiss = Number(bioMaskPneumaticHissDb) || 0;
    const spread = Number(mandibleSpreadDegrees) || 0;
    const roar = Number(gutturalChallengeAcousticDb) || 0;

    this.unmaskedMandibleRoarEndured = hiss >= 70 && spread >= 60 && roar >= 100;
    if (this.unmaskedMandibleRoarEndured) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'UNMASKED_MANDIBLE_ROAR_ENDURED',
      bioMaskPneumaticHissDb: hiss,
      mandibleSpreadDegrees: spread,
      gutturalChallengeAcousticDb: roar,
      unmaskedMandibleRoarEndured: this.unmaskedMandibleRoarEndured,
      honorAwarded: this.honorAwarded
    });
    return {
      unmaskedMandibleRoarEndured: this.unmaskedMandibleRoarEndured,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.explosiveArrowCrafted &&
      this.counterweightDeadfallRigged &&
      this.canopyExplosiveBowFired &&
      this.unmaskedMandibleRoarEndured &&
      this.honorAwarded === 350
    );
  }
}
