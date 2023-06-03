const agController = require('../src/controllers/agController')

const foods = require('./mocks/foodsMock.json')
const meal = require('./mocks/meal_validation.json')

agController.newAdapter(foods, meal)
