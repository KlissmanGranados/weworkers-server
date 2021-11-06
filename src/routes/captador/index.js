const MAIN = '../../microServices/captador';
// eslint-disable-next-line max-len
const projectManagement = require(`${MAIN}/projectManagement/projectManagementRouter`);
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
// eslint-disable-next-line max-len
const getPropuestasRouter = require(`${MAIN}/getPropuestas/getPropuestasRouter`);
let routes = [];
routes = routes.concat(projectManagement);
routes = routes.concat(cuestionario);
routes = routes.concat(getPropuestasRouter);
module.exports = routes;
