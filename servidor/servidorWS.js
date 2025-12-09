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
    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.to(codigo).emit(mensaje,datos);
	}
    this.enviarATodos=function(socket,mens,datos){
    	socket.broadcast.emit(mens,datos);
    }
    this.enviarATodosEnPartidaExceptoRemitente=function(socket,codigo,mensaje,datos){
		socket.broadcast.to(codigo).emit(mensaje, datos);
	}
    this.lanzarServidor = function (io, sistema) {
        let srv = this;
        io.on('connection', function (socket) {
            console.log("Capa WS activa");
            socket.on("crearPartida", function (datos) {
                let codigo = sistema.crearPartida(datos.email);
                if (codigo != -1) {
                    socket.join(codigo);
                    console.log("Partida creada con código: " + codigo);
                    srv.enviarAlRemitente(socket, "partidaCreada", { "codigo": codigo });
                }
                let lista = sistema.obtenerPartidasDisponibles();
                console.log(lista);
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
            });
            socket.on("unirAPartida", function (datos) {
                // pedir a sistema unir a partida
                let res = sistema.unirAPartida(datos.email, datos.codigo);
                if (res) {
                    socket.join(datos.codigo);
                    srv.enviarAlRemitente(socket, "unidoAPartida", { "codigo": datos.codigo });
                    srv.enviarATodosEnPartida(socket, datos.codigo, "iniciarPartida", { "email": datos.email });

                }
                else {
                    srv.enviarAlRemitente(socket, "noUnidoAPartida", {});
                }
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
            });
            socket.on("abandonarPartida", function (datos) {
                let codigoStr = datos.codigo.toString();
                sistema.jugadorAbandona(datos);
                //cli.enviarATodosEnPartida(io,codigoStr,"jugadorAbandona",{"nick":nick});
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(socket, "actualizarListaPartidas", lista);
                srv.enviarATodosEnPartidaExceptoRemitente(socket, codigoStr, "jugadorAbandona", { "email": datos.email });
                //cli.enviarATodos(socket,"jugadorAbandona",{"nick":nick});
                socket.leave(codigoStr);
            });
        });
    }
}
module.exports.ServidorWS = ServidorWS;