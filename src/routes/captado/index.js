const MAIN = '../../microServices/captado';
const cuestionario = require(`${MAIN}/cuestionario/cuestionarioRouter`);
const proposal = require(`${MAIN}/proposal/proposalRouter`);
let routes = [];
routes = routes.concat(cuestionario);
routes = routes.concat(proposal);
module.exports = routes;
