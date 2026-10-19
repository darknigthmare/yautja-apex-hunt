/**
 * YautjaScoutShipAutopilotCloakedExtractionSector.js
 * Chantier 7 (v150) : Rappel par pilote automatique du vaisseau Scout camouflé & rampe d'extraction (Predator 2 / The Predator).
 * Télécommande de poignet appelant le vaisseau d'éclairage Yautja en approche furtive :
 * - Descente stationnaire sous manteau optique actif au-dessus de la zone d'extraction.
 * - Souffle thermique des propulseurs repoussant les assaillants proches, ouverture de la rampe
 *   ventrale et extraction sécurisée du chasseur avec ses trophées.
 */

export class YautjaScoutShipAutopilotCloakedExtractionSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'yautja_cloaked_scout_extraction_lz';
    this.landingZonePosition = options.landingZonePosition ?? { x: 0, z: 0 };
    this.thrusterDownwashRadiusMeters = options.thrusterDownwashRadiusMeters ?? 9.0;
    this.boardingRadiusMeters = options.boardingRadiusMeters ?? 4.5;

    this.state = {
      summonedByWristGauntlet: false,
      shipHoveringCloaked: false,
      ventralRampOpen: false,
      hunterExtracted: false,
      extractedTrophiesCount: 0
    };
  }

  summonAutopilotScoutShip(nearbyHostiles = [], audioSynthesizer = null) {
    this.state.summonedByWristGauntlet = true;
    this.state.shipHoveringCloaked = true;
    this.state.ventralRampOpen = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playScoutShipCloakedHoverDescentHum === 'function') {
        audioSynthesizer.playScoutShipCloakedHoverDescentHum(1.0);
      }
      if (typeof audioSynthesizer.playScoutShipExtractionRampLockClunk === 'function') {
        audioSynthesizer.playScoutShipExtractionRampLockClunk(0.95);
      }
    }

    const pushedHostileIds = [];
    for (const hostile of nearbyHostiles) {
      const dist = Math.hypot(
        (hostile.x ?? 0) - this.landingZonePosition.x,
        (hostile.z ?? 0) - this.landingZonePosition.z
      );
      if (dist <= this.thrusterDownwashRadiusMeters) {
        hostile.knockedBackByThrusterWash = true;
        hostile.health = Math.max(1, Number(hostile.health ?? 100) - 35);
        pushedHostileIds.push(hostile.id ?? 'hostile');
      }
    }

    return {
      summoned: true,
      shipHoveringCloaked: true,
      ventralRampOpen: true,
      pushedHostileIds
    };
  }

  boardExtractionRamp(hunter = {}, audioSynthesizer = null) {
    if (!this.state.ventralRampOpen) {
      return { extracted: false, reason: 'ramp_not_open' };
    }

    const dist = Math.hypot(
      (hunter.x ?? 0) - this.landingZonePosition.x,
      (hunter.z ?? 0) - this.landingZonePosition.z
    );
    if (dist > this.boardingRadiusMeters) {
      return { extracted: false, reason: 'hunter_too_far_from_ramp', distanceMeters: dist };
    }

    this.state.ventralRampOpen = false;
    this.state.hunterExtracted = true;
    this.state.extractedTrophiesCount = Number(hunter.trophySkullsCarried ?? 1);

    if (audioSynthesizer && typeof audioSynthesizer.playScoutShipExtractionRampLockClunk === 'function') {
      audioSynthesizer.playScoutShipExtractionRampLockClunk(1.1);
    }

    return {
      extracted: true,
      extractedTrophiesCount: this.state.extractedTrophiesCount,
      orbitAscentInitiated: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      summonedByWristGauntlet: this.state.summonedByWristGauntlet,
      shipHoveringCloaked: this.state.shipHoveringCloaked,
      ventralRampOpen: this.state.ventralRampOpen,
      hunterExtracted: this.state.hunterExtracted,
      extractedTrophiesCount: this.state.extractedTrophiesCount
    };
  }
}
