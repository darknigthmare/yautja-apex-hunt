import { MegafaunaBoss } from '../MegafaunaBoss.js';
import { BadBloodRival } from '../entities/BadBloodRival.js';
import { PredalienBoss } from '../entities/PredalienBoss.js';
import { SuperPredatorBoss } from '../entities/SuperPredatorBoss.js';
import { FeralPredatorBoss } from '../entities/FeralPredatorBoss.js';
import { XenomorphQueen } from '../entities/XenomorphQueen.js';

export const BOSS_CONSTRUCTORS = Object.freeze({
  megafauna: MegafaunaBoss,
  xenoQueen: XenomorphQueen,
  badBlood: BadBloodRival,
  predalien: PredalienBoss,
  superPredator: SuperPredatorBoss,
  feralPredator: FeralPredatorBoss,
});

const DEFAULT_COLLIDER_RADII = Object.freeze({
  megafauna: 6.5,
  xenoQueen: 6.5,
  badBlood: 4.5,
  predalien: 6.5,
  superPredator: 5.5,
  feralPredator: 4.8,
});

function normalizeBossInterface(boss, bossType) {
  // Les quatre boss historiques ne possèdent pas encore tous les champs de la
  // nouvelle interface data-driven. Les valeurs ajoutées ici sont sans effet
  // sur leur IA existante, mais permettent au runtime d'éviter les branches.
  if (!Array.isArray(boss.projectiles)) boss.projectiles = [];
  if (typeof boss.isEnraged !== 'boolean') boss.isEnraged = false;
  if (!Number.isFinite(boss.colliderRadius)) boss.colliderRadius = DEFAULT_COLLIDER_RADII[bossType];
  if (typeof boss.setVisionMode !== 'function') boss.setVisionMode = () => {};
  return boss;
}

export function createBoss(scene, definition) {
  const bossType = typeof definition === 'string' ? definition : definition?.bossType;
  const BossConstructor = BOSS_CONSTRUCTORS[bossType];

  if (!BossConstructor) {
    const received = bossType == null ? 'non défini' : `« ${bossType} »`;
    throw new RangeError(
      `Type de boss ${received} inconnu. Types disponibles : ${Object.keys(BOSS_CONSTRUCTORS).join(', ')}.`,
    );
  }

  return normalizeBossInterface(new BossConstructor(scene), bossType);
}
