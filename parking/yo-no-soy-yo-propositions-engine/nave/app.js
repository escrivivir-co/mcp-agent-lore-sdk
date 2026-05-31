const contentDiv = document.getElementById('content');
const loadMapBtn = document.getElementById('btn-load-map');

async function loadMapa() {
  contentDiv.innerHTML = '<p class="loading">Cargando mapa desde la biblioteca...</p>';
  try {
    const response = await fetch('../../../biblioteca/yo-no-soy-yo-propositions-engine/mapa.md');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdownText = await response.text();
    // Resolver rutas relativas de las imagenes
    const parsedText = markdownText.replace(/.\/assets\//g, '../../../biblioteca/yo-no-soy-yo-propositions-engine/assets/');
    
    contentDiv.innerHTML = marked.parse(parsedText);
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: #f85149;">Error cargando el mapa: ${error.message}</p>
    <p>Asegúrate de ejecutar un servidor HTTP en la carpeta <code>nave/</code>, por ejemplo: <code>python3 -m http.server</code></p>`;
  }
}

loadMapBtn.addEventListener('click', loadMapa);

// Cargar por defecto
loadMapa();
