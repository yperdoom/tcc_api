const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }


  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS meal_food (
      meal_food_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      meal_id int NOT NULL,
      food_id int NOT NULL,
      PRIMARY KEY (meal_food_id),
      FOREIGN KEY (meal_id) REFERENCES meals(meal_id),
      FOREIGN KEY (food_id) REFERENCES foods(food_id)
    );`
  )
  client.release()
  await database.close()

  return create
}
