const response = require("../response");

module.exports = [
  (req, res, next)=>{
    if(req.user.usuario._rolesId != 1) {
      response.forbidden(res);
      return;
    }

    next();
    
  },
];