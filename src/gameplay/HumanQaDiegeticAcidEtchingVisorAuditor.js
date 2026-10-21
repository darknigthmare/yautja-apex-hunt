/**
 * HumanQaDiegeticAcidEtchingVisorAuditor.js
 * 
 * Audit QA Humain #3 (Diégétique) - Corrosion Acide Localisée sur Visière & Alerte Vocale d'Érosion.
 * Addresses playtester feedback: "Taking Xenomorph or Predalien acid blood spray deals raw numeric damage
 * but leaves the bio-mask optic crystal perfectly clean and pristine, completely breaking combat immersion."
 * 
 * Provides:
 * - Micro-droplet acid impact tracking with pH calculation (0.2 to 1.5)
 * - Cavitation etching depth simulation (0.0 to 25.0 microns)
 * - Optical transmission degradation (blur, distortion, spectral noise up to 65%)
 * - Diegetic Yautja bio-mask vocal alarm warning
 * - Medi-Comp alkaline neutralizing spray wash (clears etching back to 100% clarity)
 * - DOM visual overlay creation (.visor-acid-etching-overlay)
 */

export class HumanQaDiegeticAcidEtchingVisorAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.maxEtchingDepthMicrons=25.0]
   * @param {number} [options.initialEtchingDepthMicrons=0.0]
   */
  constructor(options = {}) {
    this.maxEtchingDepthMicrons = options.maxEtchingDepthMicrons || 25.0;
    this.currentEtchingDepthMicrons = options.initialEtchingDepthMicrons || 0.0;

    this.acidCraters = [];
    this.opticalClarityPct = 100.0;
    this.isCorroding = false;
    this.diegeticWarningActive = false;
  }

  /**
   * Registers an acid droplet impact on the bio-mask viewport.
   * @param {number} dropletCount
   * @param {number} acidPh
   * @returns {Object} Acid etching telemetry
   */
  registerAcidImpact(dropletCount = 3, acidPh = 0.4) {
    this.isCorroding = true;
    const etchRatePerDroplet = Math.max(0.8, (2.0 - acidPh) * 2.2);
    const addedEtchDepth = dropletCount * etchRatePerDroplet;
    this.currentEtchingDepthMicrons = Math.min(this.maxEtchingDepthMicrons, this.currentEtchingDepthMicrons + addedEtchDepth);

    for (let i = 0; i < dropletCount; i++) {
      this.acidCraters.push({
        id: `acid-crater-${this.acidCraters.length + 1}`,
        xPct: Math.round(15 + Math.random() * 70),
        yPct: Math.round(15 + Math.random() * 70),
        diameterPx: Math.round(12 + Math.random() * 28),
        depthMicrons: Number(etchRatePerDroplet.toFixed(2))
      });
    }

    const etchingRatio = this.currentEtchingDepthMicrons / this.maxEtchingDepthMicrons;
    this.opticalClarityPct = Math.max(35.0, 100.0 - etchingRatio * 65.0);

    if (this.currentEtchingDepthMicrons >= 5.0) {
      this.diegeticWarningActive = true;
    }

    return {
      impactRegistered: true,
      dropletCount,
      acidPh,
      currentEtchingDepthMicrons: Number(this.currentEtchingDepthMicrons.toFixed(2)),
      opticalClarityPct: Number(this.opticalClarityPct.toFixed(1)),
      diegeticWarningActive: this.diegeticWarningActive,
      vocalAlarm: this.diegeticWarningActive ? 'CAUSTIC_PENETRATION_WARNING' : 'STABLE',
      activeCratersCount: this.acidCraters.length
    };
  }

  /**
   * Applies Medi-Comp alkaline neutralizing spray to dissolve acid salts and restore optical polish.
   * @param {number} sprayDoseMl
   * @returns {Object} Neutralization telemetry
   */
  applyAlkalineNeutralizingWash(sprayDoseMl = 25.0) {
    if (this.currentEtchingDepthMicrons <= 0.0) {
      return { success: false, reason: 'NO_ACID_ETCHING_PRESENT' };
    }

    const depthNeutralized = Math.min(this.currentEtchingDepthMicrons, (sprayDoseMl / 25.0) * 18.0);
    this.currentEtchingDepthMicrons = Math.max(0, this.currentEtchingDepthMicrons - depthNeutralized);

    if (this.currentEtchingDepthMicrons === 0) {
      this.acidCraters = [];
      this.isCorroding = false;
      this.diegeticWarningActive = false;
      this.opticalClarityPct = 100.0;
    } else {
      const etchingRatio = this.currentEtchingDepthMicrons / this.maxEtchingDepthMicrons;
      this.opticalClarityPct = Math.max(35.0, 100.0 - etchingRatio * 65.0);
      if (this.currentEtchingDepthMicrons < 5.0) {
        this.diegeticWarningActive = false;
      }
    }

    return {
      success: true,
      sprayDoseMl,
      depthNeutralized: Number(depthNeutralized.toFixed(2)),
      remainingEtchDepthMicrons: Number(this.currentEtchingDepthMicrons.toFixed(2)),
      opticalClarityPct: Number(this.opticalClarityPct.toFixed(1)),
      diegeticWarningActive: this.diegeticWarningActive,
      surfacePassivated: true
    };
  }

  /**
   * Generates or attaches DOM overlay elements representing the caustic etching craters.
   * @param {HTMLElement} [parentElement=null]
   * @returns {HTMLElement} Container element
   */
  mountAcidEtchingOverlay(parentElement = null) {
    let container = parentElement ? parentElement.querySelector('.visor-acid-etching-overlay') : null;
    if (!container && typeof document !== 'undefined') {
      container = document.createElement('div');
      container.className = `visor-acid-etching-overlay ${this.isCorroding ? 'corroding' : ''}`;

      this.acidCraters.forEach(crater => {
        const craterEl = document.createElement('div');
        craterEl.className = 'acid-etching-crater';
        craterEl.style.left = `${crater.xPct}%`;
        craterEl.style.top = `${crater.yPct}%`;
        craterEl.style.width = `${crater.diameterPx}px`;
        craterEl.style.height = `${crater.diameterPx}px`;
        container.appendChild(craterEl);
      });

      if (parentElement) {
        parentElement.appendChild(container);
      }
    }
    return container;
  }
}
