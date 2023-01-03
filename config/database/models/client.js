const database = require('../../database/pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS clients (
      client_id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      age varchar(50) NOT NULL,
      height varchar(40) NOT NULL,
      weigth varchar(20) NOT NULL,
      fat_percentage varchar(10) NOT NULL,
      sex varchar(15) NOT NULL,
      user_id int UNSIGNED AUTO_INCREMENT FOREIGN KEY,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL
    );`
  )
  console.log(create)

  client.release()
  await database.close()
}


module.exports.insert = async (data) => {
  const client = await datavase.connect()

  try {
    await client.query(`INSERT INTO ${data} from clients`)
  } catch (error) {
    console.log(error.message)
  }
}