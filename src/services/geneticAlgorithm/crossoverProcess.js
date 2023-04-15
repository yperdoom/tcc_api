require('dotenv/config')
const { CROSSOVER_RATE, MAX_CHROMOSOME_SIZE } = process.env
const matchSize = (MAX_CHROMOSOME_SIZE >>> 1).toString(2).length

module.exports = async (fatherChromosome, motherChromosome) => {
  const fatherBinary = _arrayIntegerToBinary(fatherChromosome.chromosome)
  const motherBinary = _arrayIntegerToBinary(motherChromosome.chromosome)

  const fatherOffspring = fatherBinary
  const motherOffspring = motherBinary
  const fatherBuffer = [...fatherBinary]
  const motherBuffer = [...motherBinary]

  if ((Math.floor(Math.random() * 100)) <= CROSSOVER_RATE) {
    const cuttingPlace = Math.floor(Math.random() * (fatherChromosome.chromosome.length - 1))

    for (let i = cuttingPlace; i < (fatherChromosome.chromosome.length); i++) {
      const cutoff = Math.floor(Math.random() * (matchSize - 1))

      fatherOffspring[i] = ''
      motherOffspring[i] = ''

      for (let j = 0; j < matchSize; j++) {
        if (j >= cutoff) {
          fatherOffspring[i] += motherBuffer[i][j]
          motherOffspring[i] += fatherBuffer[i][j]
        } else {
          fatherOffspring[i] += fatherBuffer[i][j]
          motherOffspring[i] += motherBuffer[i][j]
        }
      }
    }
  }

  return {
    fatherSon: {
      chromosome: _arrayBinaryToInteger(fatherOffspring)
    },
    motherSon: {
      chromosome: _arrayBinaryToInteger(motherOffspring)
    }
  }
}

const _arrayIntegerToBinary = (array) => {
  const binaryArray = []

  for (let i = 0; i < array.length; i++) {
    let toBinary = (array[i] >>> 1).toString(2)

    if (toBinary.length < matchSize) {
      for (let j = toBinary.length; j < matchSize; j++) {
        toBinary = '0' + toBinary
      }
    }

    binaryArray.push(toBinary)
  }

  return binaryArray
}

const _arrayBinaryToInteger = (array) => {
  const integerArray = []

  for (let i = 0; i < array.length; i++) {
    integerArray.push(parseInt(array[i], 2))
  }

  return integerArray
}
