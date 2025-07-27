// script.js

// Esperar que el documento cargue completamente
window.addEventListener("DOMContentLoaded", () => {
  const btnContacto = document.querySelector("a.btn.secondary");

  if (btnContacto) {
    btnContacto.addEventListener("click", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu interés! Pronto me pondré en contacto contigo.");
    });
  }
});
