const response = require('../../../response');


exports.test = async (req, res, next) =>{
  next();
};

exports.verifyId = async (req, res, next) =>{
  if (req.body.id && typeof req.body.id === 'number') {
    next();
  }

  response.forbidden(res);
};

exports.requiredFieldsPerson = async (req, res, next) =>{
  
};

exports.requiredFieldsUser = async (req, res, next) =>{
  const obj = req.body;
};
