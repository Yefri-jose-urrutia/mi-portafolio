// JS/projects-loader.js

class ProjectsLoader {
  constructor() {
    this.projectsContainer = document.getElementById('projects-grid');
    this.loadingIndicator = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.searchInput = document.getElementById('projects-search'); // Nuevo
    this.projects = [];
    this.filteredProjects = [];

    this.init();
  }

  async init() {
    try {
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout loading projects')), 10000)
      );
      
      await Promise.race([this.loadProjectsFromJSON(), timeoutPromise]);
      this.filteredProjects = this.projects; // Inicialmente muestra todos
      this.renderProjects();
      this.setupSearch(); // Nuevo
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
          project.name.toLowerCase().includes(query) ||
          (project.short_description && project.short_description.toLowerCase().includes(query)) ||
          (project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(query))) ||
          (project.status && project.status.toLowerCase().includes(query))
        );
        this.renderProjects();
      });
    }
  }

  async loadProjectsFromJSON() {
    try {
      const response = await fetch('../Proyectos/projects-list.json');
      if (!response.ok) throw new Error('No se pudo cargar projects-list.json');

      const rawProjects = await response.json();

      // Validate that we have a valid array
      if (!Array.isArray(rawProjects)) {
        throw new Error('Invalid projects data format');
      }

      // Mapeamos los datos del JSON al formato que espera el render
      this.projects = rawProjects.map(proyecto => ({
        name: proyecto.nombre,
        short_description: proyecto.descripcion,
        cover: proyecto.imagen,
        url: proyecto.url,
        date: proyecto.date,
        technologies: proyecto.tecnologias || [],
        status: proyecto.estado || 'En desarrollo' // Obtener el estado del proyecto
      }));

      // Ordenar por fecha (más reciente primero)
      this.projects.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = []; // Ensure we have an empty array on error
      throw error; // Re-throw to be handled by init()
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
    const coverImage = project.cover;
    const techTags = (project.technologies || []).map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    // Obtener la clase y color según el estado
    const statusClass = project.status ? 
      `status-${project.status.toLowerCase().replace(/\s+/g, '-')}` : 
      'status-en-desarrollo';
    
    const statusColor = this.getStatusColor(project.status);

    return `
      <div class="project-card">
        <div class="project-image">
          <img src="../Proyectos/${coverImage}" 
               alt="${project.name}" 
               onerror="this.src='../img/default-cover.jpg'">
          <div class="project-overlay">
            <a href="../Proyectos/${project.url}" class="project-link">
              <span class="material-symbols-outlined">visibility</span>
              Ver Proyecto
            </a>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-title">${project.name}</h3>
          <p class="project-description">${project.short_description || 'Sin descripción disponible'}</p>
          <div class="project-meta">
            <div class="project-date">
              <span class="material-symbols-outlined">calendar_month</span>
              ${this.formatDate(project.date)}
            </div>
            <div class="project-status ${statusClass}" style="background-color: ${statusColor};">
              ${this.getStatusIcon(project.status)}
              ${project.status}
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
    return colors[status] || '#6c757d'; // Color gris por defecto
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