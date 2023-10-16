
const mongoOperator = require('../../../config/database/mongo/mongoOperator')
const model = 'food'

module.exports = ({
  create: async (document) => {
    return mongoOperator.new(model, document)
  },
  update: async (filter, document) => {
    return mongoOperator.put(model, filter, document)
  },
  getOne: async (filter, projection = '') => {
    return mongoOperator.getOne(model, filter, projection)
  },
  get: async (filter, projection = '') => {
    return mongoOperator.get(model, filter, projection)
  },
  getAll: async () => {
    return mongoOperator.getAll(model)
  },
  delete: async (filter) => {
    return mongoOperator.delete(model, filter)
  },

  initFoods: async () => {
    const foods = require('../../../pre_save/foodsMock.json')


    for (let i = 0; i < foods.length; i++) {
      const payload = {
        name: _refactorName(foods[i].description),
        description: foods[i].description,
        type: foods[i].category,
        weight: 100,
        calorie: _refactorNutrients(foods[i].energy_kcal),
        protein: _refactorNutrients(foods[i].protein_g),
        lipid: _refactorNutrients(foods[i].lipid_g),
        carbohydrate: _refactorNutrients(foods[i].carbohydrate_g),
      }

      const res = await mongoOperator.new(model, payload)
      if (!res) { break }
    }

  },
})

const _refactorNutrients = (nutrient) => {
  if (typeof nutrient === 'number') {
    nutrient = parseFloat(nutrient)
  } else {
    nutrient = 0
  }

  return nutrient.toFixed(2)
}

const _refactorName = (description) => {
  const match = description.match(/,/)

  if (match) {
    return description.substring(0, match.index)
  }
  return description
}
