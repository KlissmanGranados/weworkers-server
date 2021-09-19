const response = require('../response');
module.exports = [
  (req, res, next)=>{
    if (!(req.user.rolesid >0 && req.user.rolesid <3)) {
      response.forbidden(res, req.user);
      return;
    }
    next();
  },
];
