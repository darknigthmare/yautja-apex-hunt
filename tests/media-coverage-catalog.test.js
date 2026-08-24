import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MEDIA_COVERAGE_CATALOG,
  MEDIA_COVERAGE_STATS,
  MEDIA_PROVENANCE_TIERS,
  MEDIA_RELEASE_STATUSES,
  getMediaCoverageById,
  getMediaCoverageByStatus,
} from '../src/data/MediaCoverageCatalog.js';

const MAIN_SCREEN_TIERS = new Set(['SCREEN', 'AVP_SCREEN']);

test('le registre média possède des identifiants uniques et des fiches exploitables', () => {
  const ids = MEDIA_COVERAGE_CATALOG.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);

  for (const entry of MEDIA_COVERAGE_CATALOG) {
    assert.match(entry.id, /^[a-z0-9_]+$/, entry.id);
    assert.ok(entry.title && entry.medium && entry.continuity, `${entry.id}: métadonnées absentes`);
    assert.ok(MEDIA_PROVENANCE_TIERS[entry.provenanceTier], `${entry.id}: provenance inconnue`);
    assert.ok(MEDIA_RELEASE_STATUSES[entry.status], `${entry.id}: statut inconnu`);
    assert.equal(new URL(entry.sourceUrl).protocol, 'https:', `${entry.id}: source non sécurisée`);
    assert.ok(entry.coverageTargets.length > 0, `${entry.id}: cible de couverture absente`);
    entry.coverageTargets.forEach((target) => {
      assert.ok(target.type && target.id && target.label, `${entry.id}: cible incomplète`);
    });
    assert.ok(entry.gameCoverage.runtimeStatus, `${entry.id}: statut runtime absent`);
    assert.ok(entry.gameCoverage.summary, `${entry.id}: résumé runtime absent`);
    assert.equal(getMediaCoverageById(entry.id), entry);
  }
});

test('les neuf films écran sont présents, y compris les sorties récentes et AVPR', () => {
  const screenFilms = MEDIA_COVERAGE_CATALOG.filter((entry) => (
    MAIN_SCREEN_TIERS.has(entry.provenanceTier) && entry.medium.startsWith('Film')
  ));
  assert.equal(screenFilms.length, 9);

  const ids = new Set(screenFilms.map(({ id }) => id));
  for (const requiredId of ['film_avpr_2007', 'film_kok_2025', 'film_badlands_2025']) {
    assert.ok(ids.has(requiredId), requiredId);
  }
});

test('les contenus coupés, non publiés, promotionnels et crossovers restent isolés', () => {
  const expected = {
    CUT: 'PRODUCTION_ARCHIVE',
    UNRELEASED: 'PRODUCTION_ARCHIVE',
    PROMO: 'PROMO_NON_CANON',
    ALT_CROSSOVER: 'ALT_CROSSOVER',
  };

  for (const [status, provenanceTier] of Object.entries(expected)) {
    const entries = getMediaCoverageByStatus(status);
    assert.ok(entries.length > 0, `${status}: aucune entrée`);
    entries.forEach((entry) => {
      assert.equal(entry.provenanceTier, provenanceTier, entry.id);
      assert.equal(entry.gameCoverage.runtimeStatus, 'archive', entry.id);
    });
  }
});

test('les statistiques dérivées restent cohérentes avec le catalogue', () => {
  assert.equal(MEDIA_COVERAGE_STATS.total, MEDIA_COVERAGE_CATALOG.length);
  assert.equal(
    Object.values(MEDIA_COVERAGE_STATS.byStatus).reduce((sum, value) => sum + value, 0),
    MEDIA_COVERAGE_STATS.total,
  );
  assert.equal(
    Object.values(MEDIA_COVERAGE_STATS.byRuntime).reduce((sum, value) => sum + value, 0),
    MEDIA_COVERAGE_STATS.total,
  );
  assert.equal(MEDIA_COVERAGE_STATS.byStatus.RELEASED, getMediaCoverageByStatus('RELEASED').length);
});
