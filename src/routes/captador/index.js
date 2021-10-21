const MAIN = '../../microServices/captador';
// eslint-disable-next-line max-len
const projectManagement = require(`${MAIN}/projectManagement/projectManagementRouter`);
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
let routes = [];
routes = routes.concat(projectManagement);
routes = routes.concat(cuestionario);
module.exports = routes;
