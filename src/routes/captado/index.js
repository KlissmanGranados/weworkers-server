const MAIN = '../../microServices/captado';
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
let routes = [];
routes = routes.concat(cuestionario);
module.exports = routes;
