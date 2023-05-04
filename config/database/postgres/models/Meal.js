const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS meals (
      meal_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      type varchar(30) NOT NULL,
      is_adapted_meal int,
      foods int array,
      foods_multiplier int array,
      fitness float,
      recommended_calorie float NOT NULL,
      calorie float NOT NULL,
      recommended_protein float NOT NULL,
      protein float NOT NULL,
      recommended_lipid float NOT NULL,
      lipid float NOT NULL,
      recommended_carbohydrate float NOT NULL,
      carbohydrate float NOT NULL,
      food_amount int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (meal_id)
    );`
  )

  client.release()
  await database.close()

  return create
}
