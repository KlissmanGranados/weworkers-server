const express = require('express');
const paginacionRouter = new express.Router();
const response = require('../../response');
const db = require('../../database/db');

paginacionRouter.get('/:query?', async (req, res)=>{
  const {perPage, page} = req.query;
  
  const data = await db.repage({
    limit: {
      offset: page,
      rowsLimit: perPage,
    },
    text: `
    SELECT
    proyectos.id, 
    proyectos.nombre, 
    proyectos.descripcion, 
    proyectos.reclutadores_id, 
    proyectos.estado, 
    proyectos.presupuesto, 
    proyectos.fecha_crea, 
    proyectos.fecha_termina,
    tipos_pago.id AS tipos_pago_id,
    tipos_pago.nombre AS tipos_pago_nombre,
    monedas.id AS moneda_id,
    monedas.nombre_largo AS moneda_nombre_largo,
    monedas.nombre_corto AS moneda_nombre_corto,
    json_agg(json_build_object('id',tags.id,'nombre', tags.nombre)) AS tags
    FROM proyectos
    LEFT JOIN proyectos_tags 
      ON proyectos_tags.proyectos_id = proyectos.id
    LEFT JOIN tags
      ON proyectos_tags.tags_id = tags.id 
    inner JOIN tipos_pago
      ON tipos_pago.id = proyectos.tipos_pago_id
    inner JOIN monedas
      ON monedas.id = proyectos.monedas_id
    GROUP BY(proyectos.id,monedas.id,tipos_pago.id)`,
    groupBy: 'proyectos.id,monedas.id,tipos_pago.id',
    orderBy: 'proyectos.id',
    uri: '/proyecto/'
  });

  response.success(res, response.repage(req, data));
});

module.exports = paginacionRouter;
