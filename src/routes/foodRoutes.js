
module.exports = (api) => {
  api.get('/food', () => { console.log('get all foods route') })

  api.get('/food:food_id', () => { console.log('get one food route') })

  api.post('/food', () => { console.log('create food route') })

  api.put('/food', () => { console.log('modify food route') })

  api.delete('/food', () => { console.log('delete food route') })

  return api
}
