import { createMedbayInventoryState, prepareFieldMedbayInventory, refillMedbayInventory } from './YautjaMedbaySystem.js';

export const SHIP_TRANSPORTS = Object.freeze({
  scout: Object.freeze({ kind: 'scout', label: 'Éclaireur du croiseur', sourceTier: 'ORIGINAL', vehicleType: 'scout_shuttle' }),
  shuttle: Object.freeze({ kind: 'shuttle', label: 'Navette de chasse du croiseur', sourceTier: 'ORIGINAL', vehicleType: 'hunter_shuttle' }),
  pod: Object.freeze({ kind: 'pod', label: 'Capsule de traque du croiseur', sourceTier: 'ORIGINAL', vehicleType: 'hunt_drop_pod' }),
});

export function normalizeShipServiceState(value) {
  return { version: 1, selectedTransportKind: Object.hasOwn(SHIP_TRANSPORTS, value?.selectedTransportKind)
    ? value.selectedTransportKind : 'scout' };
}

/** Ship stations service existing resources; none award currency or trophies. */
export class ShipServiceRuntime {
  constructor(player, { onChange } = {}) {
    this.player = player;
    this.onChange = onChange;
    player.shipServiceState = normalizeShipServiceState(player.shipServiceState);
  }

  getDeploymentTransport() {
    return SHIP_TRANSPORTS[this.player.shipServiceState.selectedTransportKind] ?? SHIP_TRANSPORTS.scout;
  }

  selectTransport(kind, { gameState } = {}) {
    if (gameState !== 'HUB') return { success: false, changed: false, message: 'Sélection du transport disponible au croiseur.' };
    if (!Object.hasOwn(SHIP_TRANSPORTS, kind)) return { success: false, changed: false, message: 'Transport inconnu.' };
    const changed = this.player.shipServiceState.selectedTransportKind !== kind;
    this.player.shipServiceState.selectedTransportKind = kind;
    if (changed) this.onChange?.();
    return { success: true, changed, transport: this.getDeploymentTransport(), message: `${SHIP_TRANSPORTS[kind].label} prêt pour le prochain départ.` };
  }

  perform(serviceId, { gameState, station } = {}) {
    if (gameState !== 'HUB') return { success: false, changed: false, message: 'Service disponible uniquement à bord du croiseur.' };
    if (typeof serviceId !== 'string') return { success: false, changed: false, message: 'Service inconnu.' };
    if (serviceId.startsWith('select_transport_')) return this.selectTransport(serviceId.slice('select_transport_'.length), { gameState });
    const tabs = { contracts: 'missions', loadout: 'loadout', armory: 'armory', crafting: 'crafting', codex: 'codex' };
    if (Object.hasOwn(tabs, serviceId)) return { success: true, changed: false, openTab: tabs[serviceId] };
    if (serviceId === 'prepare_hunt') return { success: true, changed: false, openTab: 'loadout', huntId: station?.huntId ?? null };
    const expectedStation = { restore_vitals: 'cryo', medical: 'cleaner_lab', recharge: 'core' };
    if (!Object.hasOwn(expectedStation, serviceId) || station?.interactionType !== expectedStation[serviceId]) {
      return { success: false, changed: false, message: 'Ce service ne correspond pas à cette station.' };
    }
    const player = this.player;
    const before = this.snapshot();
    if (serviceId === 'restore_vitals') {
      player.health = player.maxHealth;
      player.stamina = player.maxStamina;
    } else if (serviceId === 'medical') {
      player.health = player.maxHealth;
      player.stamina = player.maxStamina;
      player.isAcidCorroded = false;
      player.acidTimer = 0;
      player.isBleeding = false;
      player.requiresMedicalRecovery = false;
      player.medicalAcidImmunityTimer = 0;
      player.clearCombatStatuses?.();
      player.medbayInventory = prepareFieldMedbayInventory(player.medbayInventory ?? createMedbayInventoryState());
      refillMedbayInventory(player.medbayInventory);
    } else {
      player.energy = player.maxEnergy;
      player.wristShieldIntegrity = 100;
      for (const key of ['wristShieldCooldown', 'scoutDroneCooldown', 'shurikenCooldown', 'apexDecoyCooldown']) player[key] = 0;
      player.waterDisruptionTimer = 0;
    }
    const changed = before !== this.snapshot();
    if (changed) this.onChange?.();
    const messages = {
      restore_vitals: 'Cryostase : santé et endurance restaurées. Les blessures contaminées relèvent du laboratoire.',
      medical: 'Laboratoire Cleaner : plaies traitées, corrosion neutralisée et réserve Medicomp rechargée.',
      recharge: 'Noyau : énergie, intégrité du bouclier et systèmes auxiliaires restaurés.',
    };
    return { success: true, changed, message: changed ? messages[serviceId] : 'Systèmes déjà opérationnels pour ce service.',
      ...(serviceId === 'medical' ? { openMedbay: true } : {}) };
  }

  snapshot() {
    const player = this.player;
    return JSON.stringify([player.health, player.energy, player.stamina, player.isAcidCorroded, player.acidTimer,
      player.isBleeding, player.medicalAcidImmunityTimer, player.combatStatusTimers, player.medbayInventory,
      player.wristShieldIntegrity, player.wristShieldCooldown, player.scoutDroneCooldown, player.shurikenCooldown,
      player.apexDecoyCooldown, player.waterDisruptionTimer, player.requiresMedicalRecovery]);
  }
}
