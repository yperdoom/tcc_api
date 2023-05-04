require('dotenv/config')
const { SIZE_GENERATION, MAX_CHROMOSOME_SIZE } = process.env

// Função que gera uma geração de indivíduos
module.exports = async (foods) => {
  // Declara a geração inicial de indivíduos
  const generation = []

  // Inicia a contrução da geração até o tamanho máximo da geração declarado no env
  for (let generationIterator = 0; generationIterator < Math.floor(SIZE_GENERATION); generationIterator++) {
    // Declara o objeto do indivíduo atual
    const individual = {
      chromosome: [], // Array de inteiros que representa a quantidade (peso, porção ou litros) dos alimentos
      fitness: 0.00, // Campo que indica a nota de aptidão do indivíduo
      rouletteRange: [0, 0] // Faixa da fatia de pizza (em porcentagem aplicado na roleta russa) em que representa a chance desse indivíduo ser selecionado
    }

    // Percorre iterando no indivíduo até a quantidade máxima de comidas informada
    for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
      // Gera um número aleatório entre 0 e o tamanho máximo do cromossomo declarado no env
      const random = Math.floor(Math.random() * MAX_CHROMOSOME_SIZE)

      // adiciona o número gerado no cromossomo do indivíduo atual
      individual.chromosome.push(random)
    }
    // Adiciona o indivíduo atual na geração
    generation.push(individual)
  }

  // Retorna a geração gerada para a função controladora
  return generation
}
