// Filters are documentary presentation only; the game state, equipment and saves never depend on them.
const fold=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
export function filterLoreEntries(entries,{query='',sourceTier='all',archivesOnly=false}={}){
 const needle=fold(query.trim()),tier=String(sourceTier||'all');
 return entries.filter(item=>{
  if(tier!=='all'&&item.sourceTier!==tier)return false;
  if(archivesOnly&&item.archiveOnly!==true)return false;
  if(!needle)return true;
  return fold([item.title,item.summary,item.body,item.canonNote,item.sharedId,item.canonicalRegistryId,item.id,item.category,...(item.sources??[])].filter(v=>v!=null).join(' ')).includes(needle);
 });
}
