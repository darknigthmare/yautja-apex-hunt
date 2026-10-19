/**
 * GunnisonMunicipalPoolAquaticXenomorphAmbushSector.js
 * Chantier 4 (v152) : Piscine municipale de Gunnison & embuscade aquatique des Xénomorphes (AVP: Requiem 2007).
 * Bassin olympique couvert plongé dans la vapeur et l'obscurité :
 * - L'eau réfracte les faisceaux du viseur tri-laser et amortit les tirs de Plasmacaster contre les cibles immergées.
 * - Les Xénomorphes nagent en silence sous la surface et bondissent hors de l'eau (Breach Ambush),
 *   offrant une fenêtre de contre-attaque au fouet dentelé ou aux Wristblades de Wolf.
 */

export class GunnisonMunicipalPoolAquaticXenomorphAmbushSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_municipal_swimming_pool';
    this.underwaterLaserRefractionPenalty = options.underwaterLaserRefractionPenalty ?? 0.65;
    this.underwaterPlasmaAttenuationRatio = options.underwaterPlasmaAttenuationRatio ?? 0.55;

    this.state = {
      submergedXenomorphIds: ['xeno_swimmer_1', 'xeno_swimmer_2'],
      steamFogDensity: 0.76,
      totalBreachAmbushesCountered: 0
    };
  }

  evaluateSubmergedTargetShot(basePlasmaDamage = 140, targetSubmerged = true, audioSynthesizer = null) {
    if (!targetSubmerged) {
      return {
        effectiveDamage: basePlasmaDamage,
        laserRefracted: false
      };
    }

    if (audioSynthesizer && typeof audioSynthesizer.playMunicipalPoolUnderwaterLaserRefractHum === 'function') {
      audioSynthesizer.playMunicipalPoolUnderwaterLaserRefractHum(0.95);
    }

    const attenuated = Math.round(basePlasmaDamage * (1 - this.underwaterPlasmaAttenuationRatio));
    return {
      effectiveDamage: attenuated,
      laserRefracted: true,
      accuracyPenalty: this.underwaterLaserRefractionPenalty
    };
  }

  triggerAquaticXenoBreachAndCounter(xenoId = 'xeno_swimmer_1', wolfCounterReady = true, audioSynthesizer = null) {
    this.state.submergedXenomorphIds = this.state.submergedXenomorphIds.filter((id) => id !== xenoId);

    if (audioSynthesizer && typeof audioSynthesizer.playAquaticXenomorphPoolBreachSplash === 'function') {
      audioSynthesizer.playAquaticXenomorphPoolBreachSplash(1.1);
    }

    if (wolfCounterReady) {
      this.state.totalBreachAmbushesCountered += 1;
      return {
        breached: true,
        xenoId,
        counteredInMidAir: true,
        xenoNeutralized: true
      };
    }

    return {
      breached: true,
      xenoId,
      counteredInMidAir: false,
      hunterGrappledIntoPool: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      submergedXenomorphCount: this.state.submergedXenomorphIds.length,
      totalBreachAmbushesCountered: this.state.totalBreachAmbushesCountered
    };
  }
}
