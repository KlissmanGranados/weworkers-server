const response = require('../../../response');

exports.prueba = (req,res) => {
    response.success(res, req.user)
}