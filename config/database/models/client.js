const database = require('../../database/pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS clients (
      client_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      age integer NOT NULL,
      height integer NOT NULL,
      weight double NOT NULL,
      fat_percentage double NOT NULL,
      sex varchar(15) NOT NULL,
      user_id int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (client_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );`
  )
  console.log(create)

  client.release()
  await database.close()
}
