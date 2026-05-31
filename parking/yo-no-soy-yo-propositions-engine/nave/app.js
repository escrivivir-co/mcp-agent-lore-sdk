const contentDiv = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-link');
let markdownData = {
  overview: '',
  context: '',
  thread1: '',
  thread2: ''
};

async function loadMapa() {
  contentDiv.innerHTML = '<p class="loading">Cargando mapa desde la biblioteca...</p>';
  try {
    const response = await fetch('../../../biblioteca/yo-no-soy-yo-propositions-engine/mapa.md');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const markdownText = await response.text();
    const parsedText = markdownText.replace(/.\/assets\//g, '../../../biblioteca/yo-no-soy-yo-propositions-engine/assets/');
    
    // Separar el markdown por secciones H2
    const sections = parsedText.split('\n## ');
    markdownData.overview = sections[0]; // Título y descripción
    markdownData.context = '## ' + sections.find(s => s.startsWith('1. Contexto'));
    markdownData.thread1 = '## ' + sections.find(s => s.startsWith('2. Cartografía Thread 1'));
    markdownData.thread2 = '## ' + sections.find(s => s.startsWith('3. Cartografia Thread 2'));
    
    // Cargar la vista activa
    const activeTarget = document.querySelector('.nav-link.active').dataset.target;
    renderSection(activeTarget);
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: #f85149;">Error cargando el mapa: ${error.message}</p>
    <p>Asegúrate de ejecutar el servidor desde la raíz de AgentLoreSDK: <code>npm run start:ynsy-engine</code></p>`;
  }
}

function renderSection(targetId) {
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
  
  const mdContent = markdownData[targetId];
  if (mdContent && mdContent.trim() !== '## undefined') {
    contentDiv.innerHTML = marked.parse(mdContent);
  } else {
    contentDiv.innerHTML = '<p>Sección no encontrada o vacía.</p>';
  }
}

navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    renderSection(btn.dataset.target);
  });
});

loadMapa();
