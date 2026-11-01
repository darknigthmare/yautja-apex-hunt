import test from 'node:test';
import assert from 'node:assert/strict';
import {getAlienRegistryResearchCodexEntries,assertAlienRegistryV2Integrity,ALIEN_BASE_REGISTRY_V2,getAlienRegistryForLocal,getAlienRegistryForLegacySharedId,getAlienRegistryLinkForLegacySharedId,getAlienRegistryReviewReason,getAlienRegistryInspirationForLocal} from '../src/data/AlienBaseRegistryV2.js';
import {getAlienBaseArchiveCodexEntries,getAlienBaseIdentityForLocal,assertAlienBaseSnapshotIntegrity} from '../src/data/AlienBaseFederation.js';
test('Le registre unifié public est minimal et conserve la compatibilité v1',()=>{
 const v2=assertAlienRegistryV2Integrity(),v1=assertAlienBaseSnapshotIntegrity();
 assert.equal(v2.mapped,35);assert.equal(v2.legacyAliases,49);assert.equal(v2.unresolved,4);assert.equal(v2.relations,9);
 assert.equal(v1.links,33);assert.equal(v1.archiveIds,20);
 assert.ok(ALIEN_BASE_REGISTRY_V2.records.every(x=>!Object.hasOwn(x,'description')&&!Object.hasOwn(x,'sourceRefs')));
});
test('Tous les alias locaux sont explicites et les sauvegardes restent inchangées',()=>{
 assert.equal(getAlienRegistryForLocal('YautjaSkinsDatabase','jungle_1987')?.id,'character.yautja.jungle_hunter');
 assert.equal(getAlienRegistryForLocal('YautjaContentCatalog.technology','tech_plasma_caster')?.id,'item.yautja.plasma_caster');
 assert.equal(getAlienRegistryForLocal('YautjaContentCatalog.enemies','enemy_xenomorph_drone')?.id,'bio.xenomorph.drone');
 assert.equal(getAlienBaseIdentityForLocal('YautjaSkinsDatabase','jungle_1987')?.id,'yautja:jungle-hunter-1987');
 assert.equal(getAlienRegistryForLegacySharedId('yautja:jungle-hunter-1987')?.id,'character.yautja.jungle_hunter');
 assert.equal(getAlienRegistryLinkForLegacySharedId('equipment:yautja-biomask')?.kind,'equipment-family');
 assert.equal(getAlienRegistryForLocal('skins','unregistered'),null);
});
test('Les 20 archives restent consultables, sans inventer les 4 équivalences risquées',()=>{
 const cards=getAlienBaseArchiveCodexEntries();
 assert.equal(cards.length,20);
 assert.equal(cards.filter(x=>!!x.canonicalRegistryId).length,16);
 for(const id of ['character:bishop','vehicle:p5000','faction:synthetics','archive:pathogen']){
  assert.ok(getAlienRegistryReviewReason(id));
  assert.equal(getAlienRegistryForLegacySharedId(id),null);
  assert.ok(cards.some(x=>x.sharedId===id&&x.registryReviewReason&&!x.canonicalRegistryId));
 }
 const inspired=getAlienRegistryInspirationForLocal('YautjaContentCatalog.huntBosses','xeno_queen');
 assert.equal(inspired?.basisId,'bio.xenomorph.queen');
 assert.equal(inspired.assertsIdentity,false);
});


test('20 archives supplémentaires du registre unifié sont visibles sans devenir jouables', async()=>{
 const archives=getAlienRegistryResearchCodexEntries();
 assert.equal(archives.length,20);
 assert.equal(assertAlienRegistryV2Integrity().researchArchives,20);
 const {ALL_LORE_ENTRIES,ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES,LORE_SOURCE_TIERS}=await import('../src/data/LoreCodex.js');
 assert.equal(ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES.length,20);
 assert.ok(LORE_SOURCE_TIERS.RESEARCH);
 assert.equal(new Set(ALL_LORE_ENTRIES.map(x=>x.id)).size,ALL_LORE_ENTRIES.length);
 for(const a of archives){assert.equal(a.archiveOnly,true);assert.equal(a.researchOnly,true);assert.equal(a.sourceTier,'RESEARCH');assert.equal(a.runtimeStatus,'archive');}
});
