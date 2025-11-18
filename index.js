const fs = require("fs");
const express = require('express');
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./servidor/passport-setup.js");
const app = express();
const httpServer = require('http').Server(app);
const { Server } = require("socket.io");
const moduloWS = require("./servidor/servidorWS.js");
let ws = new moduloWS.ServidorWS();
let io = new Server();

const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require("body-parser");
const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/"));

app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new
    LocalStrategy({ usernameField: "email", passwordField: "password" },
        function (email, password, done) {
            sistema.loginUsuario({ "email": email, "password": password }, function (user) {
                return done(null, user);
            })
        }
    ));

const haIniciado = function (request, response, next) {
    if (request.user) {
        next();
    }
    else {
        response.redirect("/")
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let sistema = new modelo.Sistema({ test: false });

app.get("/", function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);

});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/fallo' }),
    function (req, res) {
        res.redirect('/good');
    });

app.post('/oneTap/callback',
    passport.authenticate('google-one-tap', { failureRedirect: '/fallo' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/good');
    });

// app.get("/good", function (request, response) {
//     let nick = request.user.emails[0].value;
//     if (nick) {
//         sistema.agregarUsuario(nick);
//     }
//     //console.log(request.user.emails[0].value);
//     response.cookie('nick', nick);
//     response.redirect('/');
// });

app.get("/good", function (request, response) {
    let email = request.user.emails[0].value;
    sistema.usuarioGoogle({ "email": email }, function (obj) {
        response.cookie('nick', obj.email);
        response.redirect('/');
    });
});

app.get("/fallo", function (request, response) {
    response.send({ nick: "nook" })
});

app.post("/registrarUsuario", function (request, response) {
    sistema.registrarUsuario(request.body, function (res) {
        response.send({ "nick": res.email });
    });
});

app.get("/confirmarUsuario/:email/:key", function (request, response) {
    let email = request.params.email;
    let key = request.params.key;
    sistema.confirmarUsuario({ "email": email, "key": key }, function (usr) {
        if (usr.email != -1) {
            response.cookie('nick', usr.email);
        }
        response.redirect('/');
    });
})

app.post('/loginUsuario', passport.authenticate("local", { failureRedirect: "/fallo", successRedirect: "/ok" })
);

app.get("/ok", function (request, response) {
    response.send({ nick: request.user.email })
});

app.get("/agregarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.agregarUsuario(nick);
    response.send(res);
});

app.get("/obtenerUsuarios", haIniciado, function (request, response) {
    let res = sistema.obtenerUsuarios();
    response.send(res);
});

app.get("/eliminarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    res = sistema.eliminarUsuario(nick);
    response.send(res);
});

app.get("/numeroUsuarios", haIniciado, function (request, response) {
    let num = sistema.numeroUsuarios();
    response.send({ "numero": num });
});

app.get("/usuarioActivo/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.usuarioActivo(nick);
    response.send({ "activo": res });
});

// app.listen(PORT, () => {
//     console.log(`App está escuchando en el puerto ${PORT}`);
//     console.log('Ctrl+C para salir');
// });
httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});
io.listen(httpServer);
ws.lanzarServidor(io,sistema);