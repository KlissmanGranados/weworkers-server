const {db} = require('../../index');



db.transaction(async cliente => {
  /**
   * Request - Hash clave
   */
  const paramns = {
    persona:{
      identificacion:'2705028',
      primerNombre:'klissman',
      segundoNombre:'andress',
      primerApellido:'granados',
      segundoApellido:'rodriguez',
      idTipoIdentificacion:'1',
    },
    usuario:{
      usuario:'admin',
      clave:'asdadsadd',
      personaId:'',
      rolesId:'1',
    }
  }; 

  const idPersona = await cliente.query(`INSERT INTO personas(
    identificacion, 
    primer_nombre, 
    primer_apellido, 
    segundo_nombre, 
    segundo_apellido, 
    id_tipo_identificacion) values($1,$2,$3,$4,$5,$6) RETURNING id`,
    Object.values(paramns.persona).map(param => param.toLowerCase()));
  
  if(idPersona.rowCount == 0){
    return;
  }
  
  paramns.usuario.personaId = idPersona.rows[0].id;

  const idUsuario = await cliente.query(`INSERT INTO usuarios (
    usuario, 
    clave, 
    persona_id, 
    roles_id) VALUES($1,$2,$3,$4)`,Object.values(paramns.usuario));

  if(idUsuario.rowCount == 0){
    return;
  }

  console.log(idUsuario);

})