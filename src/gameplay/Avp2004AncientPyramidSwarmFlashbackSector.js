/**
 * Avp2004AncientPyramidSwarmFlashbackSector (v231)
 *
 * Implements iconic 1:1 canonical set-pieces from Alien vs. Predator (2004):
 * 1. The ancient Earth flashback: Yautja Gods arriving thousands of years ago to teach humans megalithic pyramid construction.
 * 2. Human sacrificial hosts willingly offering themselves in the subterranean temple to breed xenomorph serpents.
 * 3. Three unblooded adolescent Yautja hunters standing atop the summit of the colossal pyramid.
 * 4. Repelling a horde of thousands of climbing Xenomorph drones with continuous plasma barrage and smart disc sweeps (+400 Honor).
 */
export class Avp2004AncientPyramidSwarmFlashbackSector {
  constructor() {
    this.sectorId = 'AVP_2004_ANCIENT_PYRAMID_SWARM_FLASHBACK';
    this.filmReference = 'Alien vs. Predator (2004) - Ancient Earth Gods Flashback, Sacrificial Breeding & Pyramid Summit Last Stand';
    this.reset();
  }

  reset() {
    this.ancientGodsFlashbackInitiated = false;
    this.sacrificialBreedingChamberPrimed = false;
    this.pyramidSummitStandoffHeld = false;
    this.endlessSwarmPlasmaRepelled = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  initiateAncientGodsFlashback({
    civilizationEraYearsAgo = 5000,
    megalithicPyramidHeightMeters = 85
  } = {}) {
    const years = Math.max(0, Number(civilizationEraYearsAgo) || 0);
    const height = Math.max(0, Number(megalithicPyramidHeightMeters) || 0);
    this.ancientGodsFlashbackInitiated = years >= 3000 && height >= 60;
    this.eventLog.push({
      step: 'ANCIENT_GODS_FLASHBACK_INITIATED',
      civilizationEraYearsAgo: years,
      megalithicPyramidHeightMeters: height,
      ancientGodsFlashbackInitiated: this.ancientGodsFlashbackInitiated
    });
    return {
      ancientGodsFlashbackInitiated: this.ancientGodsFlashbackInitiated
    };
  }

  primeSacrificialBreedingChamber({
    sacrificialHostCount = 100,
    xenomorphIncubationRatePercent = 100
  } = {}) {
    if (!this.ancientGodsFlashbackInitiated) {
      throw new Error('Must initiate ancient flashback before priming sacrificial breeding chamber.');
    }
    const hosts = Math.max(0, Number(sacrificialHostCount) || 0);
    const rate = Number(xenomorphIncubationRatePercent) || 0;
    this.sacrificialBreedingChamberPrimed = hosts >= 50 && rate >= 90;
    this.eventLog.push({
      step: 'SACRIFICIAL_BREEDING_CHAMBER_PRIMED',
      sacrificialHostCount: hosts,
      xenomorphIncubationRatePercent: rate,
      sacrificialBreedingChamberPrimed: this.sacrificialBreedingChamberPrimed
    });
    return {
      sacrificialBreedingChamberPrimed: this.sacrificialBreedingChamberPrimed
    };
  }

  holdPyramidSummitStandoff({
    unbloodedHunterCount = 3,
    summitSteepInclineDegrees = 52
  } = {}) {
    if (!this.sacrificialBreedingChamberPrimed) {
      throw new Error('Must prime breeding chamber before holding pyramid summit standoff.');
    }
    const hunters = Math.max(0, Number(unbloodedHunterCount) || 0);
    const incline = Math.max(0, Number(summitSteepInclineDegrees) || 0);
    this.pyramidSummitStandoffHeld = hunters === 3 && incline >= 45;
    this.eventLog.push({
      step: 'PYRAMID_SUMMIT_STANDOFF_HELD',
      unbloodedHunterCount: hunters,
      summitSteepInclineDegrees: incline,
      pyramidSummitStandoffHeld: this.pyramidSummitStandoffHeld
    });
    return {
      pyramidSummitStandoffHeld: this.pyramidSummitStandoffHeld
    };
  }

  repelEndlessSwarmWithPlasmaBarrage({
    plasmaVolleyRatePerMinute = 240,
    xenomorphSwarmDecimationCount = 1200
  } = {}) {
    if (!this.pyramidSummitStandoffHeld) {
      throw new Error('Must hold pyramid summit standoff before repelling endless swarm.');
    }
    const rate = Math.max(0, Number(plasmaVolleyRatePerMinute) || 0);
    const count = Math.max(0, Number(xenomorphSwarmDecimationCount) || 0);
    this.endlessSwarmPlasmaRepelled = rate >= 180 && count >= 800;
    if (this.endlessSwarmPlasmaRepelled) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'ENDLESS_SWARM_PLASMA_REPELLED',
      plasmaVolleyRatePerMinute: rate,
      xenomorphSwarmDecimationCount: count,
      endlessSwarmPlasmaRepelled: this.endlessSwarmPlasmaRepelled,
      honorAwarded: this.honorAwarded
    });
    return {
      endlessSwarmPlasmaRepelled: this.endlessSwarmPlasmaRepelled,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.ancientGodsFlashbackInitiated &&
      this.sacrificialBreedingChamberPrimed &&
      this.pyramidSummitStandoffHeld &&
      this.endlessSwarmPlasmaRepelled &&
      this.honorAwarded === 400
    );
  }
}
