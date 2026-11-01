import { writeFileSync, readFileSync } from 'node:fs';
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

const YCOMMIT = "3cbe8861204c5fe7341b61cda61f806b596a7186";
const FILE_SHA = Object.freeze({
  "src/data/YautjaExpandedContent.js": "8663208bd897fc14ea8136a46b0760f65afe007b",
  "src/data/YautjaContentCatalog.js": "d03d62eb495e1e04a0bc30aaa9fff407c3f8bfc5",
  "src/data/YautjaLoreDatabase.js": "2ea6fbef17999783ac3bb14bfca24ff10fdd4beb",
  "src/data/LoreCodex.js": "e2a27ef68be09b2812270423ed6325fe2586133e",
  "src/data/MediaCoverageCatalog.js": "d272a5c736058ada02519800df52ddc10250530e",
  "src/data/CanonPreyExpansionV251.js": "cb447f220b0e3ed0b7ad2f0b4fcd63286a6d6726",
  "src/data/PreyTaxonomyAndCrossoverCatalog.js": "ac307846bbfb1ce846ae5832da3f97873c81a564",
  "src/data/PreyReferenceMetadata.js": "8352298311011570ac01ddbc19ee874bc387fc7b",
  "src/data/RuntimeEquipment.js": "807a1c8bdbfa16c1fdbafbc39d00af6877e7e6f3"
});
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
 const raw=JSON.stringify(buildAlienBaseCandidateExport(),null,2)+'\n';
 if(args.includes('--check')){
  if(readFileSync(out,'utf8')!==raw){console.error('Alien_base candidate drift:',out);process.exit(1);}
  console.log('Candidate intake OK:',out);
 }else{writeFileSync(out,raw);console.log('Wrote research-only candidate intake:',out);}
}
