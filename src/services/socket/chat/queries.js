const {db} = require('../../../../index');


exports.insertMessage = async (data) => {
  return db.execute(async (conn) =>{
    const prueba = 'query de prueba';

    /* const query = conn.query(
      ``,
      []
    ); */

    return prueba;
  });
};
exports.contactList = async (loggedUser) => {
  return db.transaction(async (conn) =>{
    const chatrooms = await conn.query(`
      SELECT chat_id FROM mensajes WHERE usuarios_id = $1;
      `, [loggedUser]);

    const contacts = [];
    let contactQuery;

    for (chat of chatrooms.rows) {
      contactQuery = await conn.query(`
        SELECT usuarios.id, usuarios.usuario FROM mensajes 
        INNER JOIN usuarios ON (mensajes.usuarios_id=usuarios.id) 
        WHERE mensajes.chat_id = $1 AND mensajes.usuarios_id !=$2;
        `, [chat.chat_id, loggedUser]);

      contacts.push(contactQuery.rows[0]);
    }

    return contacts;
  });
};

exports.startChat = async (loggedUser, receivedUser, proyectoId) => {
  return loggedUser !== receivedUser? db.transaction( async (conn)=>{
    const usernames = await conn.query(
        `SELECT usuarios.usuario FROM usuarios WHERE id=$1 OR id=$2;
    `, [loggedUser, receivedUser],
    );

    const firstSessionMessage = `primera sesión entre 
  ${usernames.rows[0].usuario} y ${usernames.rows[1].usuario}`;

    const query = await conn.query(
        `SELECT chat_id FROM 
  mensajes WHERE usuarios_id=$1;
  `,
        [receivedUser],
    );

    if (query.rowCount > 0) {
      const loggedQuery = await conn.query(`SELECT chat_id
      FROM mensajes WHERE usuarios_id = $1;
      `, [loggedUser]);

      const receivedQuery = await conn.query(`SELECT chat_id
      FROM mensajes WHERE usuarios_id = $1;
      `, [receivedUser]);

      const loggedIds = loggedQuery.rows.map((el) => el.chat_id);

      const receivedIds = receivedQuery.rows.map((el) => el.chat_id);

      const chatId = loggedIds.filter((el) => receivedIds.includes(el));

      const messages = await conn.query(`SELECT * FROM mensajes
      WHERE (usuarios_id=$1 and chat_id=$3)
      OR (usuarios_id=$2 and chat_id=$3);`,
      [loggedUser, receivedUser, chatId[0]]);

      return messages.rows;
    } else {
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
    }
  }):'Error: no se permiten ids repetidos';
};
