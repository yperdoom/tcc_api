const database = require('../../database/pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS clients (
      prescription_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      recommended_calorie double NOT NULL,
      recommended_protein double NOT NULL,
      recommended_lipid double NOT NULL,
      recommended_carbohydrate double NOT NULL,
      meal_amount integer NOT NULL,
      client_id int NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      PRIMARY KEY (client_id),
      FOREIGN KEY (client_id) REFERENCES clients(client_id)
    );`
  )
  console.log(create)

  client.release()
  await database.close()
}
