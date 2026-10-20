import test from 'node:test';
import assert from 'node:assert/strict';
import { HUDManager } from '../src/HUDManager.js';

const node = () => ({
  attributes: {},
  setAttribute(name, value) { this.attributes[name] = value; },
  classList: { toggle() {} },
});

test('assistive controls follow gadget activation and release, including touch camouflage', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.renderCache = new WeakMap();
  hud.weaponSlots = [];
  hud.gadgetStates = Object.fromEntries(['shield', 'drone', 'decoy'].map((key) => [key, { parentElement: node() }]));
  hud.touchCloakButton = node();
  const player = {
    health: 100, maxHealth: 100, energy: 100, maxEnergy: 100, stamina: 100, maxStamina: 100,
    honorScore: 1000, honorRankIndex: 0, ranks: ['SANG DU CHASSEUR'],
    wristShieldActive: true, wristShieldIntegrity: 100,
    scoutDrone: {}, apexDecoy: {}, isCloaked: true,
  };
  hud.updateVitals(player);
  for (const key of ['shield', 'drone', 'decoy']) {
    assert.equal(hud.gadgetStates[key].parentElement.attributes['aria-pressed'], 'true');
  }
  assert.equal(hud.touchCloakButton.attributes['aria-pressed'], 'true');
  Object.assign(player, { wristShieldActive: false, scoutDrone: null, apexDecoy: null, isCloaked: false });
  hud.updateVitals(player);
  for (const key of ['shield', 'drone', 'decoy']) {
    assert.equal(hud.gadgetStates[key].parentElement.attributes['aria-pressed'], 'false');
  }
  assert.equal(hud.touchCloakButton.attributes['aria-pressed'], 'false');
});
