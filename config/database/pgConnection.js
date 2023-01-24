const { Pool } = require('pg')
require('dotenv/config')
const {
  PGUSER,
  PGHOST,
  PGPASSWORD,
  PGDATABASE,
  PGPORT
} = process.env

const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT
})
const global = {}

module.exports.connect = async () => {
  if(global.connection){
    console.log('conexao já existente')
    return global.connection.connect()
  }
  try {
    await pool.connect()
    global.connection = pool
    return pool.connect()
  } catch (error) {
    console.log(error)
  }
}

module.exports.close = async () => {
  try {
    delete global.connect
    return 'desconectado'
  } catch (error) {
    console.log(error)
  }
}