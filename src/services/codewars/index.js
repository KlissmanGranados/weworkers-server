const {get} = require('../fetch/');

/**
 * Consulta los datos de un perfil de codewars
 * 
 * @param {String} userName usuario de codewars 
 * @return {Promise<JSON>} datos del usuario
 */
exports.profile = async (userName)=>{
  return await get(
    `https://www.codewars.com/api/v1/users/${userName}`
  );
}