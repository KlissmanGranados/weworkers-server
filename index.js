require('dotenv').config({path: process.env.PROFILE || '.env'});
const db = require('./src/database/db');
const express = require('express');
const app = express();

const consts = require('./src/const');
consts();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // eslint-disable-next-line max-len
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(express.json());
module.exports = ({app, db, consts});


