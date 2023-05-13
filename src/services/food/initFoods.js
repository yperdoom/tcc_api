const createFood = require('../food/createFood')
const time = require('../factory/getTimeNow')
const tacoFoods = require('../../../TACO.json')

module.exports = async () => {
  for (let i = 0; i < tacoFoods.length; i++) {
    const payload = {
      name: tacoFoods[i].description,
      description: tacoFoods[i].description,
      type: tacoFoods[i].category,
      weight: 100,
      calorie: tacoFoods[i].energy_kcal,
      protein: tacoFoods[i].protein_g,
      lipid: tacoFoods[i].lipid_g,
      carbohydrate: tacoFoods[i].carbohydrate_g,
      created_at: time.now(),
      updated_at: time.now()
    }

    await createFood(payload)
  }
}
