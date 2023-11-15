'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodSchema = new Schema({
  name: String,
  description: String,
  type: String,
  color: String,
  weight: Number,
  portion: Number,
  mililiter: Number,
  calorie: Number,
  carbohydrate: Number,
  protein: Number,
  lipid: Number
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

FoodSchema.index({ name: 'text' }, { default_language: 'pt-br' })

module.exports = mongoose.model('Food', FoodSchema)
