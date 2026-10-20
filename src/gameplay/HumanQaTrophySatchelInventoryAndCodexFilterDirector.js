/**
 * HumanQaTrophySatchelInventoryAndCodexFilterDirector.js
 * 
 * Human Playtester QA Audit #1: Inventory Overburden & Codex Clutter Resolution.
 * Solves infinite trophy hoarding exploit by implementing diegetic satchel mass limits and sprint penalties,
 * and organizes lore codex entries with taxonomic species filtering tabs.
 */

export class HumanQaTrophySatchelInventoryAndCodexFilterDirector {
  /**
   * @param {Object} options
   * @param {number} [options.maxSatchelWeightKg=35.0]
   * @param {string} [options.activeCategoryFilter='ALL']
   */
  constructor(options = {}) {
    this.maxSatchelWeightKg = options.maxSatchelWeightKg || 35.0;
    this.currentSatchelWeightKg = 0.0;
    this.trophyItems = [];
    this.activeCategoryFilter = options.activeCategoryFilter || 'ALL';

    this.validSpeciesCategories = [
      'ALL',
      'XENOMORPH',
      'HUMAN_SPEC_OPS',
      'APEX_PREDATOR',
      'EXTRATERRESTRIAL'
    ];
  }

  /**
   * Adds a gathered hunting trophy to the satchel.
   * @param {Object} trophy
   * @param {string} trophy.trophyId
   * @param {string} trophy.species - Species classification
   * @param {number} trophy.weightKg - Weight in kilograms
   * @param {number} trophy.honorValue - Yautja honor points
   * @returns {Object} Result of addition
   */
  addTrophyToSatchel(trophy) {
    if (!trophy || !trophy.trophyId) {
      return { success: false, reason: 'INVALID_TROPHY' };
    }

    const itemWeight = Number(trophy.weightKg) || 1.0;
    const newTotal = +(this.currentSatchelWeightKg + itemWeight).toFixed(2);

    this.trophyItems.push({
      trophyId: trophy.trophyId,
      species: trophy.species || 'EXTRATERRESTRIAL',
      weightKg: itemWeight,
      honorValue: Number(trophy.honorValue) || 100,
      timestamp: Date.now()
    });

    this.currentSatchelWeightKg = newTotal;
    const penaltyState = this.calculateMovementPenalty();

    return {
      success: true,
      trophyId: trophy.trophyId,
      currentSatchelWeightKg: this.currentSatchelWeightKg,
      maxSatchelWeightKg: this.maxSatchelWeightKg,
      isEncumbered: penaltyState.isEncumbered,
      isOverburdened: penaltyState.isOverburdened,
      speedPenaltyMultiplier: penaltyState.speedPenaltyMultiplier
    };
  }

  /**
   * Removes a trophy from the satchel (e.g. deposited in Mothership trophy wall).
   * @param {string} trophyId
   * @returns {Object}
   */
  removeTrophy(trophyId) {
    const index = this.trophyItems.findIndex(t => t.trophyId === trophyId);
    if (index === -1) {
      return { success: false, reason: 'TROPHY_NOT_FOUND' };
    }

    const removed = this.trophyItems.splice(index, 1)[0];
    this.currentSatchelWeightKg = Math.max(0, +(this.currentSatchelWeightKg - removed.weightKg).toFixed(2));
    const penaltyState = this.calculateMovementPenalty();

    return {
      success: true,
      removedItem: removed,
      currentSatchelWeightKg: this.currentSatchelWeightKg,
      speedPenaltyMultiplier: penaltyState.speedPenaltyMultiplier
    };
  }

  /**
   * Calculates encumbrance and speed degradation from satchel mass.
   * @returns {Object}
   */
  calculateMovementPenalty() {
    const fillRatio = this.currentSatchelWeightKg / this.maxSatchelWeightKg;
    const isEncumbered = fillRatio > 0.85;
    const isOverburdened = fillRatio > 1.0;

    let speedPenaltyMultiplier = 1.0;
    if (isOverburdened) {
      // Up to 35% speed penalty when overburdened
      const excess = Math.min(1.0, fillRatio - 1.0);
      speedPenaltyMultiplier = +(1.0 - (0.20 + excess * 0.15)).toFixed(2);
    } else if (isEncumbered) {
      speedPenaltyMultiplier = +(1.0 - ((fillRatio - 0.85) / 0.15) * 0.10).toFixed(2);
    }

    return {
      fillPercentage: Math.round(fillRatio * 100),
      isEncumbered,
      isOverburdened,
      speedPenaltyMultiplier
    };
  }

  /**
   * Sets the active species category filter for the UI codex.
   * @param {string} category
   * @returns {boolean}
   */
  setCodexCategoryFilter(category) {
    if (this.validSpeciesCategories.includes(category)) {
      this.activeCategoryFilter = category;
      return true;
    }
    return false;
  }

  /**
   * Filters and sorts codex entries based on category pill and search query.
   * @param {Array<Object>} entries
   * @param {string} [categoryFilter]
   * @param {string} [searchKeyword]
   * @returns {Array<Object>}
   */
  filterCodexEntries(entries = [], categoryFilter = this.activeCategoryFilter, searchKeyword = '') {
    if (!Array.isArray(entries)) return [];

    let filtered = entries;

    if (categoryFilter && categoryFilter !== 'ALL') {
      filtered = filtered.filter(entry => entry.speciesCategory === categoryFilter);
    }

    if (searchKeyword && searchKeyword.trim().length > 0) {
      const q = searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(entry => 
        (entry.title && entry.title.toLowerCase().includes(q)) ||
        (entry.description && entry.description.toLowerCase().includes(q)) ||
        (entry.originPlanet && entry.originPlanet.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  /**
   * Generates HUD representation state for the UI renderer.
   * @returns {Object}
   */
  getSatchelHudState() {
    const penalty = this.calculateMovementPenalty();
    return {
      currentSatchelWeightKg: this.currentSatchelWeightKg,
      maxSatchelWeightKg: this.maxSatchelWeightKg,
      fillPercentage: penalty.fillPercentage,
      isEncumbered: penalty.isEncumbered,
      isOverburdened: penalty.isOverburdened,
      speedPenaltyMultiplier: penalty.speedPenaltyMultiplier,
      trophyCount: this.trophyItems.length,
      activeCategoryFilter: this.activeCategoryFilter,
      categories: [...this.validSpeciesCategories]
    };
  }
}
