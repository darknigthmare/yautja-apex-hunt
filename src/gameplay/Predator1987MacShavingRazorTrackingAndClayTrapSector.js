/**
 * Predator1987MacShavingRazorTrackingAndClayTrapSector (v227)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Mac snapping his disposable shaving razor in half against his cheek while chanting his vendetta in the dark jungle.
 * 2. Stalking the glowing green/yellow luminescent Yautja blood trail through dense underbrush with filtered green light (520 nm).
 * 3. Jungle Hunter tracking Mac's heavy tactical boot vibrations from the elevated mahogany canopy.
 * 4. Setting an earthen clay decoy trench while Dutch positions the bamboo tripwire deadfall (+350 Honor).
 */
export class Predator1987MacShavingRazorTrackingAndClayTrapSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_MAC_SHAVING_RAZOR_TRACKING_AND_CLAY_TRAP';
    this.filmReference = 'Predator (1987) - Mac Broken Shaving Razor Vendetta, Luminescent Blood Trail & Clay Decoy Trench';
    this.reset();
  }

  reset() {
    this.shavingRazorSnapped = false;
    this.luminescentBloodTrailTracked = false;
    this.canopyBootVibrationsDetected = false;
    this.clayDecoyTrenchConstructed = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  snapShavingRazorVendetta({
    razorSnapForceNewtons = 280,
    whisperedVendettaVowConfirmed = true
  } = {}) {
    const force = Math.max(0, Number(razorSnapForceNewtons) || 0);
    this.shavingRazorSnapped = force >= 200 && whisperedVendettaVowConfirmed === true;
    this.eventLog.push({
      step: 'SHAVING_RAZOR_SNAPPED',
      razorSnapForceNewtons: force,
      whisperedVendettaVowConfirmed,
      shavingRazorSnapped: this.shavingRazorSnapped
    });
    return {
      shavingRazorSnapped: this.shavingRazorSnapped
    };
  }

  trackLuminescentBloodTrailUnderbrush({
    luminescenceWavelengthNm = 520,
    bloodTrailDistanceMeters = 35
  } = {}) {
    if (!this.shavingRazorSnapped) {
      throw new Error('Must snap shaving razor before tracking luminescent blood trail.');
    }
    const wave = Math.max(0, Number(luminescenceWavelengthNm) || 0);
    const dist = Math.max(0, Number(bloodTrailDistanceMeters) || 0);
    this.luminescentBloodTrailTracked = wave >= 500 && wave <= 550 && dist >= 25;
    this.eventLog.push({
      step: 'LUMINESCENT_BLOOD_TRAIL_TRACKED',
      luminescenceWavelengthNm: wave,
      bloodTrailDistanceMeters: dist,
      luminescentBloodTrailTracked: this.luminescentBloodTrailTracked
    });
    return {
      luminescentBloodTrailTracked: this.luminescentBloodTrailTracked
    };
  }

  detectBootVibrationsFromCanopy({
    seismicVibrationAmplitudeMm = 1.4,
    canopyBranchElevationMeters = 16
  } = {}) {
    if (!this.luminescentBloodTrailTracked) {
      throw new Error('Must track blood trail before canopy seismic detection.');
    }
    const amp = Number(seismicVibrationAmplitudeMm) || 0;
    const elev = Math.max(0, Number(canopyBranchElevationMeters) || 0);
    this.canopyBootVibrationsDetected = amp >= 1.0 && elev >= 12;
    this.eventLog.push({
      step: 'CANOPY_BOOT_VIBRATIONS_DETECTED',
      seismicVibrationAmplitudeMm: amp,
      canopyBranchElevationMeters: elev,
      canopyBootVibrationsDetected: this.canopyBootVibrationsDetected
    });
    return {
      canopyBootVibrationsDetected: this.canopyBootVibrationsDetected
    };
  }

  constructClayDecoyTrenchAndDeadfall({
    trenchDepthMeters = 1.2,
    deadfallLogMassKg = 380
  } = {}) {
    if (!this.canopyBootVibrationsDetected) {
      throw new Error('Must detect boot vibrations before constructing clay decoy trench.');
    }
    const depth = Math.max(0, Number(trenchDepthMeters) || 0);
    const mass = Math.max(0, Number(deadfallLogMassKg) || 0);
    this.clayDecoyTrenchConstructed = depth >= 1.0 && mass >= 300;
    if (this.clayDecoyTrenchConstructed) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'CLAY_DECOY_TRENCH_CONSTRUCTED',
      trenchDepthMeters: depth,
      deadfallLogMassKg: mass,
      clayDecoyTrenchConstructed: this.clayDecoyTrenchConstructed,
      honorAwarded: this.honorAwarded
    });
    return {
      clayDecoyTrenchConstructed: this.clayDecoyTrenchConstructed,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.shavingRazorSnapped &&
      this.luminescentBloodTrailTracked &&
      this.canopyBootVibrationsDetected &&
      this.clayDecoyTrenchConstructed &&
      this.honorAwarded === 350
    );
  }
}
