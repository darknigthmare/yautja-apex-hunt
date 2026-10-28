/**
 * Predator1987DecoyFireSpikeLogCounterweightSector (v214)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. Rigging an overhead counterweight vine suspension system with heavy jungle hardwood timber.
 * 2. Igniting a decoy bonfire to distract and bait the Jungle Hunter's thermal vision spectrum.
 * 3. Shouting Dutch's iconic battle challenge ("Come on, come on... do it now! Kill me!") and dodging a close-range plasma blast.
 * 4. Kicking the wooden tripwire peg to release the suspended spike deadfall log.
 */
export class Predator1987DecoyFireSpikeLogCounterweightSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_DECOY_FIRE_SPIKE_LOG_COUNTERWEIGHT';
    this.filmReference = 'Predator (1987) - Counterweight Vine Suspension, Decoy Fire, Dutch Battle Taunt & Tripwire Peg Kick';
    this.reset();
  }

  reset() {
    this.counterweightVineSuspensionRigged = false;
    this.decoyBonfireIgnited = false;
    this.dutchBattleTauntShouted = false;
    this.tripwirePegKickedDeadfallReleased = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  rigCounterweightVineSuspensionSystem({
    vineTensileStrengthKn = 14,
    counterweightMassKg = 320
  } = {}) {
    const tensile = Math.max(0, Number(vineTensileStrengthKn) || 0);
    const mass = Math.max(0, Number(counterweightMassKg) || 0);
    this.counterweightVineSuspensionRigged = tensile >= 10 && mass >= 250;
    this.eventLog.push({
      step: 'COUNTERWEIGHT_VINE_SUSPENSION_RIGGED',
      vineTensileStrengthKn: tensile,
      counterweightMassKg: mass,
      counterweightVineSuspensionRigged: this.counterweightVineSuspensionRigged
    });
    return {
      counterweightVineSuspensionRigged: this.counterweightVineSuspensionRigged,
      counterweightMassKg: mass
    };
  }

  igniteDecoyCampfireToBaitThermalOptics({
    flareIntensityCelsius = 550,
    thermalDecoyEffective = true
  } = {}) {
    if (!this.counterweightVineSuspensionRigged) {
      throw new Error('Must rig counterweight vine suspension before lighting the decoy campfire.');
    }
    const temp = Math.max(0, Number(flareIntensityCelsius) || 0);
    this.decoyBonfireIgnited = temp >= 400 && Boolean(thermalDecoyEffective);
    this.eventLog.push({
      step: 'DECOY_BONFIRE_IGNITED',
      flareIntensityCelsius: temp,
      thermalDecoyEffective: Boolean(thermalDecoyEffective),
      decoyBonfireIgnited: this.decoyBonfireIgnited
    });
    return {
      decoyBonfireIgnited: this.decoyBonfireIgnited,
      flareIntensityCelsius: temp
    };
  }

  shoutIconicTauntAndDodgePlasmaCasterBolt({
    tauntDecibels = 110,
    plasmaBlastDodgeMarginMeters = 0.8
  } = {}) {
    if (!this.decoyBonfireIgnited) {
      throw new Error('Decoy campfire must be burning to bait the Jungle Hunter into close range.');
    }
    const db = Math.max(0, Number(tauntDecibels) || 0);
    const margin = Math.max(0, Number(plasmaBlastDodgeMarginMeters) || 0);
    this.dutchBattleTauntShouted = db >= 90 && margin >= 0.5;
    this.eventLog.push({
      step: 'DUTCH_BATTLE_TAUNT_SHOUTED',
      tauntDecibels: db,
      plasmaBlastDodgeMarginMeters: margin,
      dutchBattleTauntShouted: this.dutchBattleTauntShouted
    });
    return {
      dutchBattleTauntShouted: this.dutchBattleTauntShouted,
      tauntDecibels: db
    };
  }

  kickTripwirePegToReleaseOverheadSpikeDeadfall({
    tripwireReleaseForceNewtons = 180,
    deadfallImpactJoules = 16500
  } = {}) {
    if (!this.dutchBattleTauntShouted) {
      throw new Error('Must shout taunt and draw the Jungle Hunter beneath the deadfall before releasing the peg.');
    }
    const force = Math.max(0, Number(tripwireReleaseForceNewtons) || 0);
    const joules = Math.max(0, Number(deadfallImpactJoules) || 0);
    this.tripwirePegKickedDeadfallReleased = force >= 100 && joules >= 12000;
    if (this.tripwirePegKickedDeadfallReleased) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'TRIPWIRE_PEG_KICKED_DEADFALL_RELEASED',
      tripwireReleaseForceNewtons: force,
      deadfallImpactJoules: joules,
      tripwirePegKickedDeadfallReleased: this.tripwirePegKickedDeadfallReleased,
      honorAwarded: this.honorAwarded
    });
    return {
      tripwirePegKickedDeadfallReleased: this.tripwirePegKickedDeadfallReleased,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      counterweightVineSuspensionRigged: this.counterweightVineSuspensionRigged,
      decoyBonfireIgnited: this.decoyBonfireIgnited,
      dutchBattleTauntShouted: this.dutchBattleTauntShouted,
      tripwirePegKickedDeadfallReleased: this.tripwirePegKickedDeadfallReleased,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
