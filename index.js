const fs = require("fs");
const express = require('express');
//const next=require('next');// from 'next';
const path = require("path");// from "path";
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./servidor/passport-setup.js");
const app = express();

app.set("trust proxy", 1);

//const nextApp = next({ dev:true });
const httpServer = require('http').Server(app);
const { Server } = require("socket.io");
const moduloWS = require("./servidor/servidorWS.js");
let ws = new moduloWS.ServidorWS();
let io = new Server();
//const handle = nextApp.getRequestHandler();
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require("body-parser");
const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3000;
const url = process.env.urlConfirmar;
// Instala el paquete cors: npm install cors
const cors = require('cors');
const isProduction = process.env.NODE_ENV === "production";
// app.use(cors({
//     origin: "http://localhost:3000", // El puerto de tu nuevo Next.js
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

//app.use(express.static(__dirname + "/"));
app.use(express.static(path.join(__dirname, "cliente")));
app.use(passport.initialize());
app.use(cookieSession({
    name: 'session',
    keys: ['patata'],
    maxAge: 24 * 60 * 60 * 1000, // 1 día
    httpOnly: true,
    secure: isProduction, // true si estás en HTTPS
    sameSite: 'lax', // 'none' si front y back están en dominios distintos
}));


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
        response.redirect(url);
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let sistema = new modelo.Sistema({ test: false });



// app.get("/", function (request, response) {
//     var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
//     response.setHeader("Content-type", "text/html");
//     response.send(contenido);

// });

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
        //     response.cookie('nick', obj.email);
        //     response.redirect('/');
        // });
        console.log(request.user.emails[0].value);
        // 1. Configuración de la cookie para que sea accesible desde el nuevo puerto
        response.cookie('email', obj.email, {
            httpOnly: false, // Cámbialo a true si solo quieres que el servidor la lea
            secure: false,   // false porque estás en localhost
            sameSite: 'lax',
            path: '/'
        });

        response.redirect(url + "dashboard.html");
    });
});

app.get("/fallo", function (request, response) {
    response.send({ nick: "nook" })
});

app.post("/registrarUsuario", function (request, response) {
    sistema.registrarUsuario(request.body, function (res) {
        response.send({ "email": res.email });
    });
});

// app.get("/confirmarUsuario/:email/:key", function (request, response) {
//     let email = request.params.email;
//     let key = request.params.key;
//     sistema.confirmarUsuario({ "email": email, "key": key }, function (usr) {
//         if (usr.email != -1) {
//             response.cookie('nick', usr.email);
//         }
//         response.redirect('/');
//     });
// })

app.get("/confirmarUsuario/:email/:key", function (request, response) {
    let email = request.params.email;
    let key = request.params.key;

    sistema.confirmarUsuario({ "email": email, "key": key }, function (usr) {
        if (usr.email != -1) {
            // 1. Configuramos la cookie con los parámetros necesarios para Cross-Origin
            response.cookie('email', usr.email, {
                httpOnly: false, // Permitir que el frontend la lea si es necesario
                secure: false,   // false mientras estés en desarrollo (http)
                sameSite: 'lax', // Necesario para que la cookie se mantenga tras el redirect
                path: '/'        // Disponible en toda la aplicación
            });

            // 2. Redirigimos al Dashboard del nuevo Frontend (puerto 3001)
            response.redirect(url + 'dashboard.html');
        } else {
            // 3. Si la confirmación falla, podrías redirigir al login con un error
            response.redirect(url + '/?error=confirmacion_fallida');
        }
    });
});

 app.post('/loginUsuario', passport.authenticate("local", { failureRedirect: "/fallo", successRedirect: "/ok" })
 );

// app.post('/loginUsuario', function (req, res, next) {
//     passport.authenticate('local', function (err, user, info) {
//         if (err) return next(err);

//         if (!user) {
//             return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
//         }

//         // Iniciamos la sesión manualmente
//         //req.logIn(user, function (err) {
//         //    if (err) return next(err);

//             // IMPORTANTE: Aquí establecemos tu cookie 'nick'
//             res.cookie('email', user.email, {
//                 httpOnly: false, // Para que el front pueda leerla
//                 secure: false,   // false en localhost
//                 sameSite: 'lax',
//                 path: '/'
//             });

//             // RESPONDEMOS JSON, NO REDIRIGIMOS
//             return res.status(200).json({
//                 success: true,
//                 message: "Login exitoso",
//                 user: {email: user.email}
//             });
//         //});
//     })(req, res, next);
// });

// Ejemplo en Express
// app.post("/loginUsuario", function (req, res) {
//     const { email, password } = req.body;

//     sistema.loginUsuario({ "email": email, "password": password }, function (usuarioValido) {
//         if (!usuarioValido) return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

//         // Poner cookie igual que Google
//         res.cookie('email', email, {
//             httpOnly: false, // puedes poner true si quieres que solo el servidor la lea
//             secure: false,   // false en local, true en producción HTTPS
//             sameSite: 'lax',
//             path: '/'
//         });

//         // Redirigir al dashboard o devolver JSON
//         return res.status(200).json({ ok: true });
//     });
// });


app.get("/ok", function (request, response) {
    //response.send({ nick: request.user.email })
    response.cookie('email', request.user.email, {
            httpOnly: false, // Cámbialo a true si solo quieres que el servidor la lea
            secure: false,   // false porque estás en localhost
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas por ejemplo
        });
   // response.redirect(url+ 'dashboard.html');
   return response.status(200).json({ email: request.user.email });
});

app.get('/verificarSesion', (req, res) => {
    if (req.user) {
        console.log("Usuario autenticado:", req.user);
        res.json({ auth: true, user: req.user });
    } else {
        res.status(401).json({ auth: false });
    }
});

// Ruta en tu servidor Express (Puerto 3000)
// app.get('/dashboard', (req, res) => {
//     // Verificamos si Passport tiene al usuario autenticado
//     res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.header('Pragma', 'no-cache');
//     res.header('Expires', '0');
//     if (req.isAuthenticated()) {
//         res.json({
//             auth: true,
//             user: req.user
//         });
//     } else {
//         // IMPORTANTE: Enviamos 401 para que el Front sepa que debe redirigir
//         res.status(401).json({ auth: false, message: "Sesión expirada o no iniciada" });
//     }
// });

// app.post("/cerrarSesion", function (request, response) {
//     console.log("--> Backend: Iniciando proceso de salida");

//     // 1. Limpiamos las cookies del lado del servidor de inmediato
//     response.clearCookie('connect.sid', { path: '/' });
//     response.clearCookie('nick', { path: '/' });
//     sistema.eliminarUsuario(request.user ? request.user.email : null);
//     console.log("--> Backend: Cookies limpiadas.");
//     // 2. Respondemos al cliente YA para que no se quede en 'pending'
//     response.status(200).json({ status: "ok" });

//     // 3. De forma asíncrona (en segundo plano), limpiamos Passport
//     if (request.logout) {
//         request.logout(function(err) {
//             if (request.session) {
//                 request.session.destroy();
//             }
//             console.log("--> Backend: Sesión de Passport finalizada en segundo plano.");
//         });
//     }
// });

app.post("/cerrarSesion", function (request, response) {
    console.log("--> Backend: Intentando cerrar sesión segura...");

    const nick = (request.user ? request.user.email : null) ||
        (request.session ? request.session.nick : null) ||
        (request.cookies ? request.cookies.nick : null);

    console.log("Nick localizado para eliminar:", nick);

    if (nick) {
        try {
            console.log(`Eliminando a ${nick} de la colección de lógica...`);
            sistema.eliminarUsuario(nick);
        } catch (error) {
            console.log("Error al eliminar usuario de la lógica:", error);
            // Seguimos adelante para que el usuario pueda salir de todos modos
        }
    }
    // 1. Limpiar Passport (si existe)
    if (request.logout) {
        try {
            request.logout(() => { });
        } catch (e) {
            console.log("Logout síncrono");
        }
    }
    sistema.eliminarUsuario(request.user ? request.user.email : null);
    // 2. Limpiar la sesión con seguridad
    if (request.session && typeof request.session.destroy === 'function') {
        request.session.destroy((err) => {
            if (err) console.log("Error al destruir sesión:", err);
            enviarRespuestaFinal(response);
        });
    } else {
        // Si no hay sesión o no hay función destroy, no pasa nada
        console.log("No había sesión activa o la función destroy no existe");
        enviarRespuestaFinal(response);
    }
});

// Función auxiliar para no repetir código
function enviarRespuestaFinal(response) {
    response.clearCookie('connect.sid', { path: '/', domain: 'localhost' });
    response.clearCookie('nick', { path: '/', domain: 'localhost' });
    console.log("--> Backend: Respuesta enviada con éxito.");
    return response.status(200).json({ status: "ok" });
}
// app.post("/cerrarSesion", function (request, response) {
//     console.log("--> Backend: Forzando cierre de sesión...");

//     // 1. Borramos el rastro en Passport de forma síncrona
//     // En muchas versiones, esto limpia req.user inmediatamente
//     if (typeof request.logout === 'function') {
//         try {
//             // Intentamos la versión con callback por si acaso
//             request.logout(() => {}); 
//         } catch (e) {
//             // Si falla (versión vieja), probamos síncrono
//             request.logout();
//         }
//     }

//     // 2. MATAR LA SESIÓN MANUALMENTE
//     // No esperamos al callback de destroy, simplemente sobrescribimos la sesión
//     if (request.session) {
//         request.session.destroy((err) => {
//             if (err) console.log("Error destruyendo sesión, pero seguimos...");

//             // 3. LIMPIEZA DE COOKIES Y RESPUESTA
//             // Usamos nombres de cookies comunes, asegúrate de que coincidan con las tuyas
//             response.clearCookie('connect.sid', { path: '/', domain: 'localhost' });
//             response.clearCookie('nick', { path: '/', domain: 'localhost' });

//             console.log("--> Backend: Todo limpio. Enviando respuesta al Front.");
//             return response.status(200).json({ status: "ok" });
//         });
//     } else {
//         // Si ni siquiera hay objeto sesión, respondemos OK igual
//         return response.status(200).json({ status: "ok" });
//     }
// });

// // Función auxiliar para asegurar que el Front reciba el OK y no se quede "Pending"
// function finalizarRespuesta(response) {
//     response.clearCookie('connect.sid', { path: '/' });
//     response.clearCookie('nick', { path: '/' });
//     console.log("Respuesta enviada al cliente.");
//     return response.status(200).json({ status: "ok" });
// }

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

app.get("/obtenerPartidasDisponibles", function (request, response) {
    let lista = sistema.obtenerPartidasDisponibles();
    response.send(lista);
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'cliente', 'index.html'));
});
//app.all('*', (req, res) => handle(req, res));

// app.listen(PORT, () => {
//     console.log(`App está escuchando en el puerto ${PORT}`);
//     console.log('Ctrl+C para salir');
// });
httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});
io.listen(httpServer);
ws.lanzarServidor(io, sistema);
