const sql = require('mssql/msnodesqlv8')
require("dotenv").config();

//configuration for sql ser

const config ={
    server:process.env.DB_SERVER,
    driver: 'msnodesqlv8',
    datatabase: process.env.DB_DATABASE,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
    Option:{
        encrypt: false ,
        trustedConnection: true
    },
    port: parseInt(process.env.DB_PORT)
};

//create a connecttion pool and export it as a promise

const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool=>{
    console.log('Connected to database');
    return pool;
})
.catch(err=>{
    console.log('Database connection failed: ',err)
    throw err;
});
module.exports={
    sql,
    poolPromise,
    config
}