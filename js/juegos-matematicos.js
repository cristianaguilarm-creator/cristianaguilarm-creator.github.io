let modo = "";
let puntos = parseInt(localStorage.getItem('puntosCentro')) || 0;
let respuestaCorrecta = "";

function empezarJuego(tipo) {
    modo = tipo;
    document.getElementById('menu').style.display = "none";
    document.getElementById('pantalla-juego').style.display = "block";
    
    // Cambiamos el título según la sección elegida de forma interactiva
    if (tipo === 'basico') document.getElementById('tipo-titulo').innerText = "➕➖ Operaciones Básicas";
    if (tipo === 'algebra') document.getElementById('tipo-titulo').innerText = "🧬 Despejar la Incógnita (X)";
    if (tipo === 'polinomio') document.getElementById('tipo-titulo').innerText = "🏷️ Clasificar Expresiones";
    
    document.getElementById('puntos').innerText = puntos;
    
    const esPolinomio = (tipo === 'polinomio');
    document.getElementById('controles-respuesta').style.display = esPolinomio ? "none" : "block";
    document.getElementById('botones-clasificacion').style.display = esPolinomio ? "grid" : "none";
    
    generar();
}

function generar() {
    document.getElementById('btn-sig').style.display = "none";
    document.getElementById('feedback').innerText = "";
    document.getElementById('respuesta').value = "";
    document.getElementById('respuesta').disabled = false;
    document.getElementById('btn-comprobar').style.display = (modo === 'polinomio') ? "none" : "block";
    
    let q = "";
    
    if (modo === 'basico') {
        const n1 = Math.floor(Math.random() * 10) + 2;
        const n2 = Math.floor(Math.random() * 10) + 2;
        const operadores = ['+', '-', '*'];
        const op = operadores[Math.floor(Math.random() * operadores.length)];

        if (op === '+') { q = `${n1} + ${n2}`; respuestaCorrecta = n1 + n2; }
        if (op === '-') { q = `${n1} - ${n2}`; respuestaCorrecta = n1 - n2; }
        if (op === '*') { q = `${n1} × ${n2}`; respuestaCorrecta = n1 * n2; }
        
    } else if (modo === 'algebra') {
        // Corrección del desafío de álgebra: ahora la X es realmente la incógnita a adivinar
        const x = Math.floor(Math.random() * 9) + 1; 
        const a = Math.floor(Math.random() * 9) + 1;
        const b = x + a;
        q = `x + ${a} = ${b}`;
        respuestaCorrecta = x; // El usuario debe deducir el valor original de x
        
    } else if (modo === 'polinomio') {
        const tipos = ['monomio', 'binomio', 'trinomio'];
        respuestaCorrecta = tipos[Math.floor(Math.random() * 3)];
        
        // Números aleatorios para que cada pregunta de polinomios sea única y divertida
        const r1 = Math.floor(Math.random() * 8) + 2;
        const r2 = Math.floor(Math.random() * 8) + 2;
        
        if (respuestaCorrecta === 'monomio') q = `${r1}x²`;
        if (respuestaCorrecta === 'binomio') q = `${r1}x + ${r2}`;
        if (respuestaCorrecta === 'trinomio') q = `x² + ${r1}x - ${r2}`;
    }
    
    document.getElementById('pregunta').innerText = q;
}

function verificar(resBoton) {
    const input = document.getElementById('respuesta');
    // Si viene de un botón (polinomio) usa resBoton, si no lee la casilla de texto
    const resUser = (resBoton || input.value).toString().trim().toLowerCase();
    const f = document.getElementById('feedback');

    if (resUser == respuestaCorrecta.toString().toLowerCase()) {
        f.innerText = "🎯 ¡Excelente! Respuesta correcta"; 
        f.style.color = "#2ed573";
        puntos += 10;
        localStorage.setItem('puntosCentro', puntos); // Guarda los puntos actualizados en la memoria
    } else {
        f.innerText = "❌ Incorrecto. La respuesta era: " + respuestaCorrecta; 
        f.style.color = "#ff4757";
        puntos = Math.max(0, puntos - 5); // Penalización opcional para hacerlo más desafiante
        localStorage.setItem('puntosCentro', puntos);
    }
    
    document.getElementById('puntos').innerText = puntos;
    document.getElementById('btn-sig').style.display = "block";
    document.getElementById('btn-comprobar').style.display = "none";
    input.disabled = true;
}

function siguiente() { 
    generar(); 
}

// Vincula los puntos guardados inmediatamente cuando carga la ventana del navegador
window.onload = () => { 
    document.getElementById('puntos').innerText = puntos; 
};
