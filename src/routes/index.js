/**
 * Archivo que agrega todas las rutas del servicio.
 */

/**
 * @name{app}
 * @type{Express}
 * @description instancia principal del servicio
 *
 * @name{path}
 * @type {path}
 * @description maneja las rutas de lectura de los archivos
 *
 * @name{loader}
 * @param{multipleDirs}
 * @type {Array}
 * @description lista de rutas de los archivos contenedores de endpoints
 * @type{function}
 * @return {Array}
 * @description almacena todos los objetos que contienen las rutas de los
 * directorios proporcionados por { multipleDirs }.
 *
 * @name {guards}
 * @type {Array}
 * @description lista de guards ordenadas por atributo
 *
 * @name {auth}
 * @type {Array}
 * @description Protege las rutas que requieren autenticación
 */
const {app} = require('../../index');
const path = require('path');
const loader = require('expressjs-routes-loader')({useNameFolder: true});
const guards = require('../guards');
const auth = require('../guards/authGuard');

/**
 * @name{apiVersion}
 * @type{String}
 * @description versión del servicio
 *
 * @name{serverHost}
 * @type{String}
 * @description puerto en donde se ejecuta el servicio
 */
const apiVersion = process.env.VERSION;
const serverHost = process.env.HOST || 'http://localhost';
const serverPort = process.env.PORT || 3000;

const multipleDirs = [
  [path.join(__dirname, './', 'auth'), `${apiVersion}/auth`],
  [path.join(__dirname, './', 'public'), `${apiVersion}/public`],
  [path.join(__dirname, './', 'captado'), `${apiVersion}/captado`],
  [path.join(__dirname, './', 'captador'), `${apiVersion}/captador`],
  [path.join(__dirname, './', 'comun'), `${apiVersion}/comun`],
];

const routes = loader(multipleDirs);
/**
 * Agrega los endpoints a la instancia
 */
routes.forEach((route) => {
  const routePrefix = route.url.split('/')[3];
  // Se verifica sino necesitan protección
  if (routePrefix === 'auth' || routePrefix === 'public') {
    app[route.method](route.url, route.middelwares, route.handler);
  } else {
    app[route.method](
        route.url,
        auth.concat(guards[routePrefix].concat(route.middelwares)),
        route.handler,
    );
  }
});

// Se inicia el servicio
app.listen(serverPort, (err) => {
  if (err) throw err;
  console.log(`server running on : ${serverHost}:${serverPort}${apiVersion}`);
});
