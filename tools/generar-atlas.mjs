#!/usr/bin/env node
/**
 * Genera los artefactos derivados del Atlas de servicios Azure.
 *
 * Fuente única de verdad: el bloque DATOS de index.html (ROLES, S, A, BK, DT, RES).
 * Así la página interactiva y la documentación nunca se contradicen.
 *
 * Salidas:
 *   data/atlas.json                         ← datos + matriz de papeles, legibles por máquina
 *   assets/atlas-banner.svg                 ← portada
 *   assets/atlas-frase.svg                  ← anatomía de la frase
 *   assets/atlas-tabla-periodica.svg        ← 45 servicios con su valencia
 *   assets/atlas-matriz.svg                 ← servicio × arquitectura: el papel de cada uno
 *   docs/10-un-servicio-muchos-papeles.md   ← solo el bloque entre marcadores
 *   docs/11-trece-arquitecturas-como-frases.md
 *   docs/12-brokers-quien-escribe-quien-lee.md
 *   docs/13-guia-de-decision.md
 *   docs/15-catalogo-a-z.md
 *
 * Uso:  node tools/generar-atlas.mjs      (o  npm run atlas)   · Node 18+, sin dependencias
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDICION = 'noviembre 2026';
const FUENTE = "Segoe UI, Inter, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'IBM Plex Mono', 'JetBrains Mono', Consolas, monospace";

/* ------------------------------------------------------------------ datos */
function leerDatos() {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const ini = '/* ===================== DATOS ===================== */';
  const fin = '/* ===================== ESTADO';
  if (!html.includes(ini) || !html.includes(fin)) throw new Error('No encuentro el bloque DATOS en index.html');
  const src = html.split(ini)[1].split(fin)[0];
  return vm.runInNewContext(`${src};({ROLES,SP,S,CATS,A,BK_KEYS,BK,DT,RES,PROV})`);
}
const D = leerDatos();
const { ROLES, SP, S, CATS, A, BK_KEYS, BK, DT, RES } = D;

const ORDEN_ROL = ['P', 'B', 'C', 'D', 'S', 'X'];
const VERBO = { P: 'produce', B: 'transporta', C: 'consume', D: 'guarda', S: 'entrega', X: 'envuelve' };
const CIRC = { P: 'Ⓟ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', S: 'Ⓢ', X: 'Ⓧ' };
const COLOR = { P: '#2DD4BF', B: '#A78BFA', C: '#FB923C', D: '#60A5FA', S: '#A3E635', X: '#94A3B8' };
const FONDO = { P: '#042F2E', B: '#1E1B4B', C: '#3B1D0A', D: '#0C2744', S: '#1A2E05', X: '#1E293B' };
const ICONO_SP = { usa: '🟢', parcial: '🟡', objetivo: '🔷', no: '·' };
const COLOR_SP = { usa: '#34D399', parcial: '#FACC15', objetivo: '#38BDF8', no: '#334155' };

// Capítulo de cada papel (y de cada familia transversal)
const CAP = {
  P: '02-produce.md', B: '03-transporta.md', C: '04-consume.md', D: '05-guarda.md', S: '06-entrega.md',
  Identidad: '07-identidad.md', Red: '08-red.md', Observabilidad: '09-observabilidad.md', DevOps: '09-observabilidad.md',
};

// Símbolo químico de cada servicio (para la tabla periódica)
const SIMBOLO = {
  eventgrid: 'Eg', egns: 'Mq', servicebus: 'Sb', eventhubs: 'Eh', storagequeue: 'Sq', iothub: 'Io',
  signalr: 'Sr', webpubsub: 'Wp', notifhubs: 'Nh', aks: 'Ak', aca: 'Ca', appservice: 'As', functions: 'Fn',
  durable: 'Df', logicapps: 'La', keda: 'Kd', dapr: 'Dp', apim: 'Am', frontdoor: 'Fd', appgw: 'Ag',
  sql: 'Sq', cosmos: 'Cs', postgres: 'Pg', redis: 'Rd', blob: 'Bl', aisearch: 'Ai', adx: 'Kx', fabric: 'Fb',
  asa: 'Sa', databricks: 'Db', powerbi: 'Pb', acs: 'Ac', graph: 'Gr', devices: 'Dv', web: 'Ui', code: 'Nt',
  entra: 'En', mi: 'Mi', kv: 'Kv', appconfig: 'Cf', vnet: 'Vn', pe: 'Pe', appi: 'Ob', acr: 'Cr', devops: 'Ci',
};
SIMBOLO.storagequeue = 'Qu';
Object.assign(SIMBOLO, { synapse: 'Sy', adf: 'Fa', aoai: 'Oa', aml: 'Ml', onprem: 'Op', azlocal: 'Lo', arc: 'Ar', expressroute: 'Er' });
const CORTO = {
  egns: 'Event Grid namespaces', acs: 'Comm. Services', web: 'Clientes', devices: 'Dispositivos', mi: 'Managed Identity',
  pe: 'Private Endpoint', appi: 'App Insights', blob: 'Blob / ADLS', adx: 'Data Explorer', fabric: 'Fabric RTI',
  aoai: 'Azure OpenAI', aml: 'Machine Learning', onprem: 'On-premises', expressroute: 'ExpressRoute / VPN',
  redis: 'Managed Redis', postgres: 'PostgreSQL', appgw: 'App Gateway', functions: 'Functions', durable: 'Durable Functions',
};

/* --------------------------------------------- matriz servicio × arquitectura */
const MATRIZ = {}; // MATRIZ[svc][arq] = Set(roles)
for (const a of A) {
  for (const l of a.lanes) for (const [id] of l.i) ((MATRIZ[id] ??= {})[a.id] ??= new Set()).add(l.r);
  for (const id of a.x) ((MATRIZ[id] ??= {})[a.id] ??= new Set()).add('X');
}
const ordenRoles = set => ORDEN_ROL.filter(r => set.has(r));
function perfil(id) {
  const m = MATRIZ[id] || {};
  const todos = new Set();
  const cuenta = Object.fromEntries(ORDEN_ROL.map(r => [r, 0]));
  for (const s of Object.values(m)) for (const r of s) { todos.add(r); cuenta[r]++; }
  const funcionales = ORDEN_ROL.filter(r => r !== 'X' && todos.has(r));
  const primario = funcionales.length
    ? funcionales.reduce((x, y) => (cuenta[y] > cuenta[x] ? y : x))
    : (todos.has('X') ? 'X' : (S[id].cat === 'Fuentes' ? 'P' : 'X'));
  return { roles: ordenRoles(todos), cuenta, arqs: Object.keys(m).length, primario, valencia: todos.size };
}
const PERFIL = Object.fromEntries(Object.keys(S).map(id => [id, perfil(id)]));
const capDe = id => {
  const p = PERFIL[id].primario;
  return p === 'X' ? (CAP[S[id].cat] || '07-identidad.md') : CAP[p];
};
const nombre = id => S[id]?.n ?? id;
const glifos = roles => roles.map(r => CIRC[r]).join(' ');
const arqPorId = id => A.find(a => a.id === id);
const sinTildes = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const md = t => String(t ?? '').replace(/\|/g, '\\|');
const recorta = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);

const PALABRA = ['Cero','Una','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Once','Doce','Trece','Catorce','Quince','Dieciséis'];
const NARQ = PALABRA[A.length] ?? String(A.length);
const POLISEMICOS = Object.keys(S)
  .filter(id => PERFIL[id].roles.filter(r => r !== 'X').length >= 2 || (PERFIL[id].roles.length >= 2 && PERFIL[id].roles.includes('X')))
  .sort((a, b) => PERFIL[b].valencia - PERFIL[a].valencia || PERFIL[b].arqs - PERFIL[a].arqs);

const CIFRAS = {
  servicios: Object.keys(S).length,
  arquitecturas: A.length,
  brokers: BK.length,
  familias: CATS.length,
  polisemicos: POLISEMICOS.length,
  apariciones: Object.values(MATRIZ).reduce((n, m) => n + Object.values(m).reduce((k, s) => k + s.size, 0), 0),
  tracer: Object.fromEntries(Object.keys(SP).map(k => [k, Object.values(S).filter(s => s.sp === k).length])),
};

/* ------------------------------------------------------------------ util */
function escribir(rel, contenido) {
  const f = path.join(RAIZ, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, contenido.endsWith('\n') ? contenido : contenido + '\n');
  console.log('  ✓', rel);
}
const AVISO = '<!-- Archivo generado por tools/generar-atlas.mjs a partir de index.html. No lo edites a mano: edita index.html y ejecuta `npm run atlas`. -->';

function defsComunes() {
  return `<defs>
<linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#030712"/><stop offset="0.55" stop-color="#0A1424"/><stop offset="1" stop-color="#101C33"/></linearGradient>
<radialGradient id="haloA" cx="0.88" cy="0.08" r="0.7"><stop offset="0" stop-color="#A78BFA" stop-opacity="0.22"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0"/></radialGradient>
<radialGradient id="haloB" cx="0.06" cy="0.96" r="0.6"><stop offset="0" stop-color="#2DD4BF" stop-opacity="0.18"/><stop offset="1" stop-color="#2DD4BF" stop-opacity="0"/></radialGradient>
<pattern id="rejilla" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#FFFFFF" stroke-opacity="0.035"/></pattern>
<linearGradient id="trazo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${COLOR.P}"/><stop offset="0.25" stop-color="${COLOR.B}"/><stop offset="0.5" stop-color="${COLOR.C}"/><stop offset="0.75" stop-color="${COLOR.D}"/><stop offset="1" stop-color="${COLOR.S}"/></linearGradient>
<marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#CBD5E1"/></marker>
</defs>`;
}
const fondo = (w, h) => `<rect width="${w}" height="${h}" fill="url(#fondo)"/><rect width="${w}" height="${h}" fill="url(#rejilla)"/><rect width="${w}" height="${h}" fill="url(#haloA)"/><rect width="${w}" height="${h}" fill="url(#haloB)"/>`;

/* ================================================================= BANNER */
function banner() {
  const W = 1600, H = 460;
  const xs = [190, 470, 750, 1030, 1310];
  const roles = ['P', 'B', 'C', 'D', 'S'];
  const ej = { P: 'ACS · Graph · tu API', B: 'Event Grid · Service Bus · Event Hubs', C: 'Functions · AKS · Container Apps', D: 'Azure SQL · Cosmos DB · Redis', S: 'SignalR · Power BI · Notification Hubs' };
  let nodos = '';
  roles.forEach((r, i) => {
    const x = xs[i] + 50;
    nodos += `<g transform="translate(${x},330)">
<circle r="40" fill="${FONDO[r]}" stroke="${COLOR[r]}" stroke-width="3"/>
<text y="13" font-size="38" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text>
<text y="-56" font-size="22" font-weight="700" fill="#F8FAFC" text-anchor="middle">${['Alguien', 'Algo', 'Alguien', 'Algo', 'Algo'][i]} ${VERBO[r]}</text>
<text y="72" font-size="14.5" fill="#94A3B8" text-anchor="middle">${esc(ej[r])}</text></g>`;
  });
  let flechas = '';
  for (let i = 0; i < 4; i++) flechas += `<line x1="${xs[i] + 96}" y1="330" x2="${xs[i + 1] + 4}" y2="330" stroke="#CBD5E1" stroke-opacity="0.75" stroke-width="2.5" marker-end="url(#flecha)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FUENTE}" role="img" aria-labelledby="t">
<title id="t">Atlas de servicios Azure · Toda arquitectura se lee como una frase</title>
${defsComunes()}${fondo(W, H)}
<g transform="translate(76,58)">
  <rect x="0" y="0" width="108" height="108" rx="22" fill="#0A1424" stroke="url(#trazo)" stroke-width="3"/>
  <g font-family="${MONO}" font-size="21" font-weight="800" text-anchor="middle">
    <text x="30" y="44" fill="${COLOR.P}">P</text><text x="54" y="44" fill="${COLOR.B}">B</text><text x="78" y="44" fill="${COLOR.C}">C</text>
    <text x="42" y="76" fill="${COLOR.D}">D</text><text x="66" y="76" fill="${COLOR.S}">S</text>
  </g>
  <rect x="10" y="88" width="88" height="6" rx="3" fill="${COLOR.X}" fill-opacity="0.7"/>
</g>
<text x="214" y="96" font-size="17" font-weight="600" letter-spacing="3" fill="#94A3B8">ATLAS-AZURE · SISTEMAS DISTRIBUIDOS</text>
<text x="212" y="152" font-size="64" font-weight="800" fill="#F8FAFC">Atlas de servicios <tspan fill="#A78BFA">Azure</tspan></text>
<text x="214" y="194" font-size="24" fill="#CBD5E1">Toda arquitectura se lee como una frase · ${CIFRAS.servicios} servicios · ${CIFRAS.arquitecturas} arquitecturas · ${CIFRAS.brokers} brokers · ${EDICION}</text>
<rect x="104" y="240" width="1392" height="196" rx="30" fill="none" stroke="${COLOR.X}" stroke-opacity="0.55" stroke-width="2" stroke-dasharray="7 7"/>
<rect x="90" y="226" width="1420" height="224" rx="38" fill="none" stroke="${COLOR.X}" stroke-opacity="0.32" stroke-width="2" stroke-dasharray="3 7"/>
<rect x="118" y="254" width="1364" height="168" rx="22" fill="none" stroke="${COLOR.X}" stroke-opacity="0.8" stroke-width="2"/>
<rect x="1088" y="230" width="400" height="22" fill="#0E1A2F"/>
<text x="1476" y="246" font-size="13" fill="#CBD5E1" text-anchor="end" letter-spacing="2">IDENTIDAD · RED · OBSERVABILIDAD ENVUELVEN TODO</text>
${flechas}${nodos}
</svg>`;
}

/* ========================================================== ANATOMÍA FRASE */
function frase() {
  const W = 1600, H = 1110;
  const cols = ['P', 'B', 'C', 'D', 'S'];
  const gram = {
    P: ['Sujeto', '¿Quién inicia?', 'Un hecho, una orden o una medición', 'Publica sin saber quién escucha'],
    B: ['Verbo', '¿Cómo viaja?', 'Fija orden, retención y entrega', 'No decide: solo garantiza'],
    C: ['Objeto', '¿Quién reacciona?', 'Recibe, decide y transforma', 'Idempotente o no es consumidor'],
    D: ['Tiempo', '¿Qué permanece?', 'Fuente de verdad o vista derivada', 'Lo único que sobrevive al reinicio'],
    S: ['Destinatario', '¿A quién llega?', 'Una persona, en segundos', 'Avisa; la verdad se relee'],
  };
  const top = r => Object.keys(S).filter(id => MATRIZ[id] && Object.values(MATRIZ[id]).some(s => s.has(r)))
    .sort((a, b) => PERFIL[b].cuenta[r] - PERFIL[a].cuenta[r]).slice(0, 6);
  const cw = 262, gap = 22, x0 = (W - (cw * 5 + gap * 4)) / 2, y0 = 330;
  let cards = '';
  cols.forEach((r, i) => {
    const x = x0 + i * (cw + gap);
    const lista = top(r).map((id, k) => `<text x="22" y="${226 + k * 27}" font-size="16" fill="#E2E8F0">${esc(recorta(nombre(id), 24))}<tspan fill="${COLOR[r]}" font-family="${MONO}" font-size="13">  ×${PERFIL[id].cuenta[r]}</tspan></text>`).join('');
    cards += `<g transform="translate(${x},${y0})">
<rect width="${cw}" height="400" rx="20" fill="${FONDO[r]}" fill-opacity="0.85" stroke="${COLOR[r]}" stroke-width="2"/>
<rect width="${cw}" height="8" rx="4" fill="${COLOR[r]}"/>
<text x="22" y="64" font-size="50" font-weight="800" fill="${COLOR[r]}" font-family="${MONO}">${r}</text>
<text x="${cw - 22}" y="46" font-size="14" fill="#94A3B8" text-anchor="end" letter-spacing="2">${gram[r][0].toUpperCase()}</text>
<text x="${cw - 22}" y="68" font-size="24" font-weight="800" fill="#F8FAFC" text-anchor="end">${VERBO[r]}</text>
<text x="22" y="108" font-size="17" font-weight="700" fill="#F8FAFC">${esc(gram[r][1])}</text>
<text x="22" y="132" font-size="14.5" fill="#CBD5E1">${esc(gram[r][2])}</text>
<text x="22" y="158" font-size="13.5" fill="#94A3B8" font-style="italic">${esc(gram[r][3])}</text>
<line x1="22" y1="184" x2="${cw - 22}" y2="184" stroke="${COLOR[r]}" stroke-opacity="0.35"/>
<text x="22" y="204" font-size="12" fill="#94A3B8" letter-spacing="1.5">QUIÉN LO HACE · VECES</text>
${lista}</g>`;
  });
  let flechas = '';
  for (let i = 0; i < 4; i++) {
    const x = x0 + (i + 1) * (cw + gap) - gap;
    flechas += `<line x1="${x - 2}" y1="${y0 + 36}" x2="${x + gap + 2}" y2="${y0 + 36}" stroke="#CBD5E1" stroke-width="2.5" marker-end="url(#flecha)"/>`;
  }
  // Las tres envolturas: anillos concéntricos alrededor de la frase, cada uno rotulado sobre su borde
  const env = [
    ['IDENTIDAD', '¿quién puede?', 'Entra ID · Managed / Workload Identity · Key Vault · RBAC de datos', 44, 'stroke-dasharray="3 7"', 0.45],
    ['RED', '¿por dónde?', 'VNet · Private Endpoint + DNS privatelink · WAF · NSG', 22, 'stroke-dasharray="9 6"', 0.6],
    ['OBSERVABILIDAD', '¿qué pasó?', 'OpenTelemetry · traceparent dentro del mensaje · App Insights', 0, '', 0.85],
  ];
  const tw = cw * 5 + gap * 4;
  let bandas = '';
  env.forEach(([n, q, , d, dash, op], i) => {
    const x = x0 - 30 - d, y = y0 - 58 - d, w = tw + 60 + 2 * d, h = 400 + 96 + 2 * d;
    bandas += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${26 + d / 2}" fill="none" stroke="${COLOR.X}" stroke-opacity="${op}" stroke-width="2" ${dash}/>`;
    const lx = x + 36 + i * 330, etiqueta = `${n} · ${q}`;
    bandas += `<rect x="${lx - 10}" y="${y - 11}" width="${etiqueta.length * 9.4 + 20}" height="22" rx="6" fill="#0C1729"/><text x="${lx}" y="${y + 5}" font-size="13.5" font-weight="800" fill="#E2E8F0" letter-spacing="2">${n} <tspan fill="#94A3B8" font-weight="400" letter-spacing="0.5">· ${q}</tspan></text>`;
  });
  const yLey = y0 + 400 + 96;
  const leyEnv = env.map(([n, , s], i) => `<g transform="translate(${x0 + i * 470},${yLey})"><text font-size="14" font-weight="800" fill="#CBD5E1" letter-spacing="1.5">${n}</text><text y="22" font-size="14" fill="#94A3B8">${esc(s)}</text></g>`).join('');
  // Franja de polisemia
  const muestra = ['eventgrid', 'servicebus', 'functions', 'blob', 'sql', 'acs', 'signalr', 'redis'];
  let poli = '';
  muestra.forEach((id, i) => {
    const x = x0 + (i % 4) * 340, y = 960 + Math.floor(i / 4) * 62;
    const roles = PERFIL[id].roles.filter(r => r !== 'X');
    poli += `<g transform="translate(${x},${y})"><text font-size="17" font-weight="700" fill="#F8FAFC">${esc(nombre(id))}</text>` +
      roles.map((r, k) => `<g transform="translate(${k * 42},14)"><rect width="36" height="26" rx="7" fill="${FONDO[r]}" stroke="${COLOR[r]}"/><text x="18" y="19" font-size="15" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text></g>`).join('') +
      `<text x="${roles.length * 42 + 6}" y="33" font-size="13" fill="#94A3B8">en ${PERFIL[id].arqs} arquitecturas</text></g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FUENTE}" role="img" aria-labelledby="t">
<title id="t">Anatomía de la frase: produce, transporta, consume, guarda y entrega, envueltos por identidad, red y observabilidad</title>
${defsComunes()}${fondo(W, H)}
<text x="80" y="76" font-size="15" font-weight="600" letter-spacing="3" fill="#94A3B8">LÁMINA I · ANATOMÍA DE LA FRASE</text>
<text x="80" y="122" font-size="30" fill="#E2E8F0">Alguien <tspan fill="${COLOR.P}" font-weight="800">produce</tspan>, algo <tspan fill="${COLOR.B}" font-weight="800">transporta</tspan>, alguien <tspan fill="${COLOR.C}" font-weight="800">consume</tspan>, algo <tspan fill="${COLOR.D}" font-weight="800">guarda</tspan> el estado</text>
<text x="80" y="162" font-size="30" fill="#E2E8F0">y algo lo <tspan fill="${COLOR.S}" font-weight="800">entrega</tspan> a una persona. <tspan fill="#CBD5E1">Identidad, red y observabilidad</tspan> <tspan fill="${COLOR.X}" font-weight="800">envuelven</tspan> todo.</text>
<text x="80" y="200" font-size="18" fill="#94A3B8">Cinco papeles funcionales en serie, tres envolturas en paralelo. Las cifras cuentan en cuántas de las ${A.length} arquitecturas del atlas aparece cada servicio en ese papel.</text>
${bandas}${cards}${flechas}${leyEnv}
<text x="80" y="924" font-size="15" font-weight="600" letter-spacing="3" fill="#94A3B8">UN MISMO SERVICIO CAMBIA DE PAPEL SEGÚN LA ARQUITECTURA</text>
${poli}
</svg>`;
}

/* ======================================================== TABLA PERIÓDICA */
function tablaPeriodica() {
  const tw = 118, th = 128, gx = 8, gy = 10;
  const cats = CATS.filter(c => Object.values(S).some(s => s.cat === c));
  const W = Math.max(1600, cats.length * (tw + gx) + 92);
  const x0 = (W - (cats.length * tw + (cats.length - 1) * gx)) / 2, y0 = 210;
  const filas = Math.max(...cats.map(c => Object.values(S).filter(s => s.cat === c).length));
  const H = y0 + filas * (th + gy) + 190;
  let n = 0, celdas = '';
  const numero = {};
  cats.forEach(c => Object.keys(S).filter(id => S[id].cat === c).forEach(id => { numero[id] = ++n; }));
  cats.forEach((c, ci) => {
    const x = x0 + ci * (tw + gx);
    celdas += `<text x="${x + tw / 2}" y="${y0 - 16}" font-size="12.5" font-weight="700" fill="#CBD5E1" text-anchor="middle" letter-spacing="0.5">${esc(c.toUpperCase())}</text>`;
    Object.keys(S).filter(id => S[id].cat === c).forEach((id, ri) => {
      const y = y0 + ri * (th + gy), p = PERFIL[id], r = p.primario;
      const pts = p.roles.map((rr, k) => `<rect x="${8 + k * 17}" y="${th - 22}" width="14" height="14" rx="3.5" fill="${COLOR[rr]}"/><text x="${15 + k * 17}" y="${th - 11}" font-size="9.5" font-weight="800" fill="#0A1424" text-anchor="middle" font-family="${MONO}">${rr}</text>`).join('');
      const nm = CORTO[id] ?? nombre(id);
      celdas += `<g transform="translate(${x},${y})">
<rect width="${tw}" height="${th}" rx="12" fill="${FONDO[r]}" stroke="${COLOR[r]}" stroke-width="1.6"/>
<text x="9" y="18" font-size="11.5" fill="#94A3B8" font-family="${MONO}">${numero[id]}</text>
<circle cx="${tw - 13}" cy="13" r="5" fill="${COLOR_SP[S[id].sp]}"/>
<text x="${tw / 2}" y="62" font-size="36" font-weight="800" fill="${COLOR[r]}" text-anchor="middle">${SIMBOLO[id]}</text>
<text x="${tw / 2}" y="84" font-size="${nm.length > 17 ? 10 : 11.5}" fill="#E2E8F0" text-anchor="middle">${esc(recorta(nm, 21))}</text>
<text x="${tw - 9}" y="${th - 11}" font-size="13" font-weight="800" fill="#F8FAFC" text-anchor="end" font-family="${MONO}">${p.valencia}</text>
${pts}</g>`;
    });
  });
  // Leyenda
  const ly = y0 + filas * (th + gy) + 40;
  const ley = ORDEN_ROL.map((r, i) => `<g transform="translate(${x0 + i * 205},${ly})"><rect width="22" height="22" rx="5" fill="${COLOR[r]}"/><text x="11" y="16" font-size="13" font-weight="800" fill="#0A1424" text-anchor="middle" font-family="${MONO}">${r}</text><text x="32" y="16" font-size="16" fill="#E2E8F0">${r === 'X' ? 'Transversal' : ROLES[r].n}</text></g>`).join('');
  const leySp = Object.entries(SP).map(([k, v], i) => `<g transform="translate(${x0 + i * 300},${ly + 46})"><circle cx="8" cy="8" r="7" fill="${COLOR_SP[k]}"/><text x="24" y="13" font-size="15" fill="#CBD5E1">${esc(v)}</text></g>`).join('');
  const ejemplo = `<g transform="translate(${x0},${ly + 96})"><text font-size="14.5" fill="#94A3B8">Cómo leer una celda: número de orden arriba a la izquierda · estado en TRACER arriba a la derecha · color = papel más frecuente.</text><text y="24" font-size="14.5" fill="#94A3B8">Casillas inferiores = todos los papeles que adopta en las ${A.length} arquitecturas · número inferior derecho = <tspan fill="#F8FAFC" font-weight="700">valencia</tspan> (cuántos papeles distintos).</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FUENTE}" role="img" aria-labelledby="t">
<title id="t">Tabla periódica de los ${CIFRAS.servicios} servicios del atlas, con su valencia de papeles</title>
${defsComunes()}${fondo(W, H)}
<text x="${x0}" y="76" font-size="15" font-weight="600" letter-spacing="3" fill="#94A3B8">LÁMINA II · TABLA PERIÓDICA DE PAPELES · ${EDICION.toUpperCase()}</text>
<text x="${x0}" y="122" font-size="38" font-weight="800" fill="#F8FAFC">${CIFRAS.servicios} servicios, ${CIFRAS.familias} familias, una valencia cada uno</text>
<text x="${x0}" y="156" font-size="18" fill="#94A3B8">Como un elemento químico, cada servicio tiene varias valencias: los papeles que puede adoptar al combinarse en una arquitectura. ${CIFRAS.polisemicos} de ${CIFRAS.servicios} tienen más de una.</text>
${celdas}${ley}${leySp}${ejemplo}
</svg>`;
}

/* ================================================================ MATRIZ */
function matrizSvg() {
  const filas = Object.keys(S).sort((a, b) => PERFIL[b].valencia - PERFIL[a].valencia || PERFIL[b].arqs - PERFIL[a].arqs || nombre(a).localeCompare(nombre(b)));
  const lw = 280, cw = 104, rh = 25, x0 = 70, y0 = 262;
  const W = Math.max(1600, x0 + lw + A.length * cw + 150);
  const H = y0 + filas.length * rh + 120;
  let cab = A.map((a, i) => `<g transform="translate(${x0 + lw + i * cw + cw / 2},${y0 - 14})"><text font-size="13.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">${esc(a.short)}</text></g>`).join('');
  cab += `<text x="${x0 + lw + A.length * cw + 46}" y="${y0 - 14}" font-size="13.5" font-weight="700" fill="#E2E8F0" text-anchor="middle">Valencia</text>`;
  let cuerpo = '';
  filas.forEach((id, k) => {
    const y = y0 + k * rh;
    if (k % 2 === 0) cuerpo += `<rect x="${x0 - 10}" y="${y}" width="${lw + A.length * cw + 110}" height="${rh}" fill="#FFFFFF" fill-opacity="0.025"/>`;
    cuerpo += `<text x="${x0}" y="${y + 17.5}" font-size="14" fill="#E2E8F0">${esc(recorta(nombre(id), 34))}</text>`;
    A.forEach((a, i) => {
      const set = MATRIZ[id]?.[a.id];
      if (!set) { cuerpo += `<circle cx="${x0 + lw + i * cw + cw / 2}" cy="${y + rh / 2}" r="1.6" fill="#334155"/>`; return; }
      const rs = ordenRoles(set), bw = 26, tot = rs.length * bw + (rs.length - 1) * 4;
      rs.forEach((r, j) => {
        const cx = x0 + lw + i * cw + (cw - tot) / 2 + j * (bw + 4);
        cuerpo += `<rect x="${cx}" y="${y + 3}" width="${bw}" height="${rh - 6}" rx="5" fill="${FONDO[r]}" stroke="${COLOR[r]}" stroke-width="1.3"/><text x="${cx + bw / 2}" y="${y + 17}" font-size="12.5" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text>`;
      });
    });
    const v = PERFIL[id].valencia;
    cuerpo += `<text x="${x0 + lw + A.length * cw + 46}" y="${y + 17.5}" font-size="15" font-weight="800" fill="${v >= 3 ? '#F472B6' : v === 2 ? '#F8FAFC' : '#64748B'}" text-anchor="middle" font-family="${MONO}">${v}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FUENTE}" role="img" aria-labelledby="t">
<title id="t">Matriz servicio por arquitectura: el papel que adopta cada servicio en cada una de las ${A.length} arquitecturas</title>
${defsComunes()}${fondo(W, H)}
<text x="${x0}" y="76" font-size="15" font-weight="600" letter-spacing="3" fill="#94A3B8">LÁMINA III · MATRIZ DE PAPELES</text>
<text x="${x0}" y="122" font-size="38" font-weight="800" fill="#F8FAFC">Un mismo servicio cambia de papel según la arquitectura</text>
<text x="${x0}" y="158" font-size="18" fill="#94A3B8">${CIFRAS.servicios} servicios × ${A.length} arquitecturas · ${CIFRAS.apariciones} apariciones · ordenados por valencia. Cada casilla dice qué papel cumple el servicio en esa frase.</text>
${ORDEN_ROL.map((r, i) => `<g transform="translate(${x0 + i * 190},180)"><rect width="22" height="20" rx="5" fill="${FONDO[r]}" stroke="${COLOR[r]}"/><text x="11" y="15" font-size="12.5" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text><text x="30" y="15" font-size="14.5" fill="#CBD5E1">${r === 'X' ? 'Transversal' : ROLES[r].n}</text></g>`).join('')}
${cab}${cuerpo}
<text x="${x0}" y="${H - 50}" font-size="14" fill="#94A3B8">Fuente: bloque DATOS de index.html · generado por tools/generar-atlas.mjs</text>
</svg>`;
}

/* ============================================================ MARKDOWN */
const linkSvc = (id, base = '') => `[${nombre(id)}](${base}15-catalogo-a-z.md#${anclaSvc(id)})`;
// Igual que GitHub: minúsculas, conserva letras Unicode (con tilde), quita la puntuación, espacio → guion
const slug = t => String(t).trim().toLowerCase().replace(/[^\p{L}\p{N} \-_]/gu, '').replace(/ /g, '-');
const anclaSvc = id => slug(nombre(id));
const anclaArq = a => slug(`${A.indexOf(a) + 1}. ${a.n}`);
const MERMAID_CLASES = ORDEN_ROL.map(r => `    classDef ${r} fill:${FONDO[r]},stroke:${COLOR[r]},color:#F8FAFC,stroke-width:2px`).join('\n');
const mmEsc = t => String(t).replace(/"/g, "'").replace(/[<>]/g, '');

function bloqueMatrizMd() {
  const filas = Object.keys(S).sort((a, b) => PERFIL[b].valencia - PERFIL[a].valencia || PERFIL[b].arqs - PERFIL[a].arqs || nombre(a).localeCompare(nombre(b)));
  let t = `| Servicio | ${A.map(a => a.short).join(' | ')} | Valencia |\n|---|${A.map(() => ':-:').join('|')}|:-:|\n`;
  for (const id of filas) {
    t += `| ${linkSvc(id)} | ${A.map(a => (MATRIZ[id]?.[a.id] ? ordenRoles(MATRIZ[id][a.id]).map(r => CIRC[r]).join('') : '·')).join(' | ')} | **${PERFIL[id].valencia}** |\n`;
  }
  return `<!-- matriz:inicio -->\n${AVISO}\n\n${t}\n<!-- matriz:fin -->`;
}

function arquitecturasMd() {
  let s = `${AVISO}\n\n# 11 · ${NARQ} arquitecturas leídas como frases\n\n`;
  s += `> Cada arquitectura de este capítulo se escribe con la misma gramática: **${ORDEN_ROL.slice(0, 5).map(r => `${CIRC[r]} ${VERBO[r]}`).join(' → ')}**, `;
  s += `envuelta por ${CIRC.X} identidad, red y observabilidad. Lo que cambia de una a otra no es la gramática: son las palabras, y el papel que cada palabra cumple.\n\n`;
  s += `Este capítulo se genera desde los datos de [\`index.html\`](../index.html), la misma fuente que la vista interactiva **Arquitecturas** (\`npm start\`).\n\n`;
  s += `## Contenido\n\n| # | Arquitectura | Cuándo | TRACER |\n|---|---|---|:-:|\n`;
  A.forEach((a, i) => { s += `| ${i + 1} | [${a.n}](#${anclaArq(a)}) | ${md(a.when)} | ${ICONO_SP[a.sp]} |\n`; });
  s += `\n---\n`;
  A.forEach((a, i) => {
    s += `\n## ${i + 1}. ${a.n}\n\n`;
    s += `**Cuándo:** ${a.when}\n\n`;
    s += `<p align="center"><a href="../${rutaLamina(a, i)}"><img src="../${rutaLamina(a, i)}" alt="Lámina de la arquitectura ${a.n}" width="100%"></a></p>\n\n`;
    // La frase
    const porRol = r => a.lanes.filter(l => l.r === r).flatMap(l => l.i.map(([id]) => nombre(id)));
    const partes = ORDEN_ROL.slice(0, 5).map(r => [r, [...new Set(porRol(r))]]).filter(([, v]) => v.length);
    s += `> **La frase:** ${partes.map(([r, v]) => `${CIRC[r]} *${v.slice(0, 3).join(', ')}${v.length > 3 ? '…' : ''}* **${VERBO[r]}**`).join(' · ')}; `;
    s += `${CIRC.X} *${a.x.map(nombre).join(', ')}* **envuelven**.\n\n`;
    // Diagrama
    // Carriles de izquierda a derecha; los servicios de cada carril, apilados (nodos sin aristas internas = mismo rango)
    s += '```mermaid\nflowchart LR\n';
    a.lanes.forEach((l, li) => {
      s += `    subgraph L${li}["${CIRC[l.r]} ${mmEsc(l.t)}${l.s ? ' · ' + mmEsc(l.s) : ''}"]\n        direction LR\n`;
      l.i.forEach(([id, how], k) => { s += `        L${li}_${k}["${mmEsc(nombre(id))}<br/><small>${mmEsc(how)}</small>"]:::${l.r}\n`; });
      s += '    end\n';
      s += `    style L${li} fill:${FONDO[l.r]}22,stroke:${COLOR[l.r]},stroke-width:2px\n`;
    });
    for (let li = 0; li < a.lanes.length - 1; li++) s += `    L${li} ==> L${li + 1}\n`;
    s += `    subgraph XX["${CIRC.X} Envoltura: identidad · red · observabilidad"]\n        direction LR\n`;
    a.x.forEach((id, k) => { s += `        X${k}["${mmEsc(nombre(id))}"]:::X\n`; });
    s += `    end\n    style XX fill:#1E293B22,stroke:${COLOR.X},stroke-dasharray:6 4\n    L${a.lanes.length - 1} -.- XX\n`;
    s += MERMAID_CLASES + '\n```\n\n';
    // Carriles
    s += `| Papel | Carril | Servicios y cómo participan |\n|:-:|---|---|\n`;
    a.lanes.forEach(l => { s += `| ${CIRC[l.r]} | **${md(l.t)}**${l.s ? `<br/><sub>${md(l.s)}</sub>` : ''} | ${l.i.map(([id, how]) => `${linkSvc(id)}: ${md(how)}`).join(' · ')} |\n`; });
    s += `| ${CIRC.X} | **Envoltura** | ${a.x.map(id => linkSvc(id)).join(' · ')} |\n\n`;
    s += `**Garantías que debes conocer**\n\n${a.g.map(x => `- ${x}`).join('\n')}\n\n`;
    s += `**Patrones**\n\n${a.pt.map(x => `- ${x}`).join('\n')}\n\n`;
    s += `> [!CAUTION]\n> **Antipatrones:** ${a.anti.join(' · ')}.\n\n`;
    s += `> [!NOTE]\n> **En TRACER** (${ICONO_SP[a.sp]} ${SP[a.sp]}): ${a.tracer}\n\n`;
    s += `**Dilo en una frase de entrevista:** *"${a.ph}"*\n\n`;
    if (a.cmp) {
      s += `**Equivalentes en otras nubes** (aproximados: los servicios no son idénticos uno a uno)\n\n| Proveedor | Servicios para esta arquitectura | Fortaleza aquí | Enfoque general |\n|---|---|---|---|\n`;
      a.cmp.forEach(([pv, svc, f]) => { s += `| ${pv === 'Azure' ? '**Azure**' : pv} | ${md(svc)} | ${md(f)} | ${md(D.PROV?.[pv] ?? '')} |\n`; });
      s += '\n';
    }
    s += '---\n';
  });
  s += `\n[← 10 · Un servicio, muchos papeles](10-un-servicio-muchos-papeles.md) · [Índice](../README.md) · [12 · Brokers →](12-brokers-quien-escribe-quien-lee.md)\n`;
  return s;
}

function brokersMd() {
  let s = `${AVISO}\n\n# 12 · Brokers: quién escribe, quién lee\n\n`;
  s += `> Un broker es el **verbo** de la frase: no produce ni consume, pero decide **cómo** viaja el significado (push o pull, orden, retención, reintentos). `;
  s += `Este capítulo mira cada broker desde dentro: qué servicios **escriben** en él (Ⓟ en esa relación) y cuáles **leen** de él (Ⓒ en esa relación). `;
  s += `Fíjate en cuántos nombres aparecen en ambas columnas de brokers distintos: es la polisemia en acción.\n\n`;
  s += `## Comparativa de contratos\n\n| Broker | Para | ${BK_KEYS.join(' | ')} |\n|---|---|${BK_KEYS.map(() => '---').join('|')}|\n`;
  BK.forEach(b => { s += `| **${nombre(b.id)}** | ${md(b.as)} | ${b.pr.map(md).join(' | ')} |\n`; });
  s += `\n> [!TIP]\n> Lee la tabla por columnas, no por filas. **Orden** y **Dead-letter** separan comandos de hechos; **Replay** separa logs de colas; **Entrega** te dice si tu consumidor debe ser idempotente (casi siempre: sí).\n\n`;
  // Quién aparece en ambos lados
  const escribe = new Map(), lee = new Map();
  BK.forEach(b => { b.in.forEach(([id]) => (escribe.get(id) || escribe.set(id, new Set()).get(id)).add(b.id)); b.out.forEach(([id]) => (lee.get(id) || lee.set(id, new Set()).get(id)).add(b.id)); });
  const ambos = [...escribe.keys()].filter(id => lee.has(id)).sort((x, y) => (escribe.get(y).size + lee.get(y).size) - (escribe.get(x).size + lee.get(x).size));
  s += `## Los que escriben y también leen\n\n${ambos.length} servicios aparecen como emisores de un broker y como lectores de otro (o del mismo):\n\n`;
  s += `| Servicio | Escribe en | Lee de |\n|---|---|---|\n`;
  ambos.forEach(id => { s += `| ${linkSvc(id)} | ${[...escribe.get(id)].map(nombre).join(', ')} | ${[...lee.get(id)].map(nombre).join(', ')} |\n`; });
  s += `\n---\n`;
  BK.forEach((b, i) => {
    s += `\n## ${i + 1}. ${nombre(b.id)} · ${b.as}\n\n${S[b.id]?.d ?? ''}\n\n`;
    s += '```mermaid\nflowchart LR\n';
    b.in.forEach(([id, how], k) => { s += `    I${k}["${mmEsc(nombre(id))}<br/><small>${mmEsc(how)}</small>"]:::P --> BK\n`; });
    s += `    BK{{"${mmEsc(nombre(b.id))}"}}:::B\n`;
    b.out.forEach(([id, how], k) => { s += `    BK --> O${k}["${mmEsc(nombre(id))}<br/><small>${mmEsc(how)}</small>"]:::C\n`; });
    s += MERMAID_CLASES + '\n```\n\n';
    s += `| | |\n|---|---|\n`;
    BK_KEYS.forEach((k, j) => { s += `| **${k}** | ${md(b.pr[j])} |\n`; });
    if (S[b.id]?.k) s += `| **Garantías y límites** | ${md(S[b.id].k)} |\n`;
    if (S[b.id]?.net) s += `| **SDK .NET** | \`${md(S[b.id].net)}\` |\n`;
    if (S[b.id]?.rbac) s += `| **Rol RBAC de datos** | ${md(S[b.id].rbac)} |\n`;
    s += `\n- ✅ **Úsalo para:** ${b.use}\n- ⛔ **Evítalo para:** ${b.avoid}\n`;
    if (S[b.id]?.tip) s += `\n> [!TIP]\n> ${S[b.id].tip}\n`;
    s += '\n---\n';
  });
  s += `\n[← 11 · ${NARQ} arquitecturas](11-trece-arquitecturas-como-frases.md) · [Índice](../README.md) · [13 · Guía de decisión →](13-guia-de-decision.md)\n`;
  return s;
}

function decisionMd() {
  let s = `${AVISO}\n\n# 13 · Guía de decisión: ¿qué uso?\n\n`;
  s += `> La primera pregunta no es "¿qué servicio?", sino **"¿qué viaja?"**. Un hecho, una orden, una medición y un aviso son cuatro sustantivos distintos y piden cuatro verbos distintos. `;
  s += `El árbol es el mismo que el de la pestaña **¿Qué uso?** de la vista interactiva.\n\n`;
  s += '```mermaid\nflowchart TD\n';
  const nodoId = k => `Q_${k}`;
  for (const [k, n] of Object.entries(DT)) s += `    ${nodoId(k)}{"${mmEsc(n.q)}"}\n`;
  for (const [k, n] of Object.entries(DT)) {
    n.o.forEach(([txt, dst]) => {
      if (dst.startsWith('R:')) {
        const r = dst.slice(2);
        s += `    ${nodoId(k)} -->|"${mmEsc(txt)}"| R_${r}_${k}(["${mmEsc(nombre(r))}"]):::B\n`;
      } else s += `    ${nodoId(k)} -->|"${mmEsc(txt)}"| ${nodoId(dst)}\n`;
    });
  }
  s += MERMAID_CLASES + '\n```\n\n';
  s += `## Respuestas razonadas\n\nCada hoja del árbol trae su porqué, la cadena típica en la que vive y la trampa que debes evitar.\n\n`;
  s += `| Resultado | Por qué | Cadena típica | Arquitectura | Trampa |\n|---|---|---|---|---|\n`;
  for (const [id, r] of Object.entries(RES)) {
    const arq = arqPorId(r.a);
    s += `| **${linkSvc(id)}** | ${md(r.why)} | ${r.ch.map(([sid, rol]) => `${CIRC[rol]} ${nombre(sid)}`).join(' → ')} | [${arq.short}](11-trece-arquitecturas-como-frases.md#${anclaArq(arq)}) | ${md(r.avoid)} |\n`;
  }
  s += `\n> [!IMPORTANT]\n> Observa las cadenas: el mismo servicio aparece con glifos distintos según la respuesta. `;
  s += `En la cadena de SignalR, Event Grid es Ⓑ y SignalR también es Ⓑ; en la de Cosmos DB, el propio Cosmos DB es Ⓓ y el change feed lo convierte en fuente. La decisión no elige "un servicio": elige **un papel para cada servicio**.\n`;
  s += `\n[← 12 · Brokers](12-brokers-quien-escribe-quien-lee.md) · [Índice](../README.md) · [14 · Caso TRACER →](14-caso-tracer.md)\n`;
  return s;
}

function catalogoMd() {
  const ids = Object.keys(S).sort((a, b) => sinTildes(nombre(a)).localeCompare(sinTildes(nombre(b))));
  let s = `${AVISO}\n\n# 15 · Catálogo A–Z\n\n`;
  s += `Los ${CIFRAS.servicios} servicios del atlas, en orden alfabético. **Papeles** son todos los que adopta en las ${A.length} arquitecturas; **valencia** es cuántos distintos. `;
  s += `TRACER: ${Object.entries(SP).map(([k, v]) => `${ICONO_SP[k]} ${v}`).join(' · ')}.\n\n`;
  s += `| Letra | Servicios |\n|---|---|\n`;
  const porLetra = {};
  ids.forEach(id => (porLetra[sinTildes(nombre(id))[0].toUpperCase()] ??= []).push(id));
  Object.entries(porLetra).forEach(([l, v]) => { s += `| **${l}** | ${v.map(id => `[${nombre(id)}](#${anclaSvc(id)})`).join(' · ')} |\n`; });
  s += `\n## Resumen\n\n| Servicio | Familia | Papeles | Valencia | TRACER | Capítulo |\n|---|---|---|:-:|:-:|---|\n`;
  ids.forEach(id => { s += `| [${nombre(id)}](#${anclaSvc(id)}) | ${S[id].cat} | ${glifos(PERFIL[id].roles)} | ${PERFIL[id].valencia} | ${ICONO_SP[S[id].sp]} | [${capDe(id).slice(0, 2)}](${capDe(id)}) |\n`; });
  s += `\n---\n`;
  ids.forEach(id => {
    const x = S[id], p = PERFIL[id];
    s += `\n### ${nombre(id)}\n\n`;
    s += `**${x.cat}** · ${glifos(p.roles)} · valencia ${p.valencia} · ${ICONO_SP[x.sp]} ${SP[x.sp]} · capítulo [${capDe(id).replace('.md', '')}](${capDe(id)})\n\n${x.d}\n\n`;
    const filas = [];
    if (x.c) filas.push(['Recibe de', x.c]);
    if (x.p) filas.push(['Entrega o publica a', x.p]);
    if (x.k) filas.push(['Garantías y límites', x.k]);
    if (x.net) filas.push(['SDK .NET', '`' + x.net + '`']);
    if (x.rbac) filas.push(['Rol RBAC', x.rbac]);
    const enArq = Object.entries(MATRIZ[id] || {}).map(([a, set]) => `${arqPorId(a).short} ${ordenRoles(set).map(r => CIRC[r]).join('')}`);
    if (enArq.length) filas.push(['Papel por arquitectura', enArq.join(' · ')]);
    if (filas.length) s += `| | |\n|---|---|\n${filas.map(([k, v]) => `| **${k}** | ${md(v)} |`).join('\n')}\n\n`;
    if (x.tip) s += `> 💡 ${x.tip}\n\n`;
  });
  s += `\n[← 14 · Caso TRACER](14-caso-tracer.md) · [Índice](../README.md) · [16 · Referencia rápida →](16-referencia-rapida-y-glosario.md)\n`;
  return s;
}


/* ================================================= LÁMINAS POR ARQUITECTURA */
// Envoltura: a qué anillo pertenece cada servicio transversal
const ANILLO = { entra: 'I', mi: 'I', kv: 'I', appconfig: 'I', arc: 'I', vnet: 'R', pe: 'R', expressroute: 'R', appi: 'O', acr: 'O', devops: 'O' };
const ANILLOS = [
  ['I', 'IDENTIDAD', '¿quién puede?', 'stroke-dasharray="2 7"', 0.55],
  ['R', 'RED', '¿por dónde?', 'stroke-dasharray="10 6"', 0.7],
  ['O', 'OBSERVABILIDAD', '¿qué pasó?', '', 0.9],
];
const POLI = '#F472B6';
const ancho = (t, fs, k = 0.53) => String(t).length * fs * k;
function envolver(texto, maxPx, fs, k = 0.53) {
  const max = Math.max(8, Math.floor(maxPx / (fs * k)));
  const palabras = String(texto).split(/\s+/), lineas = [];
  let l = '';
  for (const w of palabras) {
    if (!l) l = w;
    else if ((l + ' ' + w).length <= max) l += ' ' + w;
    else { lineas.push(l); l = w; }
  }
  if (l) lineas.push(l);
  return lineas;
}
const tspans = (lineas, x, dy) => lineas.map((l, i) => `<tspan x="${x}" dy="${i ? dy : 0}">${esc(l)}</tspan>`).join('');
const rutaLamina = (a, i) => `assets/arquitecturas/${String(i + 1).padStart(2, '0')}-${a.id}.svg`;

function laminaArquitectura(a, idx) {
  const W = 1800, M = 56;
  const num = String(idx + 1).padStart(2, '0');
  let svg = '';

  // ---------- Cabecera
  let y = 74;
  svg += `<text x="${M}" y="${y}" font-size="15" font-weight="600" letter-spacing="3" fill="#94A3B8">LÁMINA A·${num} · ARQUITECTURA ${num} DE ${A.length}</text>`;
  y += 58;
  svg += `<text x="${M}" y="${y}" font-size="50" font-weight="800" fill="#F8FAFC">${esc(a.n)}</text>`;
  const cuando = envolver(a.when, 1060, 20);
  y += 40;
  svg += `<text x="${M}" y="${y}" font-size="20" fill="#CBD5E1">${tspans(cuando, M, 27)}</text>`;
  y += (cuando.length - 1) * 27;

  // Leyenda a la derecha
  const lx = W - M - 470;
  svg += `<g transform="translate(${lx},48)"><rect width="470" height="132" rx="16" fill="#0B1527" stroke="#1E293B"/>`;
  ORDEN_ROL.forEach((r, i) => {
    const gx = 18 + (i % 3) * 150, gy = 22 + Math.floor(i / 3) * 34;
    svg += `<rect x="${gx}" y="${gy}" width="24" height="24" rx="6" fill="${FONDO[r]}" stroke="${COLOR[r]}" stroke-width="1.5"/><text x="${gx + 12}" y="${gy + 17}" font-size="13" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text><text x="${gx + 32}" y="${gy + 17}" font-size="14" fill="#CBD5E1">${r === 'X' ? 'Envuelve' : ROLES[r].n}</text>`;
  });
  svg += `<rect x="18" y="94" width="24" height="18" rx="5" fill="none" stroke="${POLI}" stroke-width="1.6" stroke-dasharray="4 3"/><text x="50" y="108" font-size="13.5" fill="#CBD5E1">cambia de papel</text>`;
  svg += `<circle cx="250" cy="103" r="6" fill="${COLOR_SP[a.sp]}"/><text x="262" y="108" font-size="13.5" fill="#CBD5E1">${esc(SP[a.sp])}</text></g>`;

  // ---------- La frase
  y += 72;
  const partes = [];
  ORDEN_ROL.slice(0, 5).forEach(r => {
    const ns = [...new Set(a.lanes.filter(l => l.r === r).flatMap(l => l.i.map(([id]) => nombre(id))))];
    if (ns.length) partes.push([r, ns]);
  });
  const trozos = [];
  partes.forEach(([r, ns], i) => {
    trozos.push([`${CIRC[r]} `, COLOR[r], 700]);
    trozos.push([ns.slice(0, 3).join(', ') + (ns.length > 3 ? '…' : '') + ' ', '#E2E8F0', 400]);
    trozos.push([VERBO[r], COLOR[r], 800]);
    trozos.push([i < partes.length - 1 ? '  →  ' : '', '#64748B', 400]);
  });
  trozos.push(['   ·   ' + CIRC.X + ' ', COLOR.X, 700], [a.x.map(nombre).join(', ') + ' ', '#CBD5E1', 400], ['envuelven', COLOR.X, 800]);
  svg += `<text x="${M}" y="${y - 32}" font-size="12.5" font-weight="700" letter-spacing="2.5" fill="#64748B">LA FRASE</text>`;
  // Partir en líneas por estimación y dejar que el navegador coloque cada palabra (espaciado exacto)
  const fs = 18, maxW = W - 2 * M, lineas = [[]];
  let usado = 0;
  for (const [t, c, w] of trozos) {
    for (const pal of t.split(/(?<= )/)) {
      if (!pal) continue;
      const wpx = ancho(pal, fs, w >= 700 ? 0.57 : 0.51);
      if (usado + wpx > maxW && pal.trim()) { lineas.push([]); usado = 0; }
      lineas[lineas.length - 1].push([pal, c, w]); usado += wpx;
    }
  }
  let lineaY = y;
  lineas.forEach((ln, k) => {
    lineaY = y + k * 28;
    svg += `<text x="${M}" y="${lineaY}" font-size="${fs}" xml:space="preserve">${ln.map(([pal, c, w]) => `<tspan fill="${c}" font-weight="${w}">${esc(pal)}</tspan>`).join('')}</text>`;
  });
  y = lineaY + 44;

  // ---------- Escenario: anillos + carriles
  const yS = y, D = 30;                         // separación entre anillos
  const n = a.lanes.length, gap = 52;
  const x0 = M + 3 * D + 26, x1 = W - M - 3 * D - 26;
  const laneW = (x1 - x0 - (n - 1) * gap) / n;
  const laneTop = yS + 2 * D + 54;

  // Medir tarjetas
  const enEsta = {};                             // servicio → papeles en ESTA arquitectura
  a.lanes.forEach(l => l.i.forEach(([id]) => (enEsta[id] ??= []).push([l.r, l.t])));
  const medidas = a.lanes.map(l => {
    const cab = envolver(l.t, laneW - 64, 17, 0.56), sub = l.s ? envolver(l.s, laneW - 64, 12.5) : [];
    const hCab = 24 + cab.length * 21 + sub.length * 16 + 14;
    const tarjetas = l.i.map(([id, how]) => {
      const tw = laneW - 24;
      const nom = envolver(nombre(id), tw - 52, 15, 0.56);
      const desc = how ? envolver(how, tw - 24, 12.5) : [];
      const aqui = enEsta[id].filter(([r, t]) => !(r === l.r && t === l.t));
      const fuera = Object.entries(MATRIZ[id] || {}).filter(([aid]) => aid !== a.id)
        .flatMap(([aid, set]) => [...set].filter(r => r !== l.r && r !== 'X').map(r => [r, arqPorId(aid).short]));
      const agrup = {};
      fuera.forEach(([r, sh]) => (agrup[r] ??= []).push(sh));
      const txtFuera = Object.entries(agrup).map(([r, shs]) => `${CIRC[r]} ${shs.slice(0, 2).join(', ')}${shs.length > 2 ? ` +${shs.length - 2}` : ''}`).join(' · ');
      const distinto = aqui.filter(([r]) => r !== l.r), igual = aqui.filter(([r]) => r === l.r);
      const lAqui = distinto.flatMap(([r, t]) => envolver(`↔ aquí también ${CIRC[r]} (${t})`, tw - 24, 11.5, 0.56));
      const lIgual = igual.flatMap(([, t]) => envolver(`↳ también en «${t}»`, tw - 24, 11.5, 0.53));
      const lFuera = txtFuera ? envolver(`en otras: ${txtFuera}`, tw - 24, 11.5) : [];
      const extra = lAqui.length + lIgual.length + lFuera.length;
      const h = 14 + nom.length * 19 + desc.length * 16 + (extra ? 8 + extra * 15 : 0) + 12;
      return { id, nom, desc, lAqui, lIgual, lFuera, h };
    });
    const h = hCab + tarjetas.reduce((k, t) => k + t.h + 10, 0) + 6;
    return { cab, sub, hCab, tarjetas, h };
  });
  const lanesH = Math.max(...medidas.map(m => m.h));
  const lanesBottom = laneTop + lanesH;

  // X por anillo
  const porAnillo = { I: [], R: [], O: [] };
  a.x.forEach(id => porAnillo[ANILLO[id] ?? 'O'].push(nombre(id)));
  const yE = lanesBottom + 2 * D + 36;          // borde inferior del anillo exterior
  ANILLOS.forEach(([k, nom, q, dash, op], i) => {
    const d = i * D;
    const rx = M + d, ry = yS + d, rw = W - 2 * M - 2 * d, rh = yE - yS - 2 * d;
    svg += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="${34 - i * 6}" fill="${i === 2 ? '#0B1527' : 'none'}" fill-opacity="0.55" stroke="${COLOR.X}" stroke-opacity="${op}" stroke-width="2" ${dash}/>`;
    const svcs = porAnillo[k].length ? porAnillo[k].join(' · ') : 'no se declara en esta arquitectura: pregunta abierta';
    const etiqueta = `${nom}  ${q}  ${svcs}`;
    const tx = rx + 34 + i * 18, tw = ancho(etiqueta, 13.5, 0.55) + 28;
    svg += `<rect x="${tx - 12}" y="${ry - 12}" width="${tw}" height="24" rx="7" fill="#0A1222" stroke="${COLOR.X}" stroke-opacity="${op * 0.6}"/>`;
    svg += `<text x="${tx}" y="${ry + 5}" font-size="13.5"><tspan font-weight="800" fill="#E2E8F0" letter-spacing="2">${nom}</tspan><tspan fill="#94A3B8">  ${q}  </tspan><tspan fill="${porAnillo[k].length ? '#F8FAFC' : '#F59E0B'}" font-weight="${porAnillo[k].length ? 600 : 400}" font-style="${porAnillo[k].length ? 'normal' : 'italic'}">${esc(svcs)}</tspan></text>`;
  });

  // Carriles
  medidas.forEach((m, li) => {
    const l = a.lanes[li], r = l.r, lx2 = x0 + li * (laneW + gap);
    svg += `<rect x="${lx2}" y="${laneTop}" width="${laneW}" height="${lanesH}" rx="16" fill="${FONDO[r]}" fill-opacity="0.32" stroke="${COLOR[r]}" stroke-opacity="0.55"/>`;
    svg += `<rect x="${lx2}" y="${laneTop}" width="${laneW}" height="5" rx="2.5" fill="${COLOR[r]}"/>`;
    svg += `<circle cx="${lx2 + 26}" cy="${laneTop + 32}" r="15" fill="${FONDO[r]}" stroke="${COLOR[r]}" stroke-width="2"/><text x="${lx2 + 26}" y="${laneTop + 38}" font-size="16" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text>`;
    svg += `<text x="${lx2 + 50}" y="${laneTop + 30}" font-size="17" font-weight="800" fill="#F8FAFC">${tspans(m.cab, lx2 + 50, 21)}</text>`;
    if (m.sub.length) svg += `<text x="${lx2 + 50}" y="${laneTop + 30 + m.cab.length * 21}" font-size="12.5" fill="#94A3B8">${tspans(m.sub, lx2 + 50, 16)}</text>`;
    let cy = laneTop + m.hCab;
    m.tarjetas.forEach(t => {
      const tx = lx2 + 12, tw = laneW - 24;
      svg += `<rect x="${tx}" y="${cy}" width="${tw}" height="${t.h}" rx="11" fill="#0A1222" fill-opacity="0.92" stroke="${t.lAqui.length ? POLI : COLOR[r]}" stroke-opacity="${t.lAqui.length ? 1 : 0.7}" stroke-width="${t.lAqui.length ? 2 : 1.2}" ${t.lAqui.length ? 'stroke-dasharray="6 4"' : ''}/>`;
      svg += `<rect x="${tx + 12}" y="${cy + 13}" width="22" height="22" rx="6" fill="${FONDO[r]}" stroke="${COLOR[r]}"/><text x="${tx + 23}" y="${cy + 29}" font-size="12.5" font-weight="800" fill="${COLOR[r]}" text-anchor="middle" font-family="${MONO}">${r}</text>`;
      let ty = cy + 29;
      svg += `<text x="${tx + 42}" y="${ty}" font-size="15" font-weight="700" fill="#F8FAFC">${tspans(t.nom, tx + 42, 19)}</text>`;
      ty += (t.nom.length - 1) * 19 + 19;
      if (t.desc.length) { svg += `<text x="${tx + 12}" y="${ty}" font-size="12.5" fill="#CBD5E1">${tspans(t.desc, tx + 12, 16)}</text>`; ty += t.desc.length * 16; }
      const extras = [...t.lAqui.map(x => [x, POLI, 700]), ...t.lIgual.map(x => [x, '#94A3B8', 400]), ...t.lFuera.map(x => [x, '#F9A8D4', 400])];
      if (extras.length) {
        ty += 4;
        svg += `<line x1="${tx + 12}" y1="${ty - 8}" x2="${tx + tw - 12}" y2="${ty - 8}" stroke="${t.lAqui.length || t.lFuera.length ? POLI : '#334155'}" stroke-opacity="0.35"/>`;
        extras.forEach(([ln, c, w], k) => { svg += `<text x="${tx + 12}" y="${ty + 6 + k * 15}" font-size="11.5" fill="${c}" font-weight="${w}">${esc(ln)}</text>`; });
      }
      cy += t.h + 10;
    });
    // Flecha hacia el siguiente carril
    if (li < n - 1) {
      const ax = lx2 + laneW + 6, bx = lx2 + laneW + gap - 6, ay = laneTop + 32;
      svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${ay}" stroke="#CBD5E1" stroke-width="2.5" marker-end="url(#flecha)"/>`;
      svg += `<line class="flujo" x1="${ax}" y1="${ay}" x2="${bx - 6}" y2="${ay}" stroke="${COLOR[a.lanes[li + 1].r]}" stroke-width="2.5"/>`;
    }
  });

  // ---------- Paneles inferiores
  let yP = yE + 54;
  const cols = [
    ['GARANTÍAS', a.g, '#60A5FA', '•'],
    ['PATRONES QUE LA HACEN FUNCIONAR', a.pt, '#34D399', '•'],
    ['ANTIPATRONES', a.anti, '#F87171', '✕'],
  ];
  const pw = (W - 2 * M - 3 * 26) / 4;
  let hMax = 0;
  const paneles = cols.map(([t, items, c, b], i) => {
    const px = M + i * (pw + 26);
    let out = `<text x="${px}" y="${yP}" font-size="12.5" font-weight="700" letter-spacing="2.5" fill="${c}">${t}</text>`;
    let py = yP + 30;
    items.forEach(it => {
      const ls = envolver(it, pw - 22, 14);
      out += `<text x="${px}" y="${py}" font-size="14" fill="${c}">${b}</text><text x="${px + 18}" y="${py}" font-size="14" fill="#E2E8F0">${tspans(ls, px + 18, 19)}</text>`;
      py += ls.length * 19 + 8;
    });
    hMax = Math.max(hMax, py - yP);
    return out;
  });
  // Cuarto panel: equivalentes en otras nubes o TRACER
  const px4 = M + 3 * (pw + 26);
  let p4 = '';
  if (a.cmp) {
    p4 += `<text x="${px4}" y="${yP}" font-size="12.5" font-weight="700" letter-spacing="2.5" fill="#FACC15">EQUIVALENTES EN OTRAS NUBES</text>`;
    let py = yP + 30;
    a.cmp.forEach(([pv, svc]) => {
      const ls = envolver(svc, pw - 8, 13.5);
      p4 += `<text x="${px4}" y="${py}" font-size="13.5" font-weight="800" fill="${pv === 'Azure' ? '#60A5FA' : '#F8FAFC'}">${esc(pv)}</text><text x="${px4}" y="${py + 19}" font-size="13.5" fill="#CBD5E1">${tspans(ls, px4, 18)}</text>`;
      py += 19 + ls.length * 18 + 10;
    });
    hMax = Math.max(hMax, py - yP);
  } else {
    p4 += `<text x="${px4}" y="${yP}" font-size="12.5" font-weight="700" letter-spacing="2.5" fill="#FACC15">EN TRACER</text>`;
    const ls = envolver(a.tracer, pw - 8, 14);
    p4 += `<text x="${px4}" y="${yP + 30}" font-size="14" fill="#E2E8F0">${tspans(ls, px4, 19)}</text>`;
    hMax = Math.max(hMax, 30 + ls.length * 19);
  }
  svg += paneles.join('') + p4;
  yP += hMax + 24;

  // Frase de entrevista
  const cita = envolver(`“${a.ph}”`, W - 2 * M - 70, 19, 0.5);
  const hc = 46 + cita.length * 27;
  svg += `<rect x="${M}" y="${yP}" width="${W - 2 * M}" height="${hc}" rx="14" fill="#0B1527" stroke="#1E293B"/><rect x="${M}" y="${yP}" width="5" height="${hc}" rx="2.5" fill="${POLI}"/>`;
  svg += `<text x="${M + 30}" y="${yP + 28}" font-size="12" font-weight="700" letter-spacing="2.5" fill="${POLI}">DILO EN UNA FRASE</text>`;
  svg += `<text x="${M + 30}" y="${yP + 56}" font-size="19" font-style="italic" fill="#F8FAFC">${tspans(cita, M + 30, 27)}</text>`;
  yP += hc + 40;
  svg += `<text x="${M}" y="${yP}" font-size="13" fill="#64748B">Atlas de servicios Azure · generado desde index.html por tools/generar-atlas.mjs · ${EDICION}</text>`;
  const H = yP + 36;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FUENTE}" role="img" aria-labelledby="t">
<title id="t">${esc(a.n)}: quién produce, qué transporta, quién consume, dónde se guarda el estado, cómo llega a una persona y qué la envuelve</title>
<style>.flujo{stroke-dasharray:4 14;animation:fluir 1.1s linear infinite}@keyframes fluir{to{stroke-dashoffset:-18}}@media (prefers-reduced-motion:reduce){.flujo{animation:none}}</style>
${defsComunes()}${fondo(W, H)}
${svg}
</svg>`;
}

/* ============================================================== EJECUCIÓN */
console.log('Atlas de servicios Azure · generando a partir de index.html');
escribir('data/atlas.json', JSON.stringify({
  edicion: EDICION, cifras: CIFRAS, roles: ROLES,
  servicios: Object.fromEntries(Object.entries(S).map(([id, v]) => [id, { ...v, papeles: PERFIL[id].roles, valencia: PERFIL[id].valencia, primario: PERFIL[id].primario }])),
  matriz: Object.fromEntries(Object.entries(MATRIZ).map(([id, m]) => [id, Object.fromEntries(Object.entries(m).map(([a, set]) => [a, ordenRoles(set)]))])),
  arquitecturas: A, brokers: BK, decision: DT, respuestas: RES,
}, null, 2));
escribir('assets/atlas-banner.svg', banner());
escribir('assets/atlas-frase.svg', frase());
escribir('assets/atlas-tabla-periodica.svg', tablaPeriodica());
escribir('assets/atlas-matriz.svg', matrizSvg());
escribir('docs/11-trece-arquitecturas-como-frases.md', arquitecturasMd());
escribir('docs/12-brokers-quien-escribe-quien-lee.md', brokersMd());
escribir('docs/13-guia-de-decision.md', decisionMd());
escribir('docs/15-catalogo-a-z.md', catalogoMd());
A.forEach((a, i) => escribir(rutaLamina(a, i), laminaArquitectura(a, i)));

const cap10 = path.join(RAIZ, 'docs/10-un-servicio-muchos-papeles.md');
if (fs.existsSync(cap10)) {
  const txt = fs.readFileSync(cap10, 'utf8');
  const nuevo = txt.replace(/<!-- matriz:inicio -->[\s\S]*?<!-- matriz:fin -->/, bloqueMatrizMd());
  if (nuevo !== txt) { fs.writeFileSync(cap10, nuevo); console.log('  ✓ docs/10-un-servicio-muchos-papeles.md (bloque de la matriz)'); }
  else console.log('  · docs/10: sin cambios en la matriz');
}
console.log(`Listo: ${CIFRAS.servicios} servicios · ${A.length} arquitecturas · ${BK.length} brokers · ${CIFRAS.polisemicos} servicios con más de un papel.`);
