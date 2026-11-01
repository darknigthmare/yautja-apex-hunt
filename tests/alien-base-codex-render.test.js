import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_LORE_ENTRIES,ALIEN_BASE_ARCHIVE_ENTRIES,ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES} from '../src/data/LoreCodex.js';
const prevWindow=globalThis.window;
globalThis.window={addEventListener(){}};
const {Game}=await import('../src/main.js');
if(prevWindow===undefined)delete globalThis.window;else globalThis.window=prevWindow;
const element=tag=>({
 tag,className:'',dataset:{},children:[],style:{setProperty(){}},textContent:'',title:'',
 append(...items){this.children.push(...items);},
 replaceChildren(...items){this.children=[...items];}
});
test('Codex public renders 40 non-playable Alien_base archive cards with provenance',()=>{
 const previous=globalThis.document;
 const grid=element('div');
 globalThis.document={
  getElementById:id=>id==='codex-grid'?grid:null,
  createElement:element,
  createTextNode:content=>({tag:'#text',textContent:content})
 };
 try{Game.prototype.renderLoreCodex.call({});}
 finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
 assert.equal(ALIEN_BASE_ARCHIVE_ENTRIES.length,20);
 assert.equal(ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES.length,20);
 assert.equal(grid.children.length,ALL_LORE_ENTRIES.length);
 const cards=grid.children.filter(c=>c.className==='codex-card');
 assert.equal(cards.length,ALL_LORE_ENTRIES.length);
 const stamps=cards.flatMap(c=>c.children.filter(x=>x.className==='codex-shared-reference').map(x=>x.textContent));
 assert.equal(stamps.length,40);
 assert.equal(stamps.filter(x=>x.includes('CORRESPONDANCE EN REVUE')).length,4);
 assert.equal(stamps.filter(x=>x.includes('REGISTRE ALIEN_BASE')).length,36);
 const badges=cards.flatMap(c=>c.children.filter(x=>x.className==='codex-card-header').flatMap(h=>h.children.filter(x=>x.className==='codex-tier').map(x=>x.textContent)));
 assert.equal(badges.filter(x=>x==='RECH.').length,20);
});
