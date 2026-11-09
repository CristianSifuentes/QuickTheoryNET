#!/usr/bin/env node
/**
 * Verifica que cada enlace relativo y cada ancla (#…) de README.md y docs/*.md existan,
 * calculando los identificadores de los títulos como lo hace GitHub.
 *
 * Uso:  node tools/verificar-enlaces.mjs   (o  npm run verificar)  · sale con código 1 si hay enlaces rotos
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archivos = ['README.md', ...fs.readdirSync(path.join(RAIZ, 'docs')).filter(f => f.endsWith('.md')).map(f => `docs/${f}`)];

// Slug de GitHub: quita formato, minúsculas, conserva letras y números Unicode, guiones y guiones bajos; espacio → guion; duplicados con -1, -2…
function anclas(texto) {
  const vistas = new Map(), res = new Set();
  const sinCodigo = texto.replace(/```[\s\S]*?```/g, '');
  for (const m of sinCodigo.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const plano = m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[`*_~]/g, (c) => (c === '_' ? '_' : ''));
    const base = plano.trim().toLowerCase().replace(/[^\p{L}\p{N}\p{M} \-_]/gu, '').replace(/ /g, '-');
    const n = vistas.get(base) ?? 0;
    vistas.set(base, n + 1);
    res.add(n ? `${base}-${n}` : base);
  }
  return res;
}

const cache = new Map();
const anclasDe = f => { if (!cache.has(f)) cache.set(f, anclas(fs.readFileSync(f, 'utf8'))); return cache.get(f); };

let rotos = 0, total = 0;
for (const rel of archivos) {
  const f = path.join(RAIZ, rel);
  const texto = fs.readFileSync(f, 'utf8').replace(/```[\s\S]*?```/g, '');
  const enlaces = [...texto.matchAll(/\]\(([^)\s]+)\)/g), ...texto.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const e of enlaces) {
    if (/^(https?:|mailto:)/.test(e)) continue;
    total++;
    const [ruta, ancla] = e.split('#');
    const destino = ruta ? path.resolve(path.dirname(f), decodeURI(ruta)) : f;
    if (!fs.existsSync(destino)) { console.log(`✗ ${rel}: no existe ${e}`); rotos++; continue; }
    if (ancla && destino.endsWith('.md') && !anclasDe(destino).has(decodeURIComponent(ancla))) {
      console.log(`✗ ${rel}: ancla inexistente ${e}`); rotos++;
    }
  }
}
console.log(rotos ? `\n${rotos} enlaces rotos de ${total}.` : `✓ ${total} enlaces relativos verificados en ${archivos.length} archivos, ninguno roto.`);
process.exit(rotos ? 1 : 0);
