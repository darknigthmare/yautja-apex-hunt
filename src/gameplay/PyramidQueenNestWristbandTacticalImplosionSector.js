/**
 * PyramidQueenNestWristbandTacticalImplosionSector.js
 * Chantier 2 (v153) : Séquence d'autodestruction finale & onde de condensation bleue de Scar dans la pyramide (AVP 2004).
 * Détachement tactique du gantelet de poignet de Scar au cœur de la chambre de ponte de la Reine :
 * - Compte à rebours en glyphes rouges suivi d'une onde sphérique de condensation bleue qui aspire l'air.
 * - Déclenche l'implosion/explosion souterraine détruisant l'intégralité de la ruche Xénomorphe
 *   et faisant s'effondrer la station baleinière en surface pendant que Scar et Lex s'échappent par le traineau.
 */

export class PyramidQueenNestWristbandTacticalImplosionSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_queen_nest_implosion_epicenter';
    this.escapeRadiusMeters = options.escapeRadiusMeters ?? 180.0;
    this.implosionLethalDamage = 9999;

    this.state = {
      wristbandDetachedAndArmed: false,
      blueCondensationWaveTriggered: false,
      nestDestroyed: false,
      xenomorphsVaporizedCount: 0
    };
  }

  detachAndArmWristbandInNest() {
    this.state.wristbandDetachedAndArmed = true;
    return {
      armed: true,
      wristbandDetachedAndArmed: true
    };
  }

  detonateBlueCondensationImplosion(hiveEntities = [], survivors = [], audioSynthesizer = null) {
    if (!this.state.wristbandDetachedAndArmed) {
      this.detachAndArmWristbandInNest();
    }

    this.state.blueCondensationWaveTriggered = true;
    this.state.nestDestroyed = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playScarWristbandBlueCondensationWave === 'function') {
        audioSynthesizer.playScarWristbandBlueCondensationWave(1.1);
      }
      if (typeof audioSynthesizer.playPyramidQueenNestTacticalImplosion === 'function') {
        audioSynthesizer.playPyramidQueenNestTacticalImplosion(1.25);
      }
    }

    for (const xeno of hiveEntities) {
      xeno.health = 0;
      xeno.vaporizedByWristbandImplosion = true;
      this.state.xenomorphsVaporizedCount += 1;
    }

    const escapedSurvivorIds = [];
    for (const surv of survivors) {
      const dist = Number(surv.distanceFromEpicenterMeters ?? 220);
      if (dist >= this.escapeRadiusMeters) {
        surv.escapedOnSurfaceSled = true;
        escapedSurvivorIds.push(surv.id ?? 'survivor');
      } else {
        surv.health = 0;
      }
    }

    return {
      detonated: true,
      blueCondensationWaveTriggered: true,
      nestDestroyed: true,
      xenomorphsVaporizedCount: this.state.xenomorphsVaporizedCount,
      escapedSurvivorIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      wristbandDetachedAndArmed: this.state.wristbandDetachedAndArmed,
      nestDestroyed: this.state.nestDestroyed,
      xenomorphsVaporizedCount: this.state.xenomorphsVaporizedCount
    };
  }
}
