'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const individualSchema = new Schema({
  chromosome: Array,
  fitness: Number,
  rouletteRange: Array
})

const generationLogSchema = new Schema({
  generation: [individualSchema],
  individual: individualSchema,
  averageFitnessGeneration: Number,
  countGeneration: Number,
  parameters: {}
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

module.exports = mongoose.model('GenerationLog', generationLogSchema)
