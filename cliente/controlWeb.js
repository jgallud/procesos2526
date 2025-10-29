function ControlWeb() {
    this.comprobarSesion = function () {
        let nick = $.cookie("nick");
        if (nick) {
            this.mostrarHome(nick);
        }
        else {
            //this.mostrarAgregarUsuario();
            this.mostrarRegistro();
        }
    }
    this.mostrarRegistro = function () {
        $("#fmRegistro").remove();
        $("#registro").load("./cliente/registro.html", function () {
            $("#btnRegistro").on("click", function (e) {
                e.preventDefault();
                let email = $("#email").val();
                let pwd = $("#pwd").val();
                if (email && pwd) {
                    rest.registrarUsuario(email,pwd);
                    console.log(email + " " + pwd);
                }
            });
        });
    }
     this.mostrarLogin = function () {
        this.limpiar();
        $("#registro").load("./cliente/login.html", function () {
            $('#btnGS').load("./cliente/botonGS.html");
            $("#btnLogin").on("click", function (e) {
                e.preventDefault();
                let email = $("#email").val();
                let pwd = $("#pwd").val();
                if (email && pwd) {
                    rest.loginUsuario(email, pwd);
                    console.log(email + " " + pwd);
                }
            });
        });
    }
    this.mostrarAgregarUsuario = function () {
        //this.limpiar();
        $('#mAU').remove();
        let cadena = '<div id="mAU" class="form-group">';
        cadena = cadena + '<label for="nick">Introduce un nick:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="nick">';
        cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary">Agregar usuario</button>';
        cadena = cadena + '<div><a href="/auth/google">Acceso Google</a></div>';
        cadena = cadena + '<div id="btnGS"></div>';
        cadena = cadena + '<div id="msg"></div>'
        cadena = cadena + '</div>';

        $("#au").append(cadena);
        //$('#btnGS').load("./cliente/botonGS.html");
        //#au .btn div
        $("#btnAU").on("click", function () {
            let nick = $("#nick").val();
            rest.agregarUsuario(nick);
        });
    }
    this.mostrarHome = function (nick) {
        //this.limpiar();
        //let nick = $.cookie("nick"); //podría ser parámetro de la función
        //ws.email=nick;
        $('#mAU').remove();
        $('#mH').remove();
        let cadena = "<div id='mH'><h2>Bienvenido " + nick + " al sistema</h2></div>";
        $("#au").append(cadena);
        //this.mostrarCrearPartida();
    }
    this.salir = function () {
        $.removeCookie("nick");
        location.reload();
    }

}