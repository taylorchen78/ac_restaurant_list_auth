const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// show add restaurant page
router.get('/create', (req, res) => {
  return res.render('create')
})

// create restaurant
router.post('/', (req, res) => {
  const inputData = req.body
  inputData["userId"] = req.user._id

  return Restaurant.create(inputData)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// show selected restaurant info
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// show edit page
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// update restaurant info
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  const inputData = req.body
  inputData["userId"] = userId

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, inputData)
      return restaurant.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

// delete selected restaurant
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router