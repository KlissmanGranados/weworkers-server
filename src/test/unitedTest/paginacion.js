const {app,db} = require('../../../index');
const response = require('../../response');

const serverHost = process.env.HOST || 'http://localhost';
const serverPort = process.env.PORT || 3000;

app.get('/:query', (req,res)=>{

  let { offset, limit } = req.query;

  if(!limit || !offset){
    response.warning_required_fields(res,{limit:null,offset:null});
    return;
  }

  const uri = `${serverHost}:${serverPort}${req.path}?offset=%offset%&limit=${limit}`;

  db.execute(async conn =>{

    const sql = `
      SELECT 
        proyectos.id AS proyecto_id,
        to_json(proyectos) AS proyecto,
        array_to_json(array_agg(tags)) AS tags
      FROM 
      proyectos
      INNER JOIN proyectos_tags ON 
      proyectos_tags.proyectos_id = proyectos.id
      INNER JOIN tags ON 
        proyectos_tags.tags_id = tags.id 
      GROUP BY (proyecto_id)
      OFFSET $1 ROWS LIMIT $2
    `;

    const prepared = { text:sql, values:[ offset,limit ] }

    const {rows, rowCount} = await conn.query(prepared);
  
    const prev = uri.replace('%offset%',(parseInt(offset)-10)>=0? (offset-10): 0);
    const next = uri.replace('%offset%',(parseInt(offset) +10));
    
    response.success(res,{rows,rowCount,prev,next});

  });

});

app.listen(3000, (err) => {
  if (err) throw err;
  console.log(`server running on : localhost:3000`);
});
