/**
 * VoyageurBisonGraveyardAshFogAmbushSector.js
 * Chantier 3 (v151) : Cimetière de bisons écorchés & brume de fumée des trappeurs français (Prey 2022).
 * Plaine des Grandes Plaines jonchée de carcasses et enveloppée par la fumée des feux de camp :
 * - Les nappes de fumée basse et de cendres dissimulent l'approche accroupie de Feral ou de Naru.
 * - Offre des points d'appui furtifs derrière les carcasses et déclenche un bonus de férocité
 *   du chasseur face aux trappeurs lourdement armés de mousquets à silex.
 */

export class VoyageurBisonGraveyardAshFogAmbushSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'comanche_plains_bison_graveyard_ash_fog';
    this.ashSmokeDensity = options.ashSmokeDensity ?? 0.84;

    this.ambushMounds = (options.ambushMounds ?? [
      { id: 'mound_north_carcass', x: -14, z: 8, occupiedBy: null },
      { id: 'mound_center_hearth', x: 0, z: 16, occupiedBy: null },
      { id: 'mound_south_wagon', x: 12, z: -6, occupiedBy: null }
    ]).map((m) => ({ ...m }));

    this.state = {
      totalAmbushesLaunched: 0,
      trappersNeutralized: 0
    };
  }

  enterAshFogConcealment(hunter = {}, moundId = 'mound_north_carcass', audioSynthesizer = null) {
    const mound = this.ambushMounds.find((m) => m.id === moundId);
    if (!mound) {
      return { concealed: false, reason: 'mound_not_found' };
    }

    mound.occupiedBy = hunter.id ?? 'hunter';
    hunter.concealedInAshSmoke = true;
    hunter.musketAimPenaltyAgainstHunter = 0.78;

    if (audioSynthesizer && typeof audioSynthesizer.playBisonGraveyardAshWindHowl === 'function') {
      audioSynthesizer.playBisonGraveyardAshWindHowl(0.95);
    }

    return {
      concealed: true,
      moundId: mound.id,
      ashSmokeDensity: this.ashSmokeDensity,
      musketAimPenaltyAgainstHunter: hunter.musketAimPenaltyAgainstHunter
    };
  }

  executeCrossfireAshAmbush(hunter = {}, trappers = []) {
    this.state.totalAmbushesLaunched += 1;
    const eliminatedIds = [];

    for (const trapper of trappers) {
      const dist = Number(trapper.distanceMeters ?? 6.0);
      if (dist <= 10.0) {
        trapper.health = 0;
        trapper.ambushedFromAshFog = true;
        eliminatedIds.push(trapper.id ?? 'trapper');
        this.state.trappersNeutralized += 1;
      }
    }

    hunter.concealedInAshSmoke = false;
    return {
      ambushed: true,
      eliminatedCount: eliminatedIds.length,
      eliminatedIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      ashSmokeDensity: this.ashSmokeDensity,
      totalAmbushesLaunched: this.state.totalAmbushesLaunched,
      trappersNeutralized: this.state.trappersNeutralized
    };
  }
}
