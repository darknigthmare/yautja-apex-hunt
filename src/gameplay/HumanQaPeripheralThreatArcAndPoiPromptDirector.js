import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 6 + Audit Testeur Humain QA #1 (v156) — Persona "Joueur FPS/TPS Compétitif : Arc Directionnel de Menace Périphérique 360° & Invite POI Haute Visibilité"
 * 1. Calcule l'angle CSS (`rotate(${angleDeg}deg)`) et le quadrant (`REAR_LEFT`, `REAR_RIGHT`, `FRONT`, `FLANK`) d'une menace hors-champ afin d'afficher un arc directionnel immédiat autour du réticule.
 * 2. Formate les invites d'interaction POI (`[E]`) avec la distance arrondie au dixième de mètre et l'état d'éligibilité.
 */
export class HumanQaPeripheralThreatArcAndPoiPromptDirector {
  computeThreatArcIndicator(relativeAngleRad = 0, threatSeverity = 'HIGH') {
    const deg = Math.round(((Number(relativeAngleRad) || 0) * 180) / Math.PI);
    const normalizedDeg = ((deg % 360) + 360) % 360;

    let quadrant = 'FRONT';
    if (normalizedDeg >= 45 && normalizedDeg < 135) quadrant = 'RIGHT_FLANK';
    else if (normalizedDeg >= 135 && normalizedDeg < 225) quadrant = 'REAR_BLINDSPOT';
    else if (normalizedDeg >= 225 && normalizedDeg < 315) quadrant = 'LEFT_FLANK';

    if (threatSeverity === 'HIGH' || threatSeverity === 'CRITICAL') {
      audioSynth.playPeripheralThreatArcWarningPing?.();
    }

    return {
      rotationDeg: normalizedDeg,
      cssTransform: `rotate(${normalizedDeg}deg)`,
      quadrant,
      arcVisible: true
    };
  }

  formatPoiInteractionPill(poiLabel = 'Console Sacrificielle', distanceMeters = 1.8, maxRangeMeters = 3.0) {
    const withinRange = distanceMeters <= maxRangeMeters;
    const roundedDist = Number(distanceMeters).toFixed(1);
    return {
      withinRange,
      pillText: `[E] ${poiLabel} (${roundedDist}m)`,
      cssClass: 'poi-interaction-pill'
    };
  }
}
