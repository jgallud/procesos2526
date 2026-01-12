const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");

function Sistema(test) {
  this.usuarios = {};
  this.cad = new datos.CAD();
	this.partidas={};
  
  this.registrarUsuario = function (obj, callback) {
    let modelo = this;
    if (!obj.nick) {
      obj.nick = obj.email.split("@")[0];;
    }
    this.cad.buscarUsuario({ email: obj.email }, async function (usr) {
      if (!usr) {
        obj.key = Date.now().toString();
        obj.confirmada = false;
        const hash = await bcrypt.hash(obj.password, 10);
        obj.password = hash;
        modelo.cad.insertarUsuario(obj, function (res) {
          callback(res);
        });
        correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
      }
      else {
        callback({ "email": -1 });
      }
    });
  }
  this.confirmarUsuario = function (obj, callback) {
    let modelo = this;
    this.cad.buscarUsuario({
      "email": obj.email, "confirmada": false, "key": obj.key
    }, function (usr) {
      if (usr) {
        usr.confirmada = true;
        modelo.cad.actualizarUsuario(usr, function (res) {
          callback({ "email": res.email }); //callback(res)
        })
      }
      else {
        callback({
          "email": - 1
        });
      }
    })
  }
  this.loginUsuario = function (obj, callback) {
    let modelo = this;

    this.cad.buscarUsuario({ email: obj.email, "confirmada": true }, function (usr) {
      if (!usr) {
        //modelo.cad.insertarUsuario(obj, function (res) {
        callback({ "email": -1 });
        //});
      }
      else {
        bcrypt.compare(obj.password, usr.password, function (err, result) {
          if (result) {
            callback({ "email": usr.email });
            modelo.agregarUsuario(usr.email);
          }
          else {
            callback({ "email": -1 });
          }
        })
      }
    });
  }
  this.usuarioGoogle = function (usr, callback) {
    let modelo = this;
    this.cad.buscarOCrearUsuario(usr, function (obj) {
      callback(obj);
      modelo.agregarUsuario(obj.email);

    });
  }

  this.agregarUsuario = function (nick) {
    let res = { "nick": -1 };
    if (!this.usuarios[nick]) {
      this.usuarios[nick] = new Usuario(nick);
      res.nick = nick;
    }
    else {
      console.log("el nick " + nick + " ya está activo");
    }
    return res;
  }

  this.obtenerUsuarios = function () {
    let lista = [];
    for (let u in this.usuarios) {
      lista.push({ "nick": this.usuarios[u].nick }); //agregar otra informacion
    }
    return lista;
    //return this.usuarios; ;
  }

  this.usuarioActivo = function (nick) {
    return this.usuarios[nick] != undefined;
  }

  this.eliminarUsuario = function (nick) {
    res = { "nick": -1 };
    if (this.usuarios[nick]) {
      delete this.usuarios[nick];
      res.nick = nick;
    }
    return res;
  }

  this.numeroUsuarios = function () {
    return Object.keys(this.usuarios).length;
  }

  this.crearPartida = function (email) {
    // obtener el objeto usuario con email = “email”
    let usr = this.usuarios[email]; //obtnerUsuario(email)
    let codigo = this.obtenerCodigo(); //mejorar obtenerCodigo
    if (usr && !this.partidas[codigo]) {
      //console.log("Modelo- Creando partida con código: " + codigo);
      this.partidas[codigo] = new Partida(codigo, usr);
      return codigo;
    }
    else {
      return -1;
    }
  }

  this.unirAPartida = function (email, codigo) {
    let usr = this.usuarios[email];
    let res = false;
    let partida = this.partidas[codigo];
    if (usr && partida) {
      res = partida.asignarJugador(usr,"black");
      //return res;
    }
    return res;
  }

  this.obtenerCodigo = function () {
    let cadena = "ABCDEFGHIJKLMNOPQRSTUVXYZ123456789";
    let letras = cadena.split('');
    let maxCadena = cadena.length;
    let codigo = [];
    for (i = 0; i < 6; i++) {
      codigo.push(letras[randomInt(1, maxCadena) - 1]);
    }
    return codigo.join('');
  }
  function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  }

  this.obtenerPartidasDisponibles = function () {
    let lista = [];
    for (var e in this.partidas) {
      let partida = this.partidas[e];
      if (partida.partidaDisponible()) {
        lista.push({ owner: partida.owner.nick, codigo: partida.codigo });
      }
    };
    return lista;
  }

  this.obtenerTodasPartidas = function () {
    let lista = [];
    for (var e in this.partidas) {
      let partida = this.partidas[e];
      lista.push({ owner: partida.owner.nick, codigo: partida.codigo });
    };
    return lista;
  }
  this.eliminarPartida = function (email, codigo) {
    let res = { "eliminado": false };
    let partida = this.partidas[codigo];
    let usr = this.usuarios[email];
    if (usr && partida && (usr == partida.owner)) {
      delete this.partidas[codigo];
      res.eliminado = true;
    }
    return res;
  }

  this.jugadorAbandona = function (datos) {
    let codigo = datos.codigo;
    let email = datos.email;  
    console.log("Jugador "+email+" abandona la partida "+codigo);
    this.eliminarPartida(email, codigo);
  }

  if (!test.test) {
    this.cad.conectar(function (db) {
      console.log("Conectado a Mongo Atlas");
      // Aquí puedes realizar operaciones con la base de datos
    });
  }
}

function Partida(codigo, owner) {
  this.codigo = codigo;
  this.owner = owner;
  this.jugadores = [];
  this.maxJug = 2;
  this.turno = "white";
  this.listaCompleta=false;
  this.tablero = Array(9).fill(null).map(() => Array(9).fill(0));
  this.asignarJugador = function (usr, color) {
    if (this.jugadores.length >= this.maxJug) {
      return false;
    }
    console.log("Asignando jugador " + usr.nick + " a la partida " + this.codigo);
    usr.color = color;
    this.jugadores[usr.email] = usr;
    if (Object.keys(this.jugadores).length === this.maxJug) {
      this.listaCompleta = true;
    }
    return true;
  }
  this.partidaDisponible = function () {
    return this.jugadores.length < this.maxJug;
  }
  this.asignarJugador(this.owner,"white");
}

function Usuario(nick,color) {
  this.nick = nick;
  this.email = nick;
  this.color=color;
}

module.exports.Sistema = Sistema;
