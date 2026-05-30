#!/usr/bin/env node
// audit-anchors.mjs — Verifica que toda referencia `general-definition.md#<ancla>`
// en los derivados apunte a un heading real de la canónica.
// Uso: `node .github/hooks/audit-anchors.mjs` desde la raíz del repo.
// Exit 0 si OK, 1 si hay anclas rotas.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CANON = 'general-definition.md';

// Slug-ificador estilo GitHub: lower, espacios→-, quita signos no [\w-áéíóúüñ·],
// colapsa guiones múltiples. Suficiente para anclas markdown del repo.
function slugify(heading) {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[`*_~]+/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

// 1. Cosechar headings reales de la canónica
const canonText = readFileSync(join(ROOT, CANON), 'utf8');
const anchors = new Set();
for (const line of canonText.split('\n')) {
  const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
  if (m) anchors.add(slugify(m[1]));
}

// 2. Recolectar archivos .md en derivados (AGENTS.md + todo .github/)
const TARGETS = ['AGENTS.md', '.github'];
const files = [];
function walk(p) {
  const abs = join(ROOT, p);
  let st;
  try { st = statSync(abs); } catch { return; }
  if (st.isDirectory()) {
    for (const name of readdirSync(abs)) walk(join(p, name));
  } else if (p.endsWith('.md')) {
    files.push(p);
  }
}
for (const t of TARGETS) walk(t);

// 3. Buscar refs y validar
const broken = [];
const linkRE = /general-definition\.md#([\p{L}\p{N}\-_·]+)/giu;
for (const f of files) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const match of line.matchAll(linkRE)) {
      const anchor = match[1];
      if (!anchors.has(anchor)) {
        broken.push({ file: f, line: i + 1, anchor });
      }
    }
  });
}

if (broken.length === 0) {
  console.log(`✓ audit-anchors OK · ${anchors.size} anclas vivas · ${files.length} derivados`);
  process.exit(0);
}

console.error(`✗ audit-anchors FAIL · ${broken.length} anclas rotas:`);
for (const b of broken) {
  console.error(`  ${b.file}:${b.line} → #${b.anchor}`);
}
console.error(`\nAnclas válidas en ${CANON} (${anchors.size}): use estas o añada el heading correspondiente.`);
process.exit(1);
