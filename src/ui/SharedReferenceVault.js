import {YautjaContentCatalog} from '../data/YautjaContentCatalog.js';
import {MEDIA_COVERAGE_CATALOG, MEDIA_PROVENANCE_TIERS, MEDIA_RELEASE_STATUSES} from '../data/MediaCoverageCatalog.js';
import {LORE_SOURCE_TIERS, LORE_SOURCES} from '../data/LoreCodex.js';
import {getAlienRegistryForLocal,getAlienRegistryInspirationForLocal} from '../data/AlienBaseRegistryV2.js';
import {getAlienBaseMediaByLocalId} from '../data/AlienBaseMediaV2.js';
import {getVaultCardMiniatureSvg, getCategoryIconSvg} from './CanonLogosAndEmblems.js';

const GROUPS = Object.freeze([
 {grid:'technology-catalog-grid',items:YautjaContentCatalog.technology,collection:'technology'},
 {grid:'vehicle-catalog-grid',items:YautjaContentCatalog.vehicles,collection:'vehicles'},
 {grid:'enemy-catalog-grid',items:YautjaContentCatalog.enemies,collection:'enemies'},
 {grid:'event-catalog-grid',items:YautjaContentCatalog.levelEvents,collection:'levelEvents'},
 {grid:'boss-catalog-grid',items:YautjaContentCatalog.huntBosses,collection:'huntBosses'},
 {grid:'support-catalog-grid',items:YautjaContentCatalog.support,collection:'support'},
 {grid:'media-coverage-grid',items:MEDIA_COVERAGE_CATALOG,collection:'media'}
]);
export const CONTENT_VAULT_TOTAL = GROUPS.reduce((sum,x)=>sum+x.items.length,0);
const STATUS = Object.freeze({
 playable:'JOUABLE DÉCLARÉ',encounter:'RENCONTRE DÉCLARÉE',
 customization:'PERSONNALISATION',gallery:'GALERIE',partial:'PARTIEL',archive:'ARCHIVE'
});
const normalized=text=>String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
const element=(doc,tag,className,text)=>{
 const el=doc.createElement(tag);el.className=className;
 if(text!==undefined)el.textContent=String(text);
 return el;
};
export function getVaultGroups(){return GROUPS.map(({grid,items,collection})=>({grid,collection,count:items.length}));}
export function getReferenceVaultMediaStatus(item){
 return getAlienBaseMediaByLocalId(item.id)?.sourceReview==='project-declared-not-primary-verified'
 ? 'À VÉRIFIER · NON CERTIFIÉ 1:1':'LIEN À EXAMINER';
}
function matches(item,query,status,media){
 const state=String(item.runtimeStatus??item.gameCoverage?.runtimeStatus??'archive');
 if(status!=='all'&&state!==status)return false;
 if(!query)return true;
 const words=[item.name,item.title,item.description,item.summary,item.role,item.gameplay,item.continuity,item.medium,item.sourceTier,
  item.provenanceTier,item.id,...(item.sources??[])];
 if(media)words.push(item.gameCoverage?.summary,item.status,item.year,getAlienBaseMediaByLocalId(item.id)?.id);
 return normalized(words.filter(v=>v!=null).join(' ')).includes(normalized(query));
}
function appendBadge(doc,parent,label,type){
 parent.append(element(doc,'span','runtime-status runtime-status-'+type,label));
}
function appendSource(doc,card,entry){
 const ids=Array.isArray(entry.sources)?entry.sources:[];
 const sources=ids.map(id=>({id,ref:LORE_SOURCES[id]}));
 if(!sources.length)return;
 const block=element(doc,'div','reference-source-list');
 block.append(element(doc,'small','reference-source-label','SOURCES DÉCLARÉES · À VÉRIFIER'));
 for(const {id,ref} of sources.slice(0,4)){
  if(ref?.url?.startsWith('https://')){
   const link=element(doc,'a','media-coverage-source',ref.title);
   link.href=ref.url;link.target='_blank';link.rel='noopener noreferrer';block.append(link);
  }else block.append(element(doc,'small','reference-source-name',id));
 }
 card.append(block);
}
 function makeCard(doc,item,collection){
 const media=collection==='media',status=item.runtimeStatus??item.gameCoverage?.runtimeStatus??'archive';
 const tier=item.sourceTier??item.provenanceTier??'ORIGINAL';
 const theme=media?MEDIA_PROVENANCE_TIERS[tier]:LORE_SOURCE_TIERS[tier];
 const card=element(doc,'article','content-catalog-card'+(media?' media-coverage-card':''));
 card.dataset.referenceId=item.id;
 card.style?.setProperty?.('--lore-tier-color',theme?.color??'#85c7c9');
 const miniatureBox=element(doc,'div','card-miniature-box vault-miniature');
 miniatureBox.innerHTML=getVaultCardMiniatureSvg(item,collection);
 card.append(miniatureBox);
 const header=element(doc,'header','content-card-header');
 const catIcon=element(doc,'span','content-card-category-icon');
 catIcon.innerHTML=getCategoryIconSvg(collection.toUpperCase(),16);
 const heading=element(doc,'h4','content-card-title',item.name??item.title);
 const badges=element(doc,'div','content-card-badges');
 appendBadge(doc,badges,STATUS[status]??'ARCHIVE',STATUS[status]?status:'archive');
 appendBadge(doc,badges,theme?.shortLabel??tier,'archive');
 if(media)badges.append(element(doc,'span','media-release-status media-release-status-'+String(item.status??'').toLowerCase(),MEDIA_RELEASE_STATUSES[item.status]??item.status));
 header.append(catIcon,heading,badges);card.append(header);
 if(media){
  card.append(element(doc,'small','media-coverage-meta',item.year+' · '+item.medium));
  card.append(element(doc,'small','media-coverage-continuity',item.continuity));
  card.append(element(doc,'p','media-coverage-summary',item.gameCoverage?.summary??'Œuvre documentée'));
  const work=getAlienBaseMediaByLocalId(item.id);
  card.append(element(doc,'small','reference-shared-id',work?'ALIEN_BASE · '+work.id:'ALIEN_BASE · IDENTITÉ À RELIER'));
  card.append(element(doc,'small','reference-verification',getReferenceVaultMediaStatus(item)));
  if(item.sourceUrl?.startsWith('https://')){
   const a=element(doc,'a','media-coverage-source','CONSULTER LA SOURCE DÉCLARÉE');
   a.href=item.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';card.append(a);
  }
 }else{
  card.append(element(doc,'p','content-card-desc',item.description??'Dossier en cours de documentation'));
  if(item.role||item.gameplay)card.append(element(doc,'small','content-card-role',item.role??item.gameplay));
  const canonical=getAlienRegistryForLocal('YautjaContentCatalog.'+collection,item.id);
  const inspired=getAlienRegistryInspirationForLocal('YautjaContentCatalog.'+collection,item.id);
  if(canonical)card.append(element(doc,'small','reference-shared-id','ALIEN_BASE · '+canonical.id));
  else if(inspired)card.append(element(doc,'small','reference-shared-id','INSPIRÉ DE · '+inspired.basisId+' · NON IDENTIQUE'));
  card.append(element(doc,'small','reference-verification','Référence de projet · reproduction 1:1 non certifiée'));
  appendSource(doc,card,item);
 }
 return card;
}
export function renderSharedReferenceVault(doc=globalThis.document){
 if(!doc?.getElementById||!doc?.createElement)return {total:CONTENT_VAULT_TOTAL,rendered:0};
 const query=String(doc.getElementById('reference-vault-search')?.value??'').trim();
 const status=String(doc.getElementById('reference-vault-status')?.value??'all');
 let rendered=0;
 for(const group of GROUPS){
  const grid=doc.getElementById(group.grid);
  if(!grid||typeof grid.replaceChildren!=='function')continue;
  const filtered=group.items.filter(item=>matches(item,query,status,group.collection==='media'));
  grid.replaceChildren(...filtered.map(item=>makeCard(doc,item,group.collection)));
  rendered+=filtered.length;
  const counters=doc.querySelectorAll?.('[data-count-for="'+group.grid+'"]')??[];
  for(const counter of counters)counter.textContent=filtered.length===group.items.length?String(group.items.length):filtered.length+' / '+group.items.length;
 }
 const total=doc.querySelector?.('[data-content-total]');
 if(total)total.textContent=rendered===CONTENT_VAULT_TOTAL?String(CONTENT_VAULT_TOTAL):rendered+' / '+CONTENT_VAULT_TOTAL;
 const empty=doc.getElementById('reference-vault-empty');
 if(empty)empty.hidden=rendered!==0;
 return {total:CONTENT_VAULT_TOTAL,rendered};
}
export function initializeSharedReferenceVault(doc=globalThis.document){
 const result=renderSharedReferenceVault(doc);
 for(const id of ['reference-vault-search','reference-vault-status']){
  const field=doc?.getElementById?.(id);
  if(field?.addEventListener&&field.dataset?.referenceVaultBound!=='true'){
   if(field.dataset)field.dataset.referenceVaultBound='true';
   field.addEventListener(id==='reference-vault-search'?'input':'change',()=>renderSharedReferenceVault(doc));
  }
 }
 return result;
}
