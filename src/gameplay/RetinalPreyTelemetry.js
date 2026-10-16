// Télémétrie physiologique rétinienne et scanner biométrique du Biomasque (Lore 1:1)
// Référence canonique : Predator 2 (1990) (séquence d'analyse des passagers du métro de Los Angeles)

import { audioSynth } from '../AudioSynthesizer.js';

export function scanTargetPhysiology(target, audio = audioSynth) {
  if (!target) return null;

  if (audio && typeof audio.playForensicScanChirp === 'function') {
    audio.playForensicScanChirp();
  }

  const isSynth = Boolean(target.isSynthetic || target.npcType?.includes('synth'));
  const isXeno = Boolean(target.isXenomorph || target.npcType?.includes('xeno'));
  const isAlerted = Boolean(target.isAlerted || target.aiState === 'combat' || target.inCombat);
  const isPanicked = Boolean(target.isPanicked || target.aiState === 'flee');
  const isPregnant = Boolean(target.isPregnant);
  const isTerminallyIll = Boolean(target.isTerminallyIll);

  let heartRateBpm = 72;
  let coreTempCelsius = 37.0;
  let physiologicalState = 'CALME / REPOS';
  let threatLevel = 'FAIBLE';

  if (isSynth) {
    heartRateBpm = 0; // Pas de pouls organique
    coreTempCelsius = 22.4; // Liquide de refroidissement synthétique
    physiologicalState = 'SYNTHÉTIQUE ACTIF (W-Y)';
    threatLevel = 'MOYENNE';
  } else if (isXeno) {
    heartRateBpm = 190;
    coreTempCelsius = 9.8; // Sang acide moléculaire froid
    physiologicalState = 'ORGANISME PARASITAIRE APEX';
    threatLevel = 'EXTRÊME';
  } else if (isPregnant) {
    heartRateBpm = 88;
    coreTempCelsius = 37.4;
    physiologicalState = 'GESTATION DÉTECTÉE (NON-CIBLE)';
    threatLevel = 'NULLE (PROTÉGÉE)';
  } else if (isPanicked) {
    heartRateBpm = 178;
    coreTempCelsius = 38.6;
    physiologicalState = 'PANIQUE & DÉCHARGE D’ADRÉNALINE';
    threatLevel = 'FAIBLE';
  } else if (isAlerted) {
    heartRateBpm = 142;
    coreTempCelsius = 37.8;
    physiologicalState = 'VIGILANCE TACTIQUE / COMBAT';
    threatLevel = 'ÉLEVÉE';
  } else if (isTerminallyIll) {
    heartRateBpm = 58;
    coreTempCelsius = 36.2;
    physiologicalState = 'PATHOLOGIE TERMINALE DÉTECTÉE';
    threatLevel = 'NULLE (PROTÉGÉE)';
  }

  const hasFirearm = Boolean(target.hasWeapon !== false && !isXeno);

  return {
    targetId: target.id ?? target.name ?? 'prey_signature',
    heartRateBpm,
    coreTempCelsius,
    physiologicalState,
    threatLevel,
    isPregnant,
    isTerminallyIll,
    isSynthetic: isSynth,
    isXenomorph: isXeno,
    hasFirearm,
    scanTimestamp: Date.now(),
  };
}

export function formatTelemetrySummary(telemetry) {
  if (!telemetry) return 'AUCUNE CIBLE ACQUISE';
  return `${telemetry.physiologicalState} · POULS: ${telemetry.heartRateBpm} BPM · TEMP: ${telemetry.coreTempCelsius.toFixed(1)}°C · MENACE: ${telemetry.threatLevel}`;
}
