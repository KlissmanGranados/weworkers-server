const response = require('../../../response');
const getPropuestasRepository = require('./getPropuestasRepository');

exports.getPropuestas = async (req, res) =>{
  const {page, perPage, idProyecto} = req.query;
  const numberOfProposals = await getPropuestasRepository
      .countPropuestas(idProyecto);

  const HOST = req.get('host');
  const BASE_URL = `${HOST}/comun/listar-propuestas?`;
  const defaultLimit = 10;
  const defaultOffset = 1;

  const limit = perPage && perPage>=1? perPage:defaultLimit;
  const offset = page && perPage>=1? page:defaultOffset;

  const numberOfPages = Math.ceil(numberOfProposals/limit);

  const results = [];

  const isInProject = await getPropuestasRepository
      .isUserInProposals(req.user.idusuario, idProyecto);

  let userProposal;

  if (isInProject.id) {
    userProposal = await getPropuestasRepository
        .getUsuarioPropuesta(isInProject.id);
    userProposal = formatProposal(userProposal);
  }

  const getProposals = await getPropuestasRepository
      .getPropuestas(idProyecto, userProposal && offset==1? limit-1:limit,
          userProposal && offset!=1? ((offset-1)*limit)-1:(offset-1)*limit);

  for (proposal of getProposals) {
    if (proposal.propuestasid !== isInProject.id) {
      results.push(formatProposal(proposal));
    }
  }

  if (userProposal && offset == 1) {
    results.unshift(userProposal);
  }


  const format = {
    pageCount: numberOfPages,
    totalProposals: numberOfProposals,
    // eslint-disable-next-line max-len
    first: `${BASE_URL}idProyecto=${idProyecto}&perPage=${limit}&page=1`,
    next: formatNext(numberOfPages, offset, BASE_URL, idProyecto, limit),
    previous: formatPrevious(offset, BASE_URL, idProyecto, limit),
    // eslint-disable-next-line max-len
    last: formatLast(numberOfPages, BASE_URL, idProyecto, limit, offset),
    results: results,
  };

  response.success(res, format);
};

const formatNext = (numberOfPages, page, BASE_URL, idProyecto, limit) => {
  return page >= numberOfPages? null:
  // eslint-disable-next-line max-len
  `${BASE_URL}idProyecto=${idProyecto}&perPage=${limit}&page=${Number(page)+1}`;
};

const formatPrevious = (page, BASE_URL, idProyecto, limit) => {
  return page <= 1? null:
  // eslint-disable-next-line max-len
    `${BASE_URL}idProyecto=${idProyecto}&perPage=${limit}&page=${page-1}`;
};

const formatLast = (numberOfPages, BASE_URL, idProyecto, limit, page) => {
  // eslint-disable-next-line max-len
  return page===0? null:`${BASE_URL}idProyecto=${idProyecto}&perPage=${limit}&page=${numberOfPages}`;
};

const formatProposal = (row) => {
  const apiVersion = process.env.VERSION;
  const serverHost = process.env.HOST || 'http://localhost';
  const serverPort = process.env.PORT || 3000;
  const perfil = `${serverHost}:${serverPort}${apiVersion}/comun/perfil/`;

  return {
    usuario: {
      perfil: (perfil + row.usuariosid),
      id: row.usuariosid,
      usuario: row.usuario,
      persona: {
        id: row.personasid,
        primerNombre: row.primer_nombre,
        primerApellido: row.primer_apellido,
      },
    },
    propuesta: {
      id: row.propuestasid,
      mensaje: row.mensaje,
    },
  };
};
