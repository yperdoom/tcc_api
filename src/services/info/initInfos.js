const Logger = require('../../controllers/loggerController')
const database = require('../../../config/database/postgres/pgConnection')
const time = require('../factory/getTimeNow')
const infosMock = require('../../../pre_save/infosMock.json')

module.exports = async () => {
  const client = await _connect()
  if (!client) {
    Logger.error({
      type: 'database-error',
      local: 'postgre-connect-init-foods-service'
    })
    return false
  } else {
    for (let i = 0; i < infosMock.length; i++) {
      const payload = await {
        name: infosMock[i].name,
        description: infosMock[i].description,
        created_at: time.now(),
        updated_at: time.now()
      }

      const res = await _createInfoOnLoop(payload, client)
      if (!res) { break }
    }

    await _disconnect(client)
  }
  return true
}

const _connect = async () => {
  const client = await database.connect()

  if (!client) {
    return null
  }

  return client
}

const _disconnect = async (client) => {
  client.release()
  await database.close()
}

const _createInfoOnLoop = async (body, client) => {
  try {
    const query = {
      text: `INSERT INTO 
        infos(
          name,
          description,
          created_at,
          updated_at
        )
        VALUES($1, $2, $3, $4)`,
      values: [
        body.name,
        body.description,
        body.created_at,
        body.updated_at
      ]
    }

    await client.query(query)
  } catch (error) {
    Logger.error({
      error: error.error,
      type: 'database-error',
      local: 'postgre-create-info-service'
    })
    return false
  }
  return true
}
