function ControlWeb() {
    this.comprobarSesion = function () {
        let nick = $.cookie("nick");
        if (nick) {
            this.mostrarHome(nick);
        }
        else {
            //this.mostrarAgregarUsuario();
            this.mostrarLogin();
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
                    rest.registrarUsuario(email, pwd);
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
            $("#btnRegistro").on("click", function (e) {
                e.preventDefault();
                cw.mostrarRegistro();
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
    this.mostrarHome = function () {
        this.limpiar();
        let nick = $.cookie("nick"); //podría ser parámetro de la función
        ws.email=nick;
        let cadena = "<div id='mH'><h2>Bienvenido " + nick + " al sistema</h2></div>";
        $("#au").append(cadena);
        this.mostrarCrearPartida();
        rest.obtenerListaPartidasDisponibles();
    }

    this.salir = function () {
        $.removeCookie("nick");
        location.reload();
    }

    this.limpiar = function () {
        $("#txt").remove();
        $('#mAU').remove();
        $('#mH').remove();
        $("#fmLogin").remove();
        $("#fmRegistro").remove();
    }
    this.mostrarModal = function (m) {
        $("#msg").remove();
        let cadena = "<div id='msg'>" + m + "</div>";
        $('#mBody').append(cadena);
        $('#miModal').modal();
        $('#btnModal').on('click',function(){
            $('#miModal').modal('hide');
        })
    }

    this.mostrarCrearPartida=function(){
        $("#mCP").remove();
        let cadena="<div id='mCP'>";
        cadena=cadena+"<h3>Crear nueva partida</h3>";
        cadena=cadena + '<button id="btnCP" type="submit" class="btn btn-primary">Crear partida</button>';
        cadena=cadena+"</div>";

        $("#partidas").append(cadena);
        
        $('#btnCP').on('click',function(){
            $("#mCP").remove();
            ws.crearPartida();
        });
    }
    this.mostrarHomePartida=function(){
        $("#mAb").remove();
        $('#mLP').remove();
        //this.quitarCLPartidas();
        //this.mostrarMensaje("Usuario: "+ws.email+" en partida: "+ws.codigo);
        let cadena="<div id='mAb'>";
        cadena=cadena+"Usuario: "+ws.email+" en partida: "+ws.codigo;
        cadena=cadena + '<button id="btnAb" type="submit" class="btn btn-primary">Abandonar partida</button>';
        cadena=cadena+"</div>";

        $("#partidas").append(cadena);

        if (ws.estado=="esperando"){
            this.mostrarEsperandoRival();
        }
        
        $('#btnAb').on('click',function(){
            $("#mAb").remove();
            $("#mER").remove();
            $('#tablero').remove();
            ws.abandonarPartida();
            cw.mostrarHome();
        });
    }
    this.mostrarEsperandoRival=function(){
        //this.limpiar();
        $('#mER').remove();
        var cadena='<div id="mER"><h3>Esperando rival</h3>';
        cadena=cadena+'<img id="gif" src="cliente/img/waiting.gif"><br>';
        cadena=cadena+'</div>';
        $('#partidas').append(cadena);
    }
    this.mostrarListaPartidas=function(lista){
        if (!ws.email) return false;
        var ant=undefined;
        $('#mLP').remove();
        var cadena='<div id="mLP" class="panel panel-default"><div class="panel-body"><h3>Partidas disponibles</h3>';
        cadena=cadena+"<div class='row'><div class='col-md-4'>";
        cadena=cadena+'<input type="button" class="btn btn-primary btn-md" id="unirme" value="Unirme a partida">';
        cadena=cadena+"</div><div class='col-md-6'>"
        cadena=cadena+'<div class="list-group" id="lista">';
        for(var i=0;i<lista.length;i++){
            //var maximo=lista[i].maximo;
            //var numJugadores=maximo-lista[i].huecos;
            cadena=cadena+'<a href="#" name="'+i+'"" value="'+lista[i].codigo+'" class="list-group-item">Codigo: '+lista[i].codigo+' Creado por: '+lista[i].owner+'</a>';
            //cadena=cadena+'<a class="list-group-item list-group-item-action" href="#" value="'+lista[i].codigo+'" value="'+lista[i].codigo+'" role="tab">'+lista[i].codigo+'<span class="badge">'+numJugadores+'/'+maximo+'</span></a>';
        } 
        cadena=cadena+'</div></div><div class="col-md-2">'
        cadena=cadena+'</div></div></div>';
        //cadena=cadena+'</div>';    
       // cadena=cadena+'</div>';
    
        $('#listaPartidas').append(cadena);
        StoreValue = []; //Declare array
        $(".list-group a").click(function(){
            StoreValue = []; //clear array
            if (ant){
              $('[name="'+ant+'"]').attr("class","list-group-item list-group-item-action");
            }
            ant=this.name;
            $(this).attr("class","list-group-item list-group-item-action active");
            StoreValue.push($(this).attr("value")); // add text to array
        });
    
        $('#unirme').click(function(){
              var codigo="";
              codigo=StoreValue[0];//$("#lista").val();
              console.log(codigo);
              if (codigo){
                $('#mLP').remove();
                $('#mCP').remove();
                ws.unirAPartida(codigo);
              }
        });
    }
}