// eslint-disable-next-line max-len
const presentacionRoutes = require('../../microServices/public/presentacion/presentacionRouter');
const staticRoutes = require('../../microServices/public/static/staticRouter');
let routes = [];
routes = routes.concat(presentacionRoutes);
routes = routes.concat(staticRoutes);
module.exports = routes;
