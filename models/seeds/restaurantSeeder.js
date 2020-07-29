// require packages
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.results.forEach(element => {
    Restaurant.create(element)
  });

  console.log('done')
})
