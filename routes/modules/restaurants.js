const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// show selected restaurant info
router.get('/:id', (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// show edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// update restaurant info
router.put('/:id', (req, res) => {
  const id = req.params.id
  const restaurant_update = req.body

  if ((restaurant_update.name.length === 0) || (restaurant_update.image.length === 0) ||
    (restaurant_update.location.length === 0) || (restaurant_update.phone.length === 0)) {
    return res.render('edit', { restaurant: restaurant_update })
  } else {
    return Restaurant.findById(id)
      .then(restaurant => {
        restaurant = Object.assign(restaurant, restaurant_update)
        return restaurant.save()
      })
      .then(() => res.redirect(`/`))
      .catch(error => console.log(error))
  }
})

// delete selected restaurant
router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router