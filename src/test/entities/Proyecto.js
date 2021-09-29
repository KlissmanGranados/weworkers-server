const {Proyecto} = require('../../entities/index');

const proyecto = new Proyecto();
proyecto.loadData(
    {
      id: 2,
      nombre: 'pandulce.com.es',
      descripcion: 'Esta era una página sobre panes dulces :c',
      presupuesto: 200000,
      fechaTermina: '2021-10-08',
      monedaID: 1,
      tiposPagoId: 1,
    },

);
console.log(proyecto);
