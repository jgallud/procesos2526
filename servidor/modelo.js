const datos = require("./cad.js");

function Sistema() {
  this.usuarios = {};
  this.cad = new datos.CAD();

  this.registrarUsuario = function (obj, callback) {
    let modelo = this;
    if (!obj.nick) {
      obj.nick = obj.email;
    }
    this.cad.buscarUsuario(obj, function (usr) {
      if (!usr) {
        modelo.cad.insertarUsuario(obj, function (res) {
          callback(res);
        });
      }
      else {
        callback({ "email": -1 });
      }
    });
  }
  this.loginUsuario = function (obj, callback) {
        let modelo = this;

        this.cad.buscarUsuario({ email: obj.email }, function (usr) {
            if (!usr) {
                //modelo.cad.insertarUsuario(obj, function (res) {
                callback({ "email": -1 });
                //});
            }
            else {
                //bcrypt.compare(obj.password, usr.password, function (err, result) {
                    if (obj.password == usr.password) {
                        callback({ "email": usr.email });
                        modelo.agregarUsuario(usr.email);
                    }
                    else {
                        callback({ "email": -1 });
                    }
                //})
            }
        });
    }
  this.usuarioGoogle = function (usr, callback) {
    let modelo = this;
    this.cad.buscarOCrearUsuario(usr, function (obj) {
      callback(obj);
      //modelo.agregarUsuario(obj.email);

    });
  }

  this.agregarUsuario = function (nick) {
    let res = { "nick": -1 };
    if (!this.usuarios[nick]) {
      this.usuarios[nick] = new Usuario(nick);
      res.nick = nick;
    }
    else {
      console.log("el nick " + nick + " está en uso");
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

  this.cad.conectar(function (db) {
    console.log("Conectado a Mongo Atlas");
    // Aquí puedes realizar operaciones con la base de datos
  });
}

function Usuario(nick) {
  this.nick = nick;
}

module.exports.Sistema = Sistema;
