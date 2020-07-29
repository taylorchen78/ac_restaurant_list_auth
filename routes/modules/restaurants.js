const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// show add restaurant page
router.get('/create', (req, res) => {
  return res.render('create')
})

// create restaurant
router.post('/', (req, res) => {
  const { name, image, location, phone } = req.body

  if (!name || !image || !location || !phone) {
    return res.render('create')
  } else {
    return Restaurant.create(req.body)
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }
})

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
  const { name, image, location, phone } = req.body

  if (!name || !image || !location || !phone) {
    return res.render('edit', { restaurant: req.body })
  } else {
    return Restaurant.findById(id)
      .then(restaurant => {
        restaurant = Object.assign(restaurant, req.body)
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