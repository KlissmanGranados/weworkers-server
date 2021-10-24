module.exports = (server) => {
  const privateKey = process.env.PRIVATE_KEY;
  const jwt = require('jsonwebtoken');
  const identify = {};
  const peerLimits = 50;

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
            if (err) {
              console.error(err);
              return next(new Error('Authentication error'));
            };
            socket.decoded = decoded;
            // relacionar sockets con el usuario autenticado
            let user = identify[socket.decoded.idusuario];
            if (!user) {
              user = {
                session: socket.decoded,
                socketsIds: [socket.id],
              };
            } else if (user.socketsIds.length <= peerLimits) {
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
        const user = identify[socket.decoded.idusuario];
        const _user = JSON.stringify(socket.decoded);
        // eliminar ids asociados
        socket.on('close', ()=>{
          identify[socket.decoded.idusuario] = undefined;
          console.info(`El usuario: [${_user}], 
          ha sido desvinculado del socket`.trim());
        });

        if (user.socketsIds.length >= peerLimits) {
          console.info(`
            Un usuario: [${_user}] , 
            ha pasado los limites de ${peerLimits} conexiones
          `.trim());
          return;
        }
        // cargar eventos del chat
        require('./chat/events')(io, socket, identify);
      });
};
