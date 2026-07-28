// Save Manager using LocalStorage for Yautja: Apex Hunt

class SaveManager {
  constructor() {
    this.STORAGE_KEY = 'yautja_apex_hunt_save_v1';
  }

  save(player) {
    try {
      const data = {
        honorScore: player.honorScore,
        honorRankIndex: player.honorRankIndex,
        hasTriBeam: player.hasTriBeam,
        hasAntiAcidCloak: player.hasAntiAcidCloak,
        hasScopeZoom: player.hasScopeZoom
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }

  load(player) {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return false;
      const data = JSON.parse(saved);

      if (data.honorScore !== undefined) player.honorScore = data.honorScore;
      if (data.honorRankIndex !== undefined) player.honorRankIndex = data.honorRankIndex;
      if (data.hasTriBeam !== undefined) player.hasTriBeam = data.hasTriBeam;
      if (data.hasAntiAcidCloak !== undefined) player.hasAntiAcidCloak = data.hasAntiAcidCloak;
      if (data.hasScopeZoom !== undefined) player.hasScopeZoom = data.hasScopeZoom;

      return true;
    } catch (e) {
      console.warn("LocalStorage load error", e);
      return false;
    }
  }
}

export const saveManager = new SaveManager();
