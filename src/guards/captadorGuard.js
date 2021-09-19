const response = require('../response');

module.exports = [
  (req, res, next)=>{
    if (req.user.rolesid !== 2) {
      response.forbidden(res);
      return;
    }

    next();
  },
];
