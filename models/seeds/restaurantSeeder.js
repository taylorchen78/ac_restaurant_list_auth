const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const User = require('../user')

const SEED_USER = [
  {
    name: '',
    email: 'user1@example.com',
    password: '12345678',
    restaurant: [1, 2, 3]
  },
  {
    name: '',
    email: 'user2@example.com',
    password: '12345678',
    restaurant: [4, 5, 6]
  }
]

db.once('open', () => {
  Promise.all(Array.from({ length: 2 }, (_, i) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER[i].password, salt))
      .then(hash => User.create({
        name: SEED_USER[i].name,
        email: SEED_USER[i].email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        const list = []
        restaurantList.results.forEach((element, index) => {
          if (SEED_USER[i].restaurant.includes(element.id)) {
            list.push(element)
          }
        })
        return { list, userId }
      })
      .then(restaurant => {
        return Promise.all(Array.from({ length: restaurant.list.length }, (_, j) =>
          Restaurant.create({
            name: restaurant.list[j].name,
            name_en: restaurant.list[j].name_en,
            category: restaurant.list[j].category,
            image: restaurant.list[j].image,
            location: restaurant.list[j].location,
            phone: restaurant.list[j].phone,
            google_map: restaurant.list[j].google_map,
            rating: restaurant.list[j].rating,
            description: restaurant.list[j].description,
            userId: restaurant.userId
          })
        ))
      })
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(err => console.log(err))
})
