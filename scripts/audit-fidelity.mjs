/** Read-only source/runtime inventory. No renderer, network or paid API calls. */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parseAst } from 'rolldown/parseAst';
import { getFidelityCoverage } from '../src/data/FidelityCoverage.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const outputIndex = process.argv.indexOf('--output');
const output = resolve(outputIndex >= 0 ? process.argv[outputIndex + 1] : '/tmp/yautja-fidelity');
const liveShip = process.argv.includes('--live-ship');
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.vercel', 'scratch']);

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) files.push(...await filesUnder(resolve(directory, entry.name)));
    else if (entry.isFile()) files.push(resolve(directory, entry.name));
  }
  return files;
}

async function staticGraph(entryFile) {
  const reachable = new Set(), errors = [], dynamicUnknown = [], externals = new Set();
  async function visit(file) {
    if (reachable.has(file)) return;
    reachable.add(file);
    let ast;
    try { ast = parseAst(await readFile(file, 'utf8')); }
    catch (error) { errors.push({ file: relative(root, file), error: error.message }); return; }
    const dependencies = [];
    for (const node of ast.body) {
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) dependencies.push(node.source.value);
    }
    const pending = [ast];
    while (pending.length) {
      const node = pending.pop();
      if (!node || typeof node !== 'object') continue;
      if (node.type === 'ImportExpression') {
        if (typeof node.source?.value === 'string') dependencies.push(node.source.value);
        else dynamicUnknown.push({ file: relative(root, file), position: node.start });
      }
      for (const child of Object.values(node)) {
        if (Array.isArray(child)) pending.push(...child);
        else if (child && typeof child === 'object') pending.push(child);
      }
    }
    for (const specifier of dependencies) {
      if (specifier.startsWith('.')) await visit(resolve(dirname(file), specifier));
      else externals.add(specifier);
    }
  }
  await visit(entryFile);
  return { reachable, errors, dynamicUnknown, externals: [...externals].sort() };
}

let ship;
try {
  if (liveShip) {
    const [{ Scene }, { MothershipHub }] = await Promise.all([import('three'), import('../src/world/MothershipHub.js')]);
    ship = new MothershipHub(new Scene());
  }
  const coverage = getFidelityCoverage({ ship });
  const files = await filesUnder(root);
  const graph = await staticGraph(resolve(root, 'src/main.js'));
  const sectorFiles = files.filter(file => /Sector\.js$/.test(file));
  const assetPaths = [...new Set(coverage.entries.flatMap(entry => entry.implementation.textures.assets))].sort();
  const assets = [];
  for (const path of assetPaths) {
    const file = resolve(root, 'public' + path);
    if (!existsSync(file)) { assets.push({ path, present: false }); continue; }
    const data = await readFile(file);
    assets.push({ path, present: true, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
  }
  const sourceFiles = [...new Set(coverage.entries.flatMap(entry => [
    ...entry.implementation.model.bindings, ...entry.implementation.mechanics.bindings,
  ]).filter(value => typeof value === 'string' && value.startsWith('src/')))].sort();
  const missingSourceFiles = sourceFiles.filter(file => !existsSync(resolve(root, file)));
  const gapCounts = {};
  for (const entry of coverage.entries) for (const gap of entry.missing) gapCounts[gap] = (gapCounts[gap] ?? 0) + 1;
  const report = {
    generatedAt: new Date().toISOString(),
    head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    workingTree: execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean),
    method: 'Static catalogue and renderer registry correspondence; no screenshot, primary-work or 1:1 certification.',
    shipInventory: liveShip ? 'live_hub_cpu_construction' : 'f3e375b_registry_snapshot',
    summary: coverage.summary, categories: coverage.categories, gapCounts,
    sourceDocuments: {
      scope: 'repository_checkout',
      spreadsheets: files.filter(file => ['.xlsx', '.xls', '.csv'].includes(extname(file))).map(file => relative(root, file)),
      blenderSources: files.filter(file => extname(file) === '.blend').map(file => relative(root, file)),
      projectReferenceDocuments: ['README.md', 'ASSET_MANIFEST.md', 'ASSET_GENERATION_PROMPTS.md', 'HERO_REALISM_REVIEW.md', 'GRAPHICS_REVIEW.md']
        .filter(file => existsSync(resolve(root, file))),
      documentedWorkbook: { filename: 'Encyclopedie_exhaustive_franchise_Predator.xlsx', claimedEntryCount: 915,
        claimedSha256: '47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C',
        citationFile: 'README.md', workbookContentsReadByThisAudit: false, hashVerifiedByThisAudit: false },
      projectAssetProvenanceStatement: 'ASSET_MANIFEST.md describes original procedural/OpenAI assets; a manifest is not proof of cinematic reproduction.',
    },
    runtimeGraph: {
      entry: 'src/main.js', reachableLocalModules: graph.reachable.size,
      sectorFiles: sectorFiles.length,
      staticallyReachableSectors: sectorFiles.filter(file => graph.reachable.has(file)).map(file => relative(root, file)),
      notStaticallyReachableSectorCount: sectorFiles.filter(file => !graph.reachable.has(file)).length,
      dynamicImportsNotResolved: graph.dynamicUnknown, errors: graph.errors,
      caveat: 'Static reachability is not proof of a functional playable level.',
    },
    implementationSourceFiles: sourceFiles.map(file => ({ path: file, present: existsSync(resolve(root, file)) })),
    referencedAssets: assets,
    coverage,
  };
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output, 'coverage.json'), JSON.stringify(report, null, 2));
  const { coverage: omitted, ...summary } = report;
  await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2));
  const csv = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  const rows = [['key', 'name', 'status', 'source', 'sourceIds', 'model', 'bindings', 'missing'],
    ...coverage.entries.map(entry => [entry.key, entry.name, entry.status, entry.source.declaredTitle,
      entry.source.sourceIds.join(' | '), entry.implementation.model.status,
      entry.implementation.model.bindings.join(' | '), entry.missing.join(' | ')])];
  await writeFile(resolve(output, 'coverage.csv'), rows.map(row => row.map(csv).join(',')).join('\n') + '\n');
  console.log(JSON.stringify({ output, records: coverage.summary.records, trainingDossiers: coverage.summary.trainingDossiers,
    matchingSubjectModels: coverage.summary.matchingSubjectTrainingDossiers,
    graphErrors: graph.errors.length, missingAssets: assets.filter(asset => !asset.present).length }));
  if (graph.errors.length || missingSourceFiles.length || assets.some(asset => !asset.present)) process.exitCode = 1;
} finally { ship?.dispose(); }
