import { parseAst } from 'rolldown/parseAst';

const PUBLIC_PREFIX = 'virtual:yautja-audio-methods/';
const INTERNAL_PREFIX = `\0${PUBLIC_PREFIX}`;

function contains(node, predicate) {
  if (!node || typeof node !== 'object') return false;
  if (predicate(node)) return true;
  return Object.values(node).some(value => Array.isArray(value)
    ? value.some(child => contains(child, predicate))
    : contains(value, predicate));
}

/**
 * Keep every method, including late overrides, while moving method definitions
 * to separately cacheable modules. Descriptor installation preserves class
 * method flags, names, arity and definition order before constructing the engine.
 * Unsupported lexical features return null rather than changing their meaning.
 */
export function splitAudioMethods(source, { maxPartBytes = 220000 } = {}) {
  if (!Number.isFinite(maxPartBytes) || maxPartBytes < 1) throw new RangeError('Invalid audio chunk budget.');
  const program = parseAst(source);
  const declaration = program.body.find(node => node.type === 'ClassDeclaration');
  if (!declaration || declaration.id?.name !== 'AudioSynthesizer' || declaration.superClass) return null;
  if (program.body.length !== 2 || program.body[1].type !== 'ExportNamedDeclaration') return null;
  const exported = program.body[1].declaration;
  const instance = exported?.declarations?.[0];
  if (exported?.type !== 'VariableDeclaration' || exported.kind !== 'const' || exported.declarations.length !== 1
    || instance.id?.name !== 'audioSynth' || instance.init?.type !== 'NewExpression'
    || instance.init.callee?.name !== 'AudioSynthesizer') return null;
  const members = declaration.body.body;
  if (members.some(member => member.type !== 'MethodDefinition' || member.static || member.computed
    || !['constructor', 'method'].includes(member.kind) || member.key.type !== 'Identifier')) return null;
  const constructor = members.find(member => member.kind === 'constructor');
  const methods = members.filter(member => member !== constructor);
  if (!constructor || !methods.length) return null;
  if (methods.some(method => contains(method.value, node => node.type === 'Super' || node.type === 'PrivateIdentifier'
    || node.type === 'MetaProperty' || (node.type === 'Identifier' && ['AudioSynthesizer', 'audioSynth', 'eval'].includes(node.name))))) return null;

  const groups = [];
  let group = [], groupBytes = 0;
  for (const method of methods) {
    const text = source.slice(method.start, method.end);
    const bytes = Buffer.byteLength(text, 'utf8');
    if (bytes > maxPartBytes) return null;
    if (group.length && groupBytes + bytes > maxPartBytes) {
      groups.push(group);
      group = [];
      groupBytes = 0;
    }
    group.push(text);
    groupBytes += bytes;
  }
  if (group.length) groups.push(group);
  const parts = groups.map((texts, index) => ({
    id: `${PUBLIC_PREFIX}${index}`,
    code: `export class AudioMethods {\n${texts.join('\n')}\n}\n`,
  }));
  const imports = parts.map((part, index) => `import { AudioMethods as AudioMethods${index} } from ${JSON.stringify(part.id)};`).join('\n');
  const code = `${imports}\n${source.slice(0, declaration.start)}\nclass AudioSynthesizer {\n${source.slice(constructor.start, constructor.end)}\n}\n`
    + `for (const Methods of [${parts.map((_, index) => `AudioMethods${index}`).join(',')}]) {\n`
    + '  const descriptors = Object.getOwnPropertyDescriptors(Methods.prototype);\n'
    + '  delete descriptors.constructor;\n'
    + '  Object.defineProperties(AudioSynthesizer.prototype, descriptors);\n'
    + `}\n${source.slice(declaration.end)}`;
  return { code, parts, declarationCount: members.length, methodCount: new Set(methods.map(method => method.key.name)).size };
}

export function audioMethodChunkName(id) {
  return id.startsWith(INTERNAL_PREFIX) ? `game-audio-methods-${id.slice(INTERNAL_PREFIX.length)}` : null;
}

/** Vite applies this only to production builds; Node and development keep source APIs. */
export function audioMethodChunksPlugin() {
  const parts = new Map();
  return {
    name: 'yautja-audio-method-chunks',
    buildStart() { parts.clear(); },
    resolveId(id) { return id.startsWith(PUBLIC_PREFIX) ? `\0${id}` : null; },
    load(id) { return parts.get(id) ?? null; },
    transform(source, id) {
      if (!/[\\/]src[\\/]AudioSynthesizer\.js$/.test(id)) return null;
      const result = splitAudioMethods(source);
      if (!result) {
        this.warn('Audio chunk split skipped: unsupported lexical structure; the complete source is preserved.');
        return null;
      }
      for (const part of result.parts) parts.set(`\0${part.id}`, part.code);
      return { code: result.code, map: null };
    },
  };
}
