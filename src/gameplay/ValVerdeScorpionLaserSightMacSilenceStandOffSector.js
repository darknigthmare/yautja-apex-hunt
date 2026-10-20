import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v156) — Leurre du Sanglier Sauvage & Pointage Tri-Laser Silencieux sur Mac et Dillon (*Predator 1987*)
 * Reproduit la scène nocturne et la traque de Mac et Dillon dans la jungle de Val Verde :
 * 1. Le sanglier sauvage détale dans les fougères, provoquant un tir de panique qui révèle la position des commandos tout en masquant le repositionnement du Jungle Hunter dans les branches.
 * 2. Alors que Mac rampe sous les racines géantes pour tendre un piège à Dillon, le Jungle Hunter se tient juste derrière lui, projette le triangle laser rouge sur son front et l'abat à bout portant.
 */
export class ValVerdeScorpionLaserSightMacSilenceStandOffSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_giant_roots_mac_standoff';
    this.boarFlushTriggered = false;
    this.triadLaserLockedOnForehead = false;
  }

  triggerWildBoarBrushDecoy(squadMembers = []) {
    this.boarFlushTriggered = true;
    audioSynth.playValVerdeNightBrushBoarDecoyRustle?.();

    for (const member of squadMembers) {
      member.revealedByPanicFire = true;
      member.ammoExpendedInPanic = true;
    }

    return {
      boarFlushed: true,
      squadPositionsRevealedCount: squadMembers.length
    };
  }

  executePointBlankForeheadTriadStrike(targetCommando = {}) {
    this.triadLaserLockedOnForehead = true;
    targetCommando.triadOnForehead = true;
    targetCommando.health = 0;

    return {
      triadLocked: true,
      pointBlankPlasmaExecuted: true,
      targetEliminated: true
    };
  }
}
