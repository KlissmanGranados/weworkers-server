const {app} = require('../../index');


const apiVersion = process.env.VERSION;
const serverHost = process.env.HOST || 'http://localhost';
const serverPort = process.env.PORT || 3000;
const paginacionRouter = require('./united test/paginacion');

app.use(paginacionRouter);

// Se inicia el servicio
app.listen(serverPort, (err) => {
  if (err) throw err;
  console.log(`server running on : ${serverHost}:${serverPort}${apiVersion} 💪`);
});
