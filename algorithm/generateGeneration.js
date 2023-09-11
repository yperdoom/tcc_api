const newChromosome = require('./generate_functions/newChromosome')

// Função que gera uma geração de indivíduos
module.exports = async (foods, params) => {
  // Declara a geração inicial de indivíduos
  const generation = []

  // Inicia a contrução da geração até o tamanho máximo da geração declarado no env
  for (let generationIterator = 0; generationIterator < Math.floor(params.SIZE_GENERATION); generationIterator++) {
    individual = newChromosome(foods, params)

    // Adiciona o indivíduo atual na geração
    generation.push(individual)
  }

  // Retorna a geração gerada para a função controladora
  return generation
}

