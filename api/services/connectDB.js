const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
})

class Database {
  constructor () {
    this.pool = pool
  }

  query (SQL, params) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err.message)
        } else {
          connection.query(SQL, params, (error, result) => {
            if (error) {
              reject(error.message)
            }
            resolve(result)
          })
        }
        connection.release()
      })
    })  
  }
}

module.exports = Database
