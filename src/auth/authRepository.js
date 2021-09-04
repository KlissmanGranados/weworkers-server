const {db} = require('../../index');

exports.getRolesById = async (id)=>{
  const rows = [
    {
      id: 1,
      nombre: 'captado',
    },
    {
      id: 2,
      nombre: 'captador',
    },
    {
      id: 3,
      nombre: 'public',
    },
  ];
  return rows.filter( (rol) =>
    rol.id == id )[0];
};

exports.getTipoIdentificacion = async (id) =>{
  const tipoIdentificaciones = [
    {
      id: 1,
      tipo: 'p',
    },
    {
      id: 2,
      tipo: 'v',
    },
    {
      id: 3,
      tipo: 'e',
    },
  ];

  return tipoIdentificaciones.filter(
      (tipo) => tipo.id == id );
};

exports.getIdentificacion = async (idTipo, identificacion) => {
  return [];
};
exports.getEmail = async (email) => {
  return [];
};
exports.getUsuario = async (usuario) => {
  return [];
};

exports.insertUsuario = async (data) =>{
  const {reclutador} = data;
  if (reclutador) {
    return await insertCaptador(data);
  }
  return await insertCaptado(data);
};

/**
 *
 * @param{Auth} auth
 * @return {Promise<void>}
 */
async function crearUsuario(auth) {
  const insertPersona = {
    text: `INSERT INTO personas 
            (identificacion, primer_nombre, 
             segundo_nombre,primer_apellido, 
             segundo_apellido, id_tipo_identificacion) 
         VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
    values: auth.valueToArray('_persona'),
  };

  // se inserta la persona
  const idPersona = await 1;

  auth.persona.id = idPersona;
  auth.usuario.personaId = idPersona;

  const insertUsuario = {
    text: `INSERT INTO usuarios 
              (usuario, clave, persona_id, roles_id) 
            VALUES($1, $2, $3, $4) RETURNING ID`,
    values: auth.valueToArray('_usuario'),
  };

  // se inserta el usuario
  const idUsuario = await 5;

  auth.usuario.id = idUsuario;
  auth.correo.usuarioId = idUsuario;

  const insertCorreo = {
    text: `INSERT INTO correos 
        (direccion, usuarios_id) VALUES($1, $2)`,
    values: auth.valueToArray('_correo'),
  };
  // insertar el correo
}

/**
 *
 * @param {Auth} captador
 * @return {Promise<void>}
 */
async function insertCaptador(captador) {
  await crearUsuario(captador);

  const insertEmpresa = {
    text: `INSERT INTO empresas (rif, razon_social) 
             VALUES($1, $2) RETURNING ID`,
    values: captador.valueToArray('_empresa'),
  };

  // se inserta la empresa
  const idEmpresa = await 8;

  captador.reclutador.empresaId = idEmpresa;
  captador.reclutador.usuarioId = captador.usuario.id;

  const insertReclutador = {
    text: `INSERT INTO reclutadores (usuarios_id, empresas_id) VALUES($1, $2)`,
    values: captador.valueToArray('_reclutador'),
  };
}

/**
 *
 * @param {Auth} captado
 * @return {Promise<void>}
 */
async function insertCaptado(captado) {
  await crearUsuario(captado);

  captado.trabajador.usuarioId = captado.usuario.id();
  const insertTrabajador = {
    text: `INSERT INTO trabajadores (usuarios_id) VALUES($1);`,
    values: captado.valueToArray('_trabajador'),
  };
  // insertar trabajador
}
