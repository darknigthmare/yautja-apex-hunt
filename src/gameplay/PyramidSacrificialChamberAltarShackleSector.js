import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 1 (v154) — Chambre de Sacrifice Rituel & Sangles d'Autel de la Pyramide (*Alien vs. Predator 2004*)
 * Reproduit la salle des autels sacrificiels de la pyramide antarctique de Bouvetøya :
 * - Dalles de pierre gravées où les hôtes sont immobilisés par des arceaux métalliques articulés.
 * - Convoyeurs verticaux acheminant les Ovomorphs depuis la chambre de ponte de la Reine pour initier la Chasse des Young Bloods (Scar, Celtic, Chopper).
 * - Possibilité de briser le mécanisme d'engagement des sangles avec un tir précis de Plasmacaster ou un lancer de Smart Disc avant l'éclosion.
 */
export class PyramidSacrificialChamberAltarShackleSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_pyramid_sacrificial_altar_chamber';
    this.altarCount = options.altarCount ?? 6;
    this.altars = Array.from({ length: this.altarCount }, (_, idx) => ({
      id: `sacrificial_altar_${idx + 1}`,
      shackleLocked: false,
      ovomorphRisen: false,
      mechanismBroken: false
    }));
    this.ovomorphConveyorActive = false;
  }

  engageSacrificialAltarShackles(targetAltarIds = null) {
    let lockedCount = 0;
    for (const altar of this.altars) {
      if (altar.mechanismBroken) continue;
      if (!targetAltarIds || targetAltarIds.includes(altar.id)) {
        altar.shackleLocked = true;
        lockedCount += 1;
      }
    }

    audioSynth.playSacrificialAltarShackleClampLock?.();

    return {
      engaged: lockedCount > 0,
      lockedCount,
      totalAltars: this.altars.length
    };
  }

  ascendOvomorphConveyorRails() {
    this.ovomorphConveyorActive = true;
    let risenCount = 0;
    for (const altar of this.altars) {
      if (!altar.mechanismBroken && altar.shackleLocked) {
        altar.ovomorphRisen = true;
        risenCount += 1;
      }
    }

    audioSynth.playOvomorphConveyorAscentRattle?.();

    return {
      conveyorActive: this.ovomorphConveyorActive,
      risenCount
    };
  }

  severAltarShackleMechanism(altarId, weaponType = 'smart_disc') {
    const altar = this.altars.find(a => a.id === altarId);
    if (!altar) return { freed: false, reason: 'altar_not_found' };

    altar.shackleLocked = false;
    altar.ovomorphRisen = false;
    altar.mechanismBroken = true;

    return {
      freed: true,
      altarId: altar.id,
      weaponType,
      remainingLockedAltars: this.altars.filter(a => a.shackleLocked).length
    };
  }
}
