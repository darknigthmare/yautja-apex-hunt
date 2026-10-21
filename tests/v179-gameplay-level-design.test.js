import test from 'node:test';
import assert from 'node:assert/strict';

import { Predator2ElScorpioPenthouseSiegeSector } from '../src/gameplay/Predator2ElScorpioPenthouseSiegeSector.js';
import { Predator2ScrapYardSpeargunSector } from '../src/gameplay/Predator2ScrapYardSpeargunSector.js';
import { Predator2ElevatorShaftDescentSector } from '../src/gameplay/Predator2ElevatorShaftDescentSector.js';
import { Predators2010GamePreserveCampSector } from '../src/gameplay/Predators2010GamePreserveCampSector.js';
import { Predators2010HanzoKatanaFalconerDuelSector } from '../src/gameplay/Predators2010HanzoKatanaFalconerDuelSector.js';
import { Prey1719ComancheQuicksandBogSector } from '../src/gameplay/Prey1719ComancheQuicksandBogSector.js';
import { Prey1719FeralBoneShieldAndFlechetteSector } from '../src/gameplay/Prey1719FeralBoneShieldAndFlechetteSector.js';
import { HumanQaPredatorCampaignHUDDirector } from '../src/gameplay/HumanQaPredatorCampaignHUDDirector.js';
import { HumanQaPredatorCampaignAuditor } from '../src/gameplay/HumanQaPredatorCampaignAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v179 Chantier LD 1: Predator2ElScorpioPenthouseSiegeSector breaches glass skylight, pins cartel with bone-crushing net-gun, and disarms Ramon Vega', () => {
  const sector = new Predator2ElScorpioPenthouseSiegeSector({ cartelMercenariesCount: 8, skylightElevationM: 15.0 });

  // Cannot fire net-gun before breaching skylight
  const premature = sector.fireNetGunPinningTarget('EL_SCORPIO_GUNMAN');
  assert.strictEqual(premature.success, false);

  // Breach skylight
  const breach = sector.breachGlassSkylight();
  assert.strictEqual(breach.success, true);
  assert.strictEqual(breach.skylightBreached, true);
  assert.strictEqual(breach.glassShatterAcousticDb, 96);

  // Pin cartel gunman to concrete wall
  const pin = sector.fireNetGunPinningTarget('RAMON_LIEUTENANT', 'REINFORCED_CONCRETE');
  assert.strictEqual(pin.success, true);
  assert.strictEqual(pin.pinnedToWall, true);
  assert.strictEqual(pin.constrictionForceN, 4500.0);
  assert.strictEqual(pin.ribFractureConfirmed, true);

  // Melee sweep through drywall
  const sweep = sector.sweepDualWristBladesMelee(1.8);
  assert.strictEqual(sweep.success, true);
  assert.strictEqual(sweep.cartelNeutralized, 3);

  // Ramon Vega disarmed & medallion collected
  const boss = sector.neutralizeCartelBossRamonVega();
  assert.strictEqual(boss.success, true);
  assert.strictEqual(boss.c4DetonationAverted, true);
  assert.strictEqual(boss.trophyAcquired, 'GOLD_EL_SCORPIO_CARTEL_MEDALLION');
});

test('v179 Chantier LD 2: Predator2ScrapYardSpeargunSector perches on 4-tier crushed cars, fires pneumatic speargun, and toggles crane electromagnet', () => {
  const sector = new Predator2ScrapYardSpeargunSector({ carStackTiers: 4, initialSpearAmmo: 6 });

  // Perch on crushed car stack
  const perch = sector.perchOnCrushedCarStack(8.5);
  assert.strictEqual(perch.success, true);
  assert.strictEqual(perch.onCarStackPerch, true);
  assert.strictEqual(perch.vantagePointCoverageDeg, 270);

  // Fire pneumatic speargun at target
  const shot = sector.firePneumaticSpeargun(35.0, 'CORRUGATED_STEEL_CONTAINER');
  assert.strictEqual(shot.success, true);
  assert.strictEqual(shot.targetImpaledAndPinned, true);
  assert.strictEqual(shot.muzzleVelocityMps, 180.0);
  assert.strictEqual(shot.remainingSpearAmmo, 5);

  // Toggle crane electromagnet
  const magnet = sector.toggleCraneElectromagnet(true);
  assert.strictEqual(magnet.success, true);
  assert.strictEqual(magnet.craneMagnetActive, true);
  assert.strictEqual(magnet.bioMaskSensorInterferencePct, 35.0);

  // Retrieve spent spear ammo
  const retrieve = sector.retrieveSpearAmmo(1);
  assert.strictEqual(retrieve.success, true);
  assert.strictEqual(retrieve.dartsRecovered, 1);
  assert.strictEqual(retrieve.totalSpearAmmo, 6);
});

test('v179 Chantier LD 3: Predator2ElevatorShaftDescentSector severs 18,000 N elevator cables, rappels vertical guide rails, and resolves 140m ledge suspension', () => {
  const sector = new Predator2ElevatorShaftDescentSector({ shaftHeightM: 120.0 });

  // Harrigan shotgun blast
  const blast = sector.fireHarriganShotgunBlast(4);
  assert.strictEqual(blast.success, true);
  assert.strictEqual(blast.weaponModel, 'BENELLI_M3_SUPER_90_12GA');

  // Sever cables
  const cables = sector.severElevatorCables();
  assert.strictEqual(cables.success, true);
  assert.strictEqual(cables.cableTensionN, 18000.0);
  assert.strictEqual(cables.cableSnapAcousticWhipDb, 118);

  // Rappel down guide rails
  const rappel = sector.rappelDownShaftGuideRails(12.0);
  assert.strictEqual(rappel.success, true);
  assert.strictEqual(rappel.hunterRappelled, true);

  // Ledge suspension duel with Harrigan
  const ledge = sector.resolveLedgeSuspensionDuel();
  assert.strictEqual(ledge.success, true);
  assert.strictEqual(ledge.ledgeSuspensionResolved, true);
  assert.strictEqual(ledge.dropElevationM, 140.0);
  assert.strictEqual(ledge.hunterArmSeveredAtWrist, true);
});

test('v179 Chantier LD 4: Predators2010GamePreserveCampSector surveys bone monoliths, frees captive Classic Hunter, and resolves Gatling plasmacaster bursts', () => {
  const sector = new Predators2010GamePreserveCampSector({ campDiameterM: 45.0 });

  // Survey monolith arena
  const survey = sector.surveyBoneMonolithArena();
  assert.strictEqual(survey.success, true);
  assert.strictEqual(survey.monolithsCount, 12);
  assert.strictEqual(survey.classicPredatorBound, true);

  // Liberate captive Classic Jungle Hunter
  const liberate = sector.liberateClassicPredator();
  assert.strictEqual(liberate.success, true);
  assert.strictEqual(liberate.classicPredatorLiberated, true);
  assert.strictEqual(liberate.duelOpponent, 'BERSERKER_SUPER_PREDATOR');

  // Berserker Gatling plasmacaster fire
  const gatling = sector.fireBerserkerGatlingPlasmacaster(2);
  assert.strictEqual(gatling.success, true);
  assert.strictEqual(gatling.totalBoltsFired, 6);
  assert.strictEqual(gatling.rotatingBarrelRpm, 1200);

  // Trigger clay mud thermal trap
  const trap = sector.triggerThermalDecoyTrap();
  assert.strictEqual(trap.success, true);
  assert.strictEqual(trap.thermalTrapTriggered, true);
  assert.strictEqual(trap.decoyMudCoverage, '100%_COOL_RIVER_CLAY');
});

test('v179 Chantier LD 5: Predators2010HanzoKatanaFalconerDuelSector adopts kenjutsu Hasso stance and resolves mutual lethal passing strike in moonlit grass', () => {
  const sector = new Predators2010HanzoKatanaFalconerDuelSector({ grassHeightM: 1.2 });

  // Enter meadow
  const meadow = sector.enterMoonlitMeadow();
  assert.strictEqual(meadow.success, true);
  assert.strictEqual(meadow.grassHeightM, 1.2);
  assert.strictEqual(meadow.footstepsMuffled, true);

  // Challenge and stance
  const stance = sector.adoptKenjutsuStanceAndChallenge();
  assert.strictEqual(stance.success, true);
  assert.strictEqual(stance.hassoStanceAssumed, true);
  assert.strictEqual(stance.falconerCloakDisengaged, true);
  assert.strictEqual(stance.swordDrawn, 'ANTIQUE_HATTORI_HANZO_KATANA');

  // Fatal simultaneous passing strike
  const strike = sector.executeSimultaneousPassingStrike();
  assert.strictEqual(strike.success, true);
  assert.strictEqual(strike.simultaneousSlashExecuted, true);
  assert.strictEqual(strike.falconerCollapsesFirst, true);
  assert.strictEqual(strike.falconerDiedWithHonor, true);
  assert.strictEqual(strike.hanzoFellWithHonor, true);
});

test('v179 Chantier LD 6: Prey1719ComancheQuicksandBogSector calculates non-Newtonian quicksand sinking, applies cold river mud cloak, and traps Feral Predator', () => {
  const sector = new Prey1719ComancheQuicksandBogSector({ bogViscosityPaS: 160.0 });

  // Sinking dynamics
  const sink = sector.calculateQuicksandSinking(60.0, 0.5);
  assert.strictEqual(sink.success, true);
  assert.strictEqual(sink.bogViscosityPaS, 160.0);
  assert.ok(sink.sinkDepthM > 0.4 && sink.sinkDepthM < 1.0);

  // Cold river mud thermal camouflage
  const mud = sector.applyColdRiverMudCamouflage(95.0);
  assert.strictEqual(mud.success, true);
  assert.strictEqual(mud.naruMudCoated, true);
  assert.strictEqual(mud.boneMaskInfraredDetectionPct, 0.0);
  assert.strictEqual(mud.thermalCloakingActive, true);

  // Trap Feral Predator in quicksand
  const trap = sector.trapFeralPredatorInQuicksand();
  assert.strictEqual(trap.success, true);
  assert.strictEqual(trap.feralPredatorBogged, true);
  assert.strictEqual(trap.feralMassKg, 195.0);
  assert.strictEqual(trap.locomotionImmobilizedPct, 85.0);
});

test('v179 Chantier LD 7: Prey1719FeralBoneShieldAndFlechetteSector deploys expandable bone fan shield, deflects musket shot, and redirects 180° flechette', () => {
  const sector = new Prey1719FeralBoneShieldAndFlechetteSector({ shieldDiameterM: 0.85 });

  // Deploy bone fan shield
  const shield = sector.deployBoneFanShield();
  assert.strictEqual(shield.success, true);
  assert.strictEqual(shield.shieldDeployed, true);
  assert.strictEqual(shield.shieldMaterial, 'ALIEN_OBSIDIAN_BONE_AND_ALLOY');

  // Deflect lead musket ball
  const deflection = sector.deflectProjectileWithShield('LEAD_MUSKET_BALL', 1200);
  assert.strictEqual(deflection.success, true);
  assert.strictEqual(deflection.projectileDeflected, true);
  assert.strictEqual(deflection.deflectionClangAcousticDb, 94);

  // Redirect targeting laser back at Feral's own skull
  const lock = sector.lockTriLaserFlechetteTarget(true);
  assert.strictEqual(lock.success, true);
  assert.strictEqual(lock.maskRedirected, true);
  assert.strictEqual(lock.targetEntity, 'FERAL_PREDATOR_OWN_SKULL');

  // Fire flechette -> 180 loop back
  const fire = sector.fireGuidedBoneFlechette();
  assert.strictEqual(fire.success, true);
  assert.strictEqual(fire.trajectoryLoopDeg, 180.0);
  assert.strictEqual(fire.feralDefeatedByOwnFlechette, true);
  assert.strictEqual(fire.naruVictorious, true);
});

test('v179 Chantier LD 8: HumanQaPredatorCampaignHUDDirector evaluates 5 campaign QA audits and mounts multi-era HUD panel', () => {
  const director = new HumanQaPredatorCampaignHUDDirector();

  const auditTelemetry = director.evaluate5CampaignAudits();
  assert.strictEqual(auditTelemetry.auditsCount, 5);
  assert.strictEqual(auditTelemetry.allPassed, true);
  assert.strictEqual(auditTelemetry.compositeUXScore, 99.6);

  const mountResult = director.mountCampaignHUD();
  assert.strictEqual(mountResult.mounted, true);
  assert.strictEqual(mountResult.panelClass, 'predator-multi-era-hud-panel');
  assert.ok(mountResult.subWidgets.includes('netgun-wire-constriction-meter'));
  assert.ok(mountResult.subWidgets.includes('speargun-pneumatic-pressure-gauge'));
  assert.ok(mountResult.subWidgets.includes('bone-shield-deflection-meter'));
});

test('v179 Chantier LD 9: AudioSynthesizer computes net-gun tension & bone shield acoustics and executes 15 new multi-era SFX methods', () => {
  // Test mathematical acoustics
  const netgunAcoustics = audioSynth.computeNetgunWireTensionAcoustics(4500.0, 42.0, 0.85);
  assert.strictEqual(netgunAcoustics.wireTensionN, 4500.0);
  assert.strictEqual(netgunAcoustics.boneCrunchResonanceDb, 87);
  assert.strictEqual(netgunAcoustics.targetPinnedSecurely, true);

  const shieldAcoustics = audioSynth.computeBoneShieldImpactDeflectionAcoustics(1250.0, 1.0, 'LEAD_MUSKET_BALL');
  assert.strictEqual(shieldAcoustics.impactEnergyJoules, 1250.0);
  assert.strictEqual(shieldAcoustics.obsidianResonanceFundamentalHz, 480);
  assert.strictEqual(shieldAcoustics.deflectionIntegrityVerified, true);

  // Test 15 procedural audio methods exist and don't throw
  const audioMethods = [
    'playNetgunLaunchWhooshPneumatic',
    'playNetgunWireConstrictionBoneCrunch',
    'playSpeargunDartDischargeZip',
    'playSpeargunDartSteelWallPenetrationThunk',
    'playElevatorCableTensionSnapWhip',
    'playElevatorCarriagePlummetRumble',
    'playKatanaBladeSteelClashZing',
    'playMoonlitGrassWindFoliageRustle',
    'playFalconerDyingBreathHiss',
    'playQuicksandViscousMudGurgle',
    'playFeralExpandableBoneShieldDeploySnap',
    'playFeralShieldMusketDeflectionClang',
    'playGuidedFlechetteLaserWhistle',
    'playFlechetteSkullImpactCrunch',
    'playSkylightGlassShatterBreach'
  ];

  audioMethods.forEach((method) => {
    assert.strictEqual(typeof audioSynth[method], 'function', `${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method]());
  });
});

test('v179 Chantier LD 10: HumanQaPredatorCampaignAuditor audits all 7 multi-era sectors and generates consolidated campaign compliance report', () => {
  const auditor = new HumanQaPredatorCampaignAuditor();

  const a1 = auditor.auditElScorpioPenthouseSiege({ skylightBreached: true, netGunPinned: true, ramonVegaDefeated: true });
  assert.strictEqual(a1.passes, true);

  const a2 = auditor.auditScrapYardSpeargun({ onCarStackPerch: true, targetImpaledAndPinned: true, muzzleVelocityMps: 180.0 });
  assert.strictEqual(a2.passes, true);

  const a3 = auditor.auditElevatorShaftDescent({ cablesSevered: true, hunterRappelled: true, ledgeSuspensionResolved: true });
  assert.strictEqual(a3.passes, true);

  const a4 = auditor.auditGamePreserveCamp({ monolithsCount: 12, classicPredatorLiberated: true, thermalTrapTriggered: true });
  assert.strictEqual(a4.passes, true);

  const a5 = auditor.auditHanzoKatanaFalconerDuel({ hassoStanceAssumed: true, falconerCloakDisengaged: true, simultaneousSlashExecuted: true });
  assert.strictEqual(a5.passes, true);

  const a6 = auditor.auditComancheQuicksandBog({ thermalCloakingActive: true, feralPredatorBogged: true, bogViscosityPaS: 160.0 });
  assert.strictEqual(a6.passes, true);

  const a7 = auditor.auditFeralBoneShieldAndFlechette({ shieldDeployed: true, projectileDeflected: true, feralDefeatedByOwnFlechette: true });
  assert.strictEqual(a7.passes, true);

  const report = auditor.generateConsolidatedCampaignReport();
  assert.strictEqual(report.version, 'v179');
  assert.strictEqual(report.totalAuditsExecuted, 7);
  assert.strictEqual(report.passedCount, 7);
  assert.strictEqual(report.compliancePct, 100);
  assert.ok(report.drawCallsInvariant.includes('<= 300'));
});
