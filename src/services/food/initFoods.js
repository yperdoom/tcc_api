const createFood = require('../food/createFood')
const time = require('../factory/getTimeNow')
const tacoFoods = require('../../../TACO.json')

module.exports = async () => {
  await createFood({
    name: tacoFoods[0].description,
    description: tacoFoods[0].description,
    type: tacoFoods[0].category,
    weight: 100,
    calorie: tacoFoods[0].energy_kcal,
    protein: tacoFoods[0].protein_g,
    lipid: tacoFoods[0].lipid_g,
    carbohydrate: tacoFoods[0].carbohydrate_g,
    created_at: time.now(),
    updated_at: time.now()
  })

  // for (let i = 0; i < tacoFoods.length; i++) {
  //   await createFood({
  //     name: tacoFoods[i].description,
  //     description: tacoFoods[i].description,
  //     type: tacoFoods[i].category,
  //     weight: 100,
  //     calorie: tacoFoods[i].energy_kcal,
  //     protein: tacoFoods[i].protein_g,
  //     lipid: tacoFoods[i].lipid_g,
  //     carbohydrate: tacoFoods[i].carbohydrate_g,
  //     created_at: time.now(),
  //     updated_at: time.now()
  //   })
  // }
}
