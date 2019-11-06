const sql = require('mssql');
const sqlConfig = {
    user: 'admin',
    password: 'mypassword',
    server: 'databasesystemsproject.cy9rjwfchpnj.us-east-1.rds.amazonaws.com',
    database: 'DistWeb'
}

const connPool = new sql.ConnectionPool(sqlConfig)
    .connect().then(conns => {
        console.log('connected')
        return conns;
    }).catch(err=> console.log('failed to connect',err));

module.exports = connPool;