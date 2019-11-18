const sql = require("mssql");

const config = {
  user: "admin",
  password: "mypassword",
  server: "databasesystemsproject.cy9rjwfchpnj.us-east-1.rds.amazonaws.com",
  port: 1433,
  database: "DistWeb"
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("connected to MSSQL database");
    return pool;
  })
  .catch(err => console.log("database connection failed"));

module.exports = { sql, poolPromise };
