function ServidorWS(io) {
    this.lanzarServidor = function (io,sistema) {
        io.on('connection', function (socket) {
            console.log("Capa WS activa");
        });
    }
    11
}
module.exports.ServidorWS = ServidorWS;