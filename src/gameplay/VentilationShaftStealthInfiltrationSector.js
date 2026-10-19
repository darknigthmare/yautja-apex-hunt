/**
 * VentilationShaftStealthInfiltrationSector.js
 * Chantier 7 (v148) : Conduit d'aération étroite & grilles découpées au laser (AVP:R 2007 / Predator 2).
 * Réseau de gaines techniques en hauteur dans l'hôpital de Gunnison ou l'abattoir de LA :
 * - Découpe thermique silencieuse des grilles d'accès verrouillées au moyen des Wristblades/Laser.
 * - Masquage acoustique et radar complet tant que le chasseur rampe dans la gaine.
 * - Exécution furtive par embuscade verticale ("Vent Drop Takedown") sur une cible passant sous une trappe.
 */

export class VentilationShaftStealthInfiltrationSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_hospital_hvac_duct_network';
    this.grates = (options.grates ?? [
      { id: 'grate_morgue_north', x: -8, z: 4, sealed: true, dropHeightMeters: 3.4 },
      { id: 'grate_corridor_central', x: 2, z: 12, sealed: true, dropHeightMeters: 3.6 },
      { id: 'grate_icu_south', x: 14, z: 20, sealed: true, dropHeightMeters: 3.5 }
    ]).map((g) => ({ ...g }));

    this.state = {
      insideVentNetwork: false,
      currentGrateNodeId: null,
      radarAcousticDampening: 0.0,
      totalGratesUnsealed: 0,
      totalVentDropAssassinations: 0
    };
  }

  laserUnsealAndEnterGrate(grateId, audioSynthesizer = null) {
    const grate = this.grates.find((g) => g.id === grateId);
    if (!grate) {
      return { entered: false, reason: 'grate_not_found' };
    }

    if (grate.sealed) {
      grate.sealed = false;
      this.state.totalGratesUnsealed += 1;
      if (audioSynthesizer && typeof audioSynthesizer.playVentilationGrateLaserUnseal === 'function') {
        audioSynthesizer.playVentilationGrateLaserUnseal(1.0);
      }
    }

    this.state.insideVentNetwork = true;
    this.state.currentGrateNodeId = grate.id;
    this.state.radarAcousticDampening = 0.94;

    return {
      entered: true,
      currentGrateNodeId: grate.id,
      radarAcousticDampening: this.state.radarAcousticDampening
    };
  }

  traverseDuctToGrate(targetGrateId, audioSynthesizer = null) {
    if (!this.state.insideVentNetwork) {
      return { traversed: false, reason: 'not_inside_vent_network' };
    }
    const targetGrate = this.grates.find((g) => g.id === targetGrateId);
    if (!targetGrate) {
      return { traversed: false, reason: 'target_grate_not_found' };
    }

    if (targetGrate.sealed) {
      targetGrate.sealed = false;
      this.state.totalGratesUnsealed += 1;
      if (audioSynthesizer && typeof audioSynthesizer.playVentilationGrateLaserUnseal === 'function') {
        audioSynthesizer.playVentilationGrateLaserUnseal(0.85);
      }
    }

    this.state.currentGrateNodeId = targetGrate.id;
    return {
      traversed: true,
      currentGrateNodeId: targetGrate.id,
      position: { x: targetGrate.x, z: targetGrate.z }
    };
  }

  executeVentDropAmbush(targetBelow = null) {
    if (!this.state.insideVentNetwork || !this.state.currentGrateNodeId) {
      return { ambushed: false, reason: 'not_positioned_in_vent' };
    }
    if (!targetBelow) {
      return { ambushed: false, reason: 'no_target_below' };
    }

    const grate = this.grates.find((g) => g.id === this.state.currentGrateNodeId);
    const horizontalDist = Math.hypot((targetBelow.x ?? 0) - grate.x, (targetBelow.z ?? 0) - grate.z);
    if (horizontalDist > 2.8) {
      return { ambushed: false, reason: 'target_not_under_grate', horizontalDist };
    }

    this.state.insideVentNetwork = false;
    this.state.radarAcousticDampening = 0.0;
    this.state.totalVentDropAssassinations += 1;

    targetBelow.health = 0;
    targetBelow.neutralizedSilently = true;
    targetBelow.pulledIntoCeiling = true;

    return {
      ambushed: true,
      grateId: grate.id,
      targetId: targetBelow.id ?? 'target',
      silentElimination: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      insideVentNetwork: this.state.insideVentNetwork,
      currentGrateNodeId: this.state.currentGrateNodeId,
      radarAcousticDampening: this.state.radarAcousticDampening,
      totalGratesUnsealed: this.state.totalGratesUnsealed,
      totalVentDropAssassinations: this.state.totalVentDropAssassinations
    };
  }
}
