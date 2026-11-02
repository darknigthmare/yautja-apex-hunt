import { DEFAULT_SETTINGS } from '../data/GameConfig.js';
import { sanitizeGraphicsQuality } from '../render/graphicsQuality.js';
import { normalizeForgeState } from '../gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { normalizeShipServiceState } from '../gameplay/ShipServiceRuntime.js';
import { createMedbayInventoryState, prepareFieldMedbayInventory } from '../gameplay/YautjaMedbaySystem.js';
import {
  DEFAULT_CUSTOMIZATION,
  PLAYABLE_WEAPONS,
  getArmorPresetCustomization,
  sanitizeCustomization,
} from '../data/RuntimeEquipment.js';

const uniqueStrings = (value = []) => [...new Set(Array.isArray(value) ? value : [])]
  .filter((entry) => typeof entry === 'string');

function normalizeRecoveryState(value) {
  if (!value || !['healthRatio', 'energyRatio', 'staminaRatio'].every(key => Number.isFinite(value[key]))) return null;
  return { healthRatio: Math.max(0, Math.min(1, value.healthRatio)), energyRatio: Math.max(0, Math.min(1, value.energyRatio)),
    staminaRatio: Math.max(0, Math.min(1, value.staminaRatio)), isAcidCorroded: value.isAcidCorroded === true,
    acidTimer: Number.isFinite(value.acidTimer) ? Math.max(0, value.acidTimer) : 0, isBleeding: value.isBleeding === true,
    requiresMedicalRecovery: value.requiresMedicalRecovery === true,
    wristShieldIntegrity: Number.isFinite(value.wristShieldIntegrity) ? Math.max(0, Math.min(100, value.wristShieldIntegrity)) : 100 };
}

function serializeRecovery(player) {
  if (![player.health, player.energy, player.stamina, player.maxHealth, player.maxEnergy, player.maxStamina].every(Number.isFinite)) return null;
  return normalizeRecoveryState({ ...player, healthRatio: player.health / Math.max(1, player.maxHealth),
    energyRatio: player.energy / Math.max(1, player.maxEnergy), staminaRatio: player.stamina / Math.max(1, player.maxStamina) });
}

function normalizeMedicalInventory(source) {
  const chargesModifier = Number.isFinite(source?.chargesModifier) && source.chargesModifier > 0 ? source.chargesModifier : 1;
  const inventory = createMedbayInventoryState({ chargesModifier });
  if (source?.charges && typeof source.charges === 'object') {
    for (const key of Object.keys(inventory.charges)) {
      if (Number.isFinite(source.charges[key])) inventory.charges[key] = Math.max(0, Math.floor(source.charges[key]));
    }
  }
  inventory.lastUsedItemId = Object.hasOwn(inventory.charges, source?.lastUsedItemId) ? source.lastUsedItemId : null;
  inventory.totalTreatmentsApplied = Number.isFinite(source?.totalTreatmentsApplied)
    ? Math.max(0, Math.floor(source.totalTreatmentsApplied)) : 0;
  return prepareFieldMedbayInventory(inventory);
}

// Versioned and validated LocalStorage persistence for Yautja: Apex Hunt.
export class SaveManager {
  constructor() {
    this.VERSION = 4;
    this.STORAGE_KEY = 'yautja_apex_hunt_save_v4';
    this.VERSION3_KEY = 'yautja_apex_hunt_save_v3';
    this.PREVIOUS_KEY = 'yautja_apex_hunt_save_v2';
    this.V2_KEY = this.PREVIOUS_KEY;
    this.LEGACY_KEY = 'yautja_apex_hunt_save_v1';
    this.TEMP_KEY = `${this.STORAGE_KEY}_writing`;
  }

  sanitizeSettings(settings = {}) {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) settings = {};
    const scale = Number(settings.hudScale);
    return {
      audioEnabled: settings.audioEnabled !== false,
      reducedMotion: settings.reducedMotion === true,
      highContrast: settings.highContrast === true,
      graphicsQuality: sanitizeGraphicsQuality(settings.graphicsQuality),
      hudScale: Number.isFinite(scale) ? Math.min(1.25, Math.max(0.85, scale)) : DEFAULT_SETTINGS.hudScale,
    };
  }

  createPayload(player, settings = DEFAULT_SETTINGS) {
    const armorPresetId = typeof player.currentSkinId === 'string'
      ? player.currentSkinId
      : DEFAULT_CUSTOMIZATION.armorPresetId;
    const customization = sanitizeCustomization(player.customization, armorPresetId);

    return {
      version: this.VERSION,
      savedAt: new Date().toISOString(),
      player: {
        honorScore: Math.max(0, Number(player.honorScore) || 0),
        lifetimeHonor: Math.max(0, Number(player.lifetimeHonor ?? player.honorScore) || 0),
        honorRankIndex: Math.min(3, Math.max(0, Number(player.honorRankIndex) || 0)),
        hasTriBeam: player.hasTriBeam === true,
        hasAntiAcidCloak: player.hasAntiAcidCloak === true,
        hasScopeZoom: player.hasScopeZoom === true,
        currentSkinId: customization.armorPresetId,
        customization,
        completedHunts: uniqueStrings(player.completedHunts),
        completedDirectiveIds: uniqueStrings(player.completedDirectiveIds),
        discoveredPoiIds: uniqueStrings(player.discoveredPoiIds),
        unlockedTechIds: uniqueStrings(player.unlockedTechIds),
        unlockedWeaponIds: uniqueStrings(
          Array.isArray(player.unlockedWeaponIds)
            ? player.unlockedWeaponIds
            : PLAYABLE_WEAPONS.map(({ id }) => id),
        ),
        unlockedCosmeticIds: uniqueStrings(player.unlockedCosmeticIds),
        selectedVehicleId: typeof player.selectedVehicleId === 'string'
          ? player.selectedVehicleId
          : 'vehicle_jungle_dropcraft',
        ...(player.shipServiceState ? { shipServiceState: normalizeShipServiceState(player.shipServiceState) } : {}),
        ...(player.medbayInventory ? { medbayInventory: normalizeMedicalInventory(player.medbayInventory) } : {}),
        ...(serializeRecovery(player) ? { recoveryState: serializeRecovery(player) } : {}),
        ...(Object.prototype.hasOwnProperty.call(player, 'trophyCraftForgeState')
          && player.trophyCraftForgeState !== undefined
          ? { trophyCraftForgeState: normalizeForgeState(player.trophyCraftForgeState) }
          : {}),
      },
      settings: this.sanitizeSettings(settings),
    };
  }

  save(player, settings = DEFAULT_SETTINGS) {
    try {
      const serialized = JSON.stringify(this.createPayload(player, settings));
      localStorage.setItem(this.TEMP_KEY, serialized);
      localStorage.setItem(this.STORAGE_KEY, serialized);
      localStorage.removeItem(this.TEMP_KEY);
      return true;
    } catch (error) {
      console.warn('LocalStorage save error', error);
      return false;
    }
  }

  parseCandidate(serialized, { format = 'v4' } = {}) {
    const parsed = JSON.parse(serialized);
    if (format === 'v4' && parsed?.version !== this.VERSION) {
      throw new Error(`Unsupported save version: ${parsed?.version ?? 'missing'}`);
    }
    if (format === 'v3' && parsed?.version !== 3) {
      throw new Error(`Unsupported v3 save version: ${parsed?.version ?? 'missing'}`);
    }
    if (format === 'v2' && parsed?.version !== 2) {
      throw new Error(`Unsupported previous save version: ${parsed?.version ?? 'missing'}`);
    }

    const source = format === 'v1' ? parsed : parsed?.player;
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      throw new Error('Save payload missing player data');
    }

    return { parsed, source };
  }

  readRawSave() {
    const candidates = [
      { key: this.STORAGE_KEY, format: 'v4', temporary: false },
      { key: this.TEMP_KEY, format: 'v4', temporary: true },
      { key: this.VERSION3_KEY, format: 'v3', temporary: false },
      { key: this.PREVIOUS_KEY, format: 'v2', temporary: false },
      { key: this.LEGACY_KEY, format: 'v1', temporary: false },
    ];
    const validCandidates = [];
    let lastError;

    for (const candidate of candidates) {
      const serialized = localStorage.getItem(candidate.key);
      if (!serialized) continue;

      try {
        const validated = this.parseCandidate(serialized, candidate);
        validCandidates.push({ ...candidate, serialized, ...validated });
      } catch (error) {
        lastError = error;
        console.warn(`LocalStorage save candidate invalid (${candidate.key})`, error);
      }
    }

    const currentCandidates = validCandidates.filter(({ format }) => format === 'v4');
    if (currentCandidates.length > 0) {
      currentCandidates.sort((left, right) => {
        const leftTime = Date.parse(left.parsed?.savedAt ?? '') || 0;
        const rightTime = Date.parse(right.parsed?.savedAt ?? '') || 0;
        if (rightTime !== leftTime) return rightTime - leftTime;
        return Number(right.temporary) - Number(left.temporary);
      });
      return currentCandidates[0];
    }

    if (validCandidates.length > 0) return validCandidates[0];
    if (lastError) throw lastError;
    return null;
  }

  load(player) {
    try {
      const raw = this.readRawSave();
      if (!raw) return { loaded: false, migrated: false, settings: { ...DEFAULT_SETTINGS } };

      const { parsed, source } = raw;
      const score = Number(source.honorScore);
      const rank = Number(source.honorRankIndex);
      const normalizedRank = Number.isFinite(rank) ? Math.min(3, Math.max(0, rank)) : 0;
      const rankThresholds = [0, 800, 1800, 3000];
      const legacyLifetime = Math.max(Number.isFinite(score) ? score : 0, rankThresholds[normalizedRank]);
      const lifetime = Number(source.lifetimeHonor ?? legacyLifetime);
      if (Number.isFinite(score)) player.honorScore = Math.max(0, score);
      if (Number.isFinite(lifetime)) player.lifetimeHonor = Math.max(0, lifetime);
      if (typeof player.syncHonorRank === 'function') player.syncHonorRank();
      else if (Number.isFinite(rank)) player.honorRankIndex = Math.min(3, Math.max(0, rank));
      player.hasTriBeam = source.hasTriBeam === true;
      player.hasAntiAcidCloak = source.hasAntiAcidCloak === true;
      player.hasScopeZoom = source.hasScopeZoom === true;

      const armorPresetId = typeof source.currentSkinId === 'string'
        ? source.currentSkinId
        : DEFAULT_CUSTOMIZATION.armorPresetId;
      const sourceCustomization = ['v4', 'v3'].includes(raw.format) ? source.customization : getArmorPresetCustomization(armorPresetId);
      player.customization = sanitizeCustomization(
        sourceCustomization,
        armorPresetId,
      );
      player.currentSkinId = player.customization.armorPresetId;
      player.completedHunts = uniqueStrings(source.completedHunts);
      player.completedDirectiveIds = uniqueStrings(source.completedDirectiveIds);
      player.discoveredPoiIds = uniqueStrings(source.discoveredPoiIds);
      player.unlockedTechIds = uniqueStrings(source.unlockedTechIds);
      player.unlockedWeaponIds = uniqueStrings(
        Array.isArray(source.unlockedWeaponIds)
          ? source.unlockedWeaponIds
          : PLAYABLE_WEAPONS.map(({ id }) => id),
      );
      player.unlockedCosmeticIds = uniqueStrings(source.unlockedCosmeticIds);
      player.selectedVehicleId = typeof source.selectedVehicleId === 'string'
        ? source.selectedVehicleId
        : 'vehicle_jungle_dropcraft';
      if (source.shipServiceState) player.shipServiceState = normalizeShipServiceState(source.shipServiceState);
      if (source.medbayInventory) player.medbayInventory = normalizeMedicalInventory(source.medbayInventory);
      const recovery = normalizeRecoveryState(source.recoveryState);
      if (recovery) player.pendingRecoveryState = recovery;
      if (Object.prototype.hasOwnProperty.call(source, 'trophyCraftForgeState')) {
        player.trophyCraftForgeState = normalizeForgeState(source.trophyCraftForgeState);
      } else {
        // Preserve absence for the one-time migration of the legacy forge key.
        delete player.trophyCraftForgeState;
      }

      const settings = this.sanitizeSettings(raw.format === 'v1' ? DEFAULT_SETTINGS : parsed.settings);
      const migrated = raw.format !== 'v4';
      if (migrated) {
        const migrationSaved = this.save(player, settings);
        if (migrationSaved) localStorage.removeItem(raw.key);
      } else if (raw.temporary) {
        this.save(player, settings);
      }

      return { loaded: true, migrated, settings };
    } catch (error) {
      console.warn('LocalStorage load error', error);
      return { loaded: false, migrated: false, settings: { ...DEFAULT_SETTINGS }, error };
    }
  }
}

export const saveManager = new SaveManager();
