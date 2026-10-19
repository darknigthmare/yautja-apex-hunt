/**
 * ValVerdeBambooPunjiSpikePitTrapSector.js
 * Chantier 4 (v153) : Piège à pieux de bambou taillés & fosse camouflée de la guérilla de Val Verde (Predator 1987).
 * Trappe végétale recouverte de fougères et hérissée de pieux de bambou durcis au feu :
 * - Cède sous le poids d'un combattant qui marche dessus sans détection préalable, infligeant
 *   des dégâts perforants et un ralentissement d'empilement.
 * - Un chasseur Yautja utilisant le mode de vision technologique/structurelle repère le vide
 *   sous le treillis de bambou et peut bondir par-dessus sans déclencher la trappe.
 */

export class ValVerdeBambooPunjiSpikePitTrapSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_bamboo_punji_pit_trail';
    this.spikeImpaleDamage = options.spikeImpaleDamage ?? 85;
    this.pits = (options.pits ?? [
      { id: 'punji_pit_north_trail', x: -8, z: 12, radius: 2.1, collapsed: false },
      { id: 'punji_pit_south_creek', x: 10, z: -6, radius: 2.1, collapsed: false }
    ]).map((p) => ({ ...p }));

    this.state = {
      totalImpaledCount: 0,
      totalBypassedViaTechVision: 0
    };
  }

  evaluateStepOverPunjiPit(walker = {}, audioSynthesizer = null) {
    for (const pit of this.pits) {
      if (pit.collapsed) continue;
      const dist = Math.hypot((walker.x ?? 0) - pit.x, (walker.z ?? 0) - pit.z);
      if (dist <= pit.radius) {
        if (walker.visionMode === 'ELECTROMAGNETIC_TECH' || walker.leapingOverHazard) {
          this.state.totalBypassedViaTechVision += 1;
          return {
            triggered: false,
            bypassedSafely: true,
            pitId: pit.id
          };
        }

        pit.collapsed = true;
        this.state.totalImpaledCount += 1;
        walker.health = Math.max(0, Number(walker.health ?? 120) - this.spikeImpaleDamage);
        walker.impaledInBambooPit = true;
        walker.movementSpeedMultiplier = 0.35;

        if (audioSynthesizer && typeof audioSynthesizer.playValVerdeBambooPunjiPitSnap === 'function') {
          audioSynthesizer.playValVerdeBambooPunjiPitSnap(1.05);
        }

        return {
          triggered: true,
          pitId: pit.id,
          damageDealt: this.spikeImpaleDamage,
          remainingHealth: walker.health
        };
      }
    }

    return { triggered: false, bypassedSafely: false };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      totalImpaledCount: this.state.totalImpaledCount,
      totalBypassedViaTechVision: this.state.totalBypassedViaTechVision
    };
  }
}
