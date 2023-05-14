const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()
  if (!client) {
    return null
  }

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS prescription_meal (
      prescription_meal_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      prescription_id int NOT NULL,
      meal_id int NOT NULL,
      PRIMARY KEY (prescription_meal_id),
      FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id),
      FOREIGN KEY (meal_id) REFERENCES meals(meal_id)
    );`
  )
  client.release()
  await database.close()

  return create
}
