// 1. Al cargar la página, revisa si el modo oscuro estaba activado
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("modo-oscuro") === "activado") {
    document.body.classList.add("dark-mode");
  }
});

// 2. La función original modificada para guardar la elección
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Guarda el estado actual en la memoria del navegador (hola we)
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem("modo-oscuro", "activado");
  } else {
    localStorage.setItem("modo-oscuro", "desactivado");
  }
}
