import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 3 (v155) — Nid de Scorpions Rouges & Duel au Katana dans les Hautes Herbes (*Predators 2010*)
 * Reproduit deux séquences emblématiques de la réserve de chasse extraterrestre (*Game Preserve Planet*) :
 * 1. Le Scorpion Rouge extraterrestre caché dans le feuillage dont le dard neurotoxique paralyse les cibles (et dont Hanzo tranche le dard au couteau).
 * 2. Le duel singulier dans la clairière d'herbes hautes battues par le vent où Hanzo dégaine le Katana ancien contre les longues lames de poignet du Falconer Predator (sans camouflage ni canon plasma).
 */
export class TallGrassRedScorpionKatanaStandOffSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_tall_grass_katana_meadow';
    this.scorpionActive = true;
    this.duelCloakDisabled = false;
    this.passesExecuted = 0;
  }

  resolveRedScorpionAmbush(reaction = 'katana_Reflex_slice') {
    if (!this.scorpionActive) {
      return { ambushed: false, reason: 'scorpion_already_eliminated' };
    }

    this.scorpionActive = false;
    audioSynth.playRedScorpionChitinmandibleClick?.();

    if (reaction === 'katana_Reflex_slice' || reaction === 'wristblade_sever') {
      return {
        ambushed: true,
        scorpionSeveredMidAir: true,
        neurotoxinApplied: false
      };
    }

    return {
      ambushed: true,
      scorpionSeveredMidAir: false,
      neurotoxinApplied: true,
      paralysisDurationSec: 3.5
    };
  }

  executeTallGrassKatanaClashPass(clashOptions = {}) {
    this.duelCloakDisabled = true;
    this.passesExecuted += 1;

    audioSynth.playTallGrassKatanaWristbladeClashRing?.();

    const mutualStrike = Boolean(clashOptions.finalMutualPass);
    return {
      passNumber: this.passesExecuted,
      duelCloakDisabled: this.duelCloakDisabled,
      mutualFatalStrike: mutualStrike,
      honorEarned: mutualStrike ? 250 : 90
    };
  }
}
