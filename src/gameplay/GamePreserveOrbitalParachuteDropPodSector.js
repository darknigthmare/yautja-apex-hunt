/**
 * GamePreserveOrbitalParachuteDropPodSector.js
 * Chantier 3 (v152) : Silo de lancement de parachutes de largage orbital (Drop Pods) de la réserve (Predators 2010).
 * Largage atmosphérique haute vitesse de combattants d'élite et de caisses piégées sur la planète réserve :
 * - Ouverture tardive déclenchée par altimètre barométrique à 85 mètres au-dessus de la canopée.
 * - Génère des conteneurs de ravitaillement ou des pièges à mitrailleuses automatiques destinés à tester
 *   les réflexes des proies larguées.
 */

export class GamePreserveOrbitalParachuteDropPodSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_parachute_drop_zone';
    this.barometricOpenAltitudeMeters = options.barometricOpenAltitudeMeters ?? 85.0;

    this.state = {
      activeDropsCount: 0,
      landedPods: [],
      deployedCanopyHangars: []
    };
  }

  executeOrbitalParachuteDrop(payload = {}, audioSynthesizer = null) {
    this.state.activeDropsCount += 1;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playOrbitalDropPodAtmosphericWhistle === 'function') {
        audioSynthesizer.playOrbitalDropPodAtmosphericWhistle(1.0);
      }
      if (typeof audioSynthesizer.playDropPodParachuteCanopyDeploySnap === 'function') {
        audioSynthesizer.playDropPodParachuteCanopyDeploySnap(1.1);
      }
    }

    const podRecord = {
      podId: payload.id ?? `drop_pod_${this.state.landedPods.length + 1}`,
      payloadType: payload.type ?? 'ELITE_COMBATANT',
      openedAtAltitudeMeters: this.barometricOpenAltitudeMeters,
      landingPosition: payload.landingPosition ?? { x: 0, z: 0 },
      hungInCanopy: Boolean(payload.catchInBranches)
    };

    this.state.landedPods.push(podRecord);
    if (podRecord.hungInCanopy) {
      this.state.deployedCanopyHangars.push(podRecord.podId);
    }

    return {
      dropped: true,
      podRecord,
      survivedImpact: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      landedPodsCount: this.state.landedPods.length,
      deployedCanopyHangarsCount: this.state.deployedCanopyHangars.length
    };
  }
}
