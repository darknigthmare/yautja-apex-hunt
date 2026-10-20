import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 10 + Audit Testeur Humain QA #5 (v156) — Persona "Testeur QA Mobilité 3D & Caméra : Hauteur Sous Plafond de Bond Yautja & Anti-Clipping Caméra"
 * 1. Adapte la flèche parabolique d'un saut assisté (`adjustedApexHeightMeters`) lorsqu'une poutre ou un plafond bas est détecté au-dessus de la trajectoire, évitant au Predator de se cogner la tête et de retomber sur place.
 * 2. Ramène doucement la caméra 3e personne en avant (`clampedCameraDistanceMeters`) lorsqu'un mur se trouve derrière le dos du chasseur.
 */
export class HumanQaLevelDesignJumpArcHeadroomAndCameraAuditor {
  constructor(options = {}) {
    this.minClearanceMarginMeters = options.minClearanceMarginMeters ?? 0.65;
    this.defaultCameraDistanceMeters = options.defaultCameraDistanceMeters ?? 4.2;
  }

  computeSafeJumpArcApex(desiredApexHeight = 5.0, ceilingHeightMeters = 10.0) {
    const maxAllowedApex = ceilingHeightMeters - this.minClearanceMarginMeters;
    const clampedApex = Math.max(1.2, Math.min(desiredApexHeight, maxAllowedApex));
    return {
      headBonkPrevented: desiredApexHeight > maxAllowedApex,
      adjustedApexHeightMeters: Number(clampedApex.toFixed(2)),
      horizontalMomentumPreserved: true
    };
  }

  resolveCameraWallCollision(wallHitDistanceMeters = null) {
    if (wallHitDistanceMeters !== null && wallHitDistanceMeters < this.defaultCameraDistanceMeters) {
      audioSynth.playCameraSpringArmAntiClipSlide?.();
      const safeDist = Math.max(0.85, wallHitDistanceMeters - 0.25);
      return {
        wallClippingPrevented: true,
        clampedCameraDistanceMeters: Number(safeDist.toFixed(2))
      };
    }

    return {
      wallClippingPrevented: false,
      clampedCameraDistanceMeters: this.defaultCameraDistanceMeters
    };
  }
}
