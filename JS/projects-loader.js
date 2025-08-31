// JS/projects-loader.js

class ProjectsLoader {
  constructor() {
    this.projectsContainer = document.getElementById('projects-grid');
    this.loadingIndicator = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.searchInput = document.getElementById('projects-search');
    this.projects = [];
    this.filteredProjects = [];

    this.init();
  }

  async init() {
    try {
      await this.loadProjectsFromJSON();
      this.filteredProjects = this.projects; 
      this.renderProjects();
      this.setupSearch();
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      this.showError();
    }
  }

  setupSearch() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.filteredProjects = this.projects.filter(project =>
          project.nombre.toLowerCase().includes(query) ||
          project.descripcion.toLowerCase().includes(query) ||
          (project.tecnologias && project.tecnologias.some(tech => tech.toLowerCase().includes(query))) ||
          (project.estado && project.estado.toLowerCase().includes(query))
        );
        this.renderProjects();
      });
    }
  }

  async loadProjectsFromJSON() {
    try {
      const response = await fetch('../Proyectos/projects-list.json');
      
      if (!response.ok) {
        throw new Error('No se pudo cargar la lista de proyectos');
      }
      
      // Aquí estaba el error principal - ahora asignamos el resultado a this.projects
      this.projects = await response.json();
      
      // Ordenar por fecha (más reciente primero)
      this.projects.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      this.showError();
      this.projects = [];
    }
  }

  renderProjects() {
    this.hideLoading();

    if (this.filteredProjects.length === 0) {
      this.projectsContainer.innerHTML = `
        <div class="no-projects">
          <span class="material-symbols-outlined">folder_open</span>
          <h3>No hay proyectos disponibles</h3>
          <p>Los proyectos se mostrarán aquí cuando estén disponibles.</p>
        </div>
      `;
      return;
    }

    const projectsHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');
    this.projectsContainer.innerHTML = projectsHTML;
  }

  createProjectCard(project) {
    // Usar los nombres de propiedades correctos (en español)
    const coverImage = project.imagen || '';
    const techTags = (project.tecnologias || []).map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    // Ajustar nombres de clases para estados
    const statusClass = project.estado ? 
      `status-${project.estado.toLowerCase().replace(/\s+/g, '-')}` : 
      'status-en-desarrollo';
    
    const statusColor = this.getStatusColor(project.estado);

    return `
      <div class="project-card">
        <div class="project-image">
          <img src="../Proyectos/${coverImage}" 
               alt="${project.nombre}" 
               onerror="this.src='../img/default-cover.jpg'">
          <div class="project-overlay">
            <a href="../Proyectos/${project.url}" class="project-link">
              <span class="material-symbols-outlined">visibility</span>
              Ver Proyecto
            </a>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-title">${project.nombre}</h3>
          <p class="project-description">${project.descripcion || 'Sin descripción disponible'}</p>
          <div class="project-meta">
            <div class="project-date">
              <span class="material-symbols-outlined">calendar_month</span>
              ${this.formatDate(project.date)}
            </div>
            <div class="project-status ${statusClass}" style="background-color: ${statusColor};">
              ${this.getStatusIcon(project.estado)}
              ${project.estado}
            </div>
          </div>
          ${techTags ? `<div class="project-technologies">${techTags}</div>` : ''}
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

  getStatusIcon(status) {
    const icons = {
      'Completado': 'check_circle',
      'En desarrollo': 'engineering',
      'Planificación': 'event',
      'Pausado': 'pause_circle',
      'Prototipo': 'science',
      'Archivado': 'inventory_2'
    };
    return `<span class="material-symbols-outlined">${icons[status] || 'info'}</span>`;
  }

  getStatusColor(status) {
    const colors = {
      'En desarrollo': '#17a2b8',
      'Completado': '#28a745',
      'Pausado': '#ffc107',
      'Planificación': '#6c757d',
      'Prototipo': '#6f42c1',
      'Archivado': '#dc3545'
    };
    return colors[status] || '#6c757d';
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
  new ProjectsLoader();
});