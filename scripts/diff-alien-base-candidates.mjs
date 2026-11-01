import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildAlienBaseCandidateExport} from './export-alien-base-candidates.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const prefix=resolve(ROOT)+sep;
const withoutPin=x=>{const {reference,...meta}=x;return meta;};
export function diffCandidateIntake(baseline,current,{revision=null,dirty=true,blobHash=null}={}){
 const old=new Map(baseline.entries.map(x=>[x.id,x]));
 const now=new Map(current.entries.map(x=>[x.id,x]));
 if(old.size!==baseline.entries.length||now.size!==current.entries.length)throw Error('Duplicate candidate ID');
 const oldBySource=new Map(),currentBySource=new Map();
 for(const x of baseline.entries){
  const p=x.reference?.path,sha=x.reference?.blobSha;
  if(!p||!sha)throw Error('Baseline provenance missing: '+x.id);
  if(oldBySource.has(p)&&oldBySource.get(p)!==sha)throw Error('Inconsistent source provenance: '+p);
  oldBySource.set(p,sha);
 }
 for(const x of current.entries){
  const p=x.reference?.path;
  if(!p)throw Error('Current candidate provenance missing: '+x.id);
  currentBySource.set(p,true);
 }
 const sourceDrift=[];
 if(blobHash){
  for(const path of new Set([...oldBySource.keys(),...currentBySource.keys()])){
   const baselineBlobSha=oldBySource.get(path)??null;
   const currentBlobSha=blobHash(path);
   if(!/^[0-9a-f]{40}$/.test(currentBlobSha??''))throw Error('Invalid current Git blob hash for '+path);
   if(baselineBlobSha!==currentBlobSha)sourceDrift.push({
    path,baselineBlobSha,currentBlobSha,reviewStatus:'SOURCE_CONTENT_CHANGED_REVIEW_REQUIRED',
    commit:!dirty&&/^[0-9a-f]{40}$/.test(revision??'')?revision:null
   });
  }
 }

 const stamp=x=>({...withoutPin(x),reviewStatus:'RESEARCH_ONLY_REVIEW_REQUIRED',reference:{
  repository:'darknigthmare/yautja-apex-hunt',path:x.reference?.path,
  commit:!dirty&&/^[a-f0-9]{40}$/.test(revision||'')?revision:null,
  blobSha:blobHash?blobHash(x.reference?.path):null,
  revisionStatus:dirty?'working-tree-review-required':'committed-clean-source'
 }});
 const additions=[],changes=[],removals=[];
 for(const x of current.entries){
  const prior=old.get(x.id);
  if(!prior){additions.push(stamp(x));continue;}
  const a=withoutPin(prior),b=withoutPin(x);
  if(JSON.stringify(a)!==JSON.stringify(b)||prior.reference?.path!==x.reference?.path){
   const changedFields=[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
   if(prior.reference?.path!==x.reference?.path)changedFields.push('reference.path');
   changes.push({id:x.id,changedFields,previousSource:prior.reference,proposed:stamp(x)});
  }
 }
 for(const x of baseline.entries)if(!now.has(x.id))removals.push({id:x.id,localId:x.localId,collection:x.collection,reviewStatus:'DO_NOT_DELETE_AUTOMATICALLY'});
 return {schemaVersion:'1.0.0',scope:'Yautja Apex Hunt → Alien_base',baselineCommit:baseline.sourceCommit,
  candidateCommit:!dirty&&/^[a-f0-9]{40}$/.test(revision||'')?revision:null,status:'REVIEW_REQUIRED',
  policy:{noAutomaticDeletion:true,noCanonPromotion:true,noGameplayStatMigration:true},
  counts:{old:baseline.entries.length,current:current.entries.length,added:additions.length,changed:changes.length,removed:removals.length,staleSourcePins:sourceDrift.length},
  additions,changes,removals,sourceDrift};
}
export function gitBlobShaForFile(path){
 if(typeof path!=='string'||!path.startsWith('src/'))throw Error('Unsafe source path');
 const full=resolve(ROOT,path);if(!full.startsWith(prefix))throw Error('Source path outside repository');
 const bytes=readFileSync(full);
 return createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),option=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null};
 const base=option('--base'),out=option('--out');
 if(!base||!out){console.error('Usage: node scripts/diff-alien-base-candidates.mjs --base PATH --out FILE [--check]');process.exit(2);}
 const previous=JSON.parse(readFileSync(resolve(base,'data/research/yautja-apex-hunt.v2.json'),'utf8'));
 let revision=null,dirty=true;
 try{
  revision=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
  dirty=execFileSync('git',['status','--porcelain'],{cwd:ROOT,encoding:'utf8'}).trim().length>0;
 }catch{dirty=true;}
 const delta=diffCandidateIntake(previous,buildAlienBaseCandidateExport(),{revision,dirty,blobHash:gitBlobShaForFile});
 if(args.includes('--check')){
  if(delta.counts.added||delta.counts.changed||delta.counts.removed||delta.counts.staleSourcePins){console.error('Research changed',JSON.stringify(delta.counts));process.exitCode=1;}
  else console.log('No candidate drift versus Alien_base');
 }else{writeFileSync(out,JSON.stringify(delta,null,2)+'\n');console.log('Wrote review-only delta',JSON.stringify(delta.counts));}
}
