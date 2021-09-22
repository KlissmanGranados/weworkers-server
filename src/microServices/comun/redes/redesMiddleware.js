const response = require('../../../response');
const {Red,RedDireccion,DireccionRedUsuario} = require('../../../Entities');

/**
 * @description Crea una asociación entre usuario y red
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
exports.AssociateNetwork = (req,res,next)=>{
  
  const {redId,direccion} = req.body;

  if(!redId){
    response.warning_required_fields({redId:null});
    return;
  }
  if(!direccion){
    response.warning_required_fields({direccion:null});
    return;
  }

  const red = new Red();
  const redDireccion = new RedDireccion();
  const direccionRedUsuario = new DireccionRedUsuario();
  
  red.id = redId;
  redDireccion.direccion = direccion;
  
  next();
}
