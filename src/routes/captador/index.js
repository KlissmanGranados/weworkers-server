const MAIN = '../../microServices/captador';
// eslint-disable-next-line max-len
const projectManagement = require(`${MAIN}/projectManagement/projectManagementRouter`)
let routes = [];
routes = routes.concat(projectManagement);
module.exports = routes;
