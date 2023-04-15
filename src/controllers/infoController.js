const verifyFields = require('../services/factory/verifyFields')
const getTimeNow = require('../services/factory/getTimeNow')

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

  body.created_at = getTimeNow()
  body.updated_at = getTimeNow()

  const info = await createInfo(body)

  if (!info) {
    return response.send({
      success: false,
      message: "it's not's possible to create a information"
    })
  }

  return response.send({
    success: true,
    message: 'info created',
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

  body.updated_at = getTimeNow()

  const info = await modifyInfo(infoId, body)

  if (!info) {
    return response.send({
      success: false,
      message: "it's not's possible to modify a information"
    })
  }

  return response.send({
    success: true,
    message: 'info modified',
    body: info
  })
}

module.exports.delete = async (requisition, response, next) => {
  const infoId = requisition.params.info_id

  const info = await deleteInfo(infoId)

  if (!info) {
    return response.send({
      success: false,
      message: "it's not's possible to delete a info"
    })
  }

  response.send({
    success: true,
    message: 'information deleted'
  })
}

module.exports.getInfo = async (requisition, response, next) => {
  const infoId = requisition.params.info_id

  const info = await getInfo('info_id', infoId)

  if (!info) {
    return response.send({
      success: false,
      message: 'info not found'
    })
  }

  response.send({
    success: true,
    message: 'info founded',
    body: info
  })
}

module.exports.getAll = async (requisition, response, next) => {
  const infos = await getAllInfos()

  if (!infos) {
    return response.send({
      success: false,
      message: 'infos not found'
    })
  }

  return response.send({
    success: true,
    message: 'infos located',
    body: {
      count_infos_found: infos.length,
      infos_found: infos
    }
  })
}
