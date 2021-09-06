/**
 * @name Guards
 * @description con los guards se protegen las rutas a nivel de grupo,
 * cada grupo que se engloba acá estará disponible si se cumple una
 * condición
 * @type {[(function(Request, Response, createServer.NextFunction): void)]}
 */
exports.captado = require('./captadoGuard');
exports.captador = require('./captadorGuard');
exports.comun = require('./comunGuard');
