const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }


  await client.query(`
    CREATE TABLE IF NOT EXISTS managers (
      manager_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      document varchar(15) NOT NULL,
      user_id int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (manager_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`
  )
  client.release()
  await database.close()
}
