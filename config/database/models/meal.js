const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS meals (
      meal_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      type varchar(30) NOT NULL,
      recommended_calorie double NOT NULL,
      calorie double NOT NULL,
      recommended_protein double NOT NULL,
      protein double NOT NULL,
      recommended_lipid double NOT NULL,
      lipid double NOT NULL,
      recommended_carbohydrate double NOT NULL,
      carbohydrate double NOT NULL,
      food_multiplier integer NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (user_id)
    );`
  )
  console.log(create)

  client.release()
  await database.close()
}
