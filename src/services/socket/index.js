module.exports = (server) => {
  const privateKey = process.env.PRIVATE_KEY;
  const jwt = require('jsonwebtoken');
  const identify = {};

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT'],
      allowedHeaders: ['token'],
      credentials: true,
    },
  });

  io.use((socket, next)=>{
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
          socket
              .handshake
              .query
              .token, privateKey, function(err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            // relacionar sockets con el usuario autenticado
            let user = identify[socket.decoded.idusuario];
            if (!user) {
              user = {
                session: socket.decoded,
                socketsIds: [socket.id],
              };
            } else {
              user.socketsIds.push(socket.id);
            }
            identify[socket.decoded.idusuario] = user;
            next();
          });
    } else {
      next(new Error('Authentication error'));
    }
  })
      .on('connection', (socket) => {
        // eliminar ids asociados
        socket.on('close', ()=>{
          identify[socket.decoded.idusuario] = undefined;
        });
        // cargar eventos del chat
        require('./chat/events')(io, socket, identify);
      });
};
