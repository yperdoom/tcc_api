'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  client: {
    age: Number,
    height: Number,
    weight: Number,
    fat_percentage: Number,
    sex: String,
    manager_id: String,
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  id: false,
  versionKey: false
})

UserSchema.index({ name: 'text' }, { default_language: 'pt-br' })
UserSchema.index({ email: 1 })
UserSchema.index({ scope: 1 })
UserSchema.index({ 'client.manager_id': 1 })


module.exports = mongoose.model('User', UserSchema)
