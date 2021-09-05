// eslint-disable-next-line no-unused-vars
const privateKey = process.env.PRIVATE_KEY;
// eslint-disable-next-line no-unused-vars
const response = require('../response');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');

module.exports = [
  (req, res, next)=>{
    /**
     * TODO
     * - verificar si el token que se recibe es válido
     * - verificar si el token está expirado
     * - decifrar token y pasar datos de sessión como atributo {Usuario} en req
     * Por ejemplo: req.user = {(id,nombre,email.apellido,rol)};
     * response.forbidden_not_login();
     */
    next();
  },
];
