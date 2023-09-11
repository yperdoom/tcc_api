module.exports = (foods, individual) => {
  // Variável que será usada para a soma de porcentagens de calorias
  let calorieSum = 0
  let proteinSum = 0
  let carbohydrateSum = 0
  let lipidSum = 0

  // Percorre por todos os alimentos, iterando por cada um deles
  for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
    const percentage = (individual.chromosome[foodIterator] * 100) / foods[foodIterator].quantity

    calorieSum += foods[foodIterator].calorie * (percentage / 100)
    proteinSum += foods[foodIterator].protein * (percentage / 100)
    carbohydrateSum += foods[foodIterator].carbohydrate * (percentage / 100)
    lipidSum += foods[foodIterator].lipid * (percentage / 100)
  }

  return {
    calories: calorieSum,
    proteins: proteinSum,
    carbohydrates: carbohydrateSum,
    lipids: lipidSum
  }
}