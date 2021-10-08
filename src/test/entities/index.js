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

mainStucture.forEach( (value) => {
  console.log(value);
  console.log(value.select());
  console.log(value.save());
  console.log(value.update());
  console.log(value.delete());
});
