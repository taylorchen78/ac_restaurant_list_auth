const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// query restaurant
router.get('/', (req, res) => {
  const keyword = req.query.keyword
  const userId = req.user._id

  Restaurant.find({ userId }).or([{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }])
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

module.exports = router