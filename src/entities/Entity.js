/**
 * @class Entity
 * @description Defines las operaciones en comun para todos los Entity
 */
const {snakeToCamelObject} = require('./../utils');

class Entity {
  #tableName;
  #primaryKey;

  /**
   * @param {String} tableName nombre de la tabla
   * @param {String} primaryKey clave primaria
   */
  constructor(tableName = null, primaryKey = 'id') {
    this.#tableName = this.#getNameTable(tableName);
    this.#primaryKey = primaryKey;
  }
  /**
   *
   * @param {Object} body
   */
  loadData(body) {
    if (!body) {
      return;
    }
    const attributesBody = Object.entries(body);
    const attributesClass = this.getAttributes();

    attributesBody.forEach((attribute) => {
      let [key, value] = attribute;
      key = String(key);
      value = String(value);
      if (attributesClass.indexOf(key) >= 0 && (value)) {
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
   * @param {Array} inputs
   * @return { Array } Lista de los campos vacios
   */
  checkRequired(inputs) {
    const attributes = this.getAttributes();
    return inputs.filter((input) => {
      return !this[input] && attributes.indexOf(input) >= 0;
    });
  }

  /**
   * @description Retorna nombre de los atributos
   * @return {string[]}
   */
  getAttributes() {
    return Object.keys(this).map((key) =>
      key.replace('_', ''));
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
            attribute.replace(/[A-Z]/g, (letter) =>
              `_${letter.toLowerCase()}`),
        );
      }
    });
    return columns;
  }
  snakeToCamel() {
    return snakeToCamelObject(this);
  }

  /**
   * @description Crea un Objeto con las columnas de la tablas del DTO
   * y enumera los inserts
   * varlues $1,$2 ...
   * @return {{columns: string, columnsNumber: string}}
   */
  getColumns() {
    const columns = this.camelCaseToSnakeCase();
    const columnsNumber = columns.map((value, index) => {
      return `$${index + 1}`;
    }).join(',');
    return {
      columns: columns.join(','),
      columnsNumber,
    };
  }

  /**
   * @description Clona la instancia actual
   * @return {Object}
   */
  clone() {
    const _clone = {...this};
    _clone.__proto__ = this.__proto__;
    return _clone;
  }
  #getNameTable(tableName = false) {
    if (tableName) {
      return tableName;
    }
    tableName = this.constructor.name;
    tableName = tableName.replace(/[A-Z]/g,
        (letter) =>`_${letter.toLowerCase()}`).replace('_', '');
    return tableName;
  }
  /**
   * @return {{text:String,values:String[]}}
   */
  select() {
    const columns = this.getAttributes().map(
        (atr)=> atr.replace(
            /[A-Z]/g, (letter) =>
              `_${letter.toLowerCase()}`),
    ).join(',');
    return {
      text: `SELECT ${columns} from ${this.#tableName} 
                         where ${this.#primaryKey}=$1`,
      values: [this[this.#primaryKey]],
    };
  }
  /**
   *
   * @return {{text:String,values:String[]}}
   */
  save() {
    const {columns, columnsNumber} = this.getColumns();
    return {
      text: `INSERT INTO ${this.#tableName}(${columns}) 
                               values(${columnsNumber})
                               RETURNING ${this.#primaryKey}`,
      values: this.toArray(),
    };
  }

  /**
   * @return {{text:String,values:String[]}}
   */
  update() {
    const columns = this.camelCaseToSnakeCase().
        filter((col) => col != 'id').map((value, index) => {
          return `${value}=$${index + 1}`;
        });
    const indexId = columns.length +1;
    return {
      text: `update ${this.#tableName} set ${columns.join(',')} 
                          where ${this.#primaryKey}=$${indexId}
                          RETURNING ${this.#primaryKey}`,
      values: (
        this.toArray().slice(1).concat(this[this.#primaryKey])
      ),
    };
  }
  /**
   *@return {{text:String,values:String[]}}
   */
  delete() {
    return {
      text: `delete from ${this.#tableName} 
                where ${this.#primaryKey}=$1
                RETURNING ${this.#primaryKey}`,
      values: [this[this.#primaryKey]],
    };
  }
}

module.exports = Entity;


