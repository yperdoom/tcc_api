
module.exports = async (foods) => {
  const foodsWithQuantity = foods.map((food) => {
    food.quantity = food.weight || food.portion || food.mililiter

    return food
  })

  return foodsWithQuantity
}
