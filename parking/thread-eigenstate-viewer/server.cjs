'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ---------------------------------------------------------------------------
// Resolución de corpus y assets
// ---------------------------------------------------------------------------

const repoRoot = path.resolve(__dirname, '..', '..');
const corpusInput = process.env.CORPUS_PATH || path.join('examples', 'yo-no-soy-yo-propositions-engine');
const corpusRoot = path.isAbsolute(corpusInput) ? corpusInput : path.resolve(repoRoot, corpusInput);

if (!fs.existsSync(corpusRoot) || !fs.statSync(corpusRoot).isDirectory()) {
  console.error(`[thread-eigenstate-viewer] CORPUS_PATH no es un directorio válido: ${corpusRoot}`);
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');

const STYLES = fs.readFileSync(path.join(publicDir, 'styles.css'), 'utf8');
const LAYOUT = fs.readFileSync(path.join(publicDir, 'layout.html'), 'utf8');
const GRAPH = JSON.parse(fs.readFileSync(path.join(dataDir, 'graph.json'), 'utf8'));

const corpusFiles = fs.readdirSync(corpusRoot);
const allowedImages = new Set(corpusFiles.filter((name) => /\.(png|jpe?g|gif|webp)$/i.test(name)));
const contextFile = corpusFiles.find((name) => name === 'context.md');
const thread1File = corpusFiles.find((name) => /thread1.*cartografia.*\.md$/i.test(name));
const thread2File = corpusFiles.find((name) => /thread2.*cartografia.*\.md$/i.test(name));

function readOrEmpty(fileName) {
  if (!fileName) return '';
  return fs.readFileSync(path.join(corpusRoot, fileName), 'utf8').replace(/\r\n/g, '\n');
}

const raw = {
  context: readOrEmpty(contextFile),
  thread1: readOrEmpty(thread1File),
  thread2: readOrEmpty(thread2File),
};

// ---------------------------------------------------------------------------
// Utilidades de parseo markdown
// ---------------------------------------------------------------------------

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripInline(markdown = '') {
  return markdown
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .trim();
}

function slug(text = '') {
  return stripInline(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function section(markdown, heading) {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start === -1) return '';
  const body = markdown.slice(start + marker.length);
  const nextHeading = body.search(/\n## |\n# /);
  return (nextHeading === -1 ? body : body.slice(0, nextHeading)).trim();
}

function firstCodeBlock(markdown) {
  const match = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : '';
}

function allCodeBlocks(markdown) {
  return [...markdown.matchAll(/```(?:\w+)?\n([\s\S]*?)```/g)].map((entry) => entry[1].trim());
}

function paragraphs(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.startsWith('```'))
    .filter((part) => !part.startsWith('|'))
    .filter((part) => !part.startsWith('- '))
    .filter((part) => !/^\d+\.\s/.test(part))
    .map((part) => stripInline(part));
}

function bulletList(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => stripInline(line.slice(2)));
}

function parseWeightedBlock(block) {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*?)\.{2,}\s*(\d+)%$/);
      if (!match) return null;
      return {
        label: stripInline(match[1].trim()),
        value: Number(match[2]),
      };
    })
    .filter(Boolean);
}

function parseTable(markdown) {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (lines.length < 3) return [];

  const headers = lines[0]
    .split('|')
    .slice(1, -1)
    .map((header) => slug(header));

  return lines.slice(2).map((line) => {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => stripInline(cell.trim()));

    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || '';
    });
    return row;
  });
}

function parseImages(markdown) {
  const images = [];
  const regex = /!\[([^\]]*)\]\(\.\/([^\)]+)\)\s*\n<ALT:\s*([\s\S]*?)>/g;
  let match;
  while ((match = regex.exec(markdown))) {
    images.push({
      label: stripInline(match[1]),
      file: match[2],
      alt: stripInline(match[3]),
    });
  }
  return images;
}

function parseQuotes(markdown) {
  const lines = markdown.split('\n');
  const entries = [];
  let speaker = '';
  let quote = [];

  function flush() {
    if (!quote.length) return;
    entries.push({
      speaker: stripInline(speaker || 'Fuente'),
      text: stripInline(quote.join(' ')),
    });
    quote = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[@')) {
      flush();
      speaker = trimmed;
      continue;
    }
    if (trimmed.startsWith('>')) {
      quote.push(trimmed.replace(/^>\s?/, ''));
      continue;
    }
    if (!trimmed) {
      flush();
    }
  }

  flush();
  return entries;
}

function parseThread(markdown, bridgeHeading) {
  const title = stripInline((markdown.match(/^#\s+(.+)$/m) || [])[1] || '');
  const headerBlock = firstCodeBlock(markdown)
    .split('\n')
    .map((line) => stripInline(line))
    .filter(Boolean);

  const eigenstates = parseTable(section(markdown, 'Eigenstates')).map((row, index) => ({
    id: `${slug(title)}-${index + 1}`,
    title: row.eigenstate || `Eigenstate ${index + 1}`,
    premise: row.axiomas_premisas_clave || '',
    anchor: row.referencia_de_anclaje || '',
    coords: row.coordenadas || '',
  }));

  return {
    title,
    headerBlock,
    lectura: paragraphs(section(markdown, 'Lectura inicial')),
    eigenstates,
    correction: firstCodeBlock(section(markdown, 'Correccion de marco')),
    mapBlock: firstCodeBlock(section(markdown, 'Mapa relacional')),
    conflict: parseWeightedBlock(firstCodeBlock(section(markdown, 'Etiqueta del conflicto'))),
    highlighted: allCodeBlocks(section(markdown, 'Eigenstates señalados')).map((item) => stripInline(item)),
    bridgeItems: bulletList(section(markdown, bridgeHeading)),
    resultBlock: firstCodeBlock(section(markdown, 'Resultado cartografico')),
  };
}

// ---------------------------------------------------------------------------
// Modelo de datos y parsing de tweets
// ---------------------------------------------------------------------------

function parseTweets(sectionContent) {
  const lines = sectionContent.split('\n');
  const posts = [];
  let currentPost = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    const isUserHeader = line.includes('[@') && (line.startsWith('[@') || line.startsWith('[') || line.includes('](https://x.com'));

    if (isUserHeader) {
      if (currentPost) {
        posts.push(currentPost);
      }
      currentPost = {
        header: line,
        name: '',
        contentLines: [],
        image: null
      };

      if (i > 0 && lines[i-1].trim().startsWith('**') && !lines[i-1].trim().startsWith('**Quote:**')) {
        currentPost.name = lines[i-1].trim();
      }
      continue;
    }

    if (currentPost) {
      const imgMatch = line.match(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/);
      if (imgMatch) {
        currentPost.image = {
          title: imgMatch[1],
          file: imgMatch[2],
          alt: ''
        };
        let k = i + 1;
        while (k < lines.length && !lines[k].trim()) k++;
        if (k < lines.length && lines[k].trim().startsWith('<ALT:')) {
          let altText = lines[k].trim().slice(5).trim();
          if (altText.endsWith('>')) altText = altText.slice(0, -1).trim();
          currentPost.image.alt = altText;
          i = k;
        }
      } else if (!line.startsWith('**Quote:**') && !line.startsWith('**') && !line.startsWith('<ALT:')) {
        currentPost.contentLines.push(line);
      }
    }
  }
  if (currentPost) {
    posts.push(currentPost);
  }

  return posts.map(post => {
    let cleanHeader = post.header
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="tweet-link">$1</a>');
    
    if (post.name) {
      const cleanName = post.name.replace(/\*\*/g, '');
      cleanHeader = `<strong>${escapeHtml(cleanName)}</strong> · ${cleanHeader}`;
    }

    const cleanText = post.contentLines
      .map(l => l.replace(/^>\s?/, '').trim())
      .filter(Boolean)
      .join('<br><br>');

    return {
      header: cleanHeader,
      text: cleanText,
      image: post.image
    };
  });
}

const contextOriginal = section(raw.context, 'Original Poster');
const contextThread1 = section(raw.context, 'Thread 1 — Comuna, infraestructura, Estado y Marx');
const contextThread2 = section(raw.context, 'Thread 2 — Marx, marxismo y "Marx no era marxista"');

const data = {
  corpus: {
    name: path.basename(corpusRoot),
    root: corpusRoot,
    files: { contextFile, thread1File, thread2File },
  },
  context: {
    original: parseTweets(contextOriginal),
    thread1: parseTweets(contextThread1),
    thread2: parseTweets(contextThread2),
  },
  thread1: parseThread(raw.thread1, 'Indice para Thread 2'),
  thread2: parseThread(raw.thread2, 'Puente hacia el archivo de proposiciones'),
  graph: GRAPH,
};

data.stats = {
  docs: [contextFile, thread1File, thread2File].filter(Boolean).length,
  images: 4, // Las 4 imágenes principales en los tweets
  thread1Eigenstates: data.thread1.eigenstates.length,
  thread2Eigenstates: data.thread2.eigenstates.length,
  bridges: 3,
};

// ---------------------------------------------------------------------------
// Render HTML
// ---------------------------------------------------------------------------

function navLink(viewId, label, currentView) {
  const active = currentView === viewId ? ' active' : '';
  return `<a class="nav-link${active}" href="/?view=${viewId}">${escapeHtml(label)}</a>`;
}

function renderTweetCard(tweet) {
  let imgHtml = '';
  if (tweet.image) {
    imgHtml = `
      <div class="tweet-image-container">
        <img src="/asset/${encodeURIComponent(tweet.image.file)}" alt="${escapeHtml(tweet.image.alt)}">
        <div class="tweet-alt-box">
          <strong>Leyenda / ALT:</strong> ${escapeHtml(tweet.image.alt || 'Sin descripción alt.')}
        </div>
      </div>
    `;
  }

  return `
    <article class="tweet-card">
      <header class="tweet-header">${tweet.header}</header>
      <div class="tweet-body">${tweet.text}</div>
      ${imgHtml}
    </article>
  `;
}

function renderBar(item) {
  return `<div class="bar-row"><div class="bar-head"><span>${escapeHtml(item.label)}</span><strong>${item.value}%</strong></div><div class="bar-track"><div class="bar-fill" style="width:${item.value}%"></div></div></div>`;
}

function renderEigenCard(item) {
  let shortAnchor = item.anchor;
  if (shortAnchor.includes('#')) {
    shortAnchor = shortAnchor.substring(shortAnchor.lastIndexOf('#') + 1);
  }

  return `
    <article class="eigen-card" style="border: 2px solid var(--ink); background: var(--paper); box-shadow: 4px 4px 0 var(--ink); padding: 14px; display: flex; flex-direction: column; justify-content: space-between; min-height: 190px;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--ink); padding-bottom: 6px; margin-bottom: 10px; font-family: monospace;">
          <span style="font-size: 11px; font-weight: bold; background: var(--ink); color: var(--paper); padding: 2px 6px; text-transform: uppercase;">${escapeHtml(item.coords || 'Φ')}</span>
          <span style="font-size: 11px; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.05em;">ANCLAJE: ${escapeHtml(shortAnchor)}</span>
        </div>
        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: bold; text-transform: uppercase; font-family: inherit;">${escapeHtml(item.title)}</h3>
        <p style="font-size: 13px; line-height: 1.4; margin: 0; color: var(--ink-soft); font-family: inherit;">${escapeHtml(item.premise)}</p>
      </div>
      <div style="font-size: 11px; border-top: 1px dashed rgba(13, 13, 13, 0.3); padding-top: 8px; margin-top: 12px; font-family: monospace; display: flex; justify-content: space-between;">
        <span>Foco: <a href="/?view=graph&focus=${encodeURIComponent(item.id)}" style="text-decoration: underline; font-weight: bold;">Ver en Mapa</a></span>
        <span class="muted">${escapeHtml(item.id)}</span>
      </div>
    </article>
  `;
}

function renderBulletList(items) {
  if (!items.length) return '<p class="muted">Sin items extraídos.</p>';
  return `<ul class="list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderHeaderMeta(lines) {
  return `<div class="pill-row">${lines.map((line) => `<span class="pill">${escapeHtml(line)}</span>`).join('')}</div>`;
}

function renderPre(title, text) {
  if (!text) return '';
  return `<section class="panel"><div class="section-head"><h2>${escapeHtml(title)}</h2></div><pre>${escapeHtml(text)}</pre></section>`;
}

function renderOverview() {
  return `
    <section class="panel hero-panel">
      <div>
        <span class="eyebrow">Nave de Análisis</span>
        <h1>thread-eigenstate-viewer</h1>
        <p>Bienvenido al módulo de visualización de Bot-Hilbert para el corpus temático <strong>yo-no-soy-yo-propositions-engine</strong>.</p>
      </div>
      <div class="hero-note">
        <strong>Propósito de la Nave</strong>
        <p>Esta nave web permite navegar debates en redes sociales extrayendo sus <strong>eigenstates</strong> (posiciones estables del campo) y trazando los <strong>puentes</strong> correctores de marco que cosen las disputas.</p>
      </div>
    </section>

    <section class="panel split" style="grid-template-columns: 1.1fr 0.9fr;">
      <article style="border-right: 1px dashed var(--ink); padding-right: 20px;">
        <h2 style="text-transform: uppercase; font-size: 15px; margin-bottom: 12px; border-bottom: 1px solid var(--ink); padding-bottom: 6px;">Estructura del Área de Pilotaje</h2>
        <p style="font-size: 14px; margin-bottom: 14px;">El visor organiza el campo conceptual en secciones para un análisis graduado del debate:</p>
        <ul class="list" style="font-size: 13px;">
          <li><strong>Mapa Relacional:</strong> Grafo interactivo responsivo que mapea los debates, puentes de corrección y estados lógicos de ambos hilos.</li>
          <li><strong>Thread 1:</strong> Análisis de la escala de infraestructura, la representatividad, la transición estatal obrera y el comunalismo.</li>
          <li><strong>Thread 2:</strong> Desglose del debate doctrinal ("no soy marxista"), la codificación y la metapolítica detrás de los memes políticos.</li>
          <li><strong>Corpus Original:</strong> La captura fáctica en bruto del diálogo secuencial, integrando las imágenes y memes de forma cronológica.</li>
        </ul>
      </article>

      <article style="padding-left: 10px;">
        <h2 style="text-transform: uppercase; font-size: 15px; margin-bottom: 12px; border-bottom: 1px solid var(--ink); padding-bottom: 6px;">Protocolo Cartográfico</h2>
        <p style="font-size: 14px; margin-bottom: 14px;">Siguiendo las disposiciones de Bot-Hilbert, esta nave ejecuta un filtrado para evitar la atomización de los argumentos:</p>
        <ol class="list" style="font-size: 13px; list-style-type: decimal; padding-left: 0;">
          <li><strong>Señalar Eigenstates:</strong> Ubica las posiciones teóricas que actúan como sumideros gravitatorios del debate.</li>
          <li><strong>Anclar Referencias:</strong> Conecta directamente cada eigenstate con la cita textual exacta de la que emerge.</li>
          <li><strong>Trazar Puentes:</strong> Revela las operaciones metapolíticas que asocian o separan conceptos de forma no-trivial.</li>
        </ol>
      </article>
    </section>

    <section class="panel">
      <div class="section-head"><h2>Documentación de Sede</h2></div>
      <p style="font-size: 13px; margin: 0;">La configuración, dependencias y reglas de esta nave viven en el repo en el archivo [parking/thread-eigenstate-viewer/README.md](parking/thread-eigenstate-viewer/README.md) y se rigen bajo los parámetros del manifiesto oficial [parking/thread-eigenstate-viewer/.meta/manifest.md](parking/thread-eigenstate-viewer/.meta/manifest.md).</p>
    </section>
  `;
}

function renderGraph(focusId) {
  const nodesById = Object.fromEntries(data.graph.nodes.map((node) => [node.id, node]));
  const focus = nodesById[focusId] || nodesById['bridge-antiestatismo'];
  const width = 1200;
  const height = 850;

  const lines = data.graph.edges
    .filter(([from, to]) => nodesById[from] && nodesById[to])
    .map(([from, to, kind]) => {
      const source = nodesById[from];
      const target = nodesById[to];
      return `<line x1="${source.x + 110}" y1="${source.y + 35}" x2="${target.x + 110}" y2="${target.y + 35}" class="edge edge-${kind}"></line>`;
    })
    .join('');

  const nodes = data.graph.nodes
    .map((node) => {
      const activeClass = focus.id === node.id ? ' active' : '';
      return `
        <foreignObject x="${node.x}" y="${node.y}" width="220" height="70">
          <a href="/?view=graph&focus=${encodeURIComponent(node.id)}" class="node node-${node.type}${activeClass}">
            <span>${escapeHtml(node.label)}</span>
          </a>
        </foreignObject>
      `;
    })
    .join('');

  return `
    <section class="panel">
      <div class="section-head"><h2>Mapa relacional</h2><span>Threads a izquierda y derecha · corpus y puentes al centro (Responsivo)</span></div>
      <div class="graph-shell">
        <div class="graph-wrap" style="overflow: visible; padding: 12px; display: flex; justify-content: center; align-items: center;">
          <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" style="max-width: 100%; display: block; overflow: visible;" aria-hidden="true">
            ${lines}
            ${nodes}
          </svg>
        </div>
        <aside class="detail-card">
          <span class="eyebrow">Foco activo</span>
          <h3>${escapeHtml(focus.label.replace(/\n/g, ' · '))}</h3>
          <p>${escapeHtml(focus.detail)}</p>
          <dl>
            <dt>Tipo</dt>
            <dd>${escapeHtml(focus.type)}</dd>
            <dt>Hilo</dt>
            <dd>${focus.id.startsWith('t1') || focus.id === 'thread1-core' ? 'Thread 1' : focus.id.startsWith('t2') || focus.id === 'thread2-core' ? 'Thread 2' : 'Contexto / Puentes'}</dd>
          </dl>
        </aside>
      </div>
    </section>
    <section class="panel split">
      <article>
        <div class="section-head"><h2>Puentes</h2></div>
        ${renderBulletList([
          'Thread 1 corrige el salto antiestatismo final → anarquismo.',
          'Thread 2 corrige el salto nombre propio → identidad doctrinal cerrada.',
          'Los memes del corpus arrastran línea política implícita y entran al mapa como evidencia.',
        ])}
      </article>
      <article>
        <div class="section-head"><h2>Cómo leer el escenario</h2></div>
        ${renderBulletList([
          'Empieza por Corpus para entender qué dispara cada disputa.',
          'Salta a Puente 01 si quieres el nudo Marx / anarquismo.',
          'Salta a Puente 02 si quieres Marx histórico frente a marxismos posteriores.',
          'Salta a Puente 03 si quieres la capa memética del debate.',
        ])}
      </article>
    </section>
  `;
}

function renderThread(thread, viewId) {
  const bridgeHeading = viewId === 'thread1' ? 'Índice para Thread 2' : 'Puente hacia el archivo de proposiciones';
  return `
    <section class="panel hero-panel">
      <div>
        <span class="eyebrow">${escapeHtml(viewId.toUpperCase())}</span>
        <h1>${escapeHtml(thread.title)}</h1>
        <p>${escapeHtml(thread.lectura[0] || '')}</p>
      </div>
      <div>${renderHeaderMeta(thread.headerBlock)}</div>
    </section>
    <section class="panel split">
      <article>
        <div class="section-head"><h2>Lectura inicial</h2></div>
        ${thread.lectura.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </article>
      <article>
        <div class="section-head"><h2>Composición del conflicto</h2></div>
        <div class="bars">${thread.conflict.map(renderBar).join('')}</div>
      </article>
    </section>
    ${renderPre('Corrección de marco', thread.correction)}
    ${renderPre('Mapa relacional', thread.mapBlock)}
    <section class="panel">
      <div class="section-head"><h2>Eigenstates</h2><span>${thread.eigenstates.length} eigenstates conceptuales</span></div>
      <div class="eigen-grid">${thread.eigenstates.map(renderEigenCard).join('')}</div>
    </section>
    ${thread.highlighted.length ? `<section class="panel"><div class="section-head"><h2>Focos señalados</h2></div><div class="highlight-list">${thread.highlighted.map((item) => `<article class="highlight-card"><pre>${escapeHtml(item)}</pre></article>`).join('')}</div></section>` : ''}
    ${thread.bridgeItems.length ? `<section class="panel"><div class="section-head"><h2>${escapeHtml(bridgeHeading)}</h2></div>${renderBulletList(thread.bridgeItems)}</section>` : ''}
    ${thread.resultBlock ? renderPre('Resultado cartográfico', thread.resultBlock) : ''}
  `;
}

function renderContext() {
  return `
    <section class="panel hero-panel">
      <div>
        <span class="eyebrow">Corpus</span>
        <h1>Conversación original</h1>
        <p>Lectura del feed capturado en [context.md](examples/yo-no-soy-yo-propositions-engine/context.md) estructurado en hilos secuenciales completos con sus memes integrados.</p>
      </div>
      <div class="hero-note">
        <strong>Guía del corpus</strong>
        <p>Abajo verás la secuencia exacta de tweets y quotes de cada hilo en su contexto cronológico.</p>
      </div>
    </section>

    <section class="panel">
      <div class="section-head"><h2>Original Poster</h2><span>Tuit disparador y quote original</span></div>
      <div class="thread-container">
        ${data.context.original.map(renderTweetCard).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="section-head"><h2>Thread 1</h2><span>Comuna, infraestructura, Estado y Marx</span></div>
      <div class="thread-container">
        ${data.context.thread1.map(renderTweetCard).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="section-head"><h2>Thread 2</h2><span>Marx, marxismo y la frase "Marx no era marxista"</span></div>
      <div class="thread-container">
        ${data.context.thread2.map(renderTweetCard).join('')}
      </div>
    </section>
  `;
}

function renderView(viewId, focusId) {
  if (viewId === 'graph') return renderGraph(focusId);
  if (viewId === 'thread1') return renderThread(data.thread1, 'thread1');
  if (viewId === 'thread2') return renderThread(data.thread2, 'thread2');
  if (viewId === 'context') return renderContext();
  return renderOverview();
}

function renderPage(viewId, focusId) {
  const body = renderView(viewId, focusId);
  const nav = [
    navLink('overview', 'Overview', viewId),
    navLink('graph', 'Mapa', viewId),
    navLink('thread1', 'Thread 1', viewId),
    navLink('thread2', 'Thread 2', viewId),
    navLink('context', 'Corpus', viewId),
  ].join('');

  const title = 'thread-eigenstate-viewer';
  const footer = `Corpus: ${escapeHtml(data.corpus.name)} · /api/data · Ctrl+C para salir`;

  return LAYOUT
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
    .replace(/\{\{CORPUS_NAME\}\}/g, escapeHtml(data.corpus.name))
    .replace('{{NAV}}', nav)
    .replace('{{BODY}}', body)
    .replace('{{FOOTER}}', footer);
}

// ---------------------------------------------------------------------------
// Servidor
// ---------------------------------------------------------------------------

const validViews = new Set(['overview', 'graph', 'thread1', 'thread2', 'context']);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (url.pathname === '/static/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(STYLES);
    return;
  }

  if (url.pathname === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  if (url.pathname.startsWith('/asset/')) {
    const fileName = path.basename(decodeURIComponent(url.pathname.replace('/asset/', '')));
    if (!allowedImages.has(fileName)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Asset no encontrado');
      return;
    }
    const ext = path.extname(fileName).toLowerCase();
    const mime =
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.gif' ? 'image/gif' :
      ext === '.webp' ? 'image/webp' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
    fs.createReadStream(path.join(corpusRoot, fileName)).pipe(res);
    return;
  }

  const viewParam = url.searchParams.get('view');
  const viewId = validViews.has(viewParam) ? viewParam : 'overview';
  const focusId = url.searchParams.get('focus') || 'bridge-antiestatismo';
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(renderPage(viewId, focusId));
});

function start() {
  const basePort = Number(process.env.PORT) || 43127;
  const ports = [basePort, basePort + 1, basePort + 2, basePort + 3];
  let index = 0;

  function attempt() {
    if (index >= ports.length) {
      console.error('[thread-eigenstate-viewer] sin puertos libres en el rango');
      process.exit(1);
      return;
    }
    const port = ports[index++];
    server.once('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        attempt();
        return;
      }
      console.error(error.stack || error.message);
      process.exit(1);
    });
    server.listen(port, '127.0.0.1', () => {
      console.log(`[thread-eigenstate-viewer] corpus=${data.corpus.name}`);
      console.log(`[thread-eigenstate-viewer] http://127.0.0.1:${port}/?view=graph`);
    });
  }

  attempt();
}

start();
