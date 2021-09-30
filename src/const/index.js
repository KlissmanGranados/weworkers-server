const db = require('../database/db');
const {snakeToCamelObject} = require('../utils');
/**
 * @description Carga las tablas que son constantes en memoria
 * @return {Promise}
 */
module.exports = (function() {
  let data = false;

  return ()=>{
    if (data) {
      return data;
    }

    data = db.execute(async (conn)=>{
      console.info(`Memorizando constantes 😎`);

      const [
        roles,
        monedas,
        tiposIdentificacion,
        tiposPago,
        redes,
        modalidades,
      ] = await Promise.all(
          [
            conn.query(`select id,nombre from roles`),
            conn.query(`SELECT id, nombre_largo, nombre_corto FROM monedas`),
            conn.query(`SELECT id, tipo FROM tipos_identificacion`),
            conn.query(`SELECT id, nombre FROM tipos_pago`),
            conn.query(`SELECT id, nombre, "timestamp" FROM redes`),
            conn.query(`SELECT id, nombre FROM modalidades`),
          ],
      );

      data = {
        roles: {
          rows: roles.rows,
          rowCount: roles.rowCount,
          getByName: (nombre) => {
            return roles.rows.filter( (role) => role.nombre == nombre )[0];
          },
          getById: (id) => {
            return roles.rows.filter( (role) => role.id == id )[0];
          },
        },
        monedas: {
          rows: monedas.rows,
          rowCount: monedas.rowCount,
          getByShortName: (shortName) => {
            return monedas.rows.filter((shortNam) =>
              shortNam.nombre_corto == shortName)[0];
          },
          getByLongName: (longName) => {
            return monedas.rows.filter((longNam) =>
              longNam.nombre_largo == longName)[0];
          },
          getById: (id) => {
            return monedas.rows.filter( (cash) => cash.id == id )[0];
          },
        },
        tiposIdentificacion: {
          rows: tiposIdentificacion.rows,
          rowCount: tiposIdentificacion.rowCount,
          getByType: (type) => {
            return tiposIdentificacion.rows.filter((ty) => ty.tipo == type)[0];
          },
          getById: (id) => {
            return tiposIdentificacion.rows.filter( (ty)=> ty.id == id )[0];
          },
        },
        tiposPago: {
          rows: tiposPago.rows,
          rowCount: tiposPago.rowCount,
          getByType: (type) =>{
            return tiposPago.rows.filter(
                (paymentType) => paymentType.nombre == type )[0];
          },
          getById: (id) =>{
            return tiposPago.rows.filter(
                (paymentType) => paymentType.id == id,
            )[0];
          },
        },
        redes: {
          rows: redes.rows,
          rowCount: redes.rowCount,
          getByType: (_red) => {
            return redes.rows.filter(
                (red) => red.nombre == _red,
            )[0];
          },
          getById: (id) =>{
            return redes.rows.filter(
                (red) => red.id == id,
            )[0];
          },
        },
        modalidades: {
          rows: modalidades.rows,
          rowCount: modalidades.rowCount,
          getByType: (_modalidad) =>{
            return modalidades.rows.filter(
                (modalidad) => modalidad.nombre == _modalidad,
            )[0];
          },
          getById: (id) => {
            return modalidades.rows.filter(
                (modalidad) => modalidad.id == id,
            )[0];
          },
        },
      };

      data = snakeToCamelObject(data);
      console.info('Constantes cargadas! 👽');
      return data;
    });
  };
})();
