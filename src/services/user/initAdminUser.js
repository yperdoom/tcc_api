const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const password = require('../../../config/auth/functions/password')
const getTimeNow = require('../factory/getTimeNow')

module.exports = async () => {
  const client = await database.connect()

  try {
    const query = {
      text: `INSERT INTO 
        users(name, email, password, scope, phone, city, state, birthday, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      values: [
        'Pedro H A Pinto',
        'yperdoom@gmail.com',
        await password.hashPassword('903546'),
        'admin',
        '54996582060',
        'Rio dos Indios',
        'RS',
        '08/09/2000',
        getTimeNow(),
        getTimeNow()
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      ...error,
      type: 'database-error',
      local: 'postgre-create-user-service'
    })
  }

  client.release()
  await database.close()
}
