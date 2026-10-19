/**
 * MothershipSkullTrophyWallSanctumDirector.js
 * Chantier 6 (v148) : Salle des trophées crâniens du vaisseau & autel d'offrande (Predator 2 Lost Tribe).
 * Sanctuaire interne du vaisseau-mère de la Lost Tribe à Los Angeles :
 * - Paroi d'alcôves osseuses abritant les crânes canoniques (Xenomorphe, T-Rex préhistorique,
 *   Alpha Bad Blood, officiers d'élite humains) illuminés par une brume ambrée.
 * - Permet d'enchâsser un nouveau crâne blanchi après une chasse victorieuse pour recevoir
 *   la bénédiction de Greyback et débloquer les reliques ancestrales (comme le pistolet à silex 1715).
 */

export class MothershipSkullTrophyWallSanctumDirector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'lost_tribe_mothership_trophy_wall_sanctum';
    this.alcoves = (options.alcoves ?? [
      { slotId: 'slot_xeno_warrior', occupied: true, species: 'XENOMORPH_WARRIOR', honorValue: 350 },
      { slotId: 'slot_cretaceous_theropod', occupied: true, species: 'PREHISTORIC_SAURIAN', honorValue: 500 },
      { slotId: 'slot_interstellar_cephalopod', occupied: true, species: 'EXTRATERRESTRIAL_APEX', honorValue: 420 },
      { slotId: 'slot_worthy_prey_north', occupied: false, species: null, honorValue: 0 },
      { slotId: 'slot_worthy_prey_center', occupied: false, species: null, honorValue: 0 },
      { slotId: 'slot_worthy_prey_south', occupied: false, species: null, honorValue: 0 }
    ]).map((a) => ({ ...a }));

    this.state = {
      totalSanctumHonor: this.alcoves.reduce((acc, a) => acc + a.honorValue, 0),
      elderRelicBestowed: false,
      ceremonialMistDensity: 0.78,
      mountedTrophiesCount: this.alcoves.filter((a) => a.occupied).length
    };
  }

  mountBleachedSkullTrophy(trophyData = {}, audioSynthesizer = null) {
    const emptySlot = this.alcoves.find((a) => !a.occupied);
    if (!emptySlot) {
      return { mounted: false, reason: 'all_sanctum_alcoves_full' };
    }
    if (!trophyData.bleachedAndCleaned) {
      return { mounted: false, reason: 'skull_not_ritually_cleaned' };
    }

    const honorGain = Number(trophyData.honorValue ?? 250);
    emptySlot.occupied = true;
    emptySlot.species = trophyData.species ?? 'WORTHY_APEX_CHAMPION';
    emptySlot.honorValue = honorGain;

    this.state.mountedTrophiesCount += 1;
    this.state.totalSanctumHonor += honorGain;

    if (audioSynthesizer && typeof audioSynthesizer.playTrophyWallSkullMountClack === 'function') {
      audioSynthesizer.playTrophyWallSkullMountClack(1.0);
    }

    let bestowedRelic = null;
    if (this.state.totalSanctumHonor >= 1500 && !this.state.elderRelicBestowed) {
      this.state.elderRelicBestowed = true;
      bestowedRelic = {
        id: 'raphael_adolini_1715_flintlock_relic',
        inscribedName: 'Raphael Adolini 1715',
        clanRankUnlocked: 'ELDER_RECOGNIZED_CHAMPION'
      };
      if (audioSynthesizer && typeof audioSynthesizer.playSanctumAncestralResonanceChord === 'function') {
        audioSynthesizer.playSanctumAncestralResonanceChord(1.1);
      }
    }

    return {
      mounted: true,
      slotId: emptySlot.slotId,
      species: emptySlot.species,
      totalSanctumHonor: this.state.totalSanctumHonor,
      elderRelicBestowed: this.state.elderRelicBestowed,
      bestowedRelic
    };
  }

  getSanctumStatus() {
    return {
      sectorId: this.sectorId,
      mountedTrophiesCount: this.state.mountedTrophiesCount,
      totalSanctumHonor: this.state.totalSanctumHonor,
      elderRelicBestowed: this.state.elderRelicBestowed,
      alcoves: this.alcoves.map((a) => ({ ...a }))
    };
  }
}
