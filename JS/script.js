window.addEventListener("DOMContentLoaded", () => {
  // Botón de contacto: muestra un mensaje
  const btnContacto = document.querySelector(".btn-contacto");
  if (btnContacto) {
    btnContacto.addEventListener("click", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu interés! Pronto me pondré en contacto contigo.");
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-menu');

  // Evento para el botón del menú
  menuToggle.addEventListener('click', function() {
    nav.classList.toggle('open');
    this.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Añadir evento para cerrar el menú cuando se hace clic fuera de él
  document.addEventListener('click', function(event) {
    // Si el menú está abierto y el clic no fue ni en el menú ni en el botón del menú
    if (
      nav.classList.contains('open') && 
      !nav.contains(event.target) && 
      event.target !== menuToggle
    ) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }, true);
});

function calcularExperienciaLaboral(fechaInicio, trabajando = true) {
  if (!trabajando) {
    document.getElementById('experiencia-laboral').textContent = 'Sin empleo actualmente';
    return;
  }
  const inicio = new Date(fechaInicio);
  const hoy = new Date();
  let años = hoy.getFullYear() - inicio.getFullYear();
  let meses = hoy.getMonth() - inicio.getMonth();
  let dias = hoy.getDate() - inicio.getDate();

  if (dias < 0) {
    meses--;
    dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    años--;
    meses += 12;
  }

  let texto = '';
  if (años > 0) texto += `${años} año${años > 1 ? 's' : ''}`;
  if (meses > 0) texto += ` y ${meses} mes${meses > 1 ? 'es' : ''}`;
  if (años === 0 && meses === 0) texto += `${dias} día${dias > 1 ? 's' : ''}`;
  else if (dias > 0) texto += ` y ${dias} día${dias > 1 ? 's' : ''}`;

  document.getElementById('experiencia-laboral').textContent = texto;
}

// Cambia a false si no estás trabajando actualmente
calcularExperienciaLaboral('2023-09-18', true);