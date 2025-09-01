class ManualsLoader {
  constructor() {
    this.manualsContainer = document.getElementById('manuals-grid');
    this.loadingIndicator = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.searchInput = document.getElementById('manuals-search');
    this.manuals = [];
    this.filteredManuals = [];
    this.projects = []; // Lista de proyectos para relacionar

    this.init();
  }

  async init() {
    try {
      // Cargar proyectos primero para poder relacionarlos
      await this.loadProjectsFromJSON();
      await this.loadManualsFromJSON();
      this.filteredManuals = this.manuals;
      this.renderManuals();
      this.setupSearch();
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
          (manual.tags && manual.tags.some(tag => tag.toLowerCase().includes(query))) ||
          (manual.proyecto_relacionado && manual.proyecto_relacionado.toLowerCase().includes(query))
        );
        this.renderManuals();
      });
    }
  }

  // Nuevo método para cargar proyectos
  async loadProjectsFromJSON() {
    try {
      const response = await fetch('../Proyectos/projects-list.json');
      if (response.ok) {
        this.projects = await response.json();
      }
    } catch (error) {
      console.error('No se pudo cargar la lista de proyectos', error);
      this.projects = [];
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

  // Método para obtener información del proyecto relacionado
  getRelatedProject(projectName) {
    if (!projectName) return null;
    return this.projects.find(project => project.nombre === projectName);
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

    // Generar el distintivo de proyecto relacionado si existe
    const projectBadge = manual.proyecto_relacionado ? this.createProjectBadge(manual.proyecto_relacionado) : '';

    return `
      <div class="manual-card">
        <div class="manual-image" style="height: 220px; overflow: hidden;">
          <img src="../Manuales/${coverImage}" 
               alt="${manual.nombre}" 
               style="width: 100%; height: 100%; object-fit: contain; object-position: center; background-color: #f5f5f5;"
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
          ${projectBadge}
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

  // Nuevo método para crear el distintivo de proyecto relacionado
  createProjectBadge(projectName) {
    const relatedProject = this.getRelatedProject(projectName);
    
    if (relatedProject) {
      return `
        <div class="project-badge">
          <a href="../Proyectos/${relatedProject.url}" class="project-link">
            <span class="material-symbols-outlined">integration_instructions</span>
            Ver Proyecto: ${relatedProject.nombre}
          </a>
        </div>
      `;
    }
    
    return `
      <div class="project-badge project-badge-simple">
        <span class="material-symbols-outlined">integration_instructions</span>
        Proyecto relacionado: ${projectName}
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