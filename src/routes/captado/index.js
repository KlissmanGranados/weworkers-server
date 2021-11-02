const MAIN = '../../microServices/captado';
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
const userOperations = require(`${MAIN}/userOperations/userOperationsRouter`);
let routes = [];

routes = routes.concat(cuestionario);
routes = routes.concat(userOperations);
module.exports = routes;
