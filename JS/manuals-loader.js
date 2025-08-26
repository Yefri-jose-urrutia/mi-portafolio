class ManualsLoader {
  constructor() {
    this.manualsContainer = document.getElementById('manuals-grid');
    this.loadingIndicator = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.searchInput = document.getElementById('manuals-search'); // Nuevo
    this.manuals = [];
    this.filteredManuals = [];

    this.init();
  }

  async init() {
    try {
      await this.loadManualsFromJSON();
      this.filteredManuals = this.manuals; // Inicialmente muestra todos
      this.renderManuals();
      this.setupSearch(); // Nuevo
    } catch (error) {
      console.error('Error cargando manuales:', error);
      this.showError();
    }
  }

  setupSearch() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.filteredManuals = this.manuals.filter(manual =>
          manual.nombre.toLowerCase().includes(query) ||
          (manual.descripcion && manual.descripcion.toLowerCase().includes(query)) ||
          (manual.tags && manual.tags.some(tag => tag.toLowerCase().includes(query)))
        );
        this.renderManuals();
      });
    }
  }

  async loadManualsFromJSON() {
    const response = await fetch('../Manuales/manuales-list.json');
    if (!response.ok) throw new Error('No se pudo cargar manuales-list.json');

    const manuals = await response.json();
    this.manuals = manuals;

    // Ordenar por fecha (más reciente primero)
    this.manuals.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }

  renderManuals() {
    this.hideLoading();

    const manualsToRender = this.filteredManuals || [];

    if (manualsToRender.length === 0) {
      this.manualsContainer.innerHTML = `
        <div class="no-manuals">
          <span class="material-symbols-outlined">menu_book</span>
          <h3>No hay manuales disponibles</h3>
          <p>Los manuales se mostrarán aquí cuando estén disponibles.</p>
        </div>
      `;
      return;
    }

    const manualsHTML = manualsToRender.map(manual => this.createManualCard(manual)).join('');
    this.manualsContainer.innerHTML = manualsHTML;
  }

  createManualCard(manual) {
    // Usar imagen predeterminada si no hay imagen
    const coverImage = manual.imagen || '../img/default-cover.jpg';
    
    // Crear etiquetas si hay tags
    const techTags = (manual.tags && manual.tags.length > 0) 
      ? manual.tags.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
      : '';

    return `
      <div class="manual-card">
        <div class="manual-image">
          <img src="../Manuales/${coverImage}" 
               alt="${manual.nombre}" 
               onerror="this.src='../img/default-cover.jpg'">
          <div class="manual-overlay">
            <a href="../Manuales/${manual.url}" class="manual-link">
              <span class="material-symbols-outlined">visibility</span>
              Ver Manual
            </a>
          </div>
        </div>
        <div class="manual-info">
          <h3 class="manual-title">${manual.nombre}</h3>
          <p class="manual-description">${manual.descripcion || 'Sin descripción disponible'}</p>
          <div class="manual-meta">
            <div class="manual-date">
              <span class="material-symbols-outlined">calendar_today</span>
              ${this.formatDate(manual.date)}
            </div>
            ${techTags ? `<div class="manual-technologies">${techTags}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return dateString;
    }
  }

  hideLoading() {
    if (this.loadingIndicator) this.loadingIndicator.style.display = 'none';
  }

  showError() {
    this.hideLoading();
    if (this.errorMessage) this.errorMessage.style.display = 'block';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ManualsLoader();
});