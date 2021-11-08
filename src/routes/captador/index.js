const MAIN = '../../microServices/captador';
// eslint-disable-next-line max-len
const projectManagement = require(`${MAIN}/projectManagement/projectManagementRouter`);
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
// eslint-disable-next-line max-len
const adjudicarProyecto = require(`${MAIN}/adjudicarProyecto/adjudicarProyectoRouter`);
let routes = [];
routes = routes.concat(projectManagement);
routes = routes.concat(cuestionario);
routes = routes.concat(adjudicarProyecto);
module.exports = routes;
