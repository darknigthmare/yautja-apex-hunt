import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 1 (v157) — Pont de Cordes Suspendu au-dessus du Gouffre & Embuscade de l'Upgrade Predator (*The Predator 2018*)
 * Reproduit la traversée périlleuse du pont suspendu au-dessus du gouffre forestier :
 * - L'Upgrade Predator (Assassin) de 3,3 mètres et 250 kg charge sur les lattes de bois.
 * - Son exosquelette dermique renforcé dévie 90 % des tirs de petit calibre sans recul.
 * - Les câbles de suspension en acier tressé s'effilochent sous la tension et peuvent être tranchés au Smart Disc ou au canon plasma pour précipiter le mastodonte dans le ravin.
 */
export class GorgeSuspensionBridgeUpgradePredatorAmbushSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'forest_gorge_suspension_bridge';
    this.bridgeIntegrity = options.bridgeIntegrity ?? 100;
    this.suspensionCablesLeft = options.suspensionCablesLeft ?? 2;
    this.suspensionCablesRight = options.suspensionCablesRight ?? 2;
    this.upgradePredatorOnBridge = false;
    this.bridgeCollapsed = false;
  }

  spawnUpgradePredatorCharge(upgradeState = {}) {
    this.upgradePredatorOnBridge = true;
    upgradeState.onBridge = true;
    upgradeState.dermalArmorActive = true;
    this.bridgeIntegrity = Math.max(0, this.bridgeIntegrity - 25);

    return {
      chargeInitiated: true,
      bridgeIntegrity: this.bridgeIntegrity,
      upgradePredatorMassKg: 250
    };
  }

  deflectBallisticFireOnDermalArmor(firePayload = {}) {
    const rawDamage = Number(firePayload.damage ?? 50);
    const absorbedDamage = Math.round(rawDamage * 0.9);
    const penetrationDamage = rawDamage - absorbedDamage;

    audioSynth.playUpgradePredatorDermalArmorDeflect?.();

    return {
      deflected: true,
      absorbedDamage,
      penetrationDamage,
      staggerResisted: true
    };
  }

  severSuspensionCable(side = 'left', weaponType = 'smart_disc') {
    if (this.bridgeCollapsed) {
      return { collapsed: true, alreadyFallen: true };
    }

    if (side === 'left' && this.suspensionCablesLeft > 0) {
      this.suspensionCablesLeft -= 1;
    } else if (side === 'right' && this.suspensionCablesRight > 0) {
      this.suspensionCablesRight -= 1;
    }

    audioSynth.playGorgeSuspensionBridgeCableSnap?.();

    const totalCables = this.suspensionCablesLeft + this.suspensionCablesRight;
    if (totalCables <= 1) {
      this.bridgeCollapsed = true;
      this.bridgeIntegrity = 0;
      return {
        severed: true,
        side,
        weaponType,
        totalCablesRemaining: totalCables,
        bridgeCollapsed: true,
        upgradePredatorPlungedIntoGorge: this.upgradePredatorOnBridge
      };
    }

    this.bridgeIntegrity = Math.round((totalCables / 4) * 100);
    return {
      severed: true,
      side,
      weaponType,
      totalCablesRemaining: totalCables,
      bridgeCollapsed: false,
      bridgeIntegrity: this.bridgeIntegrity
    };
  }
}
