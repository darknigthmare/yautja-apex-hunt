/**
 * HumanQaYautjaVocalizationAndEmoteWheelDirector.js
 * 
 * Human Playtester QA Audit #1: Radial Emote Wheel & Diegetic Yautja Vocalizations.
 * Resolves the lack of non-verbal tactical communication and intimidation cues by introducing
 * a responsive 6-slice radial emote wheel allowing players to trigger canonical mandible clicks,
 * victory roars, warning hisses, and recorded human voice mockery playback.
 */

export class HumanQaYautjaVocalizationAndEmoteWheelDirector {
  /**
   * @param {Object} options
   * @param {boolean} [options.isOpen=false]
   */
  constructor(options = {}) {
    this.isOpen = options.isOpen !== undefined ? options.isOpen : false;
    this.selectedSliceIndex = 0;

    this.emotes = [
      { id: 'MANDIBLE_CLICK_CHATTER', label: 'Mandible Chatter', tacticalRole: 'ACKNOWLEDGEMENT', angleMin: 330, angleMax: 30 },
      { id: 'VICTORY_ROAR', label: 'Victory Roar', tacticalRole: 'INTIMIDATION_BUFF', angleMin: 30, angleMax: 90 },
      { id: 'WARNING_HISS', label: 'Warning Hiss', tacticalRole: 'TERRITORIAL_THREAT', angleMin: 90, angleMax: 150 },
      { id: 'MIMIC_ANYTIME_LAUGH', label: 'Anytime Laugh', tacticalRole: 'PSYCHOLOGICAL_DECOY', angleMin: 150, angleMax: 210 },
      { id: 'HONOR_BOW', label: 'Honor Salute', tacticalRole: 'RITUAL_CHALLENGE', angleMin: 210, angleMax: 270 },
      { id: 'CLOAK_SIGNAL', label: 'Cloak Hand Signal', tacticalRole: 'STEALTH_DIRECTIVE', angleMin: 270, angleMax: 330 }
    ];

    this.lastVocalizationTriggered = null;
    this.totalVocalizationsCount = 0;
  }

  /**
   * Opens the radial emote wheel and activates tactical slowdown.
   * @returns {Object} Wheel state
   */
  openEmoteWheel() {
    this.isOpen = true;
    return {
      isOpen: true,
      slicesCount: this.emotes.length,
      timeScale: 0.25 // Bullet-time slowdown during emote selection
    };
  }

  /**
   * Closes the radial emote wheel.
   * @returns {Object}
   */
  closeEmoteWheel() {
    this.isOpen = false;
    return {
      isOpen: false,
      timeScale: 1.0
    };
  }

  /**
   * Selects an emote slice based on cursor/stick angle in degrees (0-360).
   * @param {number} angleDeg
   * @returns {Object} Selected slice
   */
  selectEmoteSlice(angleDeg = 0) {
    let normalized = angleDeg % 360;
    if (normalized < 0) normalized += 360;

    let matchedIndex = 0;
    for (let i = 0; i < this.emotes.length; i++) {
      const e = this.emotes[i];
      if (e.angleMin > e.angleMax) {
        // Wraparound slice (e.g. 330 to 30)
        if (normalized >= e.angleMin || normalized < e.angleMax) {
          matchedIndex = i;
          break;
        }
      } else {
        if (normalized >= e.angleMin && normalized < e.angleMax) {
          matchedIndex = i;
          break;
        }
      }
    }

    this.selectedSliceIndex = matchedIndex;
    const selectedEmote = this.emotes[matchedIndex];

    return {
      angleDeg: normalized,
      selectedSliceIndex: this.selectedSliceIndex,
      selectedEmote
    };
  }

  /**
   * Triggers the selected or specified Yautja vocalization/emote.
   * @param {string} [vocalizationId]
   * @returns {Object} Trigger outcome
   */
  triggerVocalization(vocalizationId) {
    const emote = vocalizationId 
      ? this.emotes.find(e => e.id === vocalizationId)
      : this.emotes[this.selectedSliceIndex];

    if (!emote) {
      return { success: false, reason: 'EMOTE_NOT_FOUND' };
    }

    this.lastVocalizationTriggered = emote.id;
    this.totalVocalizationsCount++;
    this.isOpen = false;

    return {
      success: true,
      emoteId: emote.id,
      label: emote.label,
      tacticalRole: emote.tacticalRole,
      audioMethodName: this.getAudioMethodForEmote(emote.id),
      totalVocalizationsCount: this.totalVocalizationsCount
    };
  }

  /**
   * Maps emote ID to corresponding procedural audio synthesis method.
   * @param {string} emoteId
   * @returns {string}
   */
  getAudioMethodForEmote(emoteId) {
    switch (emoteId) {
      case 'MANDIBLE_CLICK_CHATTER':
        return 'playYautjaMandibleClickingChatter';
      case 'VICTORY_ROAR':
        return 'playRockyRidgeGrizzlyChargeRoar';
      case 'WARNING_HISS':
        return 'playOvimorphEggSacSplitHiss';
      case 'MIMIC_ANYTIME_LAUGH':
        return 'playMimicVoicePlayback';
      case 'HONOR_BOW':
      case 'CLOAK_SIGNAL':
      default:
        return 'playTrophySatchelInventoryClick';
    }
  }

  /**
   * Returns current HUD payload for rendering `.yautja-emote-wheel-container`.
   * @returns {Object}
   */
  getEmoteWheelHudState() {
    return {
      isOpen: this.isOpen,
      selectedSliceIndex: this.selectedSliceIndex,
      selectedEmote: this.emotes[this.selectedSliceIndex],
      emotes: [...this.emotes],
      lastVocalizationTriggered: this.lastVocalizationTriggered
    };
  }
}
