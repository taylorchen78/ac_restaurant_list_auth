const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// show whole restaurants
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// show add restaurant page
router.get('/add', (req, res) => {
  return res.render('add')
})

// add new restaurant
router.post('/add_restaurant', (req, res) => {
  const restaurant = req.body

  if ((restaurant.name.length === 0) || (restaurant.image.length === 0) ||
    (restaurant.location.length === 0) || (restaurant.phone.length === 0)) {
    return res.render('add', { restaurant })
  } else {
    return Restaurant.create(restaurant)
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }
})

// query restaurant
router.get('/search', (req, res) => {
  const keyword = req.query.keyword

  Restaurant.find().or([{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }])
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

module.exports = router