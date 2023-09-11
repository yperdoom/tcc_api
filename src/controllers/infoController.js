const verifyFields = require('../services/factory/verifyFields')
const time = require('../services/factory/getTime')

const createInfo = require('../services/info/createInfo')
const modifyInfo = require('../services/info/modifyInfo')
const deleteInfo = require('../services/info/deleteInfo')
const getInfo = require('../services/info/getInfo')
const getAllInfos = require('../services/info/getAllInfos')

module.exports.create = async (requisition, response, next) => {
  const { body } = requisition

  const fields = verifyFields(body, [
    'name',
    'description'
  ])

  if (!fields.success) {
    return response.send(fields)
  }

  body.created_at = time.now()
  body.updated_at = time.now()

  const info = await createInfo(body)

  if (!info) {
    return response.send({
      success: false,
      message: 'Não foi possível criar esta informação!'
    })
  }

  return response.send({
    success: true,
    message: 'Informação criada.',
    body: info[0]
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

  body.updated_at = time.now()

  const info = await modifyInfo(infoId, body)

  if (!info) {
    return response.send({
      success: false,
      message: 'Não foi possível modificar esta informação!'
    })
  }

  return response.send({
    success: true,
    message: 'Informação modificada.',
    body: info[0]
  })
}

module.exports.delete = async (requisition, response, next) => {
  const infoId = requisition.params.info_id

  const info = await deleteInfo(infoId)

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

  const info = await getInfo('info_id', infoId)

  if (!info) {
    return response.send({
      success: false,
      message: 'Informação não encontrada!'
    })
  }

  response.send({
    success: true,
    message: 'Informação encontrada.',
    body: info[0]
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const infos = await getAllInfos()

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
