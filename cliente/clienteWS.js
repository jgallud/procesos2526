function ClienteWS() {
    this.socket = undefined;
    this.email=undefined;
    this.codigo=undefined;
    this.estado=undefined;
    this.ini = function () {
        this.socket = io.connect(); //se lanza el WS
        this.lanzarServidorWSCliente();
    }
    //enviar mensajes al servidor
    this.crearPartida=function(){
        this.socket.emit("crearPartida",{"email":this.email});
    }
    this.unirAPartida=function(codigo){
        this.socket.emit("unirAPartida",{"email":this.email,"codigo":codigo});
    }
    this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",{"email":this.email,"codigo":this.codigo});
        this.codigo=undefined;
        this.estado=undefined;
	}
    // responder a mensajes del servidor
    this.lanzarServidorWSCliente=function(){
        let cli=this;
        this.socket.on('connect', function(){   						
            console.log("Usuario conectado al servidor de WebSockets");
        });
        this.socket.on("partidaCreada",function(datos){
            console.log(datos.codigo);
            ws.codigo=datos.codigo;
            ws.estado="esperando";
            cw.mostrarHomePartida();
            cw.mostrarEsperandoRival();
        });
       this.socket.on("unidoAPartida",function(data){
			if (data.codigo!=-1){
				console.log("Usuario "+ws.email+" se une a partida codigo: "+data.codigo);
				cw.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;				
			}
			else{
				console.log("No se ha podido unir a partida");
			}
		});      
        this.socket.on("noUnidoAPartida",function(datos){
            console.log("No se ha podido unir");
        });  
        this.socket.on("listaPartidas",function(lista){
            console.log(lista);
            if (ws.estado!="esperando"){
                cw.mostrarListaPartidas(lista);
            }
        });
        this.socket.on("jugadorAbandona",function(data){
			let name=data.email;
			if (name.includes("@")){
				name=name.substring(0, name.lastIndexOf("@"));
			}
			cw.mostrarModal("Aviso","Jugador "+name+" abandona");
			cw.finPartida();
		});
        this.socket.on("actualizarListaPartidas",function(lista){
			if (!cli.codigo){
				cw.mostrarListaPartidas(lista);
			}
		});
        this.socket.on("iniciarPartida",function(data){
            console.log("Iniciando partida para "+data.email);
        });
    }

    this.ini();
}