import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ALIEN_BASE_SNAPSHOT,assertAlienBaseSnapshotIntegrity} from '../src/data/AlienBaseFederation.js';
const args=process.argv.slice(2),value=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null};
const base=value('--base'),target=fileURLToPath(new URL('../src/data/alien-base-snapshot.v1.json',import.meta.url));
if(!base){
 console.log('Vendored Alien_base snapshot OK',assertAlienBaseSnapshotIntegrity());
 console.log('Supply --base <local private alien_base checkout> --check or --write to compare/refresh.');
}else{
 const read=path=>JSON.parse(readFileSync(join(resolve(base),'data',path),'utf8'));
 const core=read('core.v1.json'),consumer=read('consumers/yautja-apex-hunt.v1.json'),relations=read('relations/yautja-apex-hunt-adaptations.v1.json').relations;
 const crosswalks=core.crosswalks.filter(c=>c.repository===consumer.repository).map(({repository,collection,legacyId,sharedId,note})=>({repository,collection,legacyId,sharedId,note}));
 const selected=new Set([...consumer.archiveIds,...crosswalks.map(c=>c.sharedId),...relations.map(r=>r.basisSharedId)]);
 const records=core.records.filter(r=>selected.has(r.id)).map(({id,kind,name})=>({id,kind,name}));
 if(records.length!==selected.size)throw Error('Missing public records');
 const next={schemaVersion:'1.0.0',origin:'darknigthmare/alien_base',scope:'public-minimal-yautja-apex-hunt',evidence:'identities-only-no-visual-fidelity-or-gameplay-stats',records,crosswalks,archiveIds:consumer.archiveIds,relations};
 const data=JSON.stringify(next,null,2)+'\n';
 if(args.includes('--write')){writeFileSync(target,data);console.log('Updated public minimal snapshot');}
 else if(readFileSync(target,'utf8')!==data){console.error('Alien_base snapshot drift — run --base PATH --write then review PR');process.exitCode=1;}
 else console.log('Public snapshot matches private source exactly');
}
