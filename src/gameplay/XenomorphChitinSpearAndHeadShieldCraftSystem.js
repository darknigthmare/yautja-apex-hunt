/**
 * XenomorphChitinSpearAndHeadShieldCraftSystem.js
 * Chantier 2 (v152) : Armement trophée en chitine de Xénomorphe forgé par Scar pour Lex Woods (AVP 2004).
 * Fabrication sur le terrain d'une lance à pointe caudale de Xénomorphe et d'un bouclier en dôme crânien :
 * - Confère une immunité totale (100%) à la corrosion du sang acide moléculaire lors des parades
 *   et des coups d'estoc rapprochés.
 * - Scelle le pacte d'alliance de chasse ("Enemy of my enemy") entre Scar et Lex Woods.
 */

export class XenomorphChitinSpearAndHeadShieldCraftSystem {
  constructor(options = {}) {
    this.spearThrustDamage = options.spearThrustDamage ?? 125;
    this.shieldAcidImmunityRatio = 1.0;

    this.state = {
      craftedFromSlainDrone: false,
      equippedByAllyId: null,
      acidSprayBlocksCount: 0,
      totalXenosImpaled: 0
    };
  }

  craftChitinWeaponsFromDroneCorpse(slainDrone = {}, recipient = {}, audioSynthesizer = null) {
    if (!slainDrone.isXenomorph && !slainDrone.tailIntact) {
      return { crafted: false, reason: 'invalid_xenomorph_corpse' };
    }

    this.state.craftedFromSlainDrone = true;
    this.state.equippedByAllyId = recipient.id ?? 'lex_woods';

    recipient.hasXenoTailSpear = true;
    recipient.hasXenoHeadShield = true;
    recipient.acidCorrosionImmunity = this.shieldAcidImmunityRatio;

    if (audioSynthesizer && typeof audioSynthesizer.playXenomorphChitinSpearCraftSlash === 'function') {
      audioSynthesizer.playXenomorphChitinSpearCraftSlash(1.0);
    }

    return {
      crafted: true,
      equippedByAllyId: this.state.equippedByAllyId,
      acidCorrosionImmunity: recipient.acidCorrosionImmunity
    };
  }

  blockAcidSprayAndCounterThrust(defender = {}, attackingXeno = {}, audioSynthesizer = null) {
    if (!this.state.craftedFromSlainDrone || !defender.hasXenoHeadShield) {
      return { blocked: false, reason: 'chitin_gear_not_equipped' };
    }

    this.state.acidSprayBlocksCount += 1;
    defender.acidDamageTaken = 0;

    if (audioSynthesizer && typeof audioSynthesizer.playXenoHeadShieldAcidDeflectSizzle === 'function') {
      audioSynthesizer.playXenoHeadShieldAcidDeflectSizzle(1.05);
    }

    attackingXeno.health = Math.max(0, Number(attackingXeno.health ?? 120) - this.spearThrustDamage);
    if (attackingXeno.health === 0) {
      attackingXeno.impaledByChitinSpear = true;
      this.state.totalXenosImpaled += 1;
    }

    return {
      blocked: true,
      acidDamageTaken: 0,
      counterDamageDealt: this.spearThrustDamage,
      xenoImpaled: Boolean(attackingXeno.impaledByChitinSpear)
    };
  }

  getStatus() {
    return {
      craftedFromSlainDrone: this.state.craftedFromSlainDrone,
      equippedByAllyId: this.state.equippedByAllyId,
      acidSprayBlocksCount: this.state.acidSprayBlocksCount,
      totalXenosImpaled: this.state.totalXenosImpaled
    };
  }
}
