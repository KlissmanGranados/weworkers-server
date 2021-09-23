const Proyecto = require('./src/Entities/Proyecto');

const proyecto = new Proyecto();

proyecto.loadData({
  id:1,
  nombre:'proyecto prueba',
  descripcion:'un detalle',
  reclutadoresId:1,
  estado:true,
  presupuesto:'100.000.000',
  fechaTermina:'2021-09-23'
});

console.log(proyecto);

if(!proyecto.fechaTermina){
  console.log("fecha invalida");
}

if(!proyecto.presupuesto){
  console.log("presupuesto invalido");
}