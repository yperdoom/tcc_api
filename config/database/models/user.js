const database = require('../pgConnection')

module.exports.createTable = async () => {
  const client = await database.connect()

  const create = await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id int NOT NULL GENERATED ALWAYS AS IDENTITY ( CYCLE INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1 ),
      name varchar(50) NOT NULL,
      email varchar(40) NOT NULL,
      password varchar(20) NOT NULL,
      scope varchar(10) NOT NULL,
      phone varchar(15) NOT NULL,
      city varchar(30),
      state varchar(30),
      birthday date NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL,
      constraint pk_user primary key (
        user_id
      )
    );`
  )
  console.log(create)

  client.release()
  await database.close()
}

module.exports.login = async (data) => {
  const client = await database.connect()
  let res = {}

  try { 
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [data.email]
    }

    res = await client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res
}

module.exports.create = async (data) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `INSERT INTO 
        users(name, email, password, scope, phone, city, state, birthday, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      values: [data.name, data.email, data.password, data.scope, data.phone, data.city, data.state, data.birthday, data.created_at, data.updated_at]
    }

    res = await client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res
}

module.exports.modify = async (data) => {
  const client = await database.connect()
  let res = {}

  try {
    const query = {
      text: `UPDATE users
        SET name=$2, password=$3, scope=$4, phone=$5, city=$6, state=$7, birthday=$8, updated_at=$9)
        WHERE email = $1`,
      values: [data.email, data.name, data.password, data.scope, data.phone, data.city, data.state, data.birthday, data.updated_at]
    }

    res = await client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })

  } catch (error) {
    res = null
    console.log(error.message)
  }

  client.release()

  await database.close()

  return res
}