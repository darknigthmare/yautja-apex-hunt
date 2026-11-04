import data from './alien-base-media.v2.json' with { type: 'json' };
export const ALIEN_BASE_MEDIA_V2 = Object.freeze(data);
const refs = new Map(data.records.map(item=>[item.localId,Object.freeze(item)]));
export const getAlienBaseMediaByLocalId = id => refs.get(id) ?? null;
export function assertAlienBaseMediaIntegrity(){
 if(data.schemaVersion!=='2.0.0'||data.origin!=='darknigthmare/alien_base'||data.scope!=='public-minimal-apex-media')throw Error('Media scope incompatible');
 const ids=new Set(),locals=new Set();
 for(const work of data.records){
  if(!work.id?.startsWith('work.')||work.id!=='work.'+work.localId||!work.title||!Number.isInteger(work.year))throw Error('Invalid shared work');
  if(ids.has(work.id)||locals.has(work.localId)||work.fidelityVerified!==false||work.sourceReview!=='project-declared-not-primary-verified')throw Error('Duplicate or auto-promoted work');
  ids.add(work.id);locals.add(work.localId);
  for(const k of ['sourceUrl','sourceRef','blobSha','damage','hp','stats','gameCoverage','copyrightAsset'])if(Object.hasOwn(work,k))throw Error('Private or gameplay field: '+k);
 }
 if(ids.size!==29)throw Error('Media export is incomplete');
 return {works:ids.size};
}
