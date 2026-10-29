/**
 * Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector (v225)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. City Hunter stalking Danny Archuleta down a rainy Los Angeles alleyway under flickering neon signs.
 * 2. Hurling the telescoping combistick with immense hydraulic force (velocity 65 m/s, pinning distance 22m).
 * 3. Scaling a vertical brick fire escape wall with clawed gauntlets to evade LAPD containment perimeter.
 * 4. Applying blue coagulant spray and surgical staples while perched above the crime scene (+400 Honor).
 */
export class Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_ALLEYWAY_COMBISTICK_THROW_AND_MEDICOMP_WALL_SCALE';
    this.filmReference = 'Predator 2 (1990) - Rainy Alleyway Combistick Impalement & Vertical Wall Medicomp Suture';
    this.reset();
  }

  reset() {
    this.alleywayQuarryStalked = false;
    this.combistickTorqueThrowExecuted = false;
    this.brickWallFireEscapeScaled = false;
    this.medicompCoagulantStapled = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  stalkAlleywayQuarryInRain({
    rainIntensityMmH = 75,
    neonInterferenceLux = 14.5
  } = {}) {
    const rain = Math.max(0, Number(rainIntensityMmH) || 0);
    const lux = Math.max(0, Number(neonInterferenceLux) || 0);
    this.alleywayQuarryStalked = rain >= 50 && lux >= 10.0;
    this.eventLog.push({
      step: 'ALLEYWAY_QUARRY_STALKED',
      rainIntensityMmH: rain,
      neonInterferenceLux: lux,
      alleywayQuarryStalked: this.alleywayQuarryStalked
    });
    return {
      alleywayQuarryStalked: this.alleywayQuarryStalked
    };
  }

  executeCombistickTorqueThrow({
    throwVelocityMs = 65,
    pinningRangeMeters = 22
  } = {}) {
    if (!this.alleywayQuarryStalked) {
      throw new Error('Must stalk quarry before executing combistick throw.');
    }
    const vel = Math.max(0, Number(throwVelocityMs) || 0);
    const range = Math.max(0, Number(pinningRangeMeters) || 0);
    this.combistickTorqueThrowExecuted = vel >= 55 && range >= 18;
    this.eventLog.push({
      step: 'COMBISTICK_TORQUE_THROW_EXECUTED',
      throwVelocityMs: vel,
      pinningRangeMeters: range,
      combistickTorqueThrowExecuted: this.combistickTorqueThrowExecuted
    });
    return {
      combistickTorqueThrowExecuted: this.combistickTorqueThrowExecuted
    };
  }

  scaleBrickWallFireEscape({
    wallVerticalHeightMeters = 18.5,
    clawGripReliabilityScore = 0.99
  } = {}) {
    if (!this.combistickTorqueThrowExecuted) {
      throw new Error('Must execute combistick throw before scaling brick wall.');
    }
    const height = Math.max(0, Number(wallVerticalHeightMeters) || 0);
    const score = Number(clawGripReliabilityScore) || 0;
    this.brickWallFireEscapeScaled = height >= 15.0 && score >= 0.95;
    this.eventLog.push({
      step: 'BRICK_WALL_FIRE_ESCAPE_SCALED',
      wallVerticalHeightMeters: height,
      clawGripReliabilityScore: score,
      brickWallFireEscapeScaled: this.brickWallFireEscapeScaled
    });
    return {
      brickWallFireEscapeScaled: this.brickWallFireEscapeScaled
    };
  }

  applyMedicompCoagulantAndStaples({
    coagulantVolumeMl = 45,
    surgicalStaplesSecuredCount = 6
  } = {}) {
    if (!this.brickWallFireEscapeScaled) {
      throw new Error('Must scale wall before applying Medicomp sutures.');
    }
    const vol = Math.max(0, Number(coagulantVolumeMl) || 0);
    const staples = Math.max(0, Number(surgicalStaplesSecuredCount) || 0);
    this.medicompCoagulantStapled = vol >= 35 && staples >= 4;
    if (this.medicompCoagulantStapled) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'MEDICOMP_COAGULANT_STAPLED',
      coagulantVolumeMl: vol,
      surgicalStaplesSecuredCount: staples,
      medicompCoagulantStapled: this.medicompCoagulantStapled,
      honorAwarded: this.honorAwarded
    });
    return {
      medicompCoagulantStapled: this.medicompCoagulantStapled,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.alleywayQuarryStalked &&
      this.combistickTorqueThrowExecuted &&
      this.brickWallFireEscapeScaled &&
      this.medicompCoagulantStapled &&
      this.honorAwarded === 400
    );
  }
}
