import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as THREE from 'three';
import { HUDManager } from '../src/HUDManager.js';
import { MegafaunaBoss } from '../src/MegafaunaBoss.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('le HUD masque le statut de la cible tant qu’elle n’est pas pistée ou acquise', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.elements = new Map();
  hud.bossCard = { classList: new Set(), classes: new Set() };
  hud.bossHpBar = { style: {} };
  hud.bossHpMeter = { setAttribute() {} };
  hud.bossDisplayName = { textContent: '' };
  hud.targetScannedName = { textContent: '' };
  hud.hornStatus = { textContent: '', classList: new Set(), classes: new Set() };
  hud.tailStatus = { textContent: '', classList: new Set(), classes: new Set() };
  hud.part1Label = { textContent: '' };
  hud.part2Label = { textContent: '' };
  hud.triLaser = { classList: new Set(), classes: new Set() };
  hud.lockonBracket = { classList: new Set(), classes: new Set() };
  hud.weakpointTag = { classList: new Set(), classes: new Set() };
  hud.lockonDistance = { textContent: '' };

  hud.commit = (element, key, value, apply) => { apply(); return true; };
  hud.setText = (element, value) => { element.textContent = String(value); };
  hud.setStyle = (element, prop, value) => { element.style[prop] = value; };
  hud.setClassState = (element, cls, active) => {
    if (active) element.classes.add(cls);
    else element.classes.delete(cls);
  };
  hud.updateMeter = (fillElement, output, meter, cur, max) => {
    fillElement.style.width = `${(cur / max) * 100}%`;
  };

  const dummyBoss = {
    health: 2500,
    maxHealth: 2500,
    hornIntact: true,
    tailIntact: true,
    trophyIntegrity: 100,
  };

  // 1. Statut non pisté / non spotté au début de la chasse
  hud.updateBossStatus(dummyBoss, 'goliath', false);
  assert.equal(hud.bossDisplayName.textContent, 'SIGNAL NON VERROUILLÉ');
  assert.match(hud.targetScannedName.textContent, /PISTAGE ACTIF/);
  assert.equal(hud.bossHpBar.style.width, '0%');
  assert.equal(hud.hornStatus.textContent, 'NON ANALYSÉ');
  assert.equal(hud.tailStatus.textContent, 'NON ANALYSÉ');

  // Pas de laser affiché
  hud.updateTriLaserPosition(null);
  assert.ok(hud.triLaser.classes.has('hidden'));
  assert.ok(hud.lockonBracket.classes.has('hidden'));

  // 2. Statut une fois la cible pistée / verrouillée
  hud.updateBossStatus(dummyBoss, 'goliath', true);
  assert.equal(hud.bossDisplayName.textContent, 'GOLIATH XENO-AKUMO');
  assert.match(hud.targetScannedName.textContent, /BIOSIGNATURE VERROUILLÉE/);
  assert.equal(hud.bossHpBar.style.width, '100%');
  assert.equal(hud.hornStatus.textContent, 'INTACTE');
  assert.equal(hud.tailStatus.textContent, 'INTACTE');
});

test('MegafaunaBoss expose une géométrie haute définition pour ses segments et membres', () => {
  const scene = new THREE.Scene();
  const boss = new MegafaunaBoss(scene);

  const horn = boss.mesh.getObjectByName('hornMesh');
  const core = boss.mesh.getObjectByName('coreMesh');
  const tail = boss.mesh.getObjectByName('tailMesh');

  assert.ok(horn, 'hornMesh doit exister');
  assert.ok(core, 'coreMesh doit exister');
  assert.ok(tail, 'tailMesh doit exister');

  // Vérifier la courbure radiale de la corne (>= 24 segments)
  assert.ok(horn.geometry.parameters.radialSegments >= 24, 'corne courbure HD');
  // Vérifier la tessellation de la sphère de noyau (>= 24 segments)
  assert.ok(core.geometry.parameters.widthSegments >= 24, 'noyau courbure HD');

  const baseTriangles = countBossVisualTriangles(boss.mesh);
  assert.ok(baseTriangles > 2000, `Megafauna doit avoir une géométrie détaillée (actuel: ${baseTriangles})`);

  boss.dispose?.();
});

test('l’interface html déclare des fiches de mission diégétiques avec illustrations et badges de menace', () => {
  const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  // Toutes les cartes de mission ont un média illustré et des badges tactiques
  assert.match(indexSource, /class="mission-card-media media-goliath"/);
  assert.match(indexSource, /class="mission-card-media media-queen"/);
  assert.match(indexSource, /class="mission-card-media media-berserker"/);
  assert.match(indexSource, /class="mission-card-media media-jungle-1987"/);
  assert.match(indexSource, /class="mission-card-media media-grid"/);

  // Badges de menace diégétiques
  assert.match(indexSource, /threat-badge threat-apex/);
  assert.match(indexSource, /threat-badge threat-queen/);
  assert.match(indexSource, /threat-badge threat-berserker/);
  assert.match(indexSource, /threat-badge threat-jungle/);

  // AudioSynth expose le son de verrouillage du bio-masque
  assert.equal(typeof audioSynth.playBioMaskLock, 'function');
  assert.equal(typeof audioSynth.playTriLaserLock, 'function');
});
