let modo = "";
        let puntos = parseInt(localStorage.getItem('puntosCentro')) || 0;
        let respuestaCorrecta = "";

        function empezarJuego(tipo) {
            modo = tipo;
            document.getElementById('menu').style.display = "none";
            document.getElementById('pantalla-juego').style.display = "block";
            document.getElementById('tipo-titulo').innerText = "Desafío " + tipo.toUpperCase();
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
                q = `${n1} x ${n2}`;
                respuestaCorrecta = n1 * n2;
            } else if (modo === 'algebra') {
                const x = Math.floor(Math.random() * 10) + 1;
                const a = Math.floor(Math.random() * 10) + 1;
                q = `x + ${a} = ${x + a}`;
                respuestaCorrecta = x;
            } else if (modo === 'polinomio') {
                const tipos = ['monomio', 'binomio', 'trinomio'];
                respuestaCorrecta = tipos[Math.floor(Math.random() * 3)];
                if(respuestaCorrecta === 'monomio') q = "4x²";
                if(respuestaCorrecta === 'binomio') q = "2x + 5";
                if(respuestaCorrecta === 'trinomio') q = "x² + 3x - 2";
            }
            document.getElementById('pregunta').innerText = q;
        }

        function verificar(resBoton) {
            const input = document.getElementById('respuesta');
            const resUser = (resBoton || input.value).toString().trim().toLowerCase();
            const f = document.getElementById('feedback');

            if (resUser == respuestaCorrecta.toString().toLowerCase()) {
                f.innerText = "✅ ¡Correcto!"; f.style.color = "#2ed573";
                puntos += 10;
                localStorage.setItem('puntosCentro', puntos);
            } else {
                f.innerText = "❌ Era: " + respuestaCorrecta; f.style.color = "#ff4757";
            }
            
            document.getElementById('puntos').innerText = puntos;
            document.getElementById('btn-sig').style.display = "block";
            document.getElementById('btn-comprobar').style.display = "none";
            input.disabled = true;
        }

        function siguiente() { generar(); }
        window.onload = () => { document.getElementById('puntos').innerText = puntos; };
