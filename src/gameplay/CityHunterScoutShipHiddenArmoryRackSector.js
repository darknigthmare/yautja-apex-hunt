import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 2 (v155) — Armurerie Secrète du Vaisseau de Reconnaissance du City Hunter (*Predator 2 1990*)
 * Reproduit le râtelier d'armes et l'établi médical du vaisseau du City Hunter caché sous Los Angeles :
 * - Paroi alvéolaire mécanique s'ouvrant par impulsion du gantelet pour révéler les armes de chasse : Speargun, Netgun, Smart Disc de rechange et bio-masques secondaires.
 * - Permet au chasseur de réapprovisionner ses dards d'alliage, ses filets métalliques et son Medi-Kit entre deux vagues.
 */
export class CityHunterScoutShipHiddenArmoryRackSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_scout_ship_armory_alcove';
    this.rackUnlocked = false;
    this.inventory = {
      speargunBolts: options.speargunBolts ?? 12,
      netgunLoads: options.netgunLoads ?? 4,
      spareSmartDisc: options.spareSmartDisc ?? true,
      medikitCharges: options.medikitCharges ?? 2
    };
  }

  unlockArmoryRackWithGauntletCode() {
    this.rackUnlocked = true;
    audioSynth.playScoutShipArmoryRackPneumaticSlide?.();
    return {
      unlocked: true,
      availableInventory: { ...this.inventory }
    };
  }

  requisitionLoadoutRefill(hunterState = {}) {
    if (!this.rackUnlocked) {
      this.unlockArmoryRackWithGauntletCode();
    }

    const grantedBolts = this.inventory.speargunBolts;
    const grantedNets = this.inventory.netgunLoads;
    const grantedSmartDisc = this.inventory.spareSmartDisc;

    hunterState.speargunAmmo = (hunterState.speargunAmmo ?? 0) + grantedBolts;
    hunterState.netgunAmmo = (hunterState.netgunAmmo ?? 0) + grantedNets;
    if (grantedSmartDisc) {
      hunterState.hasSmartDisc = true;
    }

    this.inventory.speargunBolts = 0;
    this.inventory.netgunLoads = 0;
    this.inventory.spareSmartDisc = false;

    audioSynth.playYautjaWeaponRackLockClack?.();

    return {
      refilled: true,
      grantedBolts,
      grantedNets,
      grantedSmartDisc,
      hunterSpeargunAmmo: hunterState.speargunAmmo,
      hunterNetgunAmmo: hunterState.netgunAmmo
    };
  }
}
