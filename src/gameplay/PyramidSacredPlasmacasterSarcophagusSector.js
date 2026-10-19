/**
 * PyramidSacredPlasmacasterSarcophagusSector.js
 * Chantier 4 (v148) : Autel des armes sacrées de la pyramide & ouverture par glyphes (AVP 2004).
 * Sarcophage cérémoniel de la chambre sacrificielle de Bouvetøya :
 * - Requiert la saisie de la séquence calendaire Yautja à 4 glyphes sur le clavier de poignet
 *   OU le déclenchement forcé du mécanisme par effraction humaine (déclenchant la reconfiguration).
 * - Élève le socle de pierre contenant les 3 Plasmacasters sacrés destinés aux jeunes chasseurs Blooded.
 */

export class PyramidSacredPlasmacasterSarcophagusSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_sacred_weapon_sarcophagus';
    this.sacredGlyphSequence = options.sacredGlyphSequence ?? [
      'SOLSTICE_ECLIPSE',
      'SERPENT_CROWN',
      'STAR_HUNTER_MOON',
      'BLOODED_CREST'
    ];

    this.state = {
      enteredGlyphs: [],
      sealUnlocked: false,
      pedestalElevationRatio: 0,
      plasmacastersRemaining: 3,
      pyramidTrapTriggeredByTheft: false,
      hierarchicalReconfigurationActive: false
    };
  }

  inputWristbandGlyph(glyphSymbol, audioSynthesizer = null) {
    if (this.state.sealUnlocked) {
      return { accepted: true, alreadyUnlocked: true };
    }

    const expectedIndex = this.state.enteredGlyphs.length;
    const expectedGlyph = this.sacredGlyphSequence[expectedIndex];

    if (glyphSymbol !== expectedGlyph) {
      this.state.enteredGlyphs = [];
      return {
        accepted: false,
        reason: 'glyph_mismatch_reset',
        expectedGlyph
      };
    }

    this.state.enteredGlyphs.push(glyphSymbol);

    if (audioSynthesizer && typeof audioSynthesizer.playSacredSarcophagusGlyphChime === 'function') {
      audioSynthesizer.playSacredSarcophagusGlyphChime(0.85 + expectedIndex * 0.1);
    }

    if (this.state.enteredGlyphs.length === this.sacredGlyphSequence.length) {
      this.state.sealUnlocked = true;
      this.state.pedestalElevationRatio = 1.0;

      if (audioSynthesizer && typeof audioSynthesizer.playSacredPlasmacasterPedestalRise === 'function') {
        audioSynthesizer.playSacredPlasmacasterPedestalRise(1.1);
      }
    }

    return {
      accepted: true,
      progressCount: this.state.enteredGlyphs.length,
      sealUnlocked: this.state.sealUnlocked,
      pedestalElevationRatio: this.state.pedestalElevationRatio
    };
  }

  claimSacredPlasmacaster(claimantFaction = 'YAUTJA_INITIATE', audioSynthesizer = null) {
    if (!this.state.sealUnlocked && claimantFaction === 'HUMAN_EXPEDITION') {
      // Effraction humaine directe sur le sarcophage (comme l'équipe Weyland dans AVP 2004)
      this.state.sealUnlocked = true;
      this.state.pedestalElevationRatio = 1.0;
    }

    if (!this.state.sealUnlocked) {
      return { claimed: false, reason: 'sarcophagus_sealed' };
    }
    if (this.state.plasmacastersRemaining <= 0) {
      return { claimed: false, reason: 'sarcophagus_empty' };
    }

    this.state.plasmacastersRemaining -= 1;

    if (claimantFaction === 'HUMAN_EXPEDITION') {
      this.state.pyramidTrapTriggeredByTheft = true;
      this.state.hierarchicalReconfigurationActive = true;
    }

    if (audioSynthesizer && typeof audioSynthesizer.playSacredSarcophagusGlyphChime === 'function') {
      audioSynthesizer.playSacredSarcophagusGlyphChime(1.2);
    }

    return {
      claimed: true,
      claimantFaction,
      plasmacastersRemaining: this.state.plasmacastersRemaining,
      pyramidTrapTriggeredByTheft: this.state.pyramidTrapTriggeredByTheft,
      grantedWeapon: {
        id: 'sacred_shoulder_plasmacaster_mk_ancient',
        autoTargetLaserLinked: claimantFaction === 'YAUTJA_INITIATE',
        basePlasmaDamage: 165
      }
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      sealUnlocked: this.state.sealUnlocked,
      enteredGlyphsCount: this.state.enteredGlyphs.length,
      pedestalElevationRatio: this.state.pedestalElevationRatio,
      plasmacastersRemaining: this.state.plasmacastersRemaining,
      pyramidTrapTriggeredByTheft: this.state.pyramidTrapTriggeredByTheft,
      hierarchicalReconfigurationActive: this.state.hierarchicalReconfigurationActive
    };
  }
}
