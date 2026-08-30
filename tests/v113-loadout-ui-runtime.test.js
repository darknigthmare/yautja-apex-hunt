import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(relativePath) {
  return readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

test('la préparation expose le contrat DOM complet avant déploiement', () => {
  const html = read('index.html');
  for (const id of [
    'tab-btn-loadout',
    'tab-content-loadout',
    'loadout-form',
    'loadout-slot-grid',
    'loadout-capacity-label',
    'loadout-capacity-fill',
    'loadout-validation',
    'btn-loadout-recommended',
    'btn-loadout-deploy',
  ]) {
    assert.ok(html.includes('id="' + id + '"'), 'élément absent: #' + id);
  }
});

test('un contrat prépare le paquetage et seul le bouton déployer lance la chasse', () => {
  const source = read('src/main.js');
  assert.ok(source.includes('this.prepareHunt(huntType, planetType, directiveId);'));
  assert.ok(source.includes('this.startHunt(pending.huntType, pending.planetType, pending.directiveId);'));
  assert.ok(source.includes("document.getElementById('btn-loadout-deploy')"));
});

test('le HUD masque réellement les armes et gadgets non embarqués', () => {
  const html = read('index.html');
  const hud = read('src/HUDManager.js');
  assert.ok(hud.includes('setActiveLoadout(loadout)'));
  assert.ok(hud.includes('this.weaponSlots?.forEach'));
  assert.ok(hud.includes('slot.dataset.weaponId'));
  assert.ok(hud.includes("querySelectorAll('[data-loadout-id]')"));
  assert.ok(html.includes('data-loadout-id="wrist_shield"'));
  assert.ok(html.includes('data-loadout-id="scout_drone"'));
});

test('les contrôles tactiles couvrent la chasse et le QTE', () => {
  const html = read('index.html');
  const source = read('src/main.js');
  assert.ok(html.includes('id="touch-hunt-controls"'));
  for (const direction of ['up', 'down', 'left', 'right']) {
    assert.ok(html.includes('data-hunt-move="' + direction + '"'), 'direction tactile absente: ' + direction);
  }
  for (const id of [
    'btn-touch-hunt-attack',
    'btn-touch-hunt-interact',
    'btn-touch-hunt-vision',
    'btn-touch-hunt-cloak',
    'btn-touch-hunt-pause',
  ]) {
    assert.ok(html.includes('id="' + id + '"'), 'commande tactile absente: #' + id);
  }
  assert.ok(source.includes('setupHuntTouchControls()'));
  assert.ok(source.includes('this.resolveFacehuggerQTE(true)'));
});

test('la fermeture professionnelle couvre WebGL, focus, blur et sauvegarde', () => {
  const html = read('index.html');
  const source = read('src/main.js');
  assert.ok(html.includes('id="fatal-error"'));
  assert.ok(html.includes('id="persistence-status"'));
  assert.ok(source.includes("'webglcontextlost'"));
  assert.ok(source.includes("'visibilitychange'"));
  assert.ok(source.includes("window.addEventListener('blur'"));
  assert.ok(source.includes('setPersistenceUnavailable'));
  assert.ok(source.includes('getVisibleDialog()'));
});
