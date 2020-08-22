const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const search = require('./modules/search')
const sort = require('./modules/sort')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

const { authenticator } = require('../middleware/auth')

router.use('/search', authenticator, search)
router.use('/sort', authenticator, sort)
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router