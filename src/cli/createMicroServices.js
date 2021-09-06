const fs = require('fs');
const path = require('path');

let route = './src/microServices';


/**
 * Main code for the naming process
 */
function main() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * List for availables folders
   */
  readline.question(
      'Ingrese el nombre de la carpeta en donde instanciará el microservicio:'+
      '(captado, captador, comun, public):', (folder) => {
        if (fs.existsSync(route + '/' + folder)) {
          route = route + '/' + folder;
          readline.question(
              'Ingrese el nombre del microservicio' +
               `( en ${path.basename(route)} ):`, (name) => {
                if (name.match(/[A-Za-z]/)) {
                  if (!fs.existsSync(`${route}/${name}`)) {
                    newMicroService(route, name);
                    console.log(`Microservicio ${name} creado`);
                  } else console.log(`Error, microservicio ${name} ya existe`);
                } else console.log('Error, nombre no permitido');

                readline.close();
              });
        } else {
          console.log('Error, la carpeta seleccionada no existe');
          readline.close();
        }
      });
}

main();

/**
 * Mkdir microservice folder
 * @param {String} route
 * @param {String} name
 */
function newMicroService(route, name) {
  const folderRoute = route + '/' + name;

  createFolder(route, name);
  createFileMiddleware(folderRoute, name);
  createFileRepository(folderRoute, name);
  createFileRouter(folderRoute, name);
  createFileService(folderRoute, name);
}
/**
 *
 * @param {String} route
 * @param {String} name
 */
function createFolder(route, name) {
  fs.mkdir(path.join(route, `/${name}`), (err) => {
    if (err) {
      return console.error(err);
    }
  });
}
/**
 *
 * @param {String} route
 * @param {String} name
 */
function createFileMiddleware(route, name) {
  const fileName = name + 'Middleware.js';
  fs.writeFile(
      path.join(route, `./${fileName}`), '',
      (err) =>{
        if (err) throw err;
      });
}
/**
 *
 * @param {String} route
 * @param {String} name
 */
function createFileRepository(route, name) {
  const fileName = name + 'Repository.js';

  fs.writeFile(path.join(route, `./${fileName}` ), '', (err) =>{
    if (err) throw err;
  });
}
/**
 *
 * @param {String} route
 * @param {String} name
 */
function createFileRouter(route, name) {
  const fileName = name + 'Router.js';

  const content = `const ${name}Middleware = require('./${name}Middleware');
const ${name}Service = require('./${name}Service');
  
module.exports = [];`;

  fs.writeFile(path.join(route, `./${fileName}`), content, (err) =>{
    if (err) throw err;
  });
}
/**
 *
 * @param {String} route
 * @param {String} name
 */
function createFileService(route, name) {
  const fileName = name + 'Service.js';
  const content = `const response = require('../../../response');`;

  fs.writeFile(path.join(route, `./${fileName}`), content, (err) =>{
    if (err) throw err;
  });
}
