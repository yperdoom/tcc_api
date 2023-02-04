const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS clients (
      client_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      age int NOT NULL,
      height int NOT NULL,
      weight numeric(3,2) NOT NULL,
      fat_percentage numeric(2,2) NOT NULL,
      sex varchar(15) NOT NULL,
      user_id int NOT NULL,
      manager_id int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (client_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
    );`
  )
  client.release()
  await database.close()

  return create
}
