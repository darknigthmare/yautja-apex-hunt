import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 2 (v158) — Galerie de Compression Pneumatique & Dalles Piégées à Pointes (*Alien vs. Predator 2004*)
 * Reproduit le couloir de la mort au cœur de la pyramide souterraine de Bouvetøya :
 * - Les parois cyclopéennes de granit se rapprochent sous l'impulsion de contrepoids hydrauliques (largeur 5 m -> 0,8 m).
 * - Des dalles piégées propulsent des pointes de pierre affûtées depuis le sol.
 * - Le joueur doit bondir verticalement vers les corniches d'ancrage supérieures pour échapper à l'écrasement mortel.
 */
export class PyramidPneumaticCompressingSpikeCorridorSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_pyramid_compressing_spike_gallery';
    this.initialWidthMeters = 5.0;
    this.currentWidthMeters = this.initialWidthMeters;
    this.spikesArmed = true;
    this.corridorCrushed = false;
  }

  triggerPneumaticWallCompression(deltaWidthStepMeters = 1.4) {
    this.currentWidthMeters = Math.max(0.6, this.currentWidthMeters - deltaWidthStepMeters);
    audioSynth.playPneumaticPistonWallSqueezeRumble?.();

    if (this.currentWidthMeters <= 0.8) {
      this.corridorCrushed = true;
    }

    return {
      currentWidthMeters: Number(this.currentWidthMeters.toFixed(2)),
      corridorCrushed: this.corridorCrushed,
      requiresVerticalClimb: this.currentWidthMeters < 2.0
    };
  }

  stepOnPressurePlateFloorTrap(combatant = {}) {
    if (!this.spikesArmed) {
      return { triggered: false };
    }

    audioSynth.playStoneSpikeFloorThrustClack?.();

    if (combatant.perchedOnUpperLedge) {
      return {
        triggered: true,
        damageDealt: 0,
        evadedViaUpperLedge: true
      };
    }

    const damage = 65;
    combatant.health = Math.max(0, Number(combatant.health ?? 150) - damage);
    combatant.impaledByFloorSpikes = true;

    return {
      triggered: true,
      damageDealt: damage,
      remainingHealth: combatant.health,
      evadedViaUpperLedge: false
    };
  }
}
