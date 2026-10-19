/**
 * PenthouseLightningRodStormConduitSector.js
 * Chantier 9 (v148) : Paratonnerre de toit d'immeuble & foudre sous l'orage (Predator 2).
 * Sommet d'immeuble gothique de Los Angeles 1997 balayé par l'orage :
 * - Le City Hunter peut se dresser sur la flèche métallique et lever sa Combistick ou son Smart Disc
 *   pour capter un éclair atmosphérique naturel.
 * - Surcharge instantanément les réserves d'énergie de l'armure à 150% (Overcharge) tout en déclenchant
 *   un arc électrique radial au pied du paratonnerre qui électrocute les poursuivants proches.
 */

export class PenthouseLightningRodStormConduitSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_penthouse_lightning_spire';
    this.rodPosition = options.rodPosition ?? { x: 0, y: 24.0, z: 0 };
    this.arcDischargeRadiusMeters = options.arcDischargeRadiusMeters ?? 8.5;
    this.arcElectroDamage = options.arcElectroDamage ?? 120;
    this.energyOverchargeGrant = options.energyOverchargeGrant ?? 150;
    this.stormCycleIntervalSeconds = options.stormCycleIntervalSeconds ?? 12.0;

    this.state = {
      stormChargeRatio: 1.0,
      cooldownTimer: 0,
      totalLightningChannelings: 0,
      lastOverchargeAmount: 0
    };
  }

  channelAtmosphericLightning(hunterState = {}, nearbyEnemies = [], audioSynthesizer = null) {
    if (this.state.stormChargeRatio < 1.0) {
      return {
        channeled: false,
        reason: 'storm_cell_recharging',
        stormChargeRatio: Number(this.state.stormChargeRatio.toFixed(2))
      };
    }

    const weaponRaised = Boolean(hunterState.combistickRaised || hunterState.smartDiscRaised);
    if (!weaponRaised) {
      return { channeled: false, reason: 'conductive_weapon_not_raised' };
    }

    this.state.stormChargeRatio = 0.0;
    this.state.cooldownTimer = this.stormCycleIntervalSeconds;
    this.state.totalLightningChannelings += 1;
    this.state.lastOverchargeAmount = this.energyOverchargeGrant;

    hunterState.energy = Math.max(Number(hunterState.energy ?? 100), this.energyOverchargeGrant);
    hunterState.weaponLightningInfused = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playPenthouseLightningRodThunderStrike === 'function') {
        audioSynthesizer.playPenthouseLightningRodThunderStrike(1.2);
      }
      if (typeof audioSynthesizer.playStormConduitEnergySurgeHum === 'function') {
        audioSynthesizer.playStormConduitEnergySurgeHum(1.05);
      }
    }

    const electrocutedEnemyIds = [];
    for (const enemy of nearbyEnemies) {
      const dist = Math.hypot((enemy.x ?? 0) - this.rodPosition.x, (enemy.z ?? 0) - this.rodPosition.z);
      if (dist <= this.arcDischargeRadiusMeters) {
        enemy.health = Math.max(0, Number(enemy.health ?? 100) - this.arcElectroDamage);
        enemy.electronicsFried = true;
        electrocutedEnemyIds.push(enemy.id ?? 'enemy');
      }
    }

    return {
      channeled: true,
      hunterEnergyAfterStrike: hunterState.energy,
      weaponLightningInfused: true,
      electrocutedEnemyIds
    };
  }

  update(dt = 0.016) {
    const safeDt = Math.max(0, Number(dt) || 0);
    if (this.state.cooldownTimer > 0) {
      this.state.cooldownTimer = Math.max(0, this.state.cooldownTimer - safeDt);
      this.state.stormChargeRatio = 1 - this.state.cooldownTimer / this.stormCycleIntervalSeconds;
    } else {
      this.state.stormChargeRatio = 1.0;
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      stormChargeRatio: Number(this.state.stormChargeRatio.toFixed(2)),
      totalLightningChannelings: this.state.totalLightningChannelings,
      lastOverchargeAmount: this.state.lastOverchargeAmount
    };
  }
}
