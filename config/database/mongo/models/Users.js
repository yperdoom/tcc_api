'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
  age: Number,
  height: Number,
  weight: Number,
  fat_percentage: Number,
  sex: String,
  manager_id: { type: mongoose.SchemaTypes.ObjectId },
})

const managerSchema = new Schema({
  document: String,
  user_id: { type: mongoose.SchemaTypes.ObjectId }
})

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  scope: { type: String },
  phone: String,
  document: String,
  city: String,
  state: String,
  birthday: Date,
  manager: managerSchema,
  client: clientSchema
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

UserSchema.index({ name: 'text' })
UserSchema.index({ 'manager.user_id': 1 })
UserSchema.index({ 'client.manager_id': 1 })


module.exports = mongoose.model('User', UserSchema)
