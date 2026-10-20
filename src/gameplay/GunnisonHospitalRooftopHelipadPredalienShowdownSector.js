import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 1 (v156) — Héliport du Toit de l'Hôpital de Gunnison & Duel Final Wolf vs Predalien (*AVP: Requiem 2007*)
 * Reproduit l'affrontement apocalyptique sous la pluie battante sur le toit de l'hôpital de Gunnison :
 * - Wolf retire son bio-masque et son équipement endommagé pour affronter le Predalien à mains nues et aux doubles Wristblades.
 * - Embuscade mutuelle mortelle (Wolf transperce la mâchoire interne du Predalien tandis que la queue du Predalien l'empale) juste avant la frappe thermonucléaire tactique du F-22 de la Garde Nationale.
 */
export class GunnisonHospitalRooftopHelipadPredalienShowdownSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_hospital_rooftop_helipad_rain';
    this.wolfUnmaskedForHonorDuel = false;
    this.mutualImpaleLocked = false;
    this.f22TacticalStrikeCountdownSec = options.f22TacticalStrikeCountdownSec ?? 12.0;
    this.rooftopVaporized = false;
  }

  initiateUnmaskedHonorBrawl(wolfState = {}) {
    this.wolfUnmaskedForHonorBrawl = true;
    this.wolfUnmaskedForHonorDuel = true;
    wolfState.bioMaskEquipped = false;
    wolfState.damagedCasterJettisoned = true;
    wolfState.meleeDamageMultiplier = 1.45;

    audioSynth.playWolfRooftopUnmaskingGauntletClick?.();

    return {
      honorBrawlStarted: true,
      wolfUnmasked: true,
      meleeDamageMultiplier: wolfState.meleeDamageMultiplier
    };
  }

  executeMutualFatalGrappleAndAirStrike(predalienState = {}) {
    this.mutualImpaleLocked = true;
    this.rooftopVaporized = true;
    predalienState.innerJawSevered = true;
    predalienState.health = 0;

    audioSynth.playPredalienRooftopMutualImpaleRoar?.();
    audioSynth.playGunnisonF22TacticalStrikeShockwave?.();

    return {
      mutualImpaleLocked: true,
      predalienEliminated: true,
      rooftopVaporizedByStrike: this.rooftopVaporized
    };
  }
}
