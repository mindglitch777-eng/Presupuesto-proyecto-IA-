// Montos de los guiones. En "say" y "onScreen":
//   {$corte*12}   → plata. En pantalla: "$120.000". En la voz: [[120000]] (voz.py lo lee "ciento veinte mil pesos").
//   {#diasPrueba} → número suelto. En pantalla: "14". En la voz: {{14}} (se lee "catorce").
// Las variables salen de videos/config.js (corte, sena, mensual, fundador, diasPrueba).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function cargarConfig() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(RAIZ, 'videos/config.js'), 'utf8'), ctx);
  return ctx.window.CFG;
}

const calc = (expr, cfg) => Math.round(vm.runInNewContext(expr, { ...cfg }));
export const pesos = (n) => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('es-AR');

// modo: 'pantalla' (texto legible), 'voz' (marcas para voz.py)
export function expandir(texto, cfg, modo) {
  return texto
    .replace(/\{\$([^}]+)\}/g, (_, e) => { const n = calc(e, cfg); return modo === 'voz' ? `[[${n}]]` : pesos(n); })
    .replace(/\{#([^}]+)\}/g, (_, e) => { const n = calc(e, cfg); return modo === 'voz' ? `{{${n}}}` : String(n); });
}
