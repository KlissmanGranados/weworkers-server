/**
 * Archivo que agrega todas las rutas del servicio.
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
    app[route.method](route.url, route.middlewares, route.handler);
  } else {
    app[route.method](
        route.url,
        auth.concat(guards[routePrefix].concat(route.middlewares)),
        route.handler,
    );
  }
});

// Se inicia el servicio
app.listen(serverPort, (err) => {
  if (err) throw err;
  console.log(`server running on : ${serverHost}:${serverPort}${apiVersion} 💪`);
});
