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

  const self = req.protocol + '://' + req.get('host') + req.originalUrl;

  let {perPage, page} = req.query;
  perPage = perPage || 20;
  page = page || 1;

  const apiVersion = process.env.VERSION;
  const serverHost = process.env.HOST || 'http://localhost';
  const serverPort = process.env.PORT || 3000;

  const fullUri = `${serverHost}:${serverPort}${apiVersion}`;
  const totalPage = Math.round(totalCount/perPage);
  const nexPage = (page*1)+1<= totalPage? (page*1)+1:totalPage;
  const prevPage = (page*1)-1<=0?1:(page*1)-1;

  const template = self.split('?')[0] + `?perPage=${perPage}&`;
  const first = template + 'page=1';
  const next = template + ('page=' + nexPage);
  const previous = template + ('page=' + prevPage);
  const last = template + ('page=' + totalPage);

  return {
    metadata: {
      page: page,
      perPage: perPage,
      pageCount: pageCount,
      totalCount: totalCount,
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
