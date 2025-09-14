document.addEventListener('DOMContentLoaded', function() {
  console.log("Script de atajos cargado");
  
  // Elementos del DOM
  const shortcutItems = document.querySelectorAll('.shortcut-item');
  const searchInput = document.getElementById('shortcuts-search');
  const filterButtons = document.querySelectorAll('.chip[data-filter]');
  const shortcutCards = document.querySelectorAll('.shortcut-card');
  const countElement = document.getElementById('count-number');
  const noResultsElement = document.getElementById('no-results');
  const tooltipContainer = document.createElement('div');
  
  // Inicialización del tooltip personalizado
  tooltipContainer.className = 'custom-tooltip';
  tooltipContainer.style.display = 'none';
  document.body.appendChild(tooltipContainer);
  
  // Gestionar tooltips con JavaScript (solución al problema de superposición)
  shortcutItems.forEach(item => {
    // Eliminar tooltips CSS que se superponen
    item.style.position = 'relative';
    
    // Agregar eventos para mostrar/ocultar tooltips
    item.addEventListener('mouseenter', function(e) {
      const action = this.getAttribute('data-action');
      if (!action) return;
      
      // Configurar tooltip
      tooltipContainer.textContent = action;
      tooltipContainer.style.display = 'block';
      
      // Posicionar el tooltip para evitar superposiciones
      positionTooltip(this, tooltipContainer);
    });
    
    item.addEventListener('mouseleave', function() {
      tooltipContainer.style.display = 'none';
    });
  });
  
  // Función para posicionar el tooltip de forma inteligente
  function positionTooltip(element, tooltip) {
    const rect = element.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    const tooltipWidth = tooltip.offsetWidth;
    
    // Comprobar si hay suficiente espacio arriba
    const spaceAbove = rect.top > tooltipHeight + 10;
    
    // Posicionar arriba o abajo según el espacio disponible
    if (spaceAbove) {
      tooltip.style.top = (rect.top + window.scrollY - tooltipHeight - 10) + 'px';
    } else {
      tooltip.style.top = (rect.bottom + window.scrollY + 10) + 'px';
    }
    
    // Centrar horizontalmente
    tooltip.style.left = (rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2)) + 'px';
    
    // Asegurar que el tooltip no se salga de la pantalla horizontalmente
    const rightEdge = window.innerWidth;
    const tooltipRight = rect.left + (tooltipWidth / 2) + (rect.width / 2);
    
    if (tooltipRight > rightEdge - 10) {
      tooltip.style.left = (rightEdge - tooltipWidth - 10) + 'px';
    }
    
    if (rect.left - (tooltipWidth / 2) + (rect.width / 2) < 10) {
      tooltip.style.left = '10px';
    }
  }
  
  // Filtrar atajos
  function filterShortcuts() {
    const activeFilter = document.querySelector('.chip.active');
    const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    let visibleCount = 0;
    
    shortcutCards.forEach(card => {
      const categories = card.getAttribute('data-categories') || '';
      const cardText = card.textContent.toLowerCase();
      
      const matchesFilter = filterValue === 'all' || categories.includes(filterValue);
      const matchesSearch = !searchValue || cardText.includes(searchValue);
      
      if (matchesFilter && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Actualizar contador
    if (countElement) {
      countElement.textContent = visibleCount;
    }
    
    // Mostrar/ocultar mensaje de no resultados
    if (noResultsElement) {
      if (visibleCount === 0) {
        noResultsElement.style.display = 'block';
        document.getElementById('shortcut-grid').style.display = 'none';
      } else {
        noResultsElement.style.display = 'none';
        document.getElementById('shortcut-grid').style.display = 'grid';
      }
    }
  }
  
  // Asignar eventos a los botones de filtro
  if (filterButtons) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Quitar clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón seleccionado
        this.classList.add('active');
        
        // Aplicar filtro
        filterShortcuts();
      });
    });
  }
  
  // Asignar evento al buscador
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterShortcuts();
    });
  }
  
  // Modal para detalles del atajo
  const modal = document.getElementById('shortcut-modal');
  const closeModal = document.querySelector('.close-modal');
  
  if (modal && closeModal) {
    shortcutItems.forEach(item => {
      item.addEventListener('click', function() {
        const card = this.closest('.shortcut-card');
        const title = card.getAttribute('data-title');
        const description = card.getAttribute('data-description');
        const action = this.getAttribute('data-action');
        const shortcutHtml = this.innerHTML;
        
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;
        document.getElementById('modal-shortcut').innerHTML = shortcutHtml;
        document.getElementById('modal-action').textContent = action;
        
        modal.style.display = 'block';
      });
    });
    
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Inicializar filtros y contador
  filterShortcuts();
});