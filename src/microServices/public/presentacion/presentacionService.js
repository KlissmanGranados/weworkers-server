const response = require('../../../response');

exports.main = (req, res) => {
  response.success(res, [
    {
      pokemon: 'sergio',
    },
    {
      pokemon: 'sergio',
    },
  ]);
};
