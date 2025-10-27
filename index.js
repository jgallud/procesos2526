const fs = require("fs");
const express = require('express');
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./servidor/passport-setup.js");
const app = express();
const bodyParser=require("body-parser");
const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/"));

app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let sistema = new modelo.Sistema();

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

app.get("/agregarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.agregarUsuario(nick);
    response.send(res);
});

app.get("/obtenerUsuarios", function (request, response) {
    let res = sistema.obtenerUsuarios();
    response.send(res);
});

app.get("/eliminarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    res = sistema.eliminarUsuario(nick);
    response.send(res);
});

app.get("/numeroUsuarios", function (request, response) {
    let num = sistema.numeroUsuarios();
    response.send({ "numero": num });
});

app.get("/usuarioActivo/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.usuarioActivo(nick);
    response.send({ "activo": res });
});

app.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});