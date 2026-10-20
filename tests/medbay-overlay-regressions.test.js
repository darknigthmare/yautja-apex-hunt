import test from 'node:test';
import assert from 'node:assert/strict';
import { MedbayInventoryOverlay } from '../src/ui/MedbayInventoryOverlay.js';
import { MEDBAY_ITEMS, createMedbayInventoryState } from '../src/gameplay/YautjaMedbaySystem.js';

test('hub refill restores the portable kit without granting infinite field supplies', () => {
  const fieldInventory = createMedbayInventoryState({ chargesModifier: 2 });
  for (const item of MEDBAY_ITEMS) {
    fieldInventory.charges[item.id] = 0;
    fieldInventory.cooldowns[item.id] = 8;
  }
  let refill;
  const overlay = new MedbayInventoryOverlay({
    player: { medbayInventory: fieldInventory },
    inventoryState: { ...fieldInventory, isMothership: true },
  });
  overlay.container = {
    querySelector: (selector) => selector === '#medbay-btn-refill'
      ? { addEventListener: (_, handler) => { refill = handler; } }
      : null,
  };
  overlay._bindEvents();
  refill();
  for (const item of MEDBAY_ITEMS) {
    assert.equal(fieldInventory.charges[item.id], item.baseCharges * 2);
    assert.equal(fieldInventory.cooldowns[item.id], 0);
    assert.ok(Number.isFinite(fieldInventory.charges[item.id]));
  }
  assert.equal(fieldInventory.isMothership, false);
  assert.equal(overlay.inventoryState.isMothership, true);
  assert.equal(overlay.inventoryState.charges, fieldInventory.charges);
});
