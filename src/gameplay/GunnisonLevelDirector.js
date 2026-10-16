// Directeur du niveau Gunnison, Colorado (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Cimetière, Blackout et Hôpital/Héliport

export const GUNNISON_ZONES = {
  CEMETERY_CRYPTS: {
    id: 'cemetery_crypts',
    name: 'Cimetière & Crypte de Gunnison',
    ambientFogDensity: 0.65,
    thermalOcclusion: 0.3,
  },
  DOWNTOWN_BLACKOUT: {
    id: 'downtown_blackout',
    name: 'Centre-ville en Blackout Total',
    ambientFogDensity: 0.2,
    electricalPowerActive: false,
  },
  HOSPITAL_ROOFTOP: {
    id: 'hospital_rooftop',
    name: 'Toit de l\'Hôpital & Héliport d\'Évacuation',
    ambientFogDensity: 0.15,
    elevation: 45.0,
    isEvacuationZone: true,
  },
};

export function createGunnisonLevelState(options = {}) {
  return {
    activeZone: GUNNISON_ZONES.CEMETERY_CRYPTS.id,
    powerGridOnline: options.powerGridOnline !== false,
    evacuationCountdown: 300.0, // 5 minutes avant frappe tactique F-22 / hélicoptère
    evacuationActive: false,
    evacuationCompleted: false,
    militaryNukeAlert: false,
    xenomorphWavesCount: 0,
    hospitalDefended: false,
  };
}

export function triggerTownPowerBlackout(state) {
  if (!state) return;
  state.powerGridOnline = false;
  state.activeZone = GUNNISON_ZONES.DOWNTOWN_BLACKOUT.id;
}

export function activateHospitalHelipadZone(state) {
  if (!state) return;
  state.activeZone = GUNNISON_ZONES.HOSPITAL_ROOFTOP.id;
  state.evacuationActive = true;
  state.evacuationCountdown = 120.0; // 2 minutes de survie intense au sommet
}

export function updateGunnisonDirector(state, delta, survivorTeam = []) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.evacuationActive && !state.evacuationCompleted) {
    state.evacuationCountdown = Math.max(0, state.evacuationCountdown - dt);

    // Alerte frappe thermonucléaire militaire (Lore AVP:R final)
    if (state.evacuationCountdown <= 30.0) {
      state.militaryNukeAlert = true;
    }

    if (state.evacuationCountdown <= 0) {
      state.evacuationCompleted = true;
      state.hospitalDefended = survivorTeam.some(s => (s.health || 0) > 0);
    }
  }
}
