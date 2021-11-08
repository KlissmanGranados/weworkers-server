const MAIN = '../../microServices/captado';
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
const userOperations = require(`${MAIN}/userOperations/userOperationsRouter`);
const proposal = require(`${MAIN}/proposal/proposalRouter`);
let routes = [];

routes = routes.concat(cuestionario);
routes = routes.concat(userOperations);
routes = routes.concat(proposal);
module.exports = routes;
