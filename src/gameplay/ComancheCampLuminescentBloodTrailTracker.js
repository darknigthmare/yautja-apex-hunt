import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 4 (v154) — Campement Comanche de Naru, Empreintes de Sang Vert Luminescent & Fleur *Orange Totsiyaa* (*Prey 2022*)
 * Reproduit deux mécaniques clés de *Prey (2022)* dans les Grandes Plaines du Nord (1719) :
 * 1. Pistage nocturne par gouttes de sang vert phosphorescent Yautja sur les fougères et l'écorce.
 * 2. Ingestion de la fleur médicinale *Orange Totsiyaa* qui ralentit le flux sanguin et abaisse la température corporelle (`37 °C -> 21 °C`), rendant la proie invisible au spectre thermique (`THERMAL_INFRA`) du Feral Predator tant qu'elle ne sprinte pas et ne saigne pas.
 */
export class ComancheCampLuminescentBloodTrailTracker {
  constructor(options = {}) {
    this.bloodNodes = (options.bloodNodes ?? [
      { id: 'blood_drop_creek', x: -12, z: 4, luminescence: 0.95 },
      { id: 'blood_drop_birch', x: -6, z: 9, luminescence: 0.88 },
      { id: 'blood_drop_ridge', x: 2, z: 15, luminescence: 0.82 }
    ]).map(n => ({ ...n, inspected: false }));
    this.totsiyaaCoolingTargetTempC = 21.0;
  }

  inspectLuminescentBloodNode(nodeId) {
    const node = this.bloodNodes.find(n => n.id === nodeId);
    if (!node) return { found: false };

    node.inspected = true;
    audioSynth.playLuminescentBloodTrailPulseShimmer?.();

    const inspectedCount = this.bloodNodes.filter(n => n.inspected).length;
    return {
      found: true,
      nodeId: node.id,
      luminescence: node.luminescence,
      inspectedCount,
      trailLocked: inspectedCount >= 2
    };
  }

  applyOrangeTotsiyaaHerbEffect(subject = {}) {
    subject.ingestedOrangeTotsiyaa = true;
    subject.bodyTemperatureCelsius = this.totsiyaaCoolingTargetTempC;
    subject.invisibleToThermalVision = true;

    audioSynth.playOrangeTotsiyaaHypothermicCoolChime?.();

    return {
      applied: true,
      bodyTemperatureCelsius: subject.bodyTemperatureCelsius,
      invisibleToThermalVision: subject.invisibleToThermalVision,
      detectedOnlyByMotionOrFootsteps: true
    };
  }
}
