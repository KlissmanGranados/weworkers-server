const {db} = require('../../../../index');

/**
 * @description determina si un usuario existe
 * @param {Number} userId
 * @return {Promise<Boolean>}
 */
exports.userExists = async (userId) => {
  return db.execute(async (conn) =>{
    const check = await conn.query(`
        SELECT id FROM usuarios WHERE id=$1;
        `, [userId]);

    return check.rowCount > 0;
  });
};
/**
 * @description determina si un chat existe
 * @param {Number} chatId
 * @return {Promise<Boolean>}
 */
exports.chatExists = async (chatId) => {
  return db.execute(async (conn) =>{
    const check = await conn.query(`
        SELECT id FROM chat WHERE id=$1;
        `, [chatId]);

    return check.rowCount > 0;
  });
};
