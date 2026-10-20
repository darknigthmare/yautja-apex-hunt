import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 4 (v156) — Tourbière Mouvante des Grandes Plaines & Piège de Verrouillage du Bio-Masque de Naru (*Prey 2022*)
 * Reproduit le climax de *Prey (2022)* dans la tourbière de boue profonde :
 * - Plus une entité lourde se débat dans la tourbière sans appui extérieur, plus son enfoncement (`sinkDepthRatio`) augmente et réduit sa mobilité.
 * - Naru positionne le bio-masque arraché du Feral Predator sur les rochers en face de la fosse ; lorsque le Feral tire un carreau guidé de son pistolet-arbalète, le verrouillage tri-laser du masque redirige le projectile droit vers son propre crâne.
 */
export class GreatPlainsQuicksandBogBioMaskLaserTrapSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'comanche_plains_quicksand_bog_trap';
    this.decoyMaskAlignedOnRocks = false;
    this.sinkDepthRatio = 0;
  }

  struggleInQuicksandBog(combatant = {}) {
    const massFactor = (combatant.massKg ?? 190) / 150;
    this.sinkDepthRatio = Math.min(0.95, this.sinkDepthRatio + 0.25 * massFactor);
    combatant.immobilizedInBog = this.sinkDepthRatio >= 0.7;

    audioSynth.playQuicksandBogSuctionSinkGurgle?.();

    return {
      sinkDepthRatio: Number(this.sinkDepthRatio.toFixed(2)),
      immobilizedInBog: combatant.immobilizedInBog
    };
  }

  alignCapturedBioMaskLaserTrap() {
    this.decoyMaskAlignedOnRocks = true;
    return {
      decoyMaskAligned: true,
      laserTriadPointingAtBogCenter: true
    };
  }

  fireGuidedBoltUnderDecoyMaskLock(feralState = {}) {
    if (!this.decoyMaskAlignedOnRocks) {
      this.alignCapturedBioMaskLaserTrap();
    }

    feralState.struckByOwnGuidedBolt = true;
    feralState.health = 0;

    audioSynth.playPreyBioMaskTriadSelfHomingBoltStrike?.();

    return {
      homingRedirectedByDecoyMask: true,
      feralDefeatedByOwnTech: true,
      remainingHealth: 0
    };
  }
}
