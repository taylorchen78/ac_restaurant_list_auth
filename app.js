// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Handlebars = require("handlebars")
const methodOverride = require('method-override')

const app = express()

const port = 3000

// register helper
Handlebars.registerHelper("categorySame", function (category, value, options) {
  if (category === value) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})

// require express-handlebars here
const exphbs = require('express-handlebars')

const routes = require('./routes')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// use bodyparser
app.use(bodyParser.urlencoded({ extended: true }))

// use method override
app.use(methodOverride('_method'))

app.use(routes)

// setting mongoose connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// get mongo db connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})


// start and listen on Express server
app.listen(port, () => {
  console.log(`Express is listen on localhost:${port}`)
})

