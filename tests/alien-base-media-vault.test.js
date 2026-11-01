import test from 'node:test';
import assert from 'node:assert/strict';
import {YautjaContentCatalog} from '../src/data/YautjaContentCatalog.js';
import {MEDIA_COVERAGE_CATALOG} from '../src/data/MediaCoverageCatalog.js';
import {ALIEN_BASE_MEDIA_V2, getAlienBaseMediaByLocalId,assertAlienBaseMediaIntegrity} from '../src/data/AlienBaseMediaV2.js';
import {CONTENT_VAULT_TOTAL, getVaultGroups,renderSharedReferenceVault,initializeSharedReferenceVault,getReferenceVaultMediaStatus} from '../src/ui/SharedReferenceVault.js';

function mockElement(tag){
 return {tag,className:'',dataset:{},style:{setProperty(){}},textContent:'',value:'',children:[],listeners:{},hidden:false,
  append(...items){this.children.push(...items);},
  replaceChildren(...items){this.children=items;},
  addEventListener(type,callback){this.listeners[type]=callback;}
 };
}
function mockDocument(){
 const sections=getVaultGroups(),nodes=new Map();
 for(const {grid} of sections)nodes.set(grid,mockElement('div'));
 const search=mockElement('input');search.value='';nodes.set('reference-vault-search',search);
 const status=mockElement('select');status.value='all';nodes.set('reference-vault-status',status);
 nodes.set('reference-vault-empty',mockElement('p'));
 const total=mockElement('span'),counters=new Map(sections.map(({grid})=>[grid,mockElement('span')]));
 return {nodes,total,counters,doc:{
  createElement:mockElement,
  getElementById:id=>nodes.get(id)??null,
  querySelector:query=>query==='[data-content-total]'?total:null,
  querySelectorAll:query=>{
   const m=query.match(/^\[data-count-for="([^"]+)"\]$/);
   return m&&counters.has(m[1])?[counters.get(m[1])]:[];
  }
 }};
}
test('29 œuvres Alien_base sont reliées une à une aux médias existants sans affecter le gameplay',()=>{
 const integrity=assertAlienBaseMediaIntegrity();assert.equal(integrity.works,29);
 assert.equal(MEDIA_COVERAGE_CATALOG.length,29);
 const records=ALIEN_BASE_MEDIA_V2.records;
 assert.equal(records.length,MEDIA_COVERAGE_CATALOG.length);
 for(const media of MEDIA_COVERAGE_CATALOG){
  const shared=getAlienBaseMediaByLocalId(media.id);
  assert.ok(shared,media.id);
  for(const [a,b] of [['title','title'],['year','year'],['medium','medium'],['continuity','continuity'],['provenanceTier','provenanceTier'],['status','publicationStatus']])
   assert.equal(media[a],shared[b],media.id+'/'+a);
  assert.equal(shared.fidelityVerified,false);
  assert.match(getReferenceVaultMediaStatus(media),/À VÉRIFIER/);
 }
 assert.equal(getAlienBaseMediaByLocalId('unknown'),null);
});
test('Armurerie affiche les 7 catégories réelles et les 29 œuvres sans statut jouable inventé',()=>{
 const {doc,nodes,total,counters}=mockDocument();
 const sections=getVaultGroups(),expected={
  technology:YautjaContentCatalog.technology.length,vehicles:YautjaContentCatalog.vehicles.length,
  enemies:YautjaContentCatalog.enemies.length,levelEvents:YautjaContentCatalog.levelEvents.length,
  huntBosses:YautjaContentCatalog.huntBosses.length,support:YautjaContentCatalog.support.length,
  media:MEDIA_COVERAGE_CATALOG.length
 };
 assert.equal(CONTENT_VAULT_TOTAL,Object.values(expected).reduce((a,b)=>a+b,0));
 const status=initializeSharedReferenceVault(doc);
 assert.equal(status.rendered,CONTENT_VAULT_TOTAL);
 assert.equal(total.textContent,String(CONTENT_VAULT_TOTAL));
 for(const item of sections){
  assert.equal(nodes.get(item.grid).children.length,expected[item.collection],item.grid);
  assert.equal(counters.get(item.grid).textContent,String(expected[item.collection]));
 }
 const media=nodes.get('media-coverage-grid').children;
 assert.equal(media.length,29);
 assert.ok(media.every(c=>c.children.some(x=>x.className==='reference-shared-id'&&x.textContent.includes('work.'))));
 assert.ok(media.every(c=>c.children.some(x=>x.className==='reference-verification')));
});
test('Recherche et filtre fonctionnent sans modifier les données ni les états du joueur',()=>{
 const {doc,nodes,total}=mockDocument();
 initializeSharedReferenceVault(doc);
 const search=nodes.get('reference-vault-search'),select=nodes.get('reference-vault-status');
 assert.equal(typeof search.listeners.input,'function');
 assert.equal(typeof select.listeners.change,'function');
 search.value='film_predator_1987';search.listeners.input();
 assert.equal(nodes.get('media-coverage-grid').children.length,1);
 assert.equal(nodes.get('technology-catalog-grid').children.length,0);
 assert.equal(total.textContent,'1 / '+CONTENT_VAULT_TOTAL);
 search.value='';select.value='archive';select.listeners.change();
 assert.ok(nodes.get('media-coverage-grid').children.length>0);
 assert.ok(nodes.get('technology-catalog-grid').children.length<YautjaContentCatalog.technology.length);
 search.value='référence introuvable';search.listeners.input();
 assert.equal(nodes.get('reference-vault-empty').hidden,false);
 assert.equal(total.textContent,'0 / '+CONTENT_VAULT_TOTAL);
});
