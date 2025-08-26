window.addEventListener("DOMContentLoaded", () => {
  // Botón de contacto: muestra un mensaje
  const btnContacto = document.querySelector(".btn-contacto");
  if (btnContacto) {
    btnContacto.addEventListener("click", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu interés! Pronto me pondré en contacto contigo.");
    });
  }

  document.querySelector('.menu-toggle').addEventListener('click', function() {
    const nav = document.getElementById('main-menu');
    nav.classList.toggle('open');
    this.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
});