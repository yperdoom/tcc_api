const verifyFields = require('../factory/verifyFields')
const Info = require('./infoService')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  const info = await Info.create(body)

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

  if (!fields.success) {
    return response.send(fields)
  }

  const info = await Info.update({ _id: infoId }, body)

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

  const info = await Info.delete({ _id: infoId })

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

  const info = await Info.getOne({ _id: infoId })

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
  let query = {}

  const infos = await Info.getAll(query)

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
