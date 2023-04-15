const agController = require('../src/controllers/agController')

const foods = require('./mocks/foodsMock.json')
const meal = require('./mocks/mealMock2.json')

agController.newAdapter(foods, meal)
