const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      prescription_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      recommended_calorie numeric(3,2) NOT NULL,
      recommended_protein numeric(3,2) NOT NULL,
      recommended_lipid numeric(3,2) NOT NULL,
      recommended_carbohydrate numeric(3,2) NOT NULL,
      meal_amount int NOT NULL,
      client_id int NOT NULL,
      manager_id int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (prescription_id),
      FOREIGN KEY (client_id) REFERENCES clients(client_id),
      FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
    );`
  )
  client.release()
  await database.close()

  return create
}
