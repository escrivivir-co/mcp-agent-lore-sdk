const contentDiv = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-link[data-target]');
const mainLayout = document.getElementById('main-layout');
const sidebar = document.getElementById('sidebar');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');
const detailCard = document.getElementById('node-detail');
const alephControls = document.getElementById('aleph-controls');

let markdownData = {};
let graphData = null;
let activeLayers = new Set(['thread1', 'thread2', 'juntura', 'context', 'rojo-negro']);


// ── Data loading ─────────────────────────────────────────────────────────────
async function loadData() {
  contentDiv.innerHTML = '<p class="loading">Cargando mapa desde la biblioteca...</p>';
  try {
    const mdResponse = await fetch('../../../biblioteca/yo-no-soy-yo-propositions-engine/mapa.md');
    if (!mdResponse.ok) throw new Error(`MD error! status: ${mdResponse.status}`);
    const markdownText = await mdResponse.text();
    const parsedText = markdownText.replace(/\.\/assets\//g, '../../../biblioteca/yo-no-soy-yo-propositions-engine/assets/');

    const sections = parsedText.split('\n## ');
    markdownData.planos = '## ' + (sections.find(s => s.startsWith('0. Planos de la nave')) || '');
    markdownData.overview = sections[0] + '\n## ' + (sections.find(s => s.startsWith('0. Leyenda')) || '');
    markdownData.context = '## ' + (sections.find(s => s.startsWith('1. Contexto')) || '');
    markdownData.thread1 = '## ' + (sections.find(s => s.startsWith('2. Cartografía Thread 1')) || '');
    markdownData.thread2 = '## ' + (sections.find(s => s.startsWith('3. Cartografia Thread 2')) || '');
    markdownData.espectro = '## ' + (sections.find(s => s.startsWith('4. Sub-espectro')) || '');

    const jsonResponse = await fetch('../../../biblioteca/yo-no-soy-yo-propositions-engine/mapa.graph.json');
    if (jsonResponse.ok) {
      graphData = await jsonResponse.json();
      initGraphLayers();
    }

    const activeTarget = document.querySelector('.nav-link.active').dataset.target;
    renderSection(activeTarget);
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: #f85149;">Error cargando datos: ${error.message}</p>`;
  }
}

// ── Routing ───────────────────────────────────────────────────────────────────
function renderSection(targetId) {
  // Update active state — include dropdown items
  document.querySelectorAll('.nav-link[data-target]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });

  if (targetId === 'mapa') {
    mainLayout.classList.add('graph-shell');
    sidebar.style.display = 'block';
    renderGraph();
  } else if (targetId === 'eigenstates') {
    mainLayout.classList.remove('graph-shell');
    sidebar.style.display = 'none';
    renderEigenstates();
  } else if (targetId === 'alephs') {
    mainLayout.classList.remove('graph-shell');
    sidebar.style.display = 'none';
    renderAlephs();
  } else if (targetId === 'forks') {
    mainLayout.classList.remove('graph-shell');
    sidebar.style.display = 'none';
    renderForks();
  } else {
    mainLayout.classList.remove('graph-shell');
    sidebar.style.display = 'none';
    const mdContent = markdownData[targetId];
    if (mdContent && !mdContent.startsWith('## undefined') && !mdContent.startsWith('## null')) {
      contentDiv.innerHTML = marked.parse(mdContent);
    } else {
      contentDiv.innerHTML = '<p>Sección no encontrada o vacía.</p>';
    }
  }
}

// ── Eigenstates tab ───────────────────────────────────────────────────────────
const LAYER_LABELS = {
  thread1: '🗣 Thread 1',
  thread2: '📜 Thread 2',
  juntura: '🔗 Juntura',
  context: '📌 Contexto',
  'rojo-negro': '🔴⬛ Sub-espectro'
};

const SUB_LABELS = {
  rojo: '🔴 Rojo',
  negro: '⬛ Negro',
  'rojo-negro': '🔴⬛ Rojo-Negro'
};

function renderEigenstates() {
  if (!graphData) { contentDiv.innerHTML = '<p>Grafo no cargado.</p>'; return; }

  const layers = [...new Set(graphData.nodes.map(n => n.layer))];

  // Filter bar
  let filterHtml = `<div class="filter-bar" style="margin-bottom:18px; display:flex; flex-wrap:wrap; gap:8px;">
    <button class="filter-btn active" data-layer="all" style="padding:5px 12px; border:2px solid var(--ink); background:var(--ink); color:var(--paper); font-family:inherit; font-size:11px; text-transform:uppercase; letter-spacing:.18em; cursor:pointer;">Todos</button>`;
  layers.forEach(l => {
    filterHtml += `<button class="filter-btn" data-layer="${l}" style="padding:5px 12px; border:2px solid var(--ink); background:transparent; color:var(--ink); font-family:inherit; font-size:11px; text-transform:uppercase; letter-spacing:.18em; cursor:pointer;">${LAYER_LABELS[l] || l}</button>`;
  });
  filterHtml += '</div>';

  function buildCards(filterLayer) {
    const nodes = filterLayer === 'all' ? graphData.nodes : graphData.nodes.filter(n => n.layer === filterLayer);
    let html = '<div class="eigen-grid">';
    nodes.forEach(n => {
      const layerLabel = LAYER_LABELS[n.layer] || n.layer;
      const subLabel = n.sub ? (SUB_LABELS[n.sub] || n.sub) : '';
      const forksHtml = (n.forks || []).map(f => `<span class="crossref-pill">${f}</span>`).join('');
      const crossrefHtml = n.crossref ? `<span class="crossref-pill crossref-pill--alias">≡ ${n.crossref}</span>` : '';
      html += `
        <div class="eigen-card">
          <div class="eigen-meta">
            <div class="eigen-meta-item"><strong>ID</strong>${n.id}</div>
            <div class="eigen-meta-item"><strong>Capa</strong>${layerLabel}${subLabel ? ' · ' + subLabel : ''}</div>
          </div>
          <div class="eigen-body">
            <h3 class="eigen-title">${n.title}</h3>
            ${n.axioms ? `<p class="eigen-premise">${n.axioms}</p>` : ''}
          </div>
          <div class="eigen-footer">
            ${n.reference ? `<span style="color:var(--ink-soft); font-size:11px;">${n.reference}</span>` : ''}
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${forksHtml}${crossrefHtml}</div>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  }

  contentDiv.innerHTML = `
    <div class="panel">
      <div class="section-head"><h2>Catálogo de Eigenstates</h2><span>${graphData.nodes.length} estados</span></div>
      ${filterHtml}
      <div id="eigen-cards-container">${buildCards('all')}</div>
    </div>`;

  contentDiv.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      contentDiv.querySelectorAll('.filter-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--ink)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--ink)';
      btn.style.color = 'var(--paper)';
      btn.classList.add('active');
      document.getElementById('eigen-cards-container').innerHTML = buildCards(btn.dataset.layer);
    });
  });
}

// ── Alephs tab ────────────────────────────────────────────────────────────────
function renderAlephs() {
  const overview = markdownData.overview && !markdownData.overview.startsWith('## undefined') ? markdownData.overview : '';
  const planos = markdownData.planos && !markdownData.planos.startsWith('## undefined') ? markdownData.planos : '';
  const combined = [overview, planos].filter(Boolean).join('\n\n');
  if (!combined) { contentDiv.innerHTML = '<p>Sin contenido.</p>'; return; }
  contentDiv.innerHTML = marked.parse(combined);
}

// ── Forks tab ─────────────────────────────────────────────────────────────────
const FORK_SYMBOLS = ['⊢', '⊬', '⊘', '⥱', '⟲', '≈', 'alias', 'bridges', 'contains'];
const FORK_COLORS = {
  '⊢': '#28a745', '⊬': '#d73a49', '⊘': '#6a737d',
  '⥱': '#e36209', '⟲': '#6f42c1', '≈': '#0366d6',
  'alias': '#005cc5', 'bridges': '#24292e', 'contains': '#586069'
};

function renderForks() {
  if (!graphData) { contentDiv.innerHTML = '<p>Grafo no cargado.</p>'; return; }

  let filterHtml = `<div class="filter-bar" style="margin-bottom:18px; display:flex; flex-wrap:wrap; gap:8px;">
    <button class="fork-filter-btn active" data-sym="all" style="padding:5px 12px; border:2px solid var(--ink); background:var(--ink); color:var(--paper); font-family:inherit; font-size:11px; cursor:pointer; letter-spacing:.1em;">Todos</button>`;
  FORK_SYMBOLS.forEach(sym => {
    filterHtml += `<button class="fork-filter-btn" data-sym="${sym}" style="padding:5px 12px; border:2px solid ${FORK_COLORS[sym] || '#000'}; background:transparent; color:${FORK_COLORS[sym] || '#000'}; font-family:inherit; font-size:13px; cursor:pointer;">${sym}</button>`;
  });
  filterHtml += '</div>';

  function buildTable(filterSym) {
    const edges = filterSym === 'all' ? graphData.edges : graphData.edges.filter(e => e.type.includes(filterSym));
    let html = `<table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead><tr style="border-bottom:2px solid var(--ink);">
        <th style="text-align:left; padding:6px 8px; font-size:11px; text-transform:uppercase; letter-spacing:.18em;">Origen</th>
        <th style="text-align:left; padding:6px 8px; font-size:11px; text-transform:uppercase; letter-spacing:.18em;">Tipo</th>
        <th style="text-align:left; padding:6px 8px; font-size:11px; text-transform:uppercase; letter-spacing:.18em;">Destino</th>
        <th style="text-align:left; padding:6px 8px; font-size:11px; text-transform:uppercase; letter-spacing:.18em;">Títulos</th>
      </tr></thead><tbody>`;
    edges.forEach((e, i) => {
      const sId = typeof e.source === 'object' ? e.source.id : e.source;
      const tId = typeof e.target === 'object' ? e.target.id : e.target;
      const sNode = graphData.nodes.find(n => n.id === sId);
      const tNode = graphData.nodes.find(n => n.id === tId);
      const symKey = Object.keys(FORK_COLORS).find(k => e.type.includes(k)) || '';
      const color = FORK_COLORS[symKey] || '#000';
      html += `<tr style="border-bottom:1px dashed rgba(13,13,13,.3); background:${i % 2 ? 'rgba(13,13,13,.03)' : 'transparent'};">
        <td style="padding:6px 8px; font-weight:700;">${sId}</td>
        <td style="padding:6px 8px; color:${color}; font-weight:700;">${e.type}</td>
        <td style="padding:6px 8px; font-weight:700;">${tId}</td>
        <td style="padding:6px 8px; color:var(--ink-soft); font-size:12px;">${sNode ? sNode.title : '?'} → ${tNode ? tNode.title : '?'}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    if (edges.length === 0) html = '<p style="color:var(--ink-soft);">Sin forks para este filtro.</p>';
    return html;
  }

  contentDiv.innerHTML = `<div class="panel">
    <div class="section-head"><h2>Inventario de Forks</h2><span>${graphData.edges.length} aristas</span></div>
    ${filterHtml}
    <div id="forks-table-container">${buildTable('all')}</div>
  </div>`;

  contentDiv.querySelectorAll('.fork-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      contentDiv.querySelectorAll('.fork-filter-btn').forEach(b => {
        const sym = b.dataset.sym;
        const c = FORK_COLORS[sym] || 'var(--ink)';
        b.style.background = 'transparent';
        b.style.color = c;
        b.style.borderColor = c;
        b.classList.remove('active');
      });
      btn.style.background = btn.dataset.sym === 'all' ? 'var(--ink)' : (FORK_COLORS[btn.dataset.sym] || 'var(--ink)');
      btn.style.color = 'var(--paper)';
      btn.classList.add('active');
      document.getElementById('forks-table-container').innerHTML = buildTable(btn.dataset.sym);
    });
  });
}

// ── Graph layer toggles ───────────────────────────────────────────────────────
function initGraphLayers() {
  const layers = [...new Set(graphData.nodes.map(n => n.layer))];
  alephControls.innerHTML = '';
  layers.forEach(layer => {
    if (!layer) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <label style="display:flex; gap:8px; cursor:pointer; font-size:12px;">
        <input type="checkbox" ${activeLayers.has(layer) ? 'checked' : ''} data-layer="${layer}">
        ${LAYER_LABELS[layer] || layer}
      </label>
    `;
    alephControls.appendChild(div);
  });

  alephControls.querySelectorAll('input').forEach(chk => {
    chk.addEventListener('change', (e) => {
      if (e.target.checked) activeLayers.add(e.target.dataset.layer);
      else activeLayers.delete(e.target.dataset.layer);
      renderGraph();
    });
  });
}

// ── Node detail card ──────────────────────────────────────────────────────────
function showNodeDetail(node) {
  detailCard.style.display = 'block';
  const layerLabel = LAYER_LABELS[node.layer] || node.layer;
  const subLabel = node.sub ? ` · ${SUB_LABELS[node.sub] || node.sub}` : '';
  const forksHtml = (node.forks || []).length
    ? node.forks.map(f => `<span class="crossref-pill">${f}</span>`).join('')
    : '<em style="color:var(--ink-soft);">—</em>';
  const crossrefHtml = node.crossref
    ? `<span class="crossref-pill crossref-pill--alias">≡ ${node.crossref}</span>`
    : '';

  detailTitle.textContent = `${node.id} — ${node.title}`;
  detailBody.innerHTML = `
    <div style="font-size:12px; line-height:1.5;">
      <p style="margin-bottom:6px;"><strong>Capa:</strong> ${layerLabel}${subLabel}</p>
      ${node.axioms ? `<p style="margin-bottom:6px; color:var(--ink-soft);">${node.axioms}</p>` : ''}
      ${node.reference ? `<p style="margin-bottom:6px; font-size:11px; border-top:1px dashed rgba(13,13,13,.3); padding-top:6px;"><strong>Ref:</strong> ${node.reference}</p>` : ''}
      ${(node.forks || []).length ? `<p style="margin-bottom:4px; font-size:11px;"><strong>Forks:</strong></p><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">${forksHtml}</div>` : ''}
      ${node.crossref ? `<div style="margin-top:4px;">${crossrefHtml}</div>` : ''}
    </div>`;
}

// ── Force graph ───────────────────────────────────────────────────────────────
const LAYER_CENTERS = {
  context: { x: 500, y: 60 },
  thread1: { x: 200, y: 300 },
  thread2: { x: 800, y: 300 },
  juntura: { x: 500, y: 520 },
  'rojo-negro': { x: 500, y: 750 }
};

const NODE_COLORS = {
  thread1: '#ffefc0',
  thread2: '#c0e8ff',
  juntura: '#e0c0ff',
  context: '#c0ffc8',
  'rojo-negro': '#ffc0c0'
};

function renderGraph() {
  if (!graphData) return;

  const nodes = graphData.nodes.filter(n => activeLayers.has(n.layer));
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = graphData.edges.filter(e => {
    const sId = typeof e.source === 'object' ? e.source.id : e.source;
    const tId = typeof e.target === 'object' ? e.target.id : e.target;
    return nodeIds.has(sId) && nodeIds.has(tId);
  });

  // Init positions if needed
  nodes.forEach(n => {
    if (n.x === undefined) {
      const c = LAYER_CENTERS[n.layer] || { x: 500, y: 400 };
      n.x = c.x + (Math.random() - 0.5) * 200;
      n.y = c.y + (Math.random() - 0.5) * 200;
      n.vx = 0; n.vy = 0;
    }
  });

  // Force simulation
  for (let i = 0; i < 200; i++) {
    nodes.forEach(n1 => {
      nodes.forEach(n2 => {
        if (n1 === n2) return;
        let dx = n1.x - n2.x; let dy = n1.y - n2.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let f = 2800 / (dist * dist);
        n1.vx += (dx / dist) * f; n1.vy += (dy / dist) * f;
      });
    });
    edges.forEach(e => {
      const sId = typeof e.source === 'object' ? e.source.id : e.source;
      const tId = typeof e.target === 'object' ? e.target.id : e.target;
      const s = nodes.find(n => n.id === sId);
      const t = nodes.find(n => n.id === tId);
      if (!s || !t) return;
      let dx = t.x - s.x; let dy = t.y - s.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let f = (dist - 120) * 0.04;
      s.vx += (dx / dist) * f; s.vy += (dy / dist) * f;
      t.vx -= (dx / dist) * f; t.vy -= (dy / dist) * f;
    });
    // Cluster gravity toward layer centers
    nodes.forEach(n => {
      const c = LAYER_CENTERS[n.layer] || { x: 500, y: 400 };
      n.vx += (c.x - n.x) * 0.015;
      n.vy += (c.y - n.y) * 0.015;
      n.x += n.vx * 0.1; n.y += n.vy * 0.1;
      n.vx *= 0.8; n.vy *= 0.8;
    });
  }

  const W = 1000; const H = 900;
  let svgHtml = `<svg width="100%" height="900" viewBox="0 0 ${W} ${H}" style="background:#fff; border:2px solid #000;">`;

  // Layer cluster labels
  Object.entries(LAYER_CENTERS).forEach(([layer, c]) => {
    if (!activeLayers.has(layer)) return;
    svgHtml += `<text x="${c.x}" y="${c.y - 10}" fill="rgba(13,13,13,.18)" font-size="13" text-anchor="middle" font-family="monospace" font-weight="bold">${LAYER_LABELS[layer] || layer}</text>`;
  });

  // Edges
  edges.forEach(e => {
    const sId = typeof e.source === 'object' ? e.source.id : e.source;
    const tId = typeof e.target === 'object' ? e.target.id : e.target;
    const s = nodes.find(n => n.id === sId);
    const t = nodes.find(n => n.id === tId);
    if (!s || !t) return;
    const symKey = Object.keys(FORK_COLORS).find(k => e.type.includes(k)) || '';
    const color = FORK_COLORS[symKey] || '#aaa';
    const dasharray = e.type.includes('⥱') ? '4 4' : e.type.includes('⟲') ? '2 4' : e.type.includes('alias') ? '1 3' : '';
    svgHtml += `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="${color}" stroke-width="1.5" ${dasharray ? `stroke-dasharray="${dasharray}"` : ''} opacity="0.75"/>`;
    const mx = ((s.x + t.x) / 2).toFixed(1);
    const my = ((s.y + t.y) / 2).toFixed(1);
    svgHtml += `<text x="${mx}" y="${my}" fill="${color}" font-size="9" text-anchor="middle" font-family="monospace">${e.type}</text>`;
  });

  // Nodes
  nodes.forEach(n => {
    const fill = NODE_COLORS[n.layer] || '#f0f0f0';
    const isSmall = ['context'].includes(n.layer);
    const r = isSmall ? 18 : 22;
    svgHtml += `
      <g transform="translate(${n.x.toFixed(1)}, ${n.y.toFixed(1)})" style="cursor:pointer;" class="graph-node" data-id="${n.id}">
        <circle r="${r}" fill="${fill}" stroke="#000" stroke-width="2"/>
        <text y="4" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">${n.id}</text>
      </g>`;
  });

  svgHtml += '</svg>';

  contentDiv.innerHTML = `<div class="graph-wrap graph-stage" style="width:100%; overflow:auto;">${svgHtml}</div>`;

  document.querySelectorAll('.graph-node').forEach(el => {
    el.addEventListener('click', () => {
      const node = nodes.find(n => n.id === el.dataset.id);
      if (node) showNodeDetail(node);
    });
  });
}

// ── Nav events ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-link[data-target]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    renderSection(btn.dataset.target);
  });
});

// Dropdown toggle
const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
if (dropdownToggle) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const menu = dropdownToggle.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      const menu = document.querySelector('.nav-dropdown-menu');
      if (menu) menu.style.display = 'none';
    }
  });
}

loadData();
