const mongoOperator = require('../../config/database/mongo/mongoOperator')
const verifyFields = require('../services/factory/verifyFields')

const Info = require('../services/managments/info')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  await mongoOperator.connect()
  const info = await Info.create(body)
  await mongoOperator.disconnect()

  if (!info) {
    return response.send({
      success: false,
      message: 'Não foi possível criar esta informação!'
    })
  }

  return response.send({
    success: true,
    message: 'Informação criada.',
    body: info
  })
}

module.exports.modify = async (requisition, response, next) => {
  const infoId = requisition.params.info_id
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  await mongoOperator.connect()
  const info = await Info.update({ _id: infoId }, body)
  await mongoOperator.disconnect()

  if (!info) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar esta informação!'
    })
  }

  return response.send({
    success: true,
    message: 'Informação modificada.',
    body: info
  })
}

module.exports.delete = async (requisition, response, next) => {
  const infoId = requisition.params.info_id

  await mongoOperator.connect()
  const info = await Info.delete({ _id: infoId })
  await mongoOperator.disconnect()

  if (!info) {
    return response.send({
      success: false,
      message: 'Não foi possível deletar esta informação!'
    })
  }

  response.send({
    success: true,
    message: 'Informação deletada.'
  })
}

module.exports.getInfo = async (requisition, response, next) => {
  const infoId = requisition.params.info_id

  await mongoOperator.connect()
  const info = await Info.getOne({ _id: infoId })
  await mongoOperator.disconnect()

  if (!info) {
    return response.send({
      success: false,
      message: 'Informação não encontrada!'
    })
  }

  response.send({
    success: true,
    message: 'Informação encontrada.',
    body: info
  })
}

module.exports.getAll = async (requisition, response, next) => {
  await mongoOperator.connect()
  const infos = await Info.getAll()
  await mongoOperator.disconnect()

  if (!infos) {
    return response.send({
      success: false,
      message: 'Nenhuma informação encontrada!'
    })
  }

  return response.send({
    success: true,
    message: 'Informação(s) encontrada(s).',
    body: {
      count: infos.length,
      infos
    }
  })
}
