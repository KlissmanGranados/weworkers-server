const response = require('../../../response');
const {app} = require('../../../../');
const {getRoutes} = require('get-routes');

exports.main = (req, res) => {
  let host = process.env.HOST || 'http://localhost:3000';
  host = host != 'http://localhost'? host: host + `:${process.env.PORT || 3000}`;
  const routes = getRoutes(app);

  routes.post = routes.post.map((route) => host + route);
  routes.get = routes.get.map((route) => host + route);
  routes.put = routes.put.map((route) => host + route);
  routes.delete = routes.delete.map((route) => host + route);
  routes.patch = routes.patch.map((route) => host + route);

  response.routes_listing(res, routes);
};
