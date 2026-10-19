/**
 * GunnisonHospitalRooftopHelipadShowdownSector.js
 * Chantier 1 (v151) : Héliport de l'hôpital de Gunnison & crash de l'hélicoptère d'évacuation (AVP: Requiem 2007).
 * Toit de l'hôpital de Gunnison sous une pluie diluvienne :
 * - Duel mortel au corps à corps entre Wolf et le Predalien au milieu des barils de kérosène
 *   et de l'épave d'hélicoptère de la Garde Nationale.
 * - La pluie constante perturbe le camouflage optique et les barils explosifs enflamment la piste.
 */

export class GunnisonHospitalRooftopHelipadShowdownSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_hospital_rooftop_helipad';
    this.fuelBarrels = (options.fuelBarrels ?? [
      { id: 'barrel_helipad_north', x: -6, z: 4, detonated: false, blastRadiusMeters: 6.5, blastDamage: 135 },
      { id: 'barrel_helipad_south', x: 6, z: -4, detonated: false, blastRadiusMeters: 6.5, blastDamage: 135 }
    ]).map((b) => ({ ...b }));

    this.state = {
      torrentialRainIntensity: 0.92,
      cloakRainShortCircuitActive: true,
      evacChopperWrecked: true,
      tacticalNukeCountdownSeconds: 90,
      detonatedBarrelsCount: 0
    };
  }

  detonateHelipadFuelBarrel(barrelId, combatants = [], audioSynthesizer = null) {
    const barrel = this.fuelBarrels.find((b) => b.id === barrelId);
    if (!barrel) {
      return { detonated: false, reason: 'barrel_not_found' };
    }
    if (barrel.detonated) {
      return { detonated: false, reason: 'already_detonated' };
    }

    barrel.detonated = true;
    this.state.detonatedBarrelsCount += 1;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playHospitalHelipadRotorWashChop === 'function') {
        audioSynthesizer.playHospitalHelipadRotorWashChop(0.9);
      }
      if (typeof audioSynthesizer.playHelipadFuelBarrelExplosionBoom === 'function') {
        audioSynthesizer.playHelipadFuelBarrelExplosionBoom(1.15);
      }
    }

    const burnedCombatantIds = [];
    for (const c of combatants) {
      const dist = Math.hypot((c.x ?? 0) - barrel.x, (c.z ?? 0) - barrel.z);
      if (dist <= barrel.blastRadiusMeters) {
        c.health = Math.max(0, Number(c.health ?? 200) - barrel.blastDamage);
        c.scorchedByJetFuel = true;
        c.cloakActive = false;
        burnedCombatantIds.push(c.id ?? 'combatant');
      }
    }

    return {
      detonated: true,
      barrelId: barrel.id,
      burnedCombatantIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      torrentialRainIntensity: this.state.torrentialRainIntensity,
      cloakRainShortCircuitActive: this.state.cloakRainShortCircuitActive,
      evacChopperWrecked: this.state.evacChopperWrecked,
      detonatedBarrelsCount: this.state.detonatedBarrelsCount
    };
  }
}
