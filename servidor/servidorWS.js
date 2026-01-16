function ServidorWS(io) {

    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }
    this.enviarATodosMenosRemitente = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }
    // this.enviarGlobal = function (io, mens, datos) {
    //     io.emit(mens, datos);
    // }
    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.to(codigo).emit(mensaje, datos);
    }
    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }
    this.enviarATodosEnPartidaExceptoRemitente = function (socket, codigo, mensaje, datos) {
        socket.broadcast.to(codigo).emit(mensaje, datos);
    }
    this.lanzarServidor = function (io, sistema) {
        let srv = this;
        io.on('connection', function (socket) {
            console.log("Capa WS activa");
            let lista = sistema.obtenerPartidasDisponibles();
            console.log(lista);
            srv.enviarATodos(socket, "actualizarListaPartidas", lista);
            socket.on("crearPartida", function (datos) {
                let codigo = sistema.crearPartida(datos.email);
                if (codigo != -1) {
                    socket.join(codigo);
                    console.log("Partida creada con código: " + codigo);
                    const partida = sistema.partidas[codigo];
                    const jugador = partida.jugadores[datos.email];
                    //console.log(jugador);
                    srv.enviarAlRemitente(socket, "partidaCreada", { "codigo": codigo, "color": jugador.color });
                }
                let lista = sistema.obtenerPartidasDisponibles();
                //console.log(lista);
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
            });
            socket.on("unirAPartida", function (datos) {
                // pedir a sistema unir a partida
                let res = sistema.unirAPartida(datos.email, datos.codigo);
                const partida = sistema.partidas[datos.codigo];
                let jugador = undefined;
                if (partida) {
                    jugador = partida.jugadores[datos.email];
                }
                if (res && partida && jugador) {
                    socket.join(datos.codigo);
                    srv.enviarAlRemitente(socket, "unidoAPartida", { "codigo": datos.codigo, "color": jugador.color });
                    srv.enviarATodosEnPartida(io, datos.codigo, "iniciarPartida",
                        { "email": datos.email, tablero: partida.tablero, turno: partida.turno });
                    partida.enCurso = true;
                }
                else {
                    srv.enviarAlRemitente(socket, "noUnidoAPartida", {});
                }
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
            });
            socket.on("colocarPiedra", (data) => {
                const partida = sistema.partidas[data.codigo]; // tu mapa de partidas

                if (!partida || !partida.enCurso) return;
                const jugador = partida.jugadores[data.email];
                //const jugador = partida.jugadores.black === socket.id ? "black" : "white";

                if (jugador.color !== partida.turno) {
                    return socket.emit("jugadaInvalida", "No es tu turno");
                }

                if (partida.tablero[data.y][data.x] !== 0) {
                    return socket.emit("jugadaInvalida", "Casilla ocupada");
                }

                // Coloca piedra
                partida.tablero[data.y][data.x] = jugador.color === "black" ? 1 : 2;

                partida.pasesConsecutivos = 0; // Resetear conteo de pases
                // Aquí podrías llamar a la función de capturas (más adelante)

                // Cambiar turno
                partida.turno = jugador.color === "black" ? "white" : "black";

                // Emitir tablero actualizado a ambos jugadores
                srv.enviarATodosEnPartida(io, data.codigo, "jugadaRealizada", {
                    tablero: partida.tablero,
                    turno: partida.turno
                });
                // for (const id of Object.values(partida.jugadores)) {
                //     io.to(id).emit("estadoPartida", {
                //         tablero: partida.tablero,
                //         turno: partida.turno
                //     });
                // }
            });
            socket.on("pasarTurno", () => {
                const partida = obtenerPartida(socket.partidaId);

                if (partida.finalizada) return;

                partida.pasesConsecutivos += 1;
                partida.turno = partida.turno === "N" ? "B" : "N";

                // ¿Fin de partida?
                if (partida.pasesConsecutivos >= 2) {
                    partida.finalizada = true;
                }

                io.to(partida.id).emit("estadoActualizado", partida);
            });


            socket.on("abandonarPartida", function (datos) {
                let codigoStr = datos.codigo.toString();
                srv.enviarATodosEnPartida(io, datos.codigo, "partidaAbandonada", { "id": socket.id });
                sistema.jugadorAbandona(datos);
                //cli.enviarATodosEnPartida(io,codigoStr,"jugadorAbandona",{"nick":nick});
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
                //srv.enviarATodosEnPartidaExceptoRemitente(socket, codigoStr, "jugadorAbandona", { "email": datos.email });
                //cli.enviarATodos(socket,"jugadorAbandona",{"nick":nick});


                socket.leave(codigoStr);
            });
        });
    }
}
module.exports.ServidorWS = ServidorWS;