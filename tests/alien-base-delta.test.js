import test from 'node:test';
import assert from 'node:assert/strict';
import {diffCandidateIntake,gitBlobShaForFile} from '../scripts/diff-alien-base-candidates.mjs';
import {buildAlienBaseCandidateExport} from '../scripts/export-alien-base-candidates.mjs';
test('Apex research delta is empty against identical baseline',()=>{
 const x=buildAlienBaseCandidateExport();
 const d=diffCandidateIntake(x,x,{revision:'3cbe8861204c5fe7341b61cda61f806b596a7186',dirty:false});
 assert.deepEqual([d.counts.added,d.counts.changed,d.counts.removed],[0,0,0]);
});
test('Changed record requires manual review and does not claim a dirty commit',()=>{
 const original=buildAlienBaseCandidateExport(),changed=structuredClone(original);
 changed.entries[0].name+=' (recherche)';
 const d=diffCandidateIntake(original,changed,{revision:'3cbe8861204c5fe7341b61cda61f806b596a7186',dirty:true,blobHash:()=> 'b'.repeat(40)});
 assert.equal(d.counts.changed,1);assert.equal(d.changes[0].proposed.reference.commit,null);
 assert.equal(d.changes[0].proposed.reviewStatus,'RESEARCH_ONLY_REVIEW_REQUIRED');
 assert.equal(d.policy.noAutomaticDeletion,true);
});
test('Source hash uses current file bytes rather than historic constant',()=>{
 assert.equal(gitBlobShaForFile('src/data/RuntimeEquipment.js'),'daa3e2e7c83e635791aae89041beb13c3651b653');
 assert.throws(()=>gitBlobShaForFile('../package.json'),/Unsafe source path/);
});

test('A source-only modification is detected even when all 731 descriptive records remain identical',()=>{
 const data=buildAlienBaseCandidateExport();
 const baseline=new Map(data.entries.map(x=>[x.reference.path,x.reference.blobSha]));
 const changedPath='src/data/RuntimeEquipment.js',modifiedSha='a'.repeat(40);
 const delta=diffCandidateIntake(data,data,{revision:'3cbe8861204c5fe7341b61cda61f806b596a7186',dirty:false,
  blobHash:path=>path===changedPath?modifiedSha:baseline.get(path)});
 assert.equal(delta.counts.added,0);
 assert.equal(delta.counts.changed,0);
 assert.equal(delta.counts.removed,0);
 assert.equal(delta.counts.staleSourcePins,1);
 assert.equal(delta.sourceDrift[0].path,changedPath);
 assert.equal(delta.sourceDrift[0].currentBlobSha,modifiedSha);
 assert.equal(delta.sourceDrift[0].reviewStatus,'SOURCE_CONTENT_CHANGED_REVIEW_REQUIRED');
});
test('Reference path moves are not silent even if the name remains unchanged',()=>{
 const base=buildAlienBaseCandidateExport(),change=structuredClone(base);
 change.entries[0].reference.path='src/data/RuntimeEquipment.js';
 const old=new Map(base.entries.map(x=>[x.reference.path,x.reference.blobSha]));
 const d=diffCandidateIntake(base,change,{dirty:true,blobHash:path=>old.get(path)});
 assert.equal(d.counts.changed,1);
 assert.ok(d.changes[0].changedFields.includes('reference.path'));
 assert.equal(d.changes[0].proposed.reference.commit,null);
});
test('A valid clean source check reports no false drift',()=>{
 const data=buildAlienBaseCandidateExport();
 const pinned=new Map(data.entries.map(x=>[x.reference.path,x.reference.blobSha]));
 const delta=diffCandidateIntake(data,data,{dirty:false,blobHash:path=>pinned.get(path)});
 assert.equal(delta.counts.staleSourcePins,0);
 assert.deepEqual(delta.sourceDrift,[]);
});
