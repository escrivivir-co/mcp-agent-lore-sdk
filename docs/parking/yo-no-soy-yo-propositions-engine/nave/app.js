const contentDiv = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-link');
const mainLayout = document.getElementById('main-layout');
const sidebar = document.getElementById('sidebar');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');
const detailCard = document.getElementById('node-detail');
const alephControls = document.getElementById('aleph-controls');

let markdownData = {};
let graphData = null;
let activeLayers = new Set(['thread1', 'thread2', 'juntura', 'context']);

async function loadData() {
  contentDiv.innerHTML = '<p class="loading">Cargando mapa desde la biblioteca...</p>';
  try {
    const mdResponse = await fetch('../../../biblioteca/yo-no-soy-yo-propositions-engine/mapa.md');
    if (!mdResponse.ok) throw new Error(`MD error! status: ${mdResponse.status}`);
    const markdownText = await mdResponse.text();
    const parsedText = markdownText.replace(/.\/assets\//g, '../../../biblioteca/yo-no-soy-yo-propositions-engine/assets/');
    
    const sections = parsedText.split('\n## ');
    markdownData.overview = sections[0] + '\n## ' + (sections.find(s => s.startsWith('0. Leyenda')) || '');
    markdownData.context = '## ' + sections.find(s => s.startsWith('1. Contexto'));
    markdownData.thread1 = '## ' + sections.find(s => s.startsWith('2. Cartografía Thread 1'));
    markdownData.thread2 = '## ' + sections.find(s => s.startsWith('3. Cartografia Thread 2'));
    markdownData.total = '## ' + sections.find(s => s.startsWith('4. Vista Total'));
    
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

function renderSection(targetId) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
  
  if (targetId === 'mapa') {
    mainLayout.classList.add('graph-shell');
    sidebar.style.display = 'block';
    renderGraph();
  } else {
    mainLayout.classList.remove('graph-shell');
    sidebar.style.display = 'none';
    const mdContent = markdownData[targetId];
    if (mdContent && !mdContent.startsWith('## undefined')) {
      contentDiv.innerHTML = marked.parse(mdContent);
    } else {
      contentDiv.innerHTML = '<p>Sección no encontrada o vacía.</p>';
    }
  }
}

function initGraphLayers() {
  const layers = new Set(graphData.nodes.map(n => n.layer));
  alephControls.innerHTML = '';
  layers.forEach(layer => {
    if(!layer) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <label style="display:flex; gap:8px; cursor:pointer;">
        <input type="checkbox" checked data-layer="${layer}"> aleph-${layer}
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

function showNodeDetail(node) {
  detailCard.style.display = 'block';
  detailTitle.textContent = node.id;
  detailBody.innerHTML = `
    <strong>${node.title}</strong>
    <p style="margin-top:8px; color:#555;">Tipo: ${node.type}<br>Capa: ${node.layer}</p>
  `;
}

function renderGraph() {
  if (!graphData) return;
  
  // Filtrar por capas
  const nodes = graphData.nodes.filter(n => activeLayers.has(n.layer));
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = graphData.edges.filter(e => {
    let sId = typeof e.source === 'object' ? e.source.id : e.source;
    let tId = typeof e.target === 'object' ? e.target.id : e.target;
    return nodeIds.has(sId) && nodeIds.has(tId);
  });

  // Simple force layout
  nodes.forEach(n => {
    if(n.x === undefined) {
      n.x = Math.random() * 800; n.y = Math.random() * 600; 
      n.vx = 0; n.vy = 0;
    }
  });

  for (let i = 0; i < 150; i++) {
    nodes.forEach(n1 => {
      nodes.forEach(n2 => {
        if (n1 === n2) return;
        let dx = n1.x - n2.x; let dy = n1.y - n2.y;
        let dist = Math.sqrt(dx*dx + dy*dy) || 1;
        let f = 3000 / (dist * dist);
        n1.vx += (dx/dist) * f; n1.vy += (dy/dist) * f;
      });
    });
    edges.forEach(e => {
      let s = nodes.find(n => n.id === (e.source.id || e.source));
      let t = nodes.find(n => n.id === (e.target.id || e.target));
      if (!s || !t) return;
      let dx = t.x - s.x; let dy = t.y - s.y;
      let dist = Math.sqrt(dx*dx + dy*dy) || 1;
      let f = (dist - 150) * 0.05;
      s.vx += (dx/dist) * f; s.vy += (dy/dist) * f;
      t.vx -= (dx/dist) * f; t.vy -= (dy/dist) * f;
      // Add slight downward pressure for children
      t.vy += 0.5;
    });
    nodes.forEach(n => {
      n.vx += (400 - n.x) * 0.01;
      n.vy += (300 - n.y) * 0.01;
      n.x += n.vx * 0.1; n.y += n.vy * 0.1;
      n.vx *= 0.8; n.vy *= 0.8;
    });
  }

  let svgHtml = '<svg width="100%" height="800" viewBox="0 0 800 600" style="background:#fff; border:2px solid #000;">';
  
  // Draw edges
  edges.forEach(e => {
    let s = nodes.find(n => n.id === (e.source.id || e.source));
    let t = nodes.find(n => n.id === (e.target.id || e.target));
    let strokeClass = e.type.includes('⊬') ? 'stroke: #d73a49;' : 
                      e.type.includes('⥱') ? 'stroke: #e36209; stroke-dasharray: 4 4;' : 
                      e.type.includes('⟲') ? 'stroke: #6f42c1; stroke-dasharray: 2 4;' : 
                      e.type.includes('⊘') ? 'stroke: #6a737d;' : 'stroke: #28a745;';
    
    svgHtml += `<line x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" style="${strokeClass} stroke-width:2;" />`;
    // edge label
    let mx = (s.x + t.x)/2; let my = (s.y + t.y)/2;
    svgHtml += `<text x="${mx}" y="${my}" fill="#555" font-size="10" text-anchor="middle" background="#fff">${e.type}</text>`;
  });

  // Draw nodes
  nodes.forEach(n => {
    svgHtml += `
      <g transform="translate(${n.x}, ${n.y})" style="cursor:pointer;" class="graph-node" data-id="${n.id}">
        <circle r="25" fill="#fff" stroke="#000" stroke-width="2"/>
        <text y="4" font-size="12" text-anchor="middle" font-weight="bold">${n.id}</text>
        <text y="40" font-size="10" text-anchor="middle" fill="#333">${n.title.substring(0,15)}...</text>
      </g>
    `;
  });
  
  svgHtml += '</svg>';
  
  contentDiv.innerHTML = `<div class="graph-wrap graph-stage" style="width:100%; height:100%; overflow:hidden;">${svgHtml}</div>`;
  
  // Attach click events
  document.querySelectorAll('.graph-node').forEach(el => {
    el.addEventListener('click', () => {
      const node = nodes.find(n => n.id === el.dataset.id);
      if(node) showNodeDetail(node);
    });
  });
}

navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    renderSection(btn.dataset.target);
  });
});

loadData();
