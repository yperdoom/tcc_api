'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InformationSchema = new Schema({
  name: String,
  description: String,
  created_by: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

InformationSchema.index({ name: 'text' })

module.exports = mongoose.model('Information', InformationSchema)
