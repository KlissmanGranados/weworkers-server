// eslint-disable-next-line max-len
const userOperationsRouter = require('../../microServices/comun/userOperations/userOperationsRouter');

let routes = [];
routes = routes.concat(userOperationsRouter);

module.exports = routes;
