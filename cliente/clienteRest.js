function ClienteRest() {
    this.agregarUsuario = function (nick) {
        var cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + nick + " ha sido registrado");
                cw.mostrarHome(nick);
            }
            else {
                console.log("El nick ya está ocupado");
            }
        })
    };
    this.obtenerUsuarios = function (funcion) {
        $.getJSON("/obtenerUsuarios", function (data) {
            console.log(data);
        });
    };
    this.eliminarUsuario = function (nick) {
        $.getJSON("/eliminarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + nick + " ha sido eliminado")
            }
            else {
                console.log("El nick no existe");
            }
        });
    };
    this.numeroUsuarios = function (funcion) {
        $.getJSON("/numeroUsuarios", function (data) {
            console.log(data.numero);
        });
    };
    
    this.usuarioActivo = function (nick, funcion) {
        $.getJSON("/usuarioActivo/" + nick, function (data) {
           console.log(data.activo);
        });
    };

}