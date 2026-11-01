import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_LORE_ENTRIES,ALIEN_BASE_ARCHIVE_ENTRIES,ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES} from '../src/data/LoreCodex.js';
import {filterLoreEntries} from '../src/ui/CodexFilters.js';

test('Codex defaults to the full existing catalogue and preserves 40 shared archives',()=>{
 assert.equal(filterLoreEntries(ALL_LORE_ENTRIES).length,ALL_LORE_ENTRIES.length);
 const archival=filterLoreEntries(ALL_LORE_ENTRIES,{archivesOnly:true});
 assert.equal(archival.length,ALIEN_BASE_ARCHIVE_ENTRIES.length+ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES.length);
 assert.equal(archival.length,40);
 assert.ok(archival.every(x=>x.archiveOnly===true&&x.runtimeStatus==='archive'));
});
test('Filter by research shows only 20 unverified biological/equipment dossiers',()=>{
 const selected=filterLoreEntries(ALL_LORE_ENTRIES,{sourceTier:'RESEARCH',archivesOnly:true});
 assert.equal(selected.length,20);
 assert.ok(selected.every(x=>x.sourceTier==='RESEARCH'&&x.researchOnly===true));
});
test('Queries match case-insensitive accented titles, source IDs and canonical IDs',()=>{
 const byText=filterLoreEntries(ALL_LORE_ENTRIES,{query:'wEyLaNd'});
 assert.ok(byText.length>0);assert.ok(byText.length<ALL_LORE_ENTRIES.length);
 const first=ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES[0];
 const byId=filterLoreEntries(ALL_LORE_ENTRIES,{query:first.canonicalRegistryId});
 assert.ok(byId.some(x=>x.id===first.id));
 assert.equal(filterLoreEntries(ALL_LORE_ENTRIES,{query:'zzzz_codex_introuvable'}).length,0);
});
test('Codex DOM renders filtered archive results and an accessible count',async()=>{
 const prevWindow=globalThis.window;
 globalThis.window={addEventListener(){}};
 const {Game}=await import('../src/main.js');
 if(prevWindow===undefined)delete globalThis.window;else globalThis.window=prevWindow;
 const mock=tag=>({tag,children:[],dataset:{},style:{setProperty(){}},className:'',textContent:'',append(...x){this.children.push(...x);},replaceChildren(...x){this.children=[...x];}});
 const grid=mock('div'),status=mock('output');
 const controls={'codex-grid':grid,'codex-filter-count':status,'codex-search':{value:''},
  'codex-source-filter':{value:'RESEARCH'},'codex-archives-only':{checked:true}};
 const previous=globalThis.document;
 globalThis.document={getElementById:id=>controls[id]??null,createElement:mock,createTextNode:value=>({textContent:value})};
 try{Game.prototype.renderLoreCodex.call({});}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
 assert.equal(grid.children.length,20);
 assert.match(status.textContent,/^20 \/ /);
 assert.ok(grid.children.every(x=>x.children.some(c=>c.className==='codex-shared-reference')));
});
