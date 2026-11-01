import assert from 'node:assert/strict';
import test from 'node:test';
import { HUDManager } from '../src/HUDManager.js';
import { formatWorldDistance } from '../src/ui/distanceFormat.js';

test('distance labels convert the shared three world units per metre exactly once', () => {
  assert.equal(formatWorldDistance(30), '10 m');
  assert.equal(formatWorldDistance(30, { fractionDigits: 1 }), '10.0 m');
  assert.equal(formatWorldDistance(7.2, { fractionDigits: 1 }), '2.4 m');
  assert.equal(formatWorldDistance(0), '0 m');
  assert.equal(formatWorldDistance(42.25, { fractionDigits: 1 }), '14.1 m');
});

test('invalid telemetry stays unknown instead of reporting a false zero metres', () => {
  for (const value of [NaN, Infinity, -Infinity, -1, null, undefined, '30', {}]) {
    assert.equal(formatWorldDistance(value), 'DISTANCE INCONNUE');
    assert.equal(formatWorldDistance(value, { unknown: null }), null);
  }
});

test('target lock, extraction beacon and lock alerts display metres without changing input distances', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.renderCache = new WeakMap();
  hud.lockonDistance = {};
  hud.levelEventHud = { dataset: {}, classList: { toggle() {} } };
  hud.levelEventHudTitle = {};
  hud.levelEventHudTimer = {};
  hud.levelEventHudObjective = {};
  hud.showLogMessage = () => {};
  const distance = 30;
  hud.updateTriLaserPosition({ x: 120, y: 120 }, distance, false);
  assert.equal(hud.lockonDistance.textContent, '10.0 m - SIGNAL THERMIQUE');
  hud.updateLevelEventObjective({ distance, remaining: 12.2 });
  assert.equal(hud.levelEventHudTimer.textContent, '13 S · 10 m');
  assert.match(hud.showTriLaserLockedAlert(distance), /\(10\.0 m\)/);
  assert.equal(distance, 30);
  hud.updateTriLaserPosition({ x: 120, y: 120 }, Infinity, false);
  assert.equal(hud.lockonDistance.textContent, 'DISTANCE INCONNUE - SIGNAL THERMIQUE');
  hud.updateLevelEventObjective({ distance: undefined, remaining: 5 });
  assert.equal(hud.levelEventHudTimer.textContent, '5 S · DISTANCE INCONNUE');
  assert.doesNotMatch(hud.showTriLaserLockedAlert(NaN), /NaN|Infinity|\(0/);
});
