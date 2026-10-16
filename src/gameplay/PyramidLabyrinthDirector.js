// Directeur du labyrinthe pyramidal souterrain de l'Île Bouvet (Lore 1:1)
// Référence canonique : Alien vs Predator (2004) - La pyramide change de configuration toutes les 10 minutes

import { audioSynth } from '../AudioSynthesizer.js';

export const PYRAMID_CONSTANTS = {
  DEFAULT_SHIFT_INTERVAL: 600.0, // 10 minutes (Lore 1:1 canon)
  SHIFT_TRANSITION_DURATION: 12.0, // Durée du mouvement des blocs mégalithiques
  TOTAL_CONFIGURATIONS: 4,
};

export function createPyramidLabyrinth(options = {}) {
  const shiftInterval = Number(options.shiftInterval) || PYRAMID_CONSTANTS.DEFAULT_SHIFT_INTERVAL;
  const chambers = [
    { id: 'sacrificial_chamber', name: 'Chambre Sacrificielle', elevation: -120 },
    { id: 'sarcophagus_vault', name: 'Caveau des Canons Plasmacaster', elevation: -100 },
    { id: 'hieroglyph_vestibule', name: 'Vestibule des Glyphes', elevation: -80 },
    { id: 'chitin_matrix_corridor', name: 'Corridor Chitinique', elevation: -110 },
  ];

  // Matrice de connectivité des corridors par configuration (0, 1, 2, 3)
  const configurations = [
    // Config 0: Entrée vers Vestibule et Chambre Sacrificielle ouverte
    { 'sacrificial_chamber': ['hieroglyph_vestibule'], 'sarcophagus_vault': [], 'chitin_matrix_corridor': ['hieroglyph_vestibule'] },
    // Config 1: Caveau ouvert, corridor fermé
    { 'sacrificial_chamber': [], 'sarcophagus_vault': ['hieroglyph_vestibule', 'chitin_matrix_corridor'], 'chitin_matrix_corridor': ['sarcophagus_vault'] },
    // Config 2: Confinement / Kill-box total
    { 'sacrificial_chamber': ['sarcophagus_vault'], 'sarcophagus_vault': ['sacrificial_chamber'], 'chitin_matrix_corridor': [] },
    // Config 3: Réseau complet de chasse rituelle
    { 'sacrificial_chamber': ['chitin_matrix_corridor'], 'sarcophagus_vault': ['chitin_matrix_corridor', 'hieroglyph_vestibule'], 'chitin_matrix_corridor': ['sacrificial_chamber', 'sarcophagus_vault'] },
  ];

  return {
    shiftInterval,
    countdown: shiftInterval,
    currentConfigIndex: 0,
    isShifting: false,
    shiftProgress: 0,
    shiftDuration: PYRAMID_CONSTANTS.SHIFT_TRANSITION_DURATION,
    chambers,
    configurations,
    totalShiftsCount: 0,
  };
}

export function triggerLabyrinthShift(labyrinth, audio = audioSynth) {
  if (!labyrinth || labyrinth.isShifting) return false;
  labyrinth.isShifting = true;
  labyrinth.shiftProgress = 0;
  labyrinth.countdown = labyrinth.shiftInterval;

  if (audio && typeof audio.playPyramidStoneGrind === 'function') {
    audio.playPyramidStoneGrind();
  }
  return true;
}

export function updatePyramidLabyrinth(labyrinth, delta, audio = audioSynth) {
  if (!labyrinth) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (labyrinth.isShifting) {
    labyrinth.shiftProgress += dt / labyrinth.shiftDuration;
    if (labyrinth.shiftProgress >= 1.0) {
      labyrinth.shiftProgress = 1.0;
      labyrinth.isShifting = false;
      labyrinth.currentConfigIndex = (labyrinth.currentConfigIndex + 1) % labyrinth.configurations.length;
      labyrinth.totalShiftsCount += 1;
    }
  } else {
    labyrinth.countdown = Math.max(0, labyrinth.countdown - dt);
    if (labyrinth.countdown <= 0) {
      triggerLabyrinthShift(labyrinth, audio);
    }
  }
}

export function isPathTraversable(labyrinth, fromChamberId, toChamberId) {
  if (!labyrinth) return false;
  if (labyrinth.isShifting) return false; // Portes mégalithiques en cours de rotation

  const activeLayout = labyrinth.configurations[labyrinth.currentConfigIndex];
  if (!activeLayout || !activeLayout[fromChamberId]) return false;

  return activeLayout[fromChamberId].includes(toChamberId);
}
