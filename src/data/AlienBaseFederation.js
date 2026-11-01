import snapshot from './alien-base-snapshot.v1.json' with { type: 'json' };
import {getAlienRegistryForLegacySharedId,getAlienRegistryReviewReason} from './AlienBaseRegistryV2.js';

// Never fetch alien_base (private) from a public web client or mutate save IDs.
export const ALIEN_BASE_SNAPSHOT = Object.freeze(snapshot);
const sharedById = new Map(snapshot.records.map(record=>[record.id,Object.freeze(record)]));
const linkedByLegacy = new Map(snapshot.crosswalks.map(link=>[link.collection+'::'+link.legacyId,link.sharedId]));
const basisByLegacy = new Map(snapshot.relations.map(link=>[link.collection+'::'+link.localId,Object.freeze(link)]));
export const getAlienBaseReferenceById = id => sharedById.get(id) ?? null;
export const getAlienBaseIdentityForLocal = (collection,id) => getAlienBaseReferenceById(linkedByLegacy.get(collection+'::'+id));
export const getAlienBaseBasisForLocal = (collection,id) => basisByLegacy.get(collection+'::'+id) ?? null;
export const getAlienBaseArchiveIds = () => [...snapshot.archiveIds];
const ARCHIVE_NOTES = Object.freeze({
  "faction:weyland-yutani": [
    "culture",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Conglomérat commercial omniprésent dans l'univers Alien, en particulier autour de la colonisation et de la recherche biologique."
  ],
  "faction:uscm": [
    "culture",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Marines coloniaux chargés d'interventions armées, distincts des forces de sécurité d'entreprise et des chasseurs Yautja."
  ],
  "faction:synthetics": [
    "culture",
    "SCREEN",
    [
      "alien1979",
      "aliens1986"
    ],
    "Les androïdes et synthétiques ont des missions et loyautés variables selon les modèles et leurs employeurs."
  ],
  "weapon:m41a": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Fusil à impulsion des Colonial Marines ; sa présence dans le Codex ne le rend pas équipable par le chasseur."
  ],
  "weapon:m56": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Smartgun utilisé par les artilleurs marines, indépendant de l'arsenal plasma des Yautja."
  ],
  "weapon:m240": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Incinérateur portable des marines, utile comme référence documentaire contre les menaces biologiques."
  ],
  "equipment:m314": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Détecteur de mouvement de l'équipement colonial ; il ne remplace pas les capteurs du biomasque Yautja."
  ],
  "vehicle:m577": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Transport blindé M577, conçu pour une insertion et un déplacement terrestres protégés."
  ],
  "vehicle:ud4l": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Navette d'assaut UD-4L Cheyenne destinée au déploiement des marines et de leurs équipements."
  ],
  "vehicle:p5000": [
    "technologie",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Chargeur motorisé P-5000 destiné avant tout à la manutention industrielle."
  ],
  "character:bishop": [
    "culture",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Synthétique présent à bord du Sulaco, distinct d'Ash, de David et des autres lignées d'androïdes."
  ],
  "character:ellen-ripley": [
    "culture",
    "SCREEN",
    [
      "alien1979",
      "aliens1986"
    ],
    "Survivante du Nostromo et protagoniste de la crise de LV-426 ; sa chronologie reste séparée des missions originales Apex Hunt."
  ],
  "archive:sevastopol": [
    "culture",
    "LICENSED_EU",
    [
      "alienIsolation2014"
    ],
    "Station spatiale dans Alien: Isolation, théâtre des événements liés à Amanda Ripley."
  ],
  "archive:renaissance": [
    "culture",
    "SCREEN",
    [
      "alienRomulus2024"
    ],
    "Station de recherche Renaissance de la continuité Alien: Romulus, non assimilée à Sevastopol."
  ],
  "archive:lv223": [
    "culture",
    "SCREEN",
    [
      "prometheus2012"
    ],
    "Monde des installations des Ingénieurs exploré dans Prometheus, distinct de LV-426."
  ],
  "archive:lv426": [
    "culture",
    "SCREEN",
    [
      "aliens1986"
    ],
    "Lune Acheron et théâtre de la crise de Hadley's Hope."
  ],
  "xeno:facehugger": [
    "xenomorphes",
    "SCREEN",
    [
      "alien1979"
    ],
    "Organisme implantateur du cycle xénomorphe, à distinguer des variantes et simulations propres au jeu."
  ],
  "xeno:chestburster": [
    "xenomorphes",
    "SCREEN",
    [
      "alien1979"
    ],
    "Forme émergente après implantation ; la durée et les règles d'incubation ne sont pas uniformisées artificiellement."
  ],
  "xeno:ovomorph": [
    "xenomorphes",
    "SCREEN",
    [
      "alien1979"
    ],
    "Œuf biologique du cycle xénomorphe, distinct des équipements et des trophées du chasseur."
  ],
  "archive:pathogen": [
    "xenomorphes",
    "SCREEN",
    [
      "prometheus2012",
      "alienCovenant2017"
    ],
    "Dossier sur l'agent mutagène associé aux Ingénieurs ; ne pas confondre ses effets avec toutes les castes xénomorphes."
  ]
});
export function getAlienBaseArchiveCodexEntries(){
 return snapshot.archiveIds.map(sharedId=>{
  const record = getAlienBaseReferenceById(sharedId), note=ARCHIVE_NOTES[sharedId];
  if(!record||!note)throw Error('Missing shared archive '+sharedId);
  const [category,sourceTier,sources,summary]=note;
  return Object.freeze({
   id:'alien-base:'+sharedId,sharedId,canonicalRegistryId:getAlienRegistryForLegacySharedId(sharedId)?.id??null,registryReviewReason:getAlienRegistryReviewReason(sharedId),entryType:'codex',category,title:record.name,summary,
   body:'Archive Alien_base consultable uniquement. Cette référence ne débloque ni rencontre, ni équipement, ni modèle 1:1 ; les statistiques restent propres au jeu.',
   sourceTier, sources:Object.freeze([...sources]),isOriginal:false,runtimeStatus:'archive',archiveOnly:true,locationIds:Object.freeze([])
  });
 });
}
export function assertAlienBaseSnapshotIntegrity(){
 if(snapshot.scope!=='public-minimal-yautja-apex-hunt'||snapshot.origin!=='darknigthmare/alien_base')throw Error('Wrong Alien_base scope');
 const ids=new Set(),links=new Set();
 for(const record of snapshot.records){
  if(ids.has(record.id)||Object.keys(record).sort().join('|')!=='id|kind|name')throw Error('Non-minimal or duplicate record');
  ids.add(record.id);
 }
 for(const x of snapshot.crosswalks){
  const key=x.collection+'::'+x.legacyId;
  if(links.has(key)||!ids.has(x.sharedId))throw Error('Broken local alias');
  links.add(key);
 }
 for(const x of snapshot.relations)if(x.assertsIdentity!==false||!ids.has(x.basisSharedId))throw Error('Wrong inspiration relation');
 for(const id of snapshot.archiveIds)if(!ids.has(id))throw Error('Unresolved archive');
 return {records:snapshot.records.length,links:snapshot.crosswalks.length,archiveIds:snapshot.archiveIds.length,relations:snapshot.relations.length};
}
