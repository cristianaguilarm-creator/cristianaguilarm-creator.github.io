function toggleSeccion(elemento) {
    const contenido = elemento.nextElementSibling;
    contenido.classList.toggle('abierto');
    const span = elemento.querySelector('span');
    span.innerText = contenido.classList.contains('abierto') ? '▲' : '▼';
}
