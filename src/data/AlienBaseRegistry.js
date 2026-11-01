/* Offline reference snapshot from the private Alien_base repository.
 * This module never changes mission admission, score, AI, or savegame IDs. */
import { ALIEN_BASE_PUBLIC_SNAPSHOT_V1 as snapshot } from './alien-base-public-v1.js';
function deepFreeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);if(!Object.isFrozen(value))Object.freeze(value)}return value}
deepFreeze(snapshot);
const indexes=Object.freeze(Object.fromEntries(Object.entries(snapshot.records).map(([category,rows])=>[category,new Map(rows.map(row=>[row.id,row]))])));
export const ALIEN_BASE_PUBLIC_COUNTS=Object.freeze(Object.fromEntries(Object.entries(snapshot.records).map(([category,rows])=>[category,rows.length])));
export const ALIEN_BASE_PUBLIC_VERSION=Object.freeze({format:snapshot.format,version:snapshot.version,sourceCommits:snapshot.sourceCommits});
export function getAlienBaseRecord(category,id){return typeof id==='string'&&Object.hasOwn(indexes,category)?indexes[category].get(id)??null:null}
export function getAlienBaseMediaWork(id){if(typeof id!=='string')return null;return getAlienBaseRecord('mediaCoverage',id.startsWith('apex:media:')?id:'apex:media:'+id)}
