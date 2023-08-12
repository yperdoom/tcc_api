'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const individualSchema = new Schema({
  chromosome: Array,
  fitness: Number,
  rouletteRange: Array
})

const generationLogSchema = new Schema({
  bestFitness: Number,
  informations: String,
  great: individualSchema,
  good: individualSchema,
  averageFitnessGeneration: Number,
  countGeneration: Number,
  foods: [],
  meal: {},
  parameters: {}
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

module.exports = mongoose.model('GenerationLog', generationLogSchema)
