function operar(operacion) {
            const n1 = parseFloat(document.getElementById('num1').value);
            const n2 = parseFloat(document.getElementById('num2').value);
            const display = document.getElementById('resultado');

            // Validar que se hayan escrito números
            if (isNaN(n1) || isNaN(n2)) {
                display.innerText = "⚠️ Escribe números";
                return;
            }

            let res;
            switch(operacion) {
                case '+': res = n1 + n2; break;
                case '-': res = n1 - n2; break;
                case '*': res = n1 * n2; break;
                case '/': 
                    res = n2 !== 0 ? (n1 / n2).toFixed(2) : "❌ Error (div 0)"; 
                    break;
            }

            display.innerText = "Resultado: " + res;
        }

        function limpiar() {
            document.getElementById('num1').value = "";
            document.getElementById('num2').value = "";
            document.getElementById('resultado').innerText = "Resultado: -";
        }
