import { DEFAULT_SETTINGS } from '../data/GameConfig.js';

// Versioned and validated LocalStorage persistence for Yautja: Apex Hunt.
export class SaveManager {
  constructor() {
    this.VERSION = 2;
    this.STORAGE_KEY = 'yautja_apex_hunt_save_v2';
    this.LEGACY_KEY = 'yautja_apex_hunt_save_v1';
    this.TEMP_KEY = `${this.STORAGE_KEY}_writing`;
  }

  sanitizeSettings(settings = {}) {
    const scale = Number(settings.hudScale);
    return {
      audioEnabled: settings.audioEnabled !== false,
      reducedMotion: settings.reducedMotion === true,
      highContrast: settings.highContrast === true,
      hudScale: Number.isFinite(scale) ? Math.min(1.25, Math.max(0.85, scale)) : DEFAULT_SETTINGS.hudScale,
    };
  }

  createPayload(player, settings = DEFAULT_SETTINGS) {
    return {
      version: this.VERSION,
      savedAt: new Date().toISOString(),
      player: {
        honorScore: Math.max(0, Number(player.honorScore) || 0),
        honorRankIndex: Math.min(3, Math.max(0, Number(player.honorRankIndex) || 0)),
        hasTriBeam: player.hasTriBeam === true,
        hasAntiAcidCloak: player.hasAntiAcidCloak === true,
        hasScopeZoom: player.hasScopeZoom === true,
        currentSkinId: typeof player.currentSkinId === 'string' ? player.currentSkinId : 'jungle_1987',
        completedHunts: [...new Set(Array.isArray(player.completedHunts) ? player.completedHunts : [])]
          .filter((id) => typeof id === 'string'),
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

  parseCandidate(serialized, { legacy = false } = {}) {
    const parsed = JSON.parse(serialized);
    if (!legacy && parsed?.version !== this.VERSION) {
      throw new Error(`Unsupported save version: ${parsed?.version ?? 'missing'}`);
    }

    const source = legacy ? parsed : parsed?.player;
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      throw new Error('Save payload missing player data');
    }

    return { parsed, source };
  }

  readRawSave() {
    const candidates = [
      { key: this.STORAGE_KEY, legacy: false, temporary: false },
      { key: this.TEMP_KEY, legacy: false, temporary: true },
      { key: this.LEGACY_KEY, legacy: true, temporary: false },
    ];
    let lastError;

    for (const candidate of candidates) {
      const serialized = localStorage.getItem(candidate.key);
      if (!serialized) continue;

      try {
        const validated = this.parseCandidate(serialized, candidate);
        return { ...candidate, serialized, ...validated };
      } catch (error) {
        lastError = error;
        console.warn(`LocalStorage save candidate invalid (${candidate.key})`, error);
      }
    }

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
      if (Number.isFinite(score)) player.honorScore = Math.max(0, score);
      if (Number.isFinite(rank)) player.honorRankIndex = Math.min(3, Math.max(0, rank));
      player.hasTriBeam = source.hasTriBeam === true;
      player.hasAntiAcidCloak = source.hasAntiAcidCloak === true;
      player.hasScopeZoom = source.hasScopeZoom === true;
      if (typeof source.currentSkinId === 'string') player.currentSkinId = source.currentSkinId;
      player.completedHunts = [...new Set(Array.isArray(source.completedHunts) ? source.completedHunts : [])]
        .filter((id) => typeof id === 'string');

      const settings = this.sanitizeSettings(raw.legacy ? DEFAULT_SETTINGS : parsed.settings);
      if (raw.legacy) {
        const migrated = this.save(player, settings);
        if (migrated) localStorage.removeItem(this.LEGACY_KEY);
      } else if (raw.temporary) {
        // Promote only a parsed and validated staging payload through the normal
        // temp -> primary -> temp cleanup write sequence.
        this.save(player, settings);
      }

      return { loaded: true, migrated: raw.legacy, settings };
    } catch (error) {
      console.warn('LocalStorage load error', error);
      return { loaded: false, migrated: false, settings: { ...DEFAULT_SETTINGS }, error };
    }
  }
}

export const saveManager = new SaveManager();
