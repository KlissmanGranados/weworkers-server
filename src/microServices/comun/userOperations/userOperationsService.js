const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');

exports.readPerson = async (req, res) =>{};

exports.readUser = async (req, res) => {};

exports.updatePerson = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.updateState = async (req, res) => {};

exports.userProfile = async (req, res) => {
  const id = req.body.id;

  const profile = await userOperationsRepository.readProfile(id);

  console.log(profile);

  response.success(res, profile);
};
