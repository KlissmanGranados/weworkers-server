const {
  insertMessage,
  readMessage,
} = require('./queries');

module.exports = async (io, socket, identify) => {
  const user = identify[socket.decoded.idusuario];
  const listMessages = await readMessage();

  // abriendo chat
  socket.on('chat:init', () => {
    console.info(`Abriendo chat para: [${JSON.stringify(user)}]`);
    user.socketsIds.forEach((userId) => {
      io.to(userId).emit('chat:init', listMessages);
    });
  });

  socket.on('chat:send', async (data) => {
    console.info(`${JSON.stringify(user)}, Ha enviado un mensaje`);
    /**
     * @type {Array<BigInteger>} datos del destinatario
     */
    const to = identify[data.to];
    if (to && data.to !== user.session.idusuario) { // si ambos estan conectados
      for (const _to of (to.socketsIds).concat(user.socketsIds)) {
        await insertMessage(data);
        io.to(_to).emit('chat:answer', data);
      }
    } else { // si solo quien envia
      for (const _to of (user.socketsIds)) {
        await insertMessage(data);
        io.to(_to).emit('chat:answer', data);
      }
    }
  });
};
