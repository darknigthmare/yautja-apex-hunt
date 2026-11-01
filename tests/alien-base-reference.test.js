import test from 'node:test';
import assert from 'node:assert/strict';
import { MEDIA_COVERAGE_CATALOG, MEDIA_COVERAGE_ALIEN_BASE_IDS } from '../src/data/MediaCoverageCatalog.js';
import { ALIEN_BASE_PUBLIC_COUNTS, getAlienBaseMediaWork, getAlienBaseRecord } from '../src/data/AlienBaseRegistry.js';
test('all 29 named Apex Hunt works have exact shared Alien_base identities',()=>{
 assert.equal(MEDIA_COVERAGE_CATALOG.length,29);
 assert.equal(ALIEN_BASE_PUBLIC_COUNTS.mediaCoverage,29);
 for(const work of MEDIA_COVERAGE_CATALOG){const shared=getAlienBaseMediaWork(work.id);assert.ok(shared,work.id);assert.equal(shared.name,work.title);assert.equal(MEDIA_COVERAGE_ALIEN_BASE_IDS[work.id],shared.id);assert.equal(shared.referenceOnly,true)}
});
test('separate franchise lore, work references and gameplay stats',()=>{
 assert.equal(ALIEN_BASE_PUBLIC_COUNTS.enemyFamilies,52);
 assert.equal(ALIEN_BASE_PUBLIC_COUNTS.tcgCards,158);
 assert.equal(getAlienBaseRecord('enemyFamilies','tantalus:enemy-family:001')?.visual1to1,false);
 assert.equal(getAlienBaseRecord('weapons','tantalus:proposed-m41a3-burst-rifle')?.admission,'research-only');
 assert.equal(getAlienBaseRecord('__proto__','test'),null);
 assert.equal(getAlienBaseMediaWork('not-a-work'),null);
});
