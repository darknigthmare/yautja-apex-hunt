import registry from './alien-base-registry.v2.json' with { type: 'json' };
export const ALIEN_BASE_REGISTRY_V2 = Object.freeze(registry);
const records = new Map(registry.records.map(x=>[x.id,Object.freeze(x)]));
const legacy = new Map(registry.legacyAliases.map(x=>[x.legacySharedId,Object.freeze(x)]));
const unresolved = new Map(registry.unresolvedLegacy.map(x=>[x.legacySharedId,x.reason]));
const relations = new Map(registry.relations.map(x=>[x.collection+'::'+x.localId,Object.freeze(x)]));
const GROUPS = Object.freeze({
  YautjaSkinsDatabase: 'skins',
  'YautjaContentCatalog.technology': 'technology',
  'YautjaContentCatalog.vehicles': 'vehicles',
  'YautjaContentCatalog.enemies': 'enemies',
  skins: 'skins',technology: 'technology',vehicles: 'vehicles',enemies: 'enemies'
});
export const getAlienRegistryRecord = id => records.get(id) ?? null;
export const getAlienRegistryForLocal = (collection,localId) => {
 const group = GROUPS[collection];
 return getAlienRegistryRecord(registry.groups[group]?.[localId]?.id);
};
export const getAlienRegistryLinkForLegacySharedId = id => legacy.get(id) ?? null;
export const getAlienRegistryForLegacySharedId = id => getAlienRegistryRecord(legacy.get(id)?.registryId);
export const getAlienRegistryReviewReason = id => unresolved.get(id) ?? null;
export const getAlienRegistryInspirationForLocal = (collection,localId) => relations.get(collection+'::'+localId) ?? null;
export function getAlienRegistryResearchCodexEntries(){
 return Object.freeze((registry.researchArchives ?? []).map(archive=>{
  const record=getAlienRegistryRecord(archive.id);
  if(!record||archive.fidelityVerified!==false||archive.archiveOnly!==true||archive.reviewRequired!==true)throw Error('Invalid research archive '+archive.id);
  return Object.freeze({
   id:'alien-base-research:'+record.id, canonicalRegistryId:record.id,
   entryType:'codex',category:archive.category,title:record.name,
   summary:archive.reviewNote,
   body:'Fiche documentaire du registre commun : l’œuvre exacte, les propriétés biologiques, l’apparence 1:1 et la jouabilité demandent une vérification distincte. Aucune statistique de combat n’est importée.',
   sources:Object.freeze([]),sourceTier:'RESEARCH',isOriginal:false,
   runtimeStatus:'archive',researchOnly:true,archiveOnly:true,locationIds:Object.freeze([])
  });
 }));
}

export function assertAlienRegistryV2Integrity(){
 if(registry.schemaVersion!=='2.0.0'||registry.origin!=='darknigthmare/alien_base'||registry.scope!=='public-minimal-yautja-apex-hunt')throw Error('Bad registry scope');
 if(registry.evidence!=='project-identities-not-gameplay-or-1to1-visual-certification')throw Error('Bad provenance gate');
 const ids=new Set();
 for(const x of registry.records){
  if(ids.has(x.id)||Object.keys(x).sort().join('|')!=='category|id|name')throw Error('Duplicate or non-minimal shared record');
  ids.add(x.id);
 }
 const locals=new Set();
 for(const [collection,items] of Object.entries(registry.groups)){
  for(const [localId,ref] of Object.entries(items)){
   const key=collection+'::'+localId;
   if(locals.has(key)||!ids.has(ref.id)||!ref.qualifier)throw Error('Broken local reference '+key);
   locals.add(key);
  }
 }
 const oldIds=new Set();
 for(const a of registry.legacyAliases){
  if(oldIds.has(a.legacySharedId)||!ids.has(a.registryId)||a.fidelityVerified!==false)throw Error('Invalid legacy alias');
  oldIds.add(a.legacySharedId);
 }
 for(const a of registry.unresolvedLegacy)if(oldIds.has(a.legacySharedId)||!a.reason)throw Error('Unresolved legacy changed to identity');
 for(const a of registry.relations)if(!ids.has(a.basisId)||a.assertsIdentity!==false||a.fidelityVerified!==false)throw Error('Inspiration has identity claim');
 const archives=new Set();
 for(const a of registry.researchArchives??[]){
  if(archives.has(a.id)||!ids.has(a.id)||a.reviewRequired!==true||a.archiveOnly!==true||a.fidelityVerified!==false)throw Error('Broken research archive');
  archives.add(a.id);
 }

 return {records:registry.records.length,groups:Object.keys(registry.groups).length,mapped:locals.size,legacyAliases:oldIds.size,unresolved:registry.unresolvedLegacy.length,relations:registry.relations.length,researchArchives:archives.size};
}
