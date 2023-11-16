'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mealSchema = new Schema({
  name: String,
  type: String,
  countGenerations: Number,
  foods: [],
  individual: {},
  quantity: [],
  fitness: Number,
  calorie: Number,
  carbohydrate: Number,
  protein: Number,
  lipid: Number,
  recommended_calorie: Number,
  recommended_carbohydrate: Number,
  recommended_protein: Number,
  recommended_lipid: Number,
  food_amount: Number
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

const PrescriptionSchema = new Schema({
  meals: [mealSchema],
  name: String,
  recommended_calorie: Number,
  recommended_carbohydrate: Number,
  recommended_protein: Number,
  recommended_lipid: Number,
  is_adapted_prescription: Boolean,
  meal_amount: Number,
  client_id: String,
  manager_id: String,
  token: {
    user_id: String,
    name: String,
    email: String,
    scope: String,
    phone: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

PrescriptionSchema.index({ user_id: 1 })
PrescriptionSchema.index({ client_id: 1 })
PrescriptionSchema.index({ manager_id: 1 })
PrescriptionSchema.index({ name: 'text' }, { default_language: 'pt-br' })

module.exports = mongoose.model('Prescription', PrescriptionSchema)
