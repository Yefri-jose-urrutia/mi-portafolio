
window.addEventListener("DOMContentLoaded", () => {
  // Botón de contacto: muestra un mensaje
  const btnContacto = document.querySelector(".btn-contacto");
  if (btnContacto) {
    btnContacto.addEventListener("click", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu interés! Pronto me pondré en contacto contigo.");
    });
  }
});