module.exports = (foods, params) => {
  const individual = {
    chromosome: [], // Array de inteiros que representa a quantidade (peso, porção ou litros) dos alimentos
    fitness: 0.00, // Campo que indica a nota de aptidão do indivíduo
    rouletteRange: [0, 0] // Faixa da fatia de pizza (em porcentagem aplicado na roleta russa) em que representa a chance desse indivíduo ser selecionado
  }

  // Percorre iterando no indivíduo até a quantidade máxima de comidas informada
  for (let foodIterator = 0; foodIterator < foods.length; foodIterator++) {
    // Gera um número aleatório entre 0 e o tamanho máximo do cromossomo declarado no env
    const random = Math.floor(Math.random() * params.MAX_GENERATE_CHROMOSOME_SIZE)

    // adiciona o número gerado no cromossomo do indivíduo atual
    individual.chromosome.push(random)
  }

  return individual
}
