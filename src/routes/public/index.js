/**
 *
 * @param {request} req
 * @param {response} res
 */
function main(req, res) {
  res.send('Hola mundo');
}

module.exports = [
  {
    method: 'get',
    url: '/',
    handler: main,
    middelwares: [],
  },
];
