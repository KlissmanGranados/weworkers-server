const express = require('express');
const paginacionRouter = new express.Router();
const response = require('../../response');
const db = require('../../database/db');

paginacionRouter.get('/:query?', async (req, res)=>{
  const {perPage, page} = req.query;

  const limit = {
    offset: page,
    rowsLimit: perPage,
  };

  const data = await db.repage({
    text: `select * from proyectos`,
    uri: '/auth/roles/',
    limit,
  });

  response.success(res, response.repage(req, data));
});

module.exports = paginacionRouter;
