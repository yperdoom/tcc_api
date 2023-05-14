const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const password = require('../../../config/auth/functions/password')
const time = require('../factory/getTimeNow')

const { DateTime } = require('luxon')

module.exports = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  try {
    const query = {
      text: `INSERT INTO 
        users(name, email, password, scope, phone, document, city, state, birthday, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      values: [
        'Pedro H A Pinto',
        'yperdoom@gmail.com',
        await password.hashPassword('903546'),
        'admin',
        '54996582060',
        '03369785021',
        'Rio dos Indios',
        'RS',
        DateTime.utc(2000, 9, 8),
        time.now(),
        time.now()
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      error,
      type: 'database-error',
      local: 'postgre-create-admin-user-service'
    })
  }

  client.release()
  await database.close()
}
