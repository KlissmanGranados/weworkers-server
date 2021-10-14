const {Idioma, UsuarioTag, UsuarioIdioma} = require('../../entities/index');

let mainStucture = [
  new Idioma(),
  new UsuarioIdioma(),
  new UsuarioTag(),
];

const [idioma, usuarioIdioma, usuarioTag] = mainStucture;

idioma.loadData({
  id: 1,
  nombreLargo: 'español',
  nombreCorto: 'es',
});
usuarioIdioma.loadData({
  id: 1,
  idUsuario: 33,
  idIdioma: 2,
});
usuarioTag.loadData({
  id: 1,
  idTag: 2,
  idUsuario: 33,
});

mainStucture = [idioma, usuarioIdioma, usuarioTag];

console.log(usuarioTag.idTag);

/*
mainStucture.forEach( (value) => {
  console.log(value);
});
*/
