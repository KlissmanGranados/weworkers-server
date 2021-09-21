const response = require('../../../response');
const utils = require('../../../utils');
const {Proyecto,Tag,ProyectoTag} = require('../../../Entities')
/**
 * @description verifica los datos del create
 * @param {Request} req 
 * @param {Response} res
 * @param {NextFunction} next 
 */
exports.create = (req,res,next)=>{
  next();
}