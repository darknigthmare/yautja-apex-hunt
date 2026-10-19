/**
 * CanopyAnkleSnareHoistTrapSector.js
 * Chantier 1 (v149) : Piège à collet gravitationnel de canopée (Predators 2010 / Predator 1987).
 * Collet mécanique ou végétal à contrepoids dissimulé sous l'humus :
 * - Hisse brusquement la proie par la cheville à 6 mètres de hauteur dans la canopée.
 * - Désarme immédiatement la cible suspendue tête en bas et émet une balise télémétrique au bio-masque.
 * - Attire les coéquipiers proches qui tentent de couper le câble, créant un goulet d'embuscade.
 */

export class CanopyAnkleSnareHoistTrapSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_canopy_snare_sector';
    this.triggerRadiusMeters = options.triggerRadiusMeters ?? 1.85;
    this.hoistHeightMeters = options.hoistHeightMeters ?? 6.2;
    this.hoistSnapDamage = options.hoistSnapDamage ?? 24;
    this.allyLureRadiusMeters = options.allyLureRadiusMeters ?? 18.0;

    this.snares = (options.snares ?? [
      { id: 'snare_banyan_north', x: -10, z: 6, armed: true, suspendedPreyId: null, cableIntact: true },
      { id: 'snare_vine_south', x: 8, z: -12, armed: true, suspendedPreyId: null, cableIntact: true }
    ]).map((s) => ({ ...s }));

    this.telemetryBeacons = [];
    this.totalPreyHoisted = 0;
  }

  evaluateFootstepTrigger(prey = null, squadmates = [], audioSynthesizer = null) {
    if (!prey) {
      return { triggered: false, reason: 'no_prey' };
    }

    for (const snare of this.snares) {
      if (!snare.armed || !snare.cableIntact || snare.suspendedPreyId) continue;

      const dist = Math.hypot((prey.x ?? 0) - snare.x, (prey.z ?? 0) - snare.z);
      if (dist <= this.triggerRadiusMeters) {
        snare.armed = false;
        snare.suspendedPreyId = prey.id ?? 'hoisted_prey';
        this.totalPreyHoisted += 1;

        prey.health = Math.max(1, Number(prey.health ?? 100) - this.hoistSnapDamage);
        prey.y = this.hoistHeightMeters;
        prey.suspendedUpsideDown = true;
        prey.disarmed = true;
        prey.canMove = false;

        if (audioSynthesizer) {
          if (typeof audioSynthesizer.playCanopyAnkleSnareHoistWhoosh === 'function') {
            audioSynthesizer.playCanopyAnkleSnareHoistWhoosh(1.0);
          }
          if (typeof audioSynthesizer.playSnareTelemetryBeaconPing === 'function') {
            audioSynthesizer.playSnareTelemetryBeaconPing(0.95);
          }
        }

        const luredAllies = [];
        for (const ally of squadmates) {
          if ((ally.id ?? '') === snare.suspendedPreyId) continue;
          const allyDist = Math.hypot((ally.x ?? 0) - snare.x, (ally.z ?? 0) - snare.z);
          if (allyDist <= this.allyLureRadiusMeters) {
            ally.investigatingSnareId = snare.id;
            ally.exposedToAmbush = true;
            luredAllies.push(ally.id ?? 'ally');
          }
        }

        const beacon = {
          snareId: snare.id,
          preyId: snare.suspendedPreyId,
          position: { x: snare.x, y: this.hoistHeightMeters, z: snare.z },
          luredAlliesCount: luredAllies.length
        };
        this.telemetryBeacons.push(beacon);

        return {
          triggered: true,
          snareId: snare.id,
          suspendedPreyId: snare.suspendedPreyId,
          hoistHeightMeters: this.hoistHeightMeters,
          luredAllies,
          telemetryBeacon: beacon
        };
      }
    }

    return { triggered: false, reason: 'outside_trigger_radius' };
  }

  severSnareCable(snareId, suspendedPrey = null) {
    const snare = this.snares.find((s) => s.id === snareId);
    if (!snare || !snare.cableIntact) {
      return { severed: false, reason: 'snare_not_active' };
    }

    snare.cableIntact = false;
    const droppedPreyId = snare.suspendedPreyId;
    snare.suspendedPreyId = null;

    if (suspendedPrey) {
      suspendedPrey.y = 0;
      suspendedPrey.suspendedUpsideDown = false;
      suspendedPrey.canMove = true;
      suspendedPrey.health = Math.max(1, Number(suspendedPrey.health ?? 80) - 18);
    }

    return {
      severed: true,
      snareId: snare.id,
      droppedPreyId
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      totalPreyHoisted: this.totalPreyHoisted,
      activeBeaconsCount: this.telemetryBeacons.length,
      snares: this.snares.map((s) => ({ ...s }))
    };
  }
}
