/**
 * YautjaSpinalFluidGeneticExtractorSystem.js
 * Chantier 4 (v151) : Sonde chirurgicale de prélèvement d'ADN spinal Yautja (The Predator 2018 / Predators 2010).
 * Extracteur biomédical permettant de prélever le fluide rachidien d'une proie d'élite vaincue :
 * - Analyse les marqueurs génétiques d'adaptation (endurance synaptique, résistance thermique,
 *   densité dermique) et synthétise un sérum d'optimisation métabolique pour le chasseur.
 */

export class YautjaSpinalFluidGeneticExtractorSystem {
  constructor(options = {}) {
    this.maxVialsCapacity = options.maxVialsCapacity ?? 3;
    this.healthBoostPerTrait = options.healthBoostPerTrait ?? 35;
    this.staminaRegenMultiplierGain = options.staminaRegenMultiplierGain ?? 0.25;

    this.state = {
      harvestedVials: [],
      assimilatedTraits: [],
      totalExtractions: 0
    };
  }

  harvestEliteSpinalFluid(defeatedApexSpec = {}, audioSynthesizer = null) {
    if (this.state.harvestedVials.length >= this.maxVialsCapacity) {
      return { harvested: false, reason: 'vial_storage_full' };
    }
    if (!defeatedApexSpec.isWorthyElitePrey && defeatedApexSpec.health > 0) {
      return { harvested: false, reason: 'target_not_eligible_for_harvest' };
    }

    const trait = defeatedApexSpec.geneticTrait ?? 'SYNAPTIC_REFLEX_ACCELERATION';
    const vial = {
      vialId: `vial_${this.state.totalExtractions + 1}`,
      sourceSpecies: defeatedApexSpec.species ?? 'APEX_SPECIMEN',
      geneticTrait: trait,
      purityRatio: 0.98
    };

    this.state.harvestedVials.push(vial);
    this.state.totalExtractions += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playSpinalFluidExtractorNeedlePlunge === 'function') {
      audioSynthesizer.playSpinalFluidExtractorNeedlePlunge(1.0);
    }

    return {
      harvested: true,
      vial
    };
  }

  assimilateGeneticVial(hunter = {}, audioSynthesizer = null) {
    if (this.state.harvestedVials.length === 0) {
      return { assimilated: false, reason: 'no_harvested_vials' };
    }

    const vial = this.state.harvestedVials.shift();
    this.state.assimilatedTraits.push(vial.geneticTrait);

    hunter.maxHealth = Number(hunter.maxHealth ?? 200) + this.healthBoostPerTrait;
    hunter.health = hunter.maxHealth;
    hunter.staminaRegenMultiplier = Number((Number(hunter.staminaRegenMultiplier ?? 1.0) + this.staminaRegenMultiplierGain).toFixed(2));

    if (audioSynthesizer && typeof audioSynthesizer.playGeneticAssimilationMetabolicSurge === 'function') {
      audioSynthesizer.playGeneticAssimilationMetabolicSurge(1.1);
    }

    return {
      assimilated: true,
      traitUnlocked: vial.geneticTrait,
      newMaxHealth: hunter.maxHealth,
      newStaminaRegenMultiplier: hunter.staminaRegenMultiplier
    };
  }

  getStatus() {
    return {
      harvestedVialsCount: this.state.harvestedVials.length,
      assimilatedTraits: [...this.state.assimilatedTraits],
      totalExtractions: this.state.totalExtractions
    };
  }
}
