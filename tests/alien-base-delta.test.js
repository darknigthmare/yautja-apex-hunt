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
 const d=diffCandidateIntake(original,changed,{revision:'3cbe8861204c5fe7341b61cda61f806b596a7186',dirty:true,blobHash:()=> 'current-sha'});
 assert.equal(d.counts.changed,1);assert.equal(d.changes[0].proposed.reference.commit,null);
 assert.equal(d.changes[0].proposed.reviewStatus,'RESEARCH_ONLY_REVIEW_REQUIRED');
 assert.equal(d.policy.noAutomaticDeletion,true);
});
test('Source hash uses current file bytes rather than historic constant',()=>{
 assert.equal(gitBlobShaForFile('src/data/RuntimeEquipment.js'),'807a1c8bdbfa16c1fdbafbc39d00af6877e7e6f3');
 assert.throws(()=>gitBlobShaForFile('../package.json'),/Unsafe source path/);
});
