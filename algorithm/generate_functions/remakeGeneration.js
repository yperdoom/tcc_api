module.exports = (oldGeneration, params) => {
  let newGeneration = []

  for (let i = oldGeneration.length - 1; newGeneration.length < params.SIZE_GENERATION; i--) {
    newGeneration.push(oldGeneration[i])
  }

  return newGeneration
}
