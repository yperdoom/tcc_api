module.exports = async (sumOfNutrients, meal) => {
  const quantityCalorieMultiplier = (sumOfNutrients.calories * 100) / meal.recommended_calorie
  const quantityProteinMultiplier = (sumOfNutrients.proteins * 100) / meal.recommended_protein
  const quantityCarbohydrateMultiplier = (sumOfNutrients.carbohydrates * 100) / meal.recommended_carbohydrate
  const quantityLipidMultiplier = (sumOfNutrients.lipids * 100) / meal.recommended_lipid

  const quantityEquivalentTotal = quantityProteinMultiplier + quantityCarbohydrateMultiplier + quantityLipidMultiplier

  const divisionOfProteins = {
    protein: (100 * quantityProteinMultiplier) / quantityEquivalentTotal,
    carbohydrate: (100 * quantityCarbohydrateMultiplier) / quantityEquivalentTotal,
    lipid: (100 * quantityLipidMultiplier) / quantityEquivalentTotal
  }

  const divisionProtein = Math.abs((divisionOfProteins.protein) - (meal?.division.protein | 0)) / 5
  const divisionCarbohydrate = Math.abs((divisionOfProteins.carbohydrate) - (meal?.division.carbohydrate | 0)) / 5
  const divisionLipid = Math.abs((divisionOfProteins.lipid) - ((meal?.division.lipid | 0) / 2)) / 5

  const calorieDiference = Math.abs(quantityCalorieMultiplier - 100)

  const proteinsDiference = divisionProtein + divisionCarbohydrate + divisionLipid

  const fitness = calorieDiference + proteinsDiference

  return { fitness, divisionOfProteins }
}
