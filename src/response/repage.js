/**
 * @description Medela paginación
 * @param {Request} req
 * @param {
 * {
 *  totalCount:bigint,
 *  pageCount:bigint,
 *  records:[],
 *  uri:String,
 *  key:String
 * }
* } data | {key} es opcional, selecciona el atributo que apunta a la clave,
* por defecto es id.
* @return {Object}
*/
module.exports = (req, data)=>{
  let {records, totalCount, pageCount, uri, key} = data;

  if (!uri) {
    return false;
  }

  totalCount = totalCount || 0;
  pageCount = pageCount || 0;
  const totalPages = Math.ceil(totalCount/pageCount);

  let self = req.protocol + '://' + req.get('host') + req.originalUrl;

  let {perPage, page} = req.query;
  perPage = Number(perPage) || 20;
  page = Number(page) || 1;

  if (self.indexOf('?') === -1) {
    self += `?`;
  }
  if (!req.query.perPage) {
    self += `&perPage=${perPage}`;
  }
  if (!req.query.page) {
    self += `&page=${page}`;
  }

  const apiVersion = process.env.VERSION;
  const serverHost = process.env.HOST || 'http://localhost';
  const serverPort = process.env.PORT || 3000;

  const fullUri = `${serverHost}:${serverPort}${apiVersion}`;
  const totalPage = Math.ceil(totalCount/perPage);

  const nexPage = (page+1)<= totalPage? (page+1):totalPage;
  const prevPage = (page-1)<=0?1:(page-1);

  const template = self.replace(self.slice(self.indexOf('perPage')), '') +
   `perPage=${perPage}&`;

  const first = template + 'page=1';
  let next = template + ('page=' + nexPage);

  let previous = template + ('page=' + prevPage);
  let last = template + ('page=' + totalPage );

  next = self == next? null :next;
  previous = self == first?null:previous;
  last = self == last?null:last;

  return {
    metadata: {
      page: page,
      perPage: perPage,
      pageCount: pageCount,
      totalCount: totalCount,
      totalPages: totalPages,
      links: {
        self: self,
        first: first,
        last: last,
        previous: previous,
        next: next,
      },
    },
    records: (
      records.map( (record) => {
        record.uri = fullUri + uri + record[key||'id'];
        return record;
      } )
    ),
  };
};
