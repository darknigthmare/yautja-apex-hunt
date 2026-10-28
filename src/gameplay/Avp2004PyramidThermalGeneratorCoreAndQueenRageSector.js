/**
 * Avp2004PyramidThermalGeneratorCoreAndQueenRageSector (v212)
 *
 * Implements iconic 1:1 set-pieces from Alien vs. Predator (2004):
 * 1. Descending into the ancient subterranean geothermal generator core deep below Bouvetøya Island.
 * 2. Defending Lex Woods from swarming Xenomorph drones with rapid-fire plasma caster volleys.
 * 3. Anchoring the enraged Xenomorph Queen's thrashing tail with heavy industrial steel winch cables on the whaling pier.
 * 4. Triggering high-pressure geothermal steam vents to thermal-shock and blister the Queen's chitin carapace.
 */
export class Avp2004PyramidThermalGeneratorCoreAndQueenRageSector {
  constructor() {
    this.sectorId = 'AVP_2004_PYRAMID_THERMAL_GENERATOR_CORE_AND_QUEEN_RAGE';
    this.filmReference = 'Alien vs. Predator (2004) - Thermal Generator Core, Plasma Caster Swarm Defense, Whaling Pier Steel Winch Cables & Steam Vent Purge';
    this.reset();
  }

  reset() {
    this.thermalGeneratorCoreReached = false;
    this.lexDefendedAgainstSwarm = false;
    this.queenTailAnchoredOnPier = false;
    this.steamVentPurgeTriggered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  reachAncientSubterraneanThermalGeneratorCore({
    geothermalTempCelsius = 380,
    shiftMechanismCycles = 8
  } = {}) {
    const temp = Math.max(0, Number(geothermalTempCelsius) || 0);
    const cycles = Math.max(0, Number(shiftMechanismCycles) || 0);
    this.thermalGeneratorCoreReached = temp >= 200 && cycles >= 4;
    this.eventLog.push({
      step: 'THERMAL_GENERATOR_CORE_REACHED',
      geothermalTempCelsius: temp,
      shiftMechanismCycles: cycles,
      thermalGeneratorCoreReached: this.thermalGeneratorCoreReached
    });
    return {
      thermalGeneratorCoreReached: this.thermalGeneratorCoreReached,
      geothermalTempCelsius: temp
    };
  }

  defendLexAgainstXenomorphSwarmWithPlasmaCaster({
    plasmaBlastCount = 14,
    dronesIncineratedCount = 9
  } = {}) {
    if (!this.thermalGeneratorCoreReached) {
      throw new Error('Must reach the pyramid thermal generator core before engaging the Xenomorph swarm.');
    }
    const blasts = Math.max(0, Number(plasmaBlastCount) || 0);
    const drones = Math.max(0, Number(dronesIncineratedCount) || 0);
    this.lexDefendedAgainstSwarm = blasts >= 8 && drones >= 5;
    this.eventLog.push({
      step: 'LEX_DEFENDED_AGAINST_SWARM',
      plasmaBlastCount: blasts,
      dronesIncineratedCount: drones,
      lexDefendedAgainstSwarm: this.lexDefendedAgainstSwarm
    });
    return {
      lexDefendedAgainstSwarm: this.lexDefendedAgainstSwarm,
      dronesIncineratedCount: drones
    };
  }

  anchorQueenTailWithSteelCablesOnWhalingPier({
    cableTensileStrMpa = 1250,
    winchTensionKn = 450
  } = {}) {
    if (!this.lexDefendedAgainstSwarm) {
      throw new Error('Must defend Lex Woods from drones before confronting the Queen on the whaling pier.');
    }
    const tensile = Math.max(0, Number(cableTensileStrMpa) || 0);
    const tension = Math.max(0, Number(winchTensionKn) || 0);
    this.queenTailAnchoredOnPier = tensile >= 800 && tension >= 300;
    this.eventLog.push({
      step: 'QUEEN_TAIL_ANCHORED_ON_PIER',
      cableTensileStrMpa: tensile,
      winchTensionKn: tension,
      queenTailAnchoredOnPier: this.queenTailAnchoredOnPier
    });
    return {
      queenTailAnchoredOnPier: this.queenTailAnchoredOnPier,
      winchTensionKn: tension
    };
  }

  triggerSteamVentPurgeToBlisterQueenCarapace({
    steamPressurePsi = 2200,
    carapaceThermalShockPercent = 88
  } = {}) {
    if (!this.queenTailAnchoredOnPier) {
      throw new Error('Queen tail must be securely anchored before activating geothermal steam vent purge.');
    }
    const psi = Math.max(0, Number(steamPressurePsi) || 0);
    const shock = Math.max(0, Number(carapaceThermalShockPercent) || 0);
    this.steamVentPurgeTriggered = psi >= 1500 && shock >= 60;
    if (this.steamVentPurgeTriggered) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'STEAM_VENT_PURGE_TRIGGERED',
      steamPressurePsi: psi,
      carapaceThermalShockPercent: shock,
      steamVentPurgeTriggered: this.steamVentPurgeTriggered,
      honorAwarded: this.honorAwarded
    });
    return {
      steamVentPurgeTriggered: this.steamVentPurgeTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      thermalGeneratorCoreReached: this.thermalGeneratorCoreReached,
      lexDefendedAgainstSwarm: this.lexDefendedAgainstSwarm,
      queenTailAnchoredOnPier: this.queenTailAnchoredOnPier,
      steamVentPurgeTriggered: this.steamVentPurgeTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
