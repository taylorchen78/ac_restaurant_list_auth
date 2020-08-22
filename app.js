// require packages used in the project
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const Handlebars = require("handlebars")
const exphbs = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')

require('./config/mongoose')

const app = express()

const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsRestaurantSecret',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// register helper
Handlebars.registerHelper("categorySame", function (category, value, options) {
  if (category === value) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})

// start and listen on Express server
app.listen(port, () => {
  console.log(`Express is listen on localhost:${port}`)
})

