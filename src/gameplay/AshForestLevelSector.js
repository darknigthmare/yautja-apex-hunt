// Secteur de niveau Forêt de Cendres & Arène Calcinée 1719 (Lore 1:1)
// Référence canonique : Prey (2022) - La forêt brûlée et les nuages de cendres noires masquant l'affrontement final

import { audioSynth } from '../AudioSynthesizer.js';

export const ASH_CONSTANTS = {
  FOG_VISIBILITY_METERS: 10.0,
  CHARCOAL_TREE_COLLAPSE_DAMAGE: 55.0,
};

export function createAshForestSector() {
  return {
    ashDensity: 0.82,
    visibilityRange: ASH_CONSTANTS.FOG_VISIBILITY_METERS,
    charcoalTrees: [
      { id: 'charred_pine_1', x: -6, z: 8, height: 12.0, isCollapsed: false },
      { id: 'charred_pine_2', x: 4, z: -5, height: 10.0, isCollapsed: false },
    ],
    windTimer: 0,
  };
}

export function collapseCharcoalTree(sector, treeId, targetEntity = null, audio = audioSynth) {
  if (!sector) return false;
  const tree = sector.charcoalTrees.find(t => t.id === treeId && !t.isCollapsed);
  if (!tree) return false;

  tree.isCollapsed = true;

  if (targetEntity) {
    if (typeof targetEntity.applyDamage === 'function') {
      targetEntity.applyDamage(ASH_CONSTANTS.CHARCOAL_TREE_COLLAPSE_DAMAGE, 'charcoal_tree_crush');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - ASH_CONSTANTS.CHARCOAL_TREE_COLLAPSE_DAMAGE);
    }
    targetEntity.isStaggered = true;
  }

  if (audio && typeof audio.playCharcoalCrumble === 'function') {
    audio.playCharcoalCrumble();
  }
  return true;
}

export function updateAshForestSector(sector, delta, audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  sector.windTimer += dt;
  if (sector.windTimer >= 6.0) {
    sector.windTimer = 0;
    if (audio && typeof audio.playAshWindHowl === 'function') {
      audio.playAshWindHowl();
    }
  }
}
