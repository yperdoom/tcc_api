require('dotenv/config')
const { EXPECTED_EVALUATION } = process.env

// Função que irá avaliar a geração de cromossomos informada
module.exports = (foods, generation) => {
  // Declara um array que representa a evolução da população
  const evaluation = []

  // Percorre a geração iterando por cada cromossomo presente nela
  generation.forEach((individual, index) => {
    // Variável que será usada para a soma de porcentagens
    let percentageSum = 0

    // Percorre por todos os alimentos, iterando por cada um deles
    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      // Atribui a diferença de porcentagem
      evaluation[index][foodIterator].diference = (individual[foodIterator] * 100) / foods[foodIterator].quantity

      // Soma a diferença de porcentagem
      percentageSum += evaluation[index][foodIterator].diference
    }

    // Adiciona a média de diferença em porcentagem ao indivíduo
    individual.fitness = (percentageSum / foods.length)

    // Verifica se o individuo bate com a avaliação que se espera
    if (Math.abs(individual.fitness) >= EXPECTED_EVALUATION) {
      return {
        success: true,
        individual,
        evaluation: evaluation[index]
      }
    }
  })

  return {
    success: false
  }
}
