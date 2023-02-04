const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      email varchar(40) NOT NULL,
      password varchar(80) NOT NULL,
      scope varchar(10) NOT NULL,
      phone varchar(15) NOT NULL,
      document varchar(15),
      city varchar(30),
      state varchar(30),
      birthday date NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (user_id)
    );`
  )
  console.log('User create database', create)

  client.release()
  await database.close()

  return create
}
