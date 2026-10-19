import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v154) — Aile Hospitalière de Gunnison & Incursion du Predalien / Wolf Cleaner (*AVP: Requiem 2007*)
 * Reproduit les couloirs plongés dans le noir de l'hôpital du comté de Gunnison (Colorado) :
 * - Éclairage de secours intermittent (néons grésillants) suite au sabotage de la centrale électrique.
 * - Protocole "Cleaner" de Wolf : dissolution des traces biologiques Xénomorphes au liquide corrosif bleu pour contenir l'épidémie.
 * - Affrontement rapproché dans les couloirs étroits et la cage d'ascenseur contre le Predalien et sa couvée.
 */
export class GunnisonMaternityWardXenomorphInfestationSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'gunnison_memorial_hospital_ward_blackout';
    this.emergencyLightingFlickerHz = options.emergencyLightingFlickerHz ?? 2.4;
    this.biologicalEvidenceNodes = (options.biologicalEvidenceNodes ?? [
      { id: 'bio_residue_corridor_a', dissolved: false },
      { id: 'bio_residue_nursery', dissolved: false },
      { id: 'bio_residue_stairwell', dissolved: false }
    ]).map(n => ({ ...n }));
    this.predalienCorneredInShaft = false;
  }

  pulseEmergencyCorridorLighting() {
    audioSynth.playGunnisonWardEmergencyLampFlickerBuzz?.();
    return {
      blackoutActive: true,
      emergencyLightingFlickerHz: this.emergencyLightingFlickerHz,
      recommendedVisionMode: 'XENO_ELECTRO'
    };
  }

  dissolveBiologicalEvidenceWithBlueVial(nodeId) {
    const node = this.biologicalEvidenceNodes.find(n => n.id === nodeId);
    if (!node) return { dissolved: false, reason: 'node_not_found' };

    node.dissolved = true;
    audioSynth.playWolfDissolvingVialCorrosiveHiss?.();

    const remainingEvidence = this.biologicalEvidenceNodes.filter(n => !n.dissolved).length;
    if (remainingEvidence === 0) {
      this.predalienCorneredInShaft = true;
    }

    return {
      dissolved: true,
      nodeId: node.id,
      remainingEvidence,
      predalienCorneredInShaft: this.predalienCorneredInShaft
    };
  }
}
