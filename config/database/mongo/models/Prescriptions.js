'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const foodSchema = new Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId },
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
})

const mealSchema = new Schema({
  name: String,
  type: String,
  countGenerations: Number,
  foods: [foodSchema],
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
  client_id: Number,
  manager_id: Number,
  token: {
    user_id: Number,
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
PrescriptionSchema.index({ name: 'text' })

module.exports = mongoose.model('Prescription', PrescriptionSchema)
