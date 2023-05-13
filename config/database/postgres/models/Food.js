const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS foods (
      food_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      description varchar(60) NOT NULL,
      type varchar(30) NOT NULL,
      color varchar(20),
      weight int,
      portion int,
      mililiter int,
      calorie float NOT NULL,
      protein float NOT NULL,
      lipid float NOT NULL,
      carbohydrate float NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (food_id)
    );`
  )
  client.release()
  await database.close()

  return create
}
