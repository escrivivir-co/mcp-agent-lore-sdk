#!/usr/bin/env node
// upgrade-docs.mjs — Compara el snapshot local del skill copilot-platform
// con las URLs canónicas declaradas en .meta/manifest.md.
// Uso: `node .github/skills/copilot-platform/scripts/upgrade-docs.mjs`
// Con `--apply` (y tras consenso del usuario) sobreescribe los docs cambiados y
// actualiza la entrada del historial en .meta/manifest.md.
// Exit 0 si todo OK o si el usuario no pasa --apply; exit 1 si fetch falla.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dir = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dir, '..');
const MANIFEST = join(SKILL_ROOT, '.meta', 'manifest.md');
const APPLY = process.argv.includes('--apply');

// 1. Parsear mapeo archivo → URL desde el manifest
const manifestText = readFileSync(MANIFEST, 'utf8');
const tableRE = /\|\s*`(docs\/[^`]+)`\s*\|\s*(https?:\/\/\S+)\s*\|/g;
const mapping = [];
for (const m of manifestText.matchAll(tableRE)) {
  mapping.push({ local: join(SKILL_ROOT, m[1]), url: m[2], rel: m[1] });
}

if (mapping.length === 0) {
  console.error('✗ No se encontró la tabla de mapeo en el manifest.');
  process.exit(1);
}

console.log(`Verificando ${mapping.length} docs contra fuentes remotas...\n`);

// 2. Fetch + diff
const results = [];
for (const entry of mapping) {
  let local;
  try { local = readFileSync(entry.local, 'utf8'); } catch { local = ''; }
  const localHash = createHash('sha256').update(local).digest('hex').slice(0, 8);

  let remote;
  try {
    const res = await fetch(entry.url, { headers: { 'User-Agent': 'copilot-platform-upgrader/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remote = await res.text();
  } catch (e) {
    console.error(`  ✗ FETCH FAIL  ${entry.rel} — ${e.message}`);
    results.push({ ...entry, status: 'fetch-error', remote: null, localHash });
    continue;
  }

  const remoteHash = createHash('sha256').update(remote).digest('hex').slice(0, 8);
  const changed = localHash !== remoteHash;
  const status = changed ? 'changed' : 'unchanged';

  if (changed) {
    console.log(`  ↻ CHANGED     ${entry.rel}  (local: ${localHash} → remote: ${remoteHash})`);
  } else {
    console.log(`  ✓ unchanged   ${entry.rel}`);
  }
  results.push({ ...entry, status, remote, localHash, remoteHash });
}

const changed = results.filter(r => r.status === 'changed');
const errors  = results.filter(r => r.status === 'fetch-error');

console.log(`\nResumen: ${changed.length} cambiados · ${results.filter(r => r.status === 'unchanged').length} sin cambios · ${errors.length} errores de fetch`);

if (changed.length === 0 && errors.length === 0) {
  console.log('✓ Todos los docs están al día.');
  process.exit(0);
}

if (errors.length > 0) {
  console.error('\nAlgunos fetches fallaron. Verifica conectividad o que las URLs del manifest sigan siendo válidas.');
}

if (changed.length > 0 && !APPLY) {
  console.log('\nPara aplicar los cambios, ejecuta con --apply DESPUÉS de revisar los deltas:');
  console.log('  node .github/skills/copilot-platform/scripts/upgrade-docs.mjs --apply');
  console.log('\nIMPORTANTE: revisar cada doc cambiado antes de aplicar.');
  process.exit(0);
}

// 3. Aplicar si --apply
if (APPLY && changed.length > 0) {
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of changed) {
    writeFileSync(entry.local, entry.remote, 'utf8');
    console.log(`  ✔ Actualizado ${entry.rel}`);
  }

  // Añadir fila al historial del manifest
  const histRow = `| ${today} | (modelo desconocido — ejecutar manualmente) | upgrade --apply | ${changed.map(e => e.rel).join(', ')} actualizados |`;
  const updatedManifest = manifestText.replace(
    /(\|\s*Fecha\s*\|[\s\S]+?)\n$/m,
    `$1\n${histRow}\n`
  );
  writeFileSync(MANIFEST, updatedManifest, 'utf8');
  console.log('\n✓ Manifest actualizado con entrada de historial.');
  console.log('Recuerda: actualizar la línea `snapshot_date` en el manifest y firmar el modelo que realizó el upgrade.');
}

process.exit(errors.length > 0 ? 1 : 0);
