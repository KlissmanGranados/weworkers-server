module.exports = (io, socket, identify) => {
  socket.on('chat:send', (data) => {
    const user = identify[socket.decoded.idusuario];
    user.socketsIds.forEach((socketId) => {
      io.to(socketId).emit('chat:send', {
        mensaje: data,
      });
    });
  });
};
