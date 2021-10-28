const {
  insertMessage,
  contactList,
  startChat,
  createChatRoom,
} = require('./queries');

module.exports = async (io, socket, identify) => {
  const user = identify[socket.decoded.idusuario];
  const listMessages = await contactList(user.session.idusuario);

  // abriendo chat
  console.info(`Abriendo chat para: [${JSON.stringify(user)}]`);
  user.socketsIds.forEach((userId) => {
    io.to(userId).emit('chat:init', listMessages);
  });

  socket.on('chat:send', async (data) => {
    const query = await insertMessage(data.message,
        data.chatId, user.session.idusuario);

    if (!query) {
      user.socketsIds.forEach((userId) => {
        io.to(userId).emit('chat:answer',
            'Error: no se pudo enviar el mensaje');
      });
      return;
    }
    console.info(`${JSON.stringify(user)}, Ha enviado un mensaje`);
    /**
     * @type {Array<BigInteger>} datos del destinatario
     */
    const to = identify[data.to];
    if (to && data.to !== user.session.idusuario) { // si ambos estan conectados
      for (const _to of (to.socketsIds).concat(user.socketsIds)) {
        io.to(_to).emit('chat:answer', data);
      }
    } else { // si solo quien envia
      for (const _to of (user.socketsIds)) {
        io.to(_to).emit('chat:answer', data);
      }
    }
  });

  socket.on('chat:select', async (data) =>{
    const messages = await startChat(data);

    for (const to of user.socketsIds) {
      io.to(to).emit('chat:messages', messages);
    }
  });

  socket.on('chat:create', async (data) =>{
    const responseMessage = await createChatRoom(data.proyectoId,
        data.loggedUser, data.receivedUser);

    for (const to of user.socketsIds) {
      io.to(to).emit('chat:created', responseMessage);
    }
  });
};
