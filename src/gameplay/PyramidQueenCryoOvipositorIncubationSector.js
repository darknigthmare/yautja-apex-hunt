/**
 * PyramidQueenCryoOvipositorIncubationSector.js
 * Chantier 2 (v149) : Salle d'incubation des Facehuggers & stase cryogénique brisée (AVP 2004).
 * Chambre souterraine de la Reine Xénomorphe sous la pyramide de Bouvetøya :
 * - Gestion de la stase cryogénique et du réveil centenaire de l'ovipositeur pour alimenter
 *   les plateaux d'œufs de la salle sacrificielle.
 * - Si les colliers de contention et chaînes subissent des dégâts thermiques ou d'acide critiques,
 *   la Reine se libère de son carcan pour traquer toutes les factions présentes.
 */

export class PyramidQueenCryoOvipositorIncubationSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_queen_cryo_ovipositor_chamber';
    this.maxRestraintIntegrity = options.maxRestraintIntegrity ?? 300;

    this.state = {
      cryoStasisActive: true,
      chamberTempCelsius: -115,
      ovipositorActive: false,
      eggsDeliveredToSacrificialChamber: 0,
      restraintChainIntegrity: this.maxRestraintIntegrity,
      queenUnchained: false
    };
  }

  initiateCentennialThawCycle(eggsBatchCount = 6, audioSynthesizer = null) {
    this.state.cryoStasisActive = false;
    this.state.chamberTempCelsius = 24;
    this.state.ovipositorActive = true;
    this.state.eggsDeliveredToSacrificialChamber += Math.max(1, Number(eggsBatchCount) || 6);

    if (audioSynthesizer && typeof audioSynthesizer.playQueenCryoChamberHissRelease === 'function') {
      audioSynthesizer.playQueenCryoChamberHissRelease(1.0);
    }

    return {
      thawed: true,
      chamberTempCelsius: this.state.chamberTempCelsius,
      ovipositorActive: this.state.ovipositorActive,
      eggsDeliveredToSacrificialChamber: this.state.eggsDeliveredToSacrificialChamber
    };
  }

  inflictRestraintChainDamage(damageAmount = 100, damageSource = 'ACID_BLOOD', audioSynthesizer = null) {
    if (this.state.queenUnchained) {
      return { queenUnchained: true, alreadyFree: true };
    }

    const effectiveMult = damageSource === 'ACID_BLOOD' || damageSource === 'PLASMA' ? 1.5 : 1.0;
    const appliedDamage = Math.round(Math.max(0, Number(damageAmount) || 0) * effectiveMult);
    this.state.restraintChainIntegrity = Math.max(0, this.state.restraintChainIntegrity - appliedDamage);

    if (this.state.restraintChainIntegrity === 0) {
      this.state.queenUnchained = true;
      this.state.ovipositorActive = false;

      if (audioSynthesizer && typeof audioSynthesizer.playQueenRestraintChainSnapBoom === 'function') {
        audioSynthesizer.playQueenRestraintChainSnapBoom(1.2);
      }
    }

    return {
      appliedDamage,
      restraintChainIntegrity: this.state.restraintChainIntegrity,
      queenUnchained: this.state.queenUnchained
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      cryoStasisActive: this.state.cryoStasisActive,
      chamberTempCelsius: this.state.chamberTempCelsius,
      ovipositorActive: this.state.ovipositorActive,
      eggsDeliveredToSacrificialChamber: this.state.eggsDeliveredToSacrificialChamber,
      restraintChainIntegrity: this.state.restraintChainIntegrity,
      queenUnchained: this.state.queenUnchained
    };
  }
}
