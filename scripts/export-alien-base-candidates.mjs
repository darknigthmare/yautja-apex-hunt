import { writeFileSync, readFileSync } from 'node:fs';
import {createHash} from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { YautjaContentCatalog } from '../src/data/YautjaContentCatalog.js';
import { YautjaSkinsDatabase } from '../src/data/YautjaLoreDatabase.js';
import { LORE_SOURCES, LORE_CODEX_ENTRIES, HUNT_LOCATIONS, CURRENT_HUNTS } from '../src/data/LoreCodex.js';
import { MEDIA_COVERAGE_CATALOG } from '../src/data/MediaCoverageCatalog.js';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import * as expanded from '../src/data/YautjaExpandedContent.js';
import { HUNTER_CLASSES, DREAD_STYLES, ARMOR_FINISHES, WARPAINT_PATTERNS, PLAYER_GADGETS, PLAYABLE_WEAPONS, WEAPON_TECH_VARIANTS, ARMOR_PRESET_WEAPON_VARIANTS } from '../src/data/RuntimeEquipment.js';
import { PREY_FACTIONS } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';

const YCOMMIT = "8b42b89288be20a9263b6002cec4862c782a80bc";
const FILE_SHA = Object.freeze({
  "src/data/YautjaExpandedContent.js": "9263751af1c0e93649ef828a96a5c274720a20e2",
  "src/data/YautjaContentCatalog.js": "550a72c3026e38d9ef8d79606654629efb80f7ec",
  "src/data/YautjaLoreDatabase.js": "c17d5f31944762e6eb20b2c50ece1b3fc3f665d9",
  "src/data/LoreCodex.js": "22cbbf9f1892947c32dc1572bc93d9d44eaba9e1",
  "src/data/MediaCoverageCatalog.js": "cdd82fd3c6a994e9590d32ba552c56ed139c2bf9",
  "src/data/CanonPreyExpansionV251.js": "548ab703da410a1067238a087ce02727b6aa3afc",
  "src/data/PreyTaxonomyAndCrossoverCatalog.js": "6725a4c3343cfbdb7356dcf9a00946b42139088a",
  "src/data/PreyReferenceMetadata.js": "0b3abdda06e395ad570df54e0dcea20abae713d5",
  "src/data/RuntimeEquipment.js": "24f139cf8437f1b29e44c0372fcb5e03347f0c8f"
});
// Source snapshots remain immutable; validate all file blobs before proposing an intake PR.
export function assertAlienBaseCandidateSourcesCurrent(){
 const root=new URL('../',import.meta.url);
 for(const [path,pinned] of Object.entries(FILE_SHA)){
  const bytes=readFileSync(new URL(path,root));
  const actual=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  if(actual!==pinned)throw Error('Alien_base source blob drift '+path+': '+pinned+' != '+actual);
 }
 return {sourceRevision:YCOMMIT,checkedPaths:Object.keys(FILE_SHA).length};
}
const REPO = 'darknigthmare/yautja-apex-hunt';
const expandedIds = new Set(Object.values(expanded).filter(Array.isArray).flat().map(e=>e.id));
// These five sources are newly shipped from the shared Alien_base archive: do not re-import our own snapshot as local Apex research.
const IMPORTED_ALIEN_BASE_SOURCE_IDS = new Set(['alien1979','alienIsolation2014','alienRomulus2024','prometheus2012','alienCovenant2017']);
export function buildAlienBaseCandidateExport(){
 const specs = [
  ['skins',YautjaSkinsDatabase,'character','src/data/YautjaLoreDatabase.js'],
  ...Object.entries(YautjaContentCatalog).map(([collection,items])=>[collection,items,({masks:'equipment',technology:'equipment',vehicles:'vessel',enemies:'organism',huntBosses:'character',levelEvents:'event',support:'support'})[collection]||'customization','src/data/YautjaContentCatalog.js']),
  ['loreCodex',LORE_CODEX_ENTRIES,'archive','src/data/LoreCodex.js'],
  ['huntLocations',HUNT_LOCATIONS,'location','src/data/LoreCodex.js'],
  ['currentHunts',CURRENT_HUNTS,'character','src/data/LoreCodex.js'],
  ['media',MEDIA_COVERAGE_CATALOG,'media','src/data/MediaCoverageCatalog.js'],
  ['prey',CANON_PREY_CATALOG,'organism','src/data/PreyTaxonomyAndCrossoverCatalog.js'],
  ['crossoverPrey',MULTIVERSE_CROSSOVER_PREY,'crossover','src/data/PreyTaxonomyAndCrossoverCatalog.js'],
  // Runtime definitions are indexed by name/provenance only; never export balance values, modifiers or effects.
  ['hunterClasses',HUNTER_CLASSES,'class','src/data/RuntimeEquipment.js'],
  ['dreadStyles',DREAD_STYLES,'customization','src/data/RuntimeEquipment.js'],
  ['armorFinishes',ARMOR_FINISHES,'customization','src/data/RuntimeEquipment.js'],
  ['warpaints',WARPAINT_PATTERNS,'customization','src/data/RuntimeEquipment.js'],
  ['gadgets',PLAYER_GADGETS,'equipment','src/data/RuntimeEquipment.js'],
  ['playableWeapons',PLAYABLE_WEAPONS,'weapon','src/data/RuntimeEquipment.js'],
  ['weaponTechVariants',WEAPON_TECH_VARIANTS,'weapon','src/data/RuntimeEquipment.js'],
  ['armorWeaponVariants',ARMOR_PRESET_WEAPON_VARIANTS,'weapon','src/data/RuntimeEquipment.js'],
  ['sources',Object.entries(LORE_SOURCES).filter(([id])=>!IMPORTED_ALIEN_BASE_SOURCE_IDS.has(id)).map(([id,s])=>({id,name:s.title,sourceTier:s.tier,sourceUrl:s.url})),'source','src/data/LoreCodex.js'],
  ['factions',Object.entries(PREY_FACTIONS).map(([id,name])=>({id,name})),'faction','src/data/PreyTaxonomyAndCrossoverCatalog.js']
 ];
 const entries=[],counts={},ids=new Set();
 for(const [collection,list,kind,defaultPath] of specs){
  counts[collection]=list.length;
  for(const item of list){
   const localId=String(item.id||'').trim(),name=String(item.name||item.title||'').trim();
   if(!localId||!name)throw Error('Missing ID/name in '+collection);
   const key=collection+'/'+localId;if(ids.has(key))throw Error('Duplicate '+key);ids.add(key);
   const path=collection==='prey'&&localId.startsWith('canon251_')?'src/data/CanonPreyExpansionV251.js':defaultPath==='src/data/YautjaContentCatalog.js'&&expandedIds.has(localId)?'src/data/YautjaExpandedContent.js':defaultPath;
   const sourceIds=Array.isArray(item.sources)?item.sources.filter(x=>typeof x==='string'):[];
   const sourceUrls=[...new Set([...sourceIds.map(k=>LORE_SOURCES[k]?.url),item.sourceUrl].filter(x=>typeof x==='string'&&x.startsWith('https://')))];
   const obj={id:'apex:'+collection+':'+localId,collection,localId,kind,name,researchOnly:true,admission:'RESEARCH_ONLY',canonExact:false,fidelityVerified:false,declaredTier:typeof(item.sourceTier||item.provenanceTier)==='string'?(item.sourceTier||item.provenanceTier):'UNSPECIFIED'};
   if(typeof(item.description||item.summary||item.desc)==='string')obj.declaredDescription=(item.description||item.summary||item.desc).slice(0,700);
   if(typeof(item.originMedia||item.origin)==='string')obj.declaredMedia=item.originMedia||item.origin;
   if(typeof item.sourceStatus==='string')obj.gameSourceStatus=item.sourceStatus;
   if(typeof item.status==='string')obj.mediaPublicationStatus=item.status;
   if(typeof item.year==='number')obj.mediaYear=item.year;
   if(typeof item.runtimeStatus==='string')obj.gameRuntimeStatus=item.runtimeStatus;
   if(typeof item.gameCoverage?.runtimeStatus==='string')obj.gameRuntimeStatus=item.gameCoverage.runtimeStatus;
   if(item.implementationOriginal===true||item.isOriginal===true)obj.gameInterpretationOriginal=true;
   if(sourceIds.length)obj.declaredSourceIds=sourceIds;
   if(sourceUrls.length)obj.declaredSourceUrls=sourceUrls;
   if(!FILE_SHA[path])throw Error('Missing pinned source SHA for '+path);
   obj.reference={repository:REPO,path,commit:YCOMMIT,blobSha:FILE_SHA[path]};
   entries.push(obj);
  }
 }
 return {schemaVersion:'1.0.0',origin:REPO,sourceCommit:YCOMMIT,policy:{status:'RESEARCH_ONLY',canonExact:false,visualFidelityCertified:false,gameplayStatsIncluded:false,notes:'Declared game/source references, not canonical gameplay imports; includes original simulations and crossover records.'},counts,entries};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),i=args.indexOf('--out'),out=i>=0?args[i+1]:null;
 if(!out){console.error('Usage: node scripts/export-alien-base-candidates.mjs --out PATH [--check]');process.exit(2);}
 assertAlienBaseCandidateSourcesCurrent();
 const raw=JSON.stringify(buildAlienBaseCandidateExport(),null,2)+'\n';
 if(args.includes('--check')){
  if(readFileSync(out,'utf8')!==raw){console.error('Alien_base candidate drift:',out);process.exit(1);}
  console.log('Candidate intake OK:',out);
 }else{writeFileSync(out,raw);console.log('Wrote research-only candidate intake:',out);}
}
