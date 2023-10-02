'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const generationLogSchema = new Schema({
  bestFit: Number,
  averageFits: Number,
  averageBestFits: Number,
  averageGenerations: Number,
  tests: Number,
  information: String,
  params: {}
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

module.exports = mongoose.model('GenerationLog', generationLogSchema)
