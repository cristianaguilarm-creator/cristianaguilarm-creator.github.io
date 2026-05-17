// 1. Al cargar la página, aplica el modo guardado y el emoji correcto
document.addEventListener("DOMContentLoaded", () => {
  const iconoBoton = document.getElementById("theme-icon");
  
  if (localStorage.getItem("modo-oscuro") === "activado") {
    document.body.classList.add("dark-mode");
    if (iconoBoton) iconoBoton.innerText = "🌙"; // Si está oscuro, muestra la luna.
  } else {
    if (iconoBoton) iconoBoton.innerText = "☀️"; // Si está claro, muestra el sol.
  }
});

// 2. Mi función al hacer clic para alternar el fondo y el emoji
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const iconoBoton = document.getElementById("theme-icon");
  
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem("modo-oscuro", "activado");
    if (iconoBoton) iconoBoton.innerText = "🌙";
  } else {
    localStorage.setItem("modo-oscuro", "desactivado");
    if (iconoBoton) iconoBoton.innerText = "☀️";
  }
}
