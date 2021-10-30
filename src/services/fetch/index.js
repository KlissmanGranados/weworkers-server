const fetch = require('cross-fetch');

/**
 * Hace una solicitud get a un recurso
 * @param {String} uri endPoint
 * @return {Promise<JSON>}
 */
exports.get = async (uri)=>{
  try {
    const response = await fetch(uri);
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return false;
  }
};
