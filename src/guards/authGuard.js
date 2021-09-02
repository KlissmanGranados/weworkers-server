const privateKey = process.env.PRIVATE_KEY;
const response = require('../response');

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
