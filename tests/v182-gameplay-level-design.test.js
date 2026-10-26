import test from 'node:test';
import assert from 'node:assert/strict';

import { Prey1719BurntForestTrapperAmbushSector } from '../src/gameplay/Prey1719BurntForestTrapperAmbushSector.js';
import { Avp2004ShiftingPyramidChamberSector } from '../src/gameplay/Avp2004ShiftingPyramidChamberSector.js';
import { Avp2004WhalingStationIceQueenSector } from '../src/gameplay/Avp2004WhalingStationIceQueenSector.js';
import { ThePredator2018StargazerLabBreachSector } from '../src/gameplay/ThePredator2018StargazerLabBreachSector.js';
import { ThePredator2018UpgradePredatorHuntSector } from '../src/gameplay/ThePredator2018UpgradePredatorHuntSector.js';
import { Predators2010AlienDropPodCagesSector } from '../src/gameplay/Predators2010AlienDropPodCagesSector.js';
import { Predators2010ClanTrophyTotemSector } from '../src/gameplay/Predators2010ClanTrophyTotemSector.js';
import { HumanQaPredatorFranchiseMasterHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseMasterHUDDirector.js';
import { HumanQaPredatorFranchiseMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v182 Chantier LD 1: Prey1719BurntForestTrapperAmbushSector navigates ash forest, steps into bear trap, pries it open, and deflects flintlock volley', () => {
  const sector = new Prey1719BurntForestTrapperAmbushSector({ ashDensityPct: 75.0 });

  // Navigate forest
  const nav = sector.navigateBurntPineForest();
  assert.strictEqual(nav.success, true);
  assert.strictEqual(nav.biome, 'SCORCHED_BURNT_PINE_FOREST');
  assert.strictEqual(nav.ashenFootprintsVisible, true);

  // Step into bear trap
  const step = sector.stepIntoSteelBearTrap();
  assert.strictEqual(step.success, true);
  assert.strictEqual(step.bearTrapTriggered, true);
  assert.strictEqual(step.springTensionN, 4800.0);

  // Cannot deflect musket volley before prying trap open
  const premature = sector.deflectFlintlockVolleyAndCounter(6);
  assert.strictEqual(premature.success, false);

  // Pry trap open
  const pry = sector.pryOpenSteelBearTrap();
  assert.strictEqual(pry.success, true);
  assert.strictEqual(pry.bearTrapPriedOpen, true);
  assert.strictEqual(pry.feralPredatorUnstoppable, true);

  // Deflect volley
  const deflect = sector.deflectFlintlockVolleyAndCounter(6);
  assert.strictEqual(deflect.success, true);
  assert.strictEqual(deflect.musketVolleyDeflected, true);
  assert.strictEqual(deflect.trappersDefeatedCount, 6);
});

test('v182 Chantier LD 2: Avp2004ShiftingPyramidChamberSector reconfigures 45t stone slabs every 10 min, retrieves plasmacasters, and performs acid blood ritual', () => {
  const sector = new Avp2004ShiftingPyramidChamberSector({ reconfigurationIntervalSec: 600 });

  // Shift pyramid
  const shift = sector.triggerTenMinutePyramidShift();
  assert.strictEqual(shift.success, true);
  assert.strictEqual(shift.pyramidShiftCount, 1);
  assert.strictEqual(shift.slabMassTonnes, 45.0);
  assert.strictEqual(shift.stoneGrindAcousticDb, 114);

  // Cannot mark clan ritual before retrieving weapons
  const premature = sector.executeAcidBloodRitualMarking('SCAR_PREDATOR');
  assert.strictEqual(premature.success, false);

  // Retrieve plasmacasters
  const retrieve = sector.retrieveShoulderPlasmacasters();
  assert.strictEqual(retrieve.success, true);
  assert.strictEqual(retrieve.plasmacastersRetrieved, true);
  assert.strictEqual(retrieve.weaponModel, 'DUAL_SHOULDER_PLASMACASTERS');

  // Ritual acid marking
  const ritual = sector.executeAcidBloodRitualMarking('SCAR_PREDATOR');
  assert.strictEqual(ritual.success, true);
  assert.strictEqual(ritual.clanMarkingCompleted, true);
  assert.strictEqual(ritual.warriorStatusGranted, 'BLOODED_YAUTJA_WARRIOR');
});

test('v182 Chantier LD 3: Avp2004WhalingStationIceQueenSector traverses blizzard glacier, tethers Xenomorph Queen, and drops water tower into ocean abyss', () => {
  const sector = new Avp2004WhalingStationIceQueenSector({ blizzardWindMps: 24.0 });

  // Traverse glacier
  const traverse = sector.traverseGlacierIceSheet();
  assert.strictEqual(traverse.success, true);
  assert.strictEqual(traverse.glacierTraversed, true);
  assert.strictEqual(traverse.surfaceTempC, -35.0);
  assert.strictEqual(traverse.iceTractionMu, 0.12);

  // Tether Queen
  const tether = sector.tetherXenomorphQueen();
  assert.strictEqual(tether.success, true);
  assert.strictEqual(tether.queenTethered, true);
  assert.strictEqual(tether.queenMassTonnes, 6.0);

  // Drop water tower into ocean abyss
  const plunge = sector.dropWaterTowerIntoAbyss();
  assert.strictEqual(plunge.success, true);
  assert.strictEqual(plunge.waterTowerDropped, true);
  assert.strictEqual(plunge.queenDefeatedPermanently, true);
  assert.strictEqual(plunge.honorSpearAwardedToLex, true);
});

test('v182 Chantier LD 4: ThePredator2018StargazerLabBreachSector snaps surgical restraints, recovers bio-mask & gauntlet, and hacks mainframe to escape', () => {
  const sector = new ThePredator2018StargazerLabBreachSector();

  // Break restraints
  const snap = sector.breakSurgicalRestraints();
  assert.strictEqual(snap.success, true);
  assert.strictEqual(snap.restraintsBroken, true);
  assert.strictEqual(snap.snapForceN, 3400.0);

  // Recover equipment
  const equip = sector.recoverPredatorEquipment();
  assert.strictEqual(equip.success, true);
  assert.strictEqual(equip.equipmentRecovered, true);
  assert.ok(equip.recoveredItems.includes('FUGITIVE_BIO_MASK'));

  // Hack mainframe and escape
  const escape = sector.hackStargazerMainframeAndEscape();
  assert.strictEqual(escape.success, true);
  assert.strictEqual(escape.mainframeHacked, true);
  assert.strictEqual(escape.labEscaped, true);
  assert.strictEqual(escape.escapedIntoGeorgiaWoods, true);
});

test('v182 Chantier LD 5: ThePredator2018UpgradePredatorHuntSector evaluates 3.30m titan chitin armor bullet bounce, direct ocular vision, and truck throw', () => {
  const sector = new ThePredator2018UpgradePredatorHuntSector({ upgradeHeightM: 3.30, upgradeMassKg: 350.0 });

  // Evaluate chitin defense
  const defense = sector.evaluateChitinExoskeletonDefense(30);
  assert.strictEqual(defense.success, true);
  assert.strictEqual(defense.roundsDeflectedCount, 30);
  assert.strictEqual(defense.penetrationDamageHp, 0);
  assert.strictEqual(defense.conventionalFirearmsIneffective, true);

  // Direct ocular vision
  const vision = sector.activateDirectOcularVision('ELECTROMAGNETIC_THERMAL');
  assert.strictEqual(vision.success, true);
  assert.strictEqual(vision.noBioMaskRequired, true);
  assert.strictEqual(vision.targetCloakPenetrationRatingPct, 99.0);

  // Hurl military vehicle
  const throwTruck = sector.hurlMilitaryVehicleAtPrey(3800.0);
  assert.strictEqual(throwTruck.success, true);
  assert.strictEqual(throwTruck.truckHurled, true);
  assert.strictEqual(throwTruck.throwDistanceM, 22.0);
  assert.strictEqual(throwTruck.forestCoverDemolished, true);
});

test('v182 Chantier LD 6: Predators2010AlienDropPodCagesSector inspects orbital cages, analyzes alien prey residue, and maps convergent stalking trails', () => {
  const sector = new Predators2010AlienDropPodCagesSector({ cagesCount: 8 });

  // Inspect cages
  const inspect = sector.inspectOrbitalDropCages();
  assert.strictEqual(inspect.success, true);
  assert.strictEqual(inspect.cagesInspected, true);
  assert.strictEqual(inspect.cagesCount, 8);
  assert.strictEqual(inspect.hydraulicDoorsBlownOutward, true);

  // Analyze residue
  const residue = sector.analyzeAlienPreyResidue();
  assert.strictEqual(residue.success, true);
  assert.strictEqual(residue.alienResidueAnalyzed, true);
  assert.ok(residue.identifiedAlienSpecies.includes('RIVER_GHOST_BIPEDAL'));

  // Map trails
  const map = sector.mapStalkingTrails();
  assert.strictEqual(map.success, true);
  assert.strictEqual(map.stalkingTrailsMapped, true);
  assert.strictEqual(map.tacticalPathfindingUnlocked, true);
});

test('v182 Chantier LD 7: Predators2010ClanTrophyTotemSector inspects 8m spinal totem, decodes Super Predator blood-feud glyphs, and harvests honor lore', () => {
  const sector = new Predators2010ClanTrophyTotemSector({ totemHeightM: 8.0 });

  // Inspect totem
  const inspect = sector.inspectClanTotemPole();
  assert.strictEqual(inspect.success, true);
  assert.strictEqual(inspect.totemInspected, true);
  assert.strictEqual(inspect.totemHeightM, 8.0);
  assert.strictEqual(inspect.skullsMountedCount, 14);

  // Decode blood feud
  const feud = sector.decodeSuperPredatorBloodFeud();
  assert.strictEqual(feud.success, true);
  assert.strictEqual(feud.bloodFeudDecoded, true);
  assert.strictEqual(feud.clanFactionA, 'SUPER_PREDATOR_BERSERKER_CLAN');

  // Harvest clan honor lore
  const honor = sector.harvestClanHonorScore();
  assert.strictEqual(honor.success, true);
  assert.strictEqual(honor.clanHonorHarvested, true);
  assert.strictEqual(honor.honorScoreGranted, 250);
  assert.strictEqual(honor.loreEntryUnlocked, 'CODEX_SUPER_PREDATOR_VENDETTA');
});

test('v182 Chantier LD 8: HumanQaPredatorFranchiseMasterHUDDirector evaluates 5 franchise QA audits and mounts master HUD panel', () => {
  const director = new HumanQaPredatorFranchiseMasterHUDDirector();

  const auditTelemetry = director.evaluate5FranchiseAudits();
  assert.strictEqual(auditTelemetry.auditsCount, 5);
  assert.strictEqual(auditTelemetry.allPassed, true);
  assert.strictEqual(auditTelemetry.compositeUXScore, 99.8);

  const mountResult = director.mountMasterFranchiseHUD();
  assert.strictEqual(mountResult.mounted, true);
  assert.strictEqual(mountResult.panelClass, 'predator-franchise-master-hud-panel');
  assert.ok(mountResult.subWidgets.includes('burnt-forest-ash-visibility-gauge'));
  assert.ok(mountResult.subWidgets.includes('pyramid-reconfiguration-countdown-dial'));
  assert.ok(mountResult.subWidgets.includes('upgrade-chitin-armor-integrity-bar'));
});

test('v182 Chantier LD 9: AudioSynthesizer computes pyramid shifting & bear trap acoustics and executes 15 new franchise SFX methods', () => {
  // Test mathematical acoustics
  const pyramidAcoustics = audioSynth.computePyramidStoneShiftingAcoustics(45.0, 0.8, 12000.0);
  assert.strictEqual(pyramidAcoustics.slabMassTonnes, 45.0);
  assert.strictEqual(pyramidAcoustics.infrasonicGrindHz, 20);
  assert.strictEqual(pyramidAcoustics.structuralShiftIntegrityVerified, true);

  const bearTrapAcoustics = audioSynth.computeBearTrapHydraulicSnapAcoustics(4800.0, 90.0, 'YAUTJA_ARMORED_GREAVE');
  assert.strictEqual(bearTrapAcoustics.springTensionN, 4800.0);
  assert.strictEqual(bearTrapAcoustics.ironClangSplDb, 94);
  assert.strictEqual(bearTrapAcoustics.pryingRequiredForceN, 5184);

  // Test 15 procedural audio methods exist and don't throw
  const audioMethods = [
    'playAshForestScorchedWindWhistle',
    'playHydraulicBearTrapSnapClang',
    'playBearTrapPriedOpenIronGroan',
    'playPyramidStoneSlabGrindingRumble',
    'playAcidBloodRitualMarkingSizzle',
    'playDualPlasmacasterAlternatingDischarge',
    'playGlacierBlizzardWindWhiteout',
    'playIceSheetCrackCrevasseRumble',
    'playStargazerCleanroomContainmentBreach',
    'playStargazerSecurityAlarmKlaxon',
    'playUpgradePredatorRoarTitan',
    'playChitinArmorBulletBouncePing',
    'playOrbitalDropPodImpactThud',
    'playCageDoorHydraulicBlastOpen',
    'playClanTotemBoneWindChime'
  ];

  audioMethods.forEach((method) => {
    assert.strictEqual(typeof audioSynth[method], 'function', `${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method]());
  });
});

test('v182 Chantier LD 10: HumanQaPredatorFranchiseMasterAuditor audits all 7 franchise sectors and generates consolidated master expansion report', () => {
  const auditor = new HumanQaPredatorFranchiseMasterAuditor();

  const a1 = auditor.auditBurntForestTrapperAmbush({ bearTrapTriggered: true, bearTrapPriedOpen: true, musketVolleyDeflected: true });
  assert.strictEqual(a1.passes, true);

  const a2 = auditor.auditShiftingPyramidChamber({ pyramidShiftCount: 1, plasmacastersRetrieved: true, clanMarkingCompleted: true });
  assert.strictEqual(a2.passes, true);

  const a3 = auditor.auditWhalingStationIceQueen({ glacierTraversed: true, queenTethered: true, waterTowerDropped: true });
  assert.strictEqual(a3.passes, true);

  const a4 = auditor.auditStargazerLabBreach({ restraintsBroken: true, equipmentRecovered: true, labEscaped: true });
  assert.strictEqual(a4.passes, true);

  const a5 = auditor.auditUpgradePredatorHunt({ exoskeletonActive: true, directVisionActive: true, truckHurled: true });
  assert.strictEqual(a5.passes, true);

  const a6 = auditor.auditAlienDropPodCages({ cagesInspected: true, alienResidueAnalyzed: true, stalkingTrailsMapped: true });
  assert.strictEqual(a6.passes, true);

  const a7 = auditor.auditClanTrophyTotem({ totemInspected: true, bloodFeudDecoded: true, clanHonorHarvested: true });
  assert.strictEqual(a7.passes, true);

  const report = auditor.generateConsolidatedFranchiseReport();
  assert.strictEqual(report.version, 'v182');
  assert.strictEqual(report.totalAuditsExecuted, 7);
  assert.strictEqual(report.passedCount, 7);
  assert.strictEqual(report.compliancePct, 100);
  assert.ok(report.drawCallsInvariant.includes('<= 300'));
});
