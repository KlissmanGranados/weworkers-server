const response = require('../response');
const jwt = require('jsonwebtoken');
const authRepository = require('./authRepository');

/**
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.getRoles = async (req,res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getRolesById(id));
}
/**
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.getIposIdentificacion = async (req,res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getTipoIdentificacion(id));
};
/**
 *
 * @param{Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.login = async (req, res)=>{
  const inputs = req.body;
  const checkLogin = await authRepository.login(inputs);
  if(!checkLogin){
    response.forbidden_invalid_login(res);
    return;
  }
  response.success_login(res,  makeToken(checkLogin));
};
/**
 *
 * @param{Request} req
 * @param{Response} res
 */
exports.logout = (req, res) => {
  /**
   * TODO Revocar token
   */
  response.success(res, []);
};

/**
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.regedit = async (req, res)=>{

  /** @type {Auth} */
  const auth = req.body;
  /** @type {true|void} **/
  const regedit = await authRepository.insertUsuario(auth);

  if(regedit){

    auth.persona.id = undefined;
    auth.usuario.id = undefined;
    auth.usuario.clave = undefined;
    auth.usuario.personaId = undefined;

    const token = {
      persona: auth.persona,
      usuario: auth.usuario,
    };

    response.success(res,makeToken(token));

  }else{
    response.error(res);
  }

};
/**
 * @param {Objet} data
 * @returns {String}
 */
function makeToken(data){
  return jwt.sign(data,
    process.env.PRIVATE_KEY,
    {algorithm: 'HS256', expiresIn: '1h'});
}
