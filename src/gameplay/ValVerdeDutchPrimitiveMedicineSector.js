/**
 * ValVerdeDutchPrimitiveMedicineSector.js
 * 
 * Chantier Level Design #4 - Soins Primitifs de Dutch (Cautérisation de Plaie & Garrot).
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch treating shrapnel lacerations and wristblade graze wounds while concealed in the mud trench.
 * - Field cauterization using a fire-heated machete blade:
 *   - Instantly seals open blood vessels, halting the dripping blood trail that gives away position to Yautja thermal vision.
 *   - Restores +25 health points and seals deep lacerations.
 *   - Tactical trade-off: severe momentary agony produces an involuntary muffled grunt (62 dB within 15m radius).
 * - Emergency grapevine tourniquet: stems extremity hemorrhage, restoring 80% sprint stamina recovery.
 */

export class ValVerdeDutchPrimitiveMedicineSector {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this.openBleedingWoundsCount = 2;
    this.bloodTrailActive = true;
    this.tourniquetApplied = false;
    this.macheteHeatedTempC = 0;
  }

  /**
   * Heats the heavy steel machete over the campfire coals until glowing red.
   * @param {number} [durationSec=8.0]
   * @returns {Object} Heating status
   */
  heatMacheteBladeOverFire(durationSec = 8.0) {
    this.macheteHeatedTempC = Math.min(680, Math.round(180 + durationSec * 60));

    return {
      success: true,
      macheteHeatedTempC: this.macheteHeatedTempC,
      isBladeRedHot: this.macheteHeatedTempC >= 520,
      readyToCauterize: this.macheteHeatedTempC >= 450,
      glowColor: this.macheteHeatedTempC >= 520 ? '#ff4500' : '#8b0000'
    };
  }

  /**
   * Applies the glowing blade to cauterize open wounds.
   * @returns {Object} Cauterization resolution
   */
  cauterizeWoundWithHotBlade() {
    if (this.macheteHeatedTempC < 450) {
      return { success: false, reason: 'BLADE_NOT_HOT_ENOUGH' };
    }

    this.openBleedingWoundsCount = Math.max(0, this.openBleedingWoundsCount - 1);
    this.bloodTrailActive = this.openBleedingWoundsCount > 0;
    this.macheteHeatedTempC = 120; // Heat discharged into tissue

    return {
      success: true,
      openBleedingWoundsCount: this.openBleedingWoundsCount,
      bloodTrailActive: this.bloodTrailActive,
      healthRestored: 25,
      hemorrhageHalted: true,
      suppressedPainGruntAcousticDb: 62,
      thermalBloodTrailEliminated: !this.bloodTrailActive,
      fleshSizzleAcousticDb: 74
    };
  }

  /**
   * Applies an emergency tourniquet using jungle grapevine to stem limb blood loss.
   * @returns {Object} Tourniquet outcome
   */
  applyGrapevineTourniquet() {
    this.tourniquetApplied = true;

    return {
      success: true,
      tourniquetApplied: true,
      staminaRecoveryRestoredPct: 80,
      limbArterialBleedContained: true,
      staminaCostToTie: 12
    };
  }
}
