const {db} = require('../../../../index');


exports.insertMessage = async (data) => {
  return db.execute(async (conn) =>{
    const prueba = 'query de prueba'

    /*const query = conn.query(
      ``,
      []
    ); */

    return prueba;
  })
};
exports.readMessage = async (data) => {
  return db.execute(async (conn) =>{
    const prueba = 'leyendo mensajes';

    /*const query = conn.query(
      ``,
      []
    ); */

    return prueba;
  })
};
