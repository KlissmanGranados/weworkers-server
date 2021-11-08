const {db} = require('../../../../index');
const {userExists, chatExists} = require('./validator');


/**
 * @description inserta un mensaje de un chat a la base de datos
 * @param {String} message
 * @param {Number} chatId
 * @param {Number} senderId
 * @return {Promise<Boolean>}
 */
exports.insertMessage = async (message, chatId, senderId) => {
  return db.transaction(async (conn) =>{
    await conn.query(
        `INSERT INTO mensajes
      (mensaje, chat_id, usuarios_id, "timestamp")
      VALUES
      ($1, $2, $3, CURRENT_TIMESTAMP);`,
        [message, chatId, senderId],
    );
    return true;
  });
};
/**
 * @description devuelve la lista de contactos del usuario logueado
 * @param {Number} loggedUser
 * @return {Promise<Array>}
 */
exports.contactList = async (loggedUser) => {
  return db.transaction(async (conn) =>{
    const chatrooms = await conn.query(`
      SELECT chat_id FROM mensajes WHERE usuarios_id = $1 GROUP BY chat_id;
      `, [loggedUser]);

    const contacts = [];
    let contactQuery;

    for (chat of chatrooms.rows) {
      contactQuery = await conn.query(`
        SELECT usuarios.id, usuarios.usuario, mensajes.chat_id FROM mensajes 
        INNER JOIN usuarios ON (mensajes.usuarios_id=usuarios.id) 
        WHERE mensajes.chat_id = $1 AND mensajes.usuarios_id !=$2;
        `, [chat.chat_id, loggedUser]);

      contacts.push(contactQuery.rows[0]);
    }

    return contacts;
  });
};
/**
 * @description devuelve la lista de mensajes de un chat entre 2 usuarios
 * @param {Number} chatId
 * @return {Promise<Array>}
 */
exports.startChat = async (chatId) => {
  return db.execute( async (conn)=>{
    const checkChatId = await chatExists(chatId);

    if (!checkChatId) {
      return [];
    }

    const messages = await conn.query(`SELECT * FROM mensajes
      WHERE chat_id=$1 ORDER BY "timestamp";`,
    [chatId]);

    return messages.rows;
  });
};
/**
 * @description crea una sala de chat nueva entre 2 usuarios
 * @param {Number} proyectoId
 * @param {Number} loggedUser
 * @param {Number} receivedUser
 * @return {Promise<String>}
 */
exports.createChatRoom = async (proyectoId, loggedUser, receivedUser) =>{
  return db.transaction(async (conn) =>{
    const chatroomCheck = await conn.query(`
    SELECT t1.chat_id FROM (SELECT chat_id FROM mensajes WHERE usuarios_id=$1) 
    t1 INNER JOIN (SELECT chat_id FROM mensajes WHERE usuarios_id=$2) t2 
    ON (t1.chat_id=t2.chat_id) GROUP BY t1.chat_id;
    `, [loggedUser, receivedUser]);

    const userCheck = await userExists(receivedUser);

    if (chatroomCheck.rows.length > 0 || !userCheck) {
      return `Error: la sala de chat entre los usuarios 
      ya existe o no existe el usuario`;
    }
    const usernames = await conn.query(
        `SELECT usuarios.usuario FROM usuarios WHERE id=$1 OR id=$2;
  `, [loggedUser, receivedUser],
    );

    const firstSessionMessage = `primera sesión entre 
  ${usernames.rows[0].usuario} y ${usernames.rows[1].usuario}`;

    const chat = await conn.query(`INSERT INTO chat
    (proyectos_id)
    VALUES($1) RETURNING id;`, [proyectoId]);

    await conn.query(`
    INSERT INTO mensajes
    (mensaje, chat_id, usuarios_id, "timestamp")
    VALUES
    ('Bienvenido/a al chat', $1, $2, CURRENT_TIMESTAMP),
    ('Bienvenido/a al chat', $1, $3, CURRENT_TIMESTAMP);
    `, [chat.rows[0].id, loggedUser, receivedUser]);

    return firstSessionMessage;
  });
};
