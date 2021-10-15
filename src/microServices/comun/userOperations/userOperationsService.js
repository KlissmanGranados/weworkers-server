const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');
const projectManagementRepository = require(
    '../../captador/projectManagement/projectManagementRepository',
);
const {UsuarioTag} = require('../../../entities');
const consts = require('../../../const');
/**
 * @description Selecciona un usuario
 * @param{Request} req
 * @param{Response} res
 */
exports.readUser = async (req, res) => {
  const {id} = req.params;
  const user = await userOperationsRepository.readUserTable(id);
  response.success(res, user);
};
/**
 * @description Actualiza una persona
 * @param{Request} req
 * @param{Response} res
 */
exports.updatePerson = async (req, res) => {
  const persona = req.body;

  // verificar si la identificación está en uso por un usuario distinto
  const identificationInUse = await userOperationsRepository
      .identificacionIsRepeated(
          persona.idTipoIdentificacion,
          persona.identificacion,
          req.user.idusuario,
      );

  if (identificationInUse) {
    response.warning_identification_not_available(res, persona.identificacion);
    return;
  }

  const data = persona.toArray();
  data.unshift(req.user.idusuario);
  const update = await userOperationsRepository.updatePersonTable(data);

  if (update) {
    response.success(res, req.user.idusuario);
    return;
  }
  response.error(res);
};

exports.updateUser = async (req, res) => {
  const user = req.body;

  const checkUsername = await userOperationsRepository
      .usernameExists(req.user.idusuario, user.usuario);

  if (checkUsername) {
    response.warning_user_not_available(res, user.usuario);
    return;
  }

  const checkPassword = await userOperationsRepository
      .checkPassword(req.user.idusuario, user.claveVieja);

  if (!checkPassword) {
    response.forbidden_invalid_login(res);
    return;
  }

  const update = await userOperationsRepository.updateUserTable({
    id: req.user.idusuario,
    usuario: user.usuario,
    clave: user.claveNueva});

  if (update) {
    response.success(res);
    return;
  }

  response.error(res);
};

/**
 * @description desactiva un usuario
 * @param{Request} req
 * @param{Response} res
 */
exports.deactivateUser = async (req, res) => {
  const id = req.user.idusuario;

  const checkState = await userOperationsRepository.stateIsTrue(id);

  if (!checkState) {
    response.warning_operation_not_available(res);
    return;
  }

  const deactivate = await userOperationsRepository.deactivateUser(id);

  if (deactivate) {
    response.success(res, id);
    return;
  }

  response.error(res);
};
/**
 * @description Reactiva un usuario
 * @param{Request} req
 * @param{Response} res
 */
exports.reactivateUser = async (req, res) => {
  const params = req.body;
  const check = await userOperationsRepository.selectUser(req.user.idusuario);

  if (check.estado) {
    response.warning_operation_not_available(res);
    return;
  }

  const conditions = [
    check.usuario == params.usuario,
    check.clave == params.clave,
    check.id_tipo_identificacion == params.idTipoIdentificacion,
    check.identificacion == params.identificacion,
    check.direccion == params.direccion,
  ];

  if (!conditions.every((condition) => condition )) {
    response.forbidden_invalid_login(res);
    return;
  }

  const reactivate = await userOperationsRepository
      .reactivateUser(req.user.idusuario);

  if (reactivate) {
    response.success(res);
    return;
  }

  response.error(res);
};
/**
 * @description consulta un perfil de usuario
 * @param {Request} req
 * @param {Response} res
 */
exports.userProfile = async (req, res) => {
  const {id} = req.params;
  const profile = await userOperationsRepository.readProfile(id);
  if (!profile) {
    response.forbidden(res);
    return;
  }
  response.success(res, profile);
};
/**
 * @description agrega etiquetas a un usuario
 * @param {Request} req
 * @param {Response} res
 * @return
 */
exports.newTag = async (req, res) => {
  let usuariosTags = [];

  /**
   * buscando los ids de los tags
   */

  let tagsquery = await projectManagementRepository
      .findTagByName(req.body);

  /**
   * setear los tags existentes
   */

  tagsquery.forEach((tag) =>{
    if (tag.id) {
      const usuarioTag = new UsuarioTag();
      usuarioTag.loadData({
        idTag: tag.id,
        id: undefined,
        idUsuario: undefined});
      usuariosTags.push(usuarioTag);
    }
  });

  /**
   * setear los tags no existentes
   */

  tagsquery = tagsquery.filter( (tag) => !tag.id);

  /**
   * crear tags no existentes
   */

  tagsquery = await projectManagementRepository.createTags(tagsquery);

  /**
   *  setear tags agregados
   */
  tagsquery.forEach((tag) =>{
    const usuarioTag = new UsuarioTag();
    usuarioTag.loadData({
      idTag: tag.id,
      id: undefined,
      idUsuario: undefined});
    usuariosTags.push(usuarioTag);
  });

  /**
   * setear el id del usuario en los tags
   */

  usuariosTags.forEach((usuariosTag)=>{
    usuariosTag.idUsuario = req.user.idusuario;
  });

  /**
   *  revisar si los tags existen en usuarios tags
   */

  const repeatedUsuariosTags = await userOperationsRepository
      .findUsuariosTagId(usuariosTags);

  /**
   * filtrar los tags no repetidos para el insert
   */

  const repeatedIds = repeatedUsuariosTags.map((el) => el.idTag);

  usuariosTags = usuariosTags.filter(
      (usuarioTag)=>!repeatedIds.includes(usuarioTag.idTag));

  /**
   * insert query
   */
  const insertQuery = await userOperationsRepository
      .insertUsuariosTags(usuariosTags);

  if (!insertQuery) {
    response.warning_exist_regedit(res);
    return;
  }
  response.success(res, insertQuery);
};

exports.deleteTag = async (req, res) => {
  let checkQuery;
  const idUsuarioTags = req.body.idsUsuariosTags;
  const filteredTags = [];

  idUsuarioTags.forEach( async (idUsuarioTag)=>{
    checkQuery = await userOperationsRepository
        .checkDelete(idUsuarioTag, req.user.idusuario);

    if (checkQuery) {
      filteredTags.push(idUsuarioTag);
      await userOperationsRepository
          .deleteUsuariosTag(idUsuarioTag);
    }
  });


  response.success(res, filteredTags);
};

exports.newLanguage = async (req, res) => {
  /**
   * declarando las listas de idiomas constantes y las del usuario,
   * junto con el idioma del request
   */

  const idiomas = consts().idiomas.rows;
  const idioma = req.body.idioma;
  const usuariosIdiomas = await userOperationsRepository
      .searchUsuariosIdiomas(req.user.idusuario);


  /**
   * verificando si el idioma existe
   */

  let usuariosIdioma = false;

  idiomas.forEach((el) =>{
    if (el.nombreLargo === idioma.nombreLargo) {
      usuariosIdioma = el;
    }
  });

  if (!usuariosIdioma) {
    response.error(res, 'no existe el idioma');
    return;
  }

  /**
   * verificando si el idioma a agregar no existe ya
   * en el usuario
   */

  let checkUserIdiomas = true;

  usuariosIdiomas.forEach((el) =>{
    if (el.nombre_largo === usuariosIdioma.nombreLargo) {
      checkUserIdiomas = false;
    }
  });

  if (!checkUserIdiomas) {
    response.error(res, 'ya existe dentro de la tabla');
    return;
  }

  /**
   * llamada del query para insertar el idioma en el
   * usuario
   */

  const insertQuery = await userOperationsRepository
      .insertUsuariosIdiomas(req.user.idusuario, usuariosIdioma.id);

  if (!insertQuery) {
    response.error(res, 'se hizo mal el request');
    return;
  }


  response.success(res, insertQuery);
};

exports.deleteLanguage = async (req, res) => {
  /**
   * declarando las listas de idiomas constantes y las del usuario,
   * junto con el idioma del request
   */

  const idiomas = consts().idiomas.rows;
  const idioma = req.body.idioma;
  const usuariosIdiomas = await userOperationsRepository
      .searchUsuariosIdiomas(req.user.idusuario);

  /**
   * verificando si el idioma existe
   */

  let usuariosIdioma = false;

  idiomas.forEach((el) =>{
    if (el.nombreLargo === idioma.nombreLargo) {
      usuariosIdioma = el;
    }
  });

  if (!usuariosIdioma) {
    response.error(res, 'no existe el idioma');
    return;
  }

  /**
   * verificando si el idioma a eliminar existe ya
   * en el usuario
   */

  let checkUserIdiomas = false;

  usuariosIdiomas.forEach((el) =>{
    if (el.nombre_largo === usuariosIdioma.nombreLargo) {
      checkUserIdiomas = true;
      usuariosIdioma = el;
    }
  });

  if (!checkUserIdiomas) {
    response.error(res, 'no existe dentro de la tabla');
    return;
  }

  /**
   * llamada del query para eliminar el idioma
   * del usuario
   */

  const deleteQuery = await userOperationsRepository
      .deleteUsuariosIdiomas(usuariosIdioma.id);

  if (!deleteQuery) {
    response.error(res, 'no agarra el request');
    return;
  }


  response.success(res, deleteQuery);
};
