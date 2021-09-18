/**
 * @description ruta principal
 * @type {string}
 */
const MAIN = '../../microServices/comun';
// eslint-disable-next-line max-len
const userOperationsRouter = require(`${MAIN}/userOperations/userOperationsRouter`);
const redesRouter = require(`${MAIN}/redes/redesRouter`);

/**
 * @description contiene las rutas concernientes al rol común
 * @type {Object[]}
 */
let routes = [];

// Agregando rutas
routes = routes.concat(userOperationsRouter);
routes = routes.concat(redesRouter);

// Exportando rutas
module.exports = routes;
