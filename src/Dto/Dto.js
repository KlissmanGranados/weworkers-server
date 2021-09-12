class Dto {
  /**
   * @description Carga la data proporcionada y la setea en el objeto,
   * Nota: El objeto proporcionado debe de tener el formato: {
   *   clave:valor,
   *   clave:valor,
   *   clave:valor, ...
   *  }
   * @param {Objet} body
   * @return void
   */
  loadData(body) {
    if (!body) {
      return;
    }
    const attributesBody = Object.entries(body);
    const attributesClass = this.getAttributes();

    attributesBody.forEach( (attribute) => {
      const [key, value] = attribute;
      if (attributesClass.indexOf(key)>=0 && value) {
        this[key] = value;
      }
    });
  }
  /**
   * @description Devuelve los valores de los atributos de un objeto,
   * siempre que estos estén definidos
   * @return {Array} Lista de valores seteados en la estructura
   */
  toArray() {
    return Object.values(this)
        .filter((value) =>
          typeof value != 'undefined');
  }
  /**
   * @description verifica los campos obligatorios
   * @type {Array}
   * @param inputs
   * @return { Array } Lista de los campos vacios
   */
  checkRequired( inputs ) {
    const attributes = this.getAttributes();
    return inputs.filter( (input) => {
      return !this[input] && attributes.indexOf(input)>=0;
    });
  }

  /**
   * @description Retorna nombre de los atributos
   * @return {string[]}
   */
  getAttributes() {
    return Object.keys(this).map((key) => key.replace('_', ''));
  }

  /**
   * @description Convierte los atributos de camelCase a snake_case
   * @return {String []}
   */
  camelCaseToSnakeCase() {
    const attributes = this.getAttributes();
    const columns = [];
    attributes.forEach((attribute, index) => {
      if (this[attribute] || this[attribute] === null) {
        columns.push(
            attribute.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        );
      }
    });
    return columns;
  }

  getColumns() {
    const columns = this.camelCaseToSnakeCase();
    const columnsNumber = columns.map((value, index)=>{
      return `$${index+1}`;
    }).join(',');
    return {
      columns: columns.join(','),
      columnsNumber,
    };
  }

  getObject() {
    const entries = Object.entries(this)
        .filter((entrie) => !!entrie[1])
        .map((entrie)=>{
          let [key, value] = entrie;
          key = key.replace('_', '');
          return [key, value];
        });
    return Object.fromEntries(entries);
  }
}
module.exports = Dto;
