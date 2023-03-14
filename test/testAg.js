const agController = require('../src/controllers/agController')

const foods = require('./mocks/foodsMock.json')
const meal = require('./mocks/mealMock.json')

agController.newAdapter(foods, meal)

