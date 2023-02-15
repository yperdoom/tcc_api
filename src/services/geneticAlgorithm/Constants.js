require('dotenv/config')
const { SIZE_POPULATION } = process.env

module.exports = class Constants {
  constructor () {
    this.population = SIZE_POPULATION
  }
}
