import test from 'node:test';
import assert from 'node:assert/strict';
import { ALIEN_BASE_SNAPSHOT,getAlienBaseReferenceById,getAlienBaseIdentityForLocal,getAlienBaseBasisForLocal,getAlienBaseArchiveCodexEntries,assertAlienBaseSnapshotIntegrity } from '../src/data/AlienBaseFederation.js';
import { LORE_SOURCES,ALL_LORE_ENTRIES,ALIEN_BASE_ARCHIVE_ENTRIES } from '../src/data/LoreCodex.js';
import { buildAlienBaseCandidateExport,assertAlienBaseCandidateSourcesCurrent } from '../scripts/export-alien-base-candidates.mjs';

test('Apex imports only public minimal shared identity records',()=>{
 const checked=assertAlienBaseSnapshotIntegrity();
 assert.equal(checked.links,33);assert.equal(checked.archiveIds,20);assert.equal(checked.relations,9);
 assert.ok(ALIEN_BASE_SNAPSHOT.records.every(record=>!Object.hasOwn(record,'description')&&!Object.hasOwn(record,'damage')));
});
test('Shared IDs cross-link without renaming game item/save identifiers',()=>{
 assert.equal(getAlienBaseIdentityForLocal('YautjaSkinsDatabase','jungle_1987')?.id,'yautja:jungle-hunter-1987');
 assert.equal(getAlienBaseIdentityForLocal('YautjaContentCatalog.technology','tech_biomask')?.id,'equipment:yautja-biomask');
 assert.equal(getAlienBaseReferenceById('weapon:m41a')?.kind,'weapon');
 assert.equal(getAlienBaseIdentityForLocal('YautjaContentCatalog.huntBosses','xeno_queen'),null);
 assert.equal(getAlienBaseBasisForLocal('YautjaContentCatalog.huntBosses','xeno_queen')?.basisSharedId,'xeno:queen-1986');
});
test('Twenty additional Alien archives are non-playable, sourced, and unique in actual UI codex',()=>{
 const archive=getAlienBaseArchiveCodexEntries();
 assert.equal(archive.length,20);assert.equal(ALIEN_BASE_ARCHIVE_ENTRIES.length,20);
 assert.equal(new Set(ALL_LORE_ENTRIES.map(x=>x.id)).size,ALL_LORE_ENTRIES.length);
 for(const x of archive){assert.equal(x.archiveOnly,true);assert.equal(x.runtimeStatus,'archive');assert.ok(x.sources.every(id=>LORE_SOURCES[id]?.url?.startsWith('https://')));}
});
test('Export candidate preserves 731 local names/source refs but excludes gameplay balance',()=>{
 const candidate=buildAlienBaseCandidateExport();
 assert.equal(candidate.entries.length,1130);
 assert.ok(candidate.entries.every(e=>e.researchOnly&&e.admission==='RESEARCH_ONLY'&&e.reference?.blobSha&&e.canonExact===false));
 for(const x of candidate.entries){for(const f of ['baseHonor','threatStars','damage','sizeMeters','maxHealth','moveSpeed'])assert.ok(!Object.hasOwn(x,f),x.id);}
 assert.equal(candidate.counts.prey,361);assert.equal(candidate.counts.skins,50);
 assert.equal(candidate.counts.playableWeapons,15);assert.equal(candidate.counts.hunterClasses,10);
 assert.equal(candidate.counts.sources,27);assert.equal(candidate.counts.factions,6);
 assert.equal(candidate.counts.weaponTechVariants,5);
 assert.ok(candidate.entries.filter(e=>e.collection==='playableWeapons').every(e=>!Object.hasOwn(e,'behavior')&&!Object.hasOwn(e,'effects')));
});

test('Apex master 2 November source hashes are pinned to immutable Git blobs',()=>{
 const check=assertAlienBaseCandidateSourcesCurrent();
 assert.equal(check.checkedPaths,9);
 assert.equal(check.sourceRevision,'8b42b89288be20a9263b6002cec4862c782a80bc');
 const candidate=buildAlienBaseCandidateExport();
 const fauna=candidate.entries.find(x=>x.id==='apex:factions:FAUNA');
 assert.equal(fauna?.name,'Faune indigène & Créatures de réserve');
 assert.equal(fauna.researchOnly,true);
 assert.equal(fauna.canonExact,false);
});
