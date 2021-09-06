const response = require('../../../response');
const {app} = require('../../../../');
const {getRoutes} = require('get-routes');

exports.main = (req, res) => {
  const host = process.env.HOST || 'http://localhost';
  const port = process.env.PORT || 3000;
  const routes = getRoutes(app);
  const data = {host, port, routes};
  response.routes_listing(res, data);
};
