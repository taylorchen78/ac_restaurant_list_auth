if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const Handlebars = require("handlebars")
const exphbs = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

require('./config/mongoose')

const app = express()

const port = process.env.PORT

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.errors_msg = req.flash('errors_msg')
  next()
})

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

