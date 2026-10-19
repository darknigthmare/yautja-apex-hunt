/**
 * BioMaskDiegeticHudQaSanitizer.js
 * Chantier 6 + Audit QA #4 (v152) : Assainisseur diégétique du HUD Bio-Masque & convertisseur de glyphes Yautja.
 * Garantit l'intégrité diégétique et mathématique de l'interface du chasseur :
 * - Élimine toute valeur NaN, Infinity ou négative sur les jauges (Santé, Énergie, Endurance, Intégrité Masque).
 * - Gère proprement la surcharge plasma (ex: 150% Overcharge) en plafonnant la largeur CSS de barre à 100%
 *   tout en activant le drapeau diégétique `isOvercharged`.
 * - Désactive automatiquement le réticule tri-laser et les modes spectraux lorsque le bio-masque est brisé.
 * - Convertit les valeurs numériques en glyphes segmentés Yautja authentiques.
 */

export class BioMaskDiegeticHudQaSanitizer {
  constructor() {
    this.glyphDigits = ['◈', '〡', '〢', '〣', '〤', '〥', '〦', '〧', '〨', '〩'];
    this.totalSanitizationsPerformed = 0;
  }

  toYautjaGlyphString(numberValue = 0) {
    const safeInt = Math.max(0, Math.round(Number.isFinite(Number(numberValue)) ? Number(numberValue) : 0));
    return String(safeInt)
      .split('')
      .map((digit) => this.glyphDigits[Number(digit)] ?? '◈')
      .join(':');
  }

  sanitizeHudTelemetryPayload(rawTelemetry = {}, audioSynthesizer = null) {
    this.totalSanitizationsPerformed += 1;

    const cleanNum = (val, fallback = 0) => {
      const n = Number(val);
      return Number.isFinite(n) ? n : fallback;
    };

    const maxHp = Math.max(1, cleanNum(rawTelemetry.maxHealth, 100));
    const hp = Math.min(maxHp, Math.max(0, cleanNum(rawTelemetry.health, maxHp)));

    const maxEnergy = Math.max(1, cleanNum(rawTelemetry.maxEnergy, 100));
    const rawEnergy = Math.max(0, cleanNum(rawTelemetry.energy, maxEnergy));
    const isOvercharged = rawEnergy > maxEnergy;
    const energyBarWidthPercent = Math.min(100, Math.max(0, Math.round((rawEnergy / maxEnergy) * 100)));

    const maxStamina = Math.max(1, cleanNum(rawTelemetry.maxStamina, 100));
    const stamina = Math.min(maxStamina, Math.max(0, cleanNum(rawTelemetry.stamina, maxStamina)));

    const maskIntegrity = Math.min(100, Math.max(0, cleanNum(rawTelemetry.maskIntegrity, 100)));
    const bioMaskIntact = maskIntegrity > 0 && rawTelemetry.bioMaskRemoved !== true;

    const requestedVision = String(rawTelemetry.visionMode ?? 'THERMAL_IR').toUpperCase();
    const activeVisionMode = bioMaskIntact ? requestedVision : 'UNMASKED_NAKED_EYE';

    if (audioSynthesizer && typeof audioSynthesizer.playBioMaskDiegeticGlyphCalibrationBeep === 'function') {
      audioSynthesizer.playBioMaskDiegeticGlyphCalibrationBeep(0.8);
    }

    return {
      health: Math.round(hp),
      maxHealth: Math.round(maxHp),
      healthBarWidthPercent: Math.min(100, Math.max(0, Math.round((hp / maxHp) * 100))),
      energy: Math.round(rawEnergy),
      maxEnergy: Math.round(maxEnergy),
      energyBarWidthPercent,
      isOvercharged,
      stamina: Math.round(stamina),
      maxStamina: Math.round(maxStamina),
      staminaBarWidthPercent: Math.min(100, Math.max(0, Math.round((stamina / maxStamina) * 100))),
      maskIntegrity: Math.round(maskIntegrity),
      bioMaskIntact,
      triLaserReticleVisible: bioMaskIntact,
      activeVisionMode,
      diegeticHonorGlyphs: this.toYautjaGlyphString(rawTelemetry.honorScore ?? 0)
    };
  }
}
