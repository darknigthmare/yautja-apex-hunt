/**
 * Predator1987MacScorpioHuntAndCounterweightTreeSector (v205)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. Mac Eliot crushing the scorpion on Dillon's shoulder and humming his eerie tune ("Gonna have me some fun").
 * 2. Mac tracking the luminous green phosphor blood droplets of the wounded Jungle Hunter through the canopy leaves.
 * 3. Dutch Schaefer triggering the counter-weight tree trunk trap ("Run! Get to the chopper!"),
 *    releasing the 1,850 kg trunk from 6.2 meters to crush the Jungle Hunter.
 * 4. Dutch holding a heavy boulder over the pinned Jungle Hunter's head, refusing to crush him out of warrior respect.
 */
export class Predator1987MacScorpioHuntAndCounterweightTreeSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_MAC_SCORPIO_HUNT_AND_COUNTERWEIGHT_TREE';
    this.filmReference = 'Predator (1987) - Mac Scorpio Crush, Phosphor Blood Trail & Counter-Weight Tree Drop';
    this.reset();
  }

  reset() {
    this.scorpionCrushedAndSongHummed = false;
    this.phosphorBloodTrailFollowed = false;
    this.counterweightTreeTrunkDropped = false;
    this.pinnedYautjaSparedWithRespect = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  crushScorpionOnShoulderAndHumSong({
    scorpionCrushed = true,
    humDecibels = 42
  } = {}) {
    const db = Math.max(0, Number(humDecibels) || 0);
    this.scorpionCrushedAndSongHummed = Boolean(scorpionCrushed) && db >= 30;
    this.eventLog.push({
      step: 'SCORPION_CRUSHED_AND_SONG_HUMMED',
      humDecibels: db,
      scorpionCrushedAndSongHummed: this.scorpionCrushedAndSongHummed
    });
    return {
      scorpionCrushedAndSongHummed: this.scorpionCrushedAndSongHummed,
      humDecibels: db
    };
  }

  trackLuminousPhosphorBloodDropletsInCanopy({
    dropletsFound = 5,
    greenGlowWavelengthNm = 520
  } = {}) {
    if (!this.scorpionCrushedAndSongHummed) {
      throw new Error('Mac must crush scorpion before tracking phosphor blood trail.');
    }
    const count = Math.max(0, Math.floor(Number(dropletsFound) || 0));
    const nm = Math.max(0, Number(greenGlowWavelengthNm) || 0);
    this.phosphorBloodTrailFollowed = count >= 3 && nm >= 500 && nm <= 560;
    this.eventLog.push({
      step: 'PHOSPHOR_BLOOD_TRAIL_FOLLOWED',
      dropletsFound: count,
      greenGlowWavelengthNm: nm,
      phosphorBloodTrailFollowed: this.phosphorBloodTrailFollowed
    });
    return {
      phosphorBloodTrailFollowed: this.phosphorBloodTrailFollowed,
      dropletsFound: count
    };
  }

  triggerCounterweightTreeTrunkTrap({
    counterweightMassKg = 1850,
    dropHeightMeters = 6.2
  } = {}) {
    if (!this.phosphorBloodTrailFollowed) {
      throw new Error('Phosphor trail must be tracked before Dutch baits the Predator under the tree counterweight.');
    }
    const mass = Math.max(0, Number(counterweightMassKg) || 0);
    const height = Math.max(0, Number(dropHeightMeters) || 0);
    this.counterweightTreeTrunkDropped = mass >= 1400 && height >= 5.0;
    this.eventLog.push({
      step: 'COUNTERWEIGHT_TREE_TRUNK_DROPPED',
      counterweightMassKg: mass,
      dropHeightMeters: height,
      counterweightTreeTrunkDropped: this.counterweightTreeTrunkDropped
    });
    return {
      counterweightTreeTrunkDropped: this.counterweightTreeTrunkDropped,
      counterweightMassKg: mass
    };
  }

  spareCrushedYautjaHeadWithHeavyStone({
    warriorRespectHonored = true,
    mercyAwarded = true
  } = {}) {
    if (!this.counterweightTreeTrunkDropped) {
      throw new Error('Counterweight tree must crush target before Dutch decides on mercy with the boulder.');
    }
    this.pinnedYautjaSparedWithRespect = Boolean(warriorRespectHonored) && Boolean(mercyAwarded);
    if (this.pinnedYautjaSparedWithRespect) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'PINNED_YAUTJA_SPARED_WITH_RESPECT',
      pinnedYautjaSparedWithRespect: this.pinnedYautjaSparedWithRespect,
      honorAwarded: this.honorAwarded
    });
    return {
      pinnedYautjaSparedWithRespect: this.pinnedYautjaSparedWithRespect,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      scorpionCrushedAndSongHummed: this.scorpionCrushedAndSongHummed,
      phosphorBloodTrailFollowed: this.phosphorBloodTrailFollowed,
      counterweightTreeTrunkDropped: this.counterweightTreeTrunkDropped,
      pinnedYautjaSparedWithRespect: this.pinnedYautjaSparedWithRespect,
      honorAwarded: this.honorAwarded
    };
  }
}
