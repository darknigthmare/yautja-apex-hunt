/**
 * Predator1987ExplosiveBowCraftingAndTreePerchDropSector (v210)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. Dutch Schaefer whittling grenade arrows and binding gunpowder charges to wooden shafts with jungle vines.
 * 2. Climbing into a 16-meter tree bough perch to achieve optimal sniper concealment above the clearing.
 * 3. Firing the flaming explosive arrow to detonate directly against the Jungle Hunter's shoulder plasmacaster mount.
 * 4. Executing a vine pendulum drop onto the Hunter's back to force a primal hand-to-hand duel.
 */
export class Predator1987ExplosiveBowCraftingAndTreePerchDropSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_EXPLOSIVE_BOW_CRAFTING_AND_TREE_PERCH_DROP';
    this.filmReference = 'Predator (1987) - Explosive Arrow Crafting, 16m Tree Perch, Plasmacaster Shatter & Vine Drop';
    this.reset();
  }

  reset() {
    this.explosiveArrowsCrafted = false;
    this.treePerchClimbed = false;
    this.plasmacasterShatteredByArrow = false;
    this.ropeDropHandToHandForced = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  craftExplosiveArrowsWithSurvivalKnife({
    arrowsCraftedCount = 3,
    powderGramsPerArrow = 45
  } = {}) {
    const count = Math.max(0, Number(arrowsCraftedCount) || 0);
    const powder = Math.max(0, Number(powderGramsPerArrow) || 0);
    this.explosiveArrowsCrafted = count >= 2 && powder >= 30;
    this.eventLog.push({
      step: 'EXPLOSIVE_ARROWS_CRAFTED',
      arrowsCraftedCount: count,
      powderGramsPerArrow: powder,
      explosiveArrowsCrafted: this.explosiveArrowsCrafted
    });
    return {
      explosiveArrowsCrafted: this.explosiveArrowsCrafted,
      arrowsCraftedCount: count
    };
  }

  climbToSixteenMeterTreeBoughPerch({
    boughHeightMeters = 16,
    concealmentFactor = 0.95
  } = {}) {
    if (!this.explosiveArrowsCrafted) {
      throw new Error('Must craft explosive arrows before climbing into treetop perch.');
    }
    const height = Math.max(0, Number(boughHeightMeters) || 0);
    const concealment = Math.max(0, Number(concealmentFactor) || 0);
    this.treePerchClimbed = height >= 12 && concealment >= 0.85;
    this.eventLog.push({
      step: 'TREE_PERCH_CLIMBED',
      boughHeightMeters: height,
      concealmentFactor: concealment,
      treePerchClimbed: this.treePerchClimbed
    });
    return {
      treePerchClimbed: this.treePerchClimbed,
      boughHeightMeters: height
    };
  }

  fireExplosiveArrowToShatterPlasmacaster({
    arrowSpeedMps = 85,
    directHitCasterMount = true
  } = {}) {
    if (!this.treePerchClimbed) {
      throw new Error('Tree perch must be established before taking aim with explosive bow.');
    }
    const speed = Math.max(0, Number(arrowSpeedMps) || 0);
    this.plasmacasterShatteredByArrow = speed >= 70 && Boolean(directHitCasterMount);
    this.eventLog.push({
      step: 'PLASMACASTER_SHATTERED_BY_ARROW',
      arrowSpeedMps: speed,
      directHitCasterMount: Boolean(directHitCasterMount),
      plasmacasterShatteredByArrow: this.plasmacasterShatteredByArrow
    });
    return {
      plasmacasterShatteredByArrow: this.plasmacasterShatteredByArrow,
      arrowSpeedMps: speed
    };
  }

  executeRopePendulumDropOntoHunterBack({
    dropHeightMeters = 16,
    handToHandForced = true
  } = {}) {
    if (!this.plasmacasterShatteredByArrow) {
      throw new Error('Plasmacaster must be shattered before leaping from the tree bough.');
    }
    const drop = Math.max(0, Number(dropHeightMeters) || 0);
    this.ropeDropHandToHandForced = drop >= 12 && Boolean(handToHandForced);
    if (this.ropeDropHandToHandForced) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'ROPE_DROP_HAND_TO_HAND_FORCED',
      dropHeightMeters: drop,
      ropeDropHandToHandForced: this.ropeDropHandToHandForced,
      honorAwarded: this.honorAwarded
    });
    return {
      ropeDropHandToHandForced: this.ropeDropHandToHandForced,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      explosiveArrowsCrafted: this.explosiveArrowsCrafted,
      treePerchClimbed: this.treePerchClimbed,
      plasmacasterShatteredByArrow: this.plasmacasterShatteredByArrow,
      ropeDropHandToHandForced: this.ropeDropHandToHandForced,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
