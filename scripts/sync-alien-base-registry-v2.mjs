import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {ALIEN_BASE_REGISTRY_V2,assertAlienRegistryV2Integrity} from '../src/data/AlienBaseRegistryV2.js';
const args=process.argv.slice(2),ix=args.indexOf('--base'),base=ix>=0?args[ix+1]:null;
if(!base){
 console.log('Vendored registry snapshot valid',assertAlienRegistryV2Integrity());
}else{
 const file=p=>JSON.parse(readFileSync(join(resolve(base),p),'utf8'));
 const registry=file('data/entities.v1.json'),bindings=file('data/bindings.v1.json');
 const bridge=file('data/integrations/yautja-apex-hunt.v2.json');
 const compatible=file('data/compatibility/yautja-apex-legacy.v1.json');
 const groups=bindings.games['yautja-apex-hunt'].groups;
 const ids=new Set([...Object.values(groups).flatMap(g=>Object.values(g).map(r=>r.id)),...compatible.mappings.map(x=>x.registryId),...bridge.relations.map(x=>x.basisId)]);
 const records=registry.entities.filter(x=>ids.has(x.id)).map(({id,name,category})=>({id,name,category}));
 if(records.length!==ids.size)throw Error('Missing canonical registry ID');
 const next={schemaVersion:'2.0.0',origin:'darknigthmare/alien_base',scope:'public-minimal-yautja-apex-hunt',sourceCommit:bridge.sourceCommit,
  evidence:'project-identities-not-gameplay-or-1to1-visual-certification',records,groups,
  legacyAliases:compatible.mappings.map(({legacySharedId,registryId,kind,fidelityVerified})=>({legacySharedId,registryId,kind,fidelityVerified})),
  unresolvedLegacy:compatible.unresolved,
  relations:bridge.relations.map(({collection,localId,basisId,relationship,assertsIdentity,fidelityVerified})=>({collection,localId,basisId,relationship,assertsIdentity,fidelityVerified}))};
 const target=new URL('../src/data/alien-base-registry.v2.json',import.meta.url),encoded=JSON.stringify(next,null,2)+'\n';
 if(args.includes('--write')){writeFileSync(target,encoded);console.log('Updated local public-minimal registry snapshot');}
 else if(readFileSync(target,'utf8')!==encoded){console.error('Apex shared registry drift: check candidate source and update after review');process.exitCode=1;}
 else console.log('Apex v2 registry snapshot matches the private source');
}
