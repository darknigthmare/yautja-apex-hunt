/**
 * Predator2BathroomMedicompSurgerySector.js
 * 
 * Chantier Level Design #6 - Chirurgie d'Urgence du Medicomp dans la Salle de Bain.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - Following traumatic injury (arm severed by Harrigan's shotgun fire), City Hunter crashes into an apartment bathroom.
 * - Opens the brass Medicomp emergency field surgical kit:
 *   - Grinds blue alien crystal coagulant and shattered mirror glass shards using miniature mortar & pestle.
 *   - Synthesizes burning blue chemical cauterization paste.
 *   - Applies caustic paste directly onto the severed stump to seal hemorrhaging alien blood vessels.
 *   - Severe searing agony forces an involuntary high-pitched Yautja scream reverberating through apartment air ducts (102 dB).
 * - Restores +45 health points, halts blood loss, and stabilizes the Hunter before escaping through the window.
 */

export class Predator2BathroomMedicompSurgerySector {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this.hunterHealth = 30;
    this.armSevered = true;
    this.medicompKitOpened = false;
    this.pasteSynthesized = false;
    this.surgeryCompleted = false;
  }

  /**
   * Crashes through the bathroom frosted window and opens the Medicomp kit.
   * @returns {Object} Window breach & Medicomp access
   */
  breachBathroomAndOpenMedicomp() {
    this.medicompKitOpened = true;

    return {
      success: true,
      windowGlassShattered: true,
      medicompKitOpened: true,
      instrumentsAvailable: [
        'BLUE_CRYSTAL_COAGULANT',
        'MINIATURE_MORTAR_PESTLE',
        'SURGICAL_CAUTERY_TROCAR',
        'FLESH_STAPLE_CLAMP'
      ],
      glassCrunchAcousticDb: 74,
      elderlyCoupleFledTerrified: true
    };
  }

  /**
   * Grinds blue crystals and mirror glass shards into cauterization paste.
   * @returns {Object} Synthesis telemetry
   */
  grindMedicompHealingPaste() {
    if (!this.medicompKitOpened) {
      return { success: false, reason: 'MEDICOMP_NOT_OPENED' };
    }

    this.pasteSynthesized = true;

    return {
      success: true,
      pasteSynthesized: true,
      pasteColor: '#00b0ff',
      mortarGrindAcousticDb: 58,
      chemicalReactionTempC: 380.0,
      readyForApplication: true
    };
  }

  /**
   * Applies the caustic blue paste to the severed stump.
   * @returns {Object} Surgery resolution
   */
  applyCausticCauterizationToStump() {
    if (!this.pasteSynthesized) {
      return { success: false, reason: 'PASTE_NOT_SYNTHESIZED' };
    }

    this.surgeryCompleted = true;
    const healthRestored = 45;
    this.hunterHealth += healthRestored;

    return {
      success: true,
      surgeryCompleted: true,
      healthRestored,
      hunterHealthRemaining: this.hunterHealth,
      arterialHemorrhageSealed: true,
      agonizedScreamAcousticDb: 102,
      screamEchoesThroughAirDucts: true,
      cauterizationSizzleDb: 84,
      readyToEscapeViaFireEscape: true
    };
  }
}
