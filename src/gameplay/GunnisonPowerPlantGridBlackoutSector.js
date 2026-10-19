/**
 * GunnisonPowerPlantGridBlackoutSector.js
 * Chantier 6 (v149) : Centrale électrique de Gunnison & coupure du réseau urbain (AVP: Requiem 2007).
 * Sous-station haute tension alimentant la ville de Gunnison (Colorado) :
 * - Wolf ou les Xénomorphes peuvent détruire les transformateurs principaux au plasma ou à l'acide.
 * - Plonge l'intégralité du secteur urbain dans un Blackout complet, désactivant les projecteurs
 *   de la Garde Nationale et augmentant drastiquement la furtivité nocturne tout en électrifiant les flaques.
 */

export class GunnisonPowerPlantGridBlackoutSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_municipal_power_substation';
    this.transformers = (options.transformers ?? [
      { id: 'transformer_bank_west', x: -10, z: 4, intact: true, arcRadiusMeters: 6.0 },
      { id: 'transformer_bank_east', x: 10, z: 4, intact: true, arcRadiusMeters: 6.0 }
    ]).map((t) => ({ ...t }));

    this.state = {
      cityGridOnline: true,
      ambientLightLevel: 0.85,
      nationalGuardSearchlightsActive: true,
      stealthVisibilityMultiplier: 1.0,
      destroyedTransformersCount: 0
    };
  }

  overloadTransformerWithPlasma(transformerId, nearbyEntities = [], audioSynthesizer = null) {
    const bank = this.transformers.find((t) => t.id === transformerId);
    if (!bank) {
      return { overloaded: false, reason: 'transformer_not_found' };
    }
    if (!bank.intact) {
      return { overloaded: false, reason: 'already_destroyed' };
    }

    bank.intact = false;
    this.state.destroyedTransformersCount += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playGunnisonGridTransformerExplosion === 'function') {
      audioSynthesizer.playGunnisonGridTransformerExplosion(1.1);
    }

    const shockedEntityIds = [];
    for (const entity of nearbyEntities) {
      const dist = Math.hypot((entity.x ?? 0) - bank.x, (entity.z ?? 0) - bank.z);
      if (dist <= bank.arcRadiusMeters) {
        entity.health = Math.max(0, Number(entity.health ?? 100) - 95);
        entity.electrocutedByGrid = true;
        shockedEntityIds.push(entity.id ?? 'entity');
      }
    }

    const allDestroyed = this.transformers.every((t) => !t.intact);
    if (allDestroyed && this.state.cityGridOnline) {
      this.state.cityGridOnline = false;
      this.state.ambientLightLevel = 0.08;
      this.state.nationalGuardSearchlightsActive = false;
      this.state.stealthVisibilityMultiplier = 0.25;

      if (audioSynthesizer && typeof audioSynthesizer.playCityWideBlackoutPowerDownHum === 'function') {
        audioSynthesizer.playCityWideBlackoutPowerDownHum(1.15);
      }
    }

    return {
      overloaded: true,
      transformerId: bank.id,
      shockedEntityIds,
      cityBlackoutTriggered: !this.state.cityGridOnline,
      ambientLightLevel: this.state.ambientLightLevel,
      stealthVisibilityMultiplier: this.state.stealthVisibilityMultiplier
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      cityGridOnline: this.state.cityGridOnline,
      ambientLightLevel: this.state.ambientLightLevel,
      nationalGuardSearchlightsActive: this.state.nationalGuardSearchlightsActive,
      stealthVisibilityMultiplier: this.state.stealthVisibilityMultiplier,
      destroyedTransformersCount: this.state.destroyedTransformersCount
    };
  }
}
