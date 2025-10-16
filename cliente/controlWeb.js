function ControlWeb() {
    this.mostrarAgregarUsuario = function () {
        //this.limpiar();
        $('#mAU').remove();
        let cadena = '<div id="mAU" class="form-group">';
        cadena = cadena + '<label for="nick">Introduce un nick:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="nick">';
        cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary">Agregar usuario</button>';
        cadena = cadena + '<div id="btnGS"></div>';
        cadena = cadena + '<div id="msg"></div>'
        cadena = cadena + '</div>';

        $("#au").append(cadena);
        $('#btnGS').load("./cliente/botonGS.html");
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
   
}