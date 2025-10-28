function ClienteRest() {
    this.registrarUsuario = function (email, password) {
        $.ajax({
            type: 'POST',
            url: '/registrarUsuario',
            data: JSON.stringify({ "email": email, "password": password }),
            success: function (data) {
                if (data.nick != -1) {
                    console.log("Usuario " + data.nick + " ha sido registrado");
                    $.cookie("nick", data.nick);
                    //cw.limpiar();
                    //cw.mostrarMsg("Bienvenido al sistema,"+data.nick);
                    cw.mostrarLogin();
                }
                else {
                    console.log("El nick está ocupado");
                    cw.mostrarModal("El nick está ocupado");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType: 'application/json'
        });
    }
     this.loginUsuario = function (email, password) {
        $.ajax({
            type: 'POST',
            url: '/loginUsuario',
            data: JSON.stringify({ "email": email, "password": password }),
            success: function (data) {
                if (data.nick != -1) {
                    console.log("Usuario " + data.nick + " ha iniciado sesión");
                    $.cookie("nick", data.nick);
                    //ws.email=data.nick;
                    cw.limpiar();
                    cw.mostrarHome();
                    //cw.mostrarMsg("Bienvenido al sistema,"+data.nick);
                    //cw.mostrarLogin();
                }
                else {
                    console.log("Usuario o clave incorrectos");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType: 'application/json'
        });
    }
    this.agregarUsuario = function (nick) {
        var cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {
            if (data.nick != -1) {
                console.log("Usuario " + nick + " ha sido registrado");
                $.cookie("nick",data.nick);
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