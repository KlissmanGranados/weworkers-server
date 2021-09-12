// eslint-disable-next-line max-len
const userOperationsRouter = require('../../microServices/comun/userOperations/userOperationsRouter');

let routes = [];
routes = routes.concat(userOperationsRouter);

console.log(routes)

module.exports = routes;
