const response = require('../response');
const jwt = require('jsonwebtoken');

exports.login = (req, res)=>{
  const inputs = req.body;
  const token = jwt.sign({
    usuario: inputs.usuario,
    rol: '1',
  }, process.env.PRIVATE_KEY, {algorithm: 'HS256', expiresIn: '1h'});
  response.success_login(res, ({token}));
};

exports.logout = (req, res) => {
  /**
   * TODO
   * - revocar token
   */
  response.success(res, []);
};
exports.regedit = (req, res)=>{
  response.success(res, []);
};
