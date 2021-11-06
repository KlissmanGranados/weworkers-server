/**
 * @description ruta principal
 * @type {string}
 */
const MAIN = '../../microServices/comun';
// eslint-disable-next-line max-len
const userOperationsRouter = require(`${MAIN}/userOperations/userOperationsRouter`);
const redesRouter = require(`${MAIN}/redes/redesRouter`);
const getProjectsRouter = require(`${MAIN}/getProjects/getProjectsRouter`);
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);

/**
 * @description contiene las rutas concernientes al rol común
 * @type {Array<{{
 * method:String,
 * url:String,
 * handler:Function,
 * middlewares:Array<Function>}}>}
 */
let routes = [];

// Agregando rutas
routes = routes.concat(userOperationsRouter);
routes = routes.concat(redesRouter);
routes = routes.concat(getProjectsRouter);
routes = routes.concat(cuestionario);

// Exportando rutas
module.exports = routes;
