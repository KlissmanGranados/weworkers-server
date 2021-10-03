const response = require('../../../response');

exports.getProjects = (req, res, next)=>{
  const params = req.query;

  const aceptedParams = [
    'moneda',
    'tiposPago',
    'etiqueta',
    'fecha',
    'presupuesto',
    'nombre',
    'modalidad',
    'estado',
    'perPage',
    'page',
    'usuario',
  ];

  for (const entry of Object.entries(params)) {
    const [key, value] = entry;
    if (aceptedParams.indexOf(key) === -1) {
      response.warning_data_not_valid(res, key);
      return;
    }
    if (value === null) {
      response.warning_data_not_valid(res, {[key]: value});
      return;
    }
  }

  if (params.fecha) {
    if (typeof params.fecha === 'object') {
      if (params.fecha.length !==2) {
        response.warning_data_not_valid(res, {fecha: params.fecha});
        return;
      }

      let [dateStart, dateEnd] = params.fecha;
      dateStart = new Date(dateStart).getTime();
      dateEnd = new Date(dateEnd).getTime();

      if (!dateStart || !dateEnd) {
        response.warning_data_not_valid(res, {fecha: params.fecha});
        return;
      }

      if (dateEnd < dateStart) {
        response.warning_data_not_valid(res, {fecha: params.fecha});
        return;
      }
    } else {
      const dateStart = new Date(params.fecha).getTime();
      if (!dateStart) {
        response.warning_data_not_valid(res, {fecha: params.fecha});
        return;
      }
    }
  }

  if (params.presupuesto) {
    if (typeof params.presupuesto === 'object') {
      if (params.presupuesto.length !== 2) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }
      let [presupuestoA, presupuestoB] = params.presupuesto;
      presupuestoA = Number(presupuestoA);
      presupuestoB = Number(presupuestoB);

      if (!presupuestoA || !presupuestoB) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }

      if (presupuestoA<0) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }

      if (presupuestoA > presupuestoB) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }

      if (presupuestoB <=0) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }

      params.presupuesto = [presupuestoA, presupuestoB];
    } else {
      if (!Number(params.presupuesto)) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }
      if (params.presupuesto<=0) {
        response.warning_data_not_valid(res, {presupuesto: params.presupuesto});
        return;
      }
      params.presupuesto = Number(params.presupuesto);
    }
  }
  if (params.usuario) {
    if (params.usuario === null) {
      response.warning_data_not_valid(res, {usuario: param.usuario});
      return;
    }
    if (!Number(params.usuario) && String(params.usuario) !== 'true') {
      response.warning_data_not_valid(res, {usuario: params.usuario});
      return;
    }
  }
  req.query = params;
  next();
};
