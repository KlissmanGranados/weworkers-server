let routes = [];
// eslint-disable-next-line max-len
const userOperationsRouter = require('../../microServices/comun/userOperations/userOperationsRouter');
routes = routes.concat(userOperationsRouter);

module.exports = routes;
