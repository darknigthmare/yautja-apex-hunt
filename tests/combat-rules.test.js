import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHonorAward, resolveMeleeStrike } from '../src/gameplay/combatRules.js';

test('les lames de poignet touchent uniquement à portée', () => {
  assert.deepEqual(resolveMeleeStrike(1, 7), {
    hit: true,
    damage: 48,
    honor: 18,
    kind: 'wristblades',
  });
  assert.equal(resolveMeleeStrike(1, 9).hit, false);
});

test('le fouet conserve une portée supérieure aux lames', () => {
  assert.equal(resolveMeleeStrike(8, 14).hit, true);
  assert.equal(resolveMeleeStrike(8, 19).hit, false);
});

test('l’attaque en piqué reste puissante sans frapper à travers toute l’arène', () => {
  assert.equal(resolveMeleeStrike(1, 20, { fromCanopy: true }).damage, 320);
  assert.equal(resolveMeleeStrike(1, 30, { fromCanopy: true }).hit, false);
});

test('combattre visible accorde un bonus d’honneur maîtrisé', () => {
  assert.equal(calculateHonorAward(100, true), 100);
  assert.equal(calculateHonorAward(100, false), 150);
});
