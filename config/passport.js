const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // Middle initialize
  app.use(passport.initialize())
  app.use(passport.session())

  // Strategies
  passport.use(new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, (req, email, password, done) => {
    User.findOne({ email }).then(user => {
      if (!user) {
        return done(null, false, req.flash('errors_msg', 'This email has not registerd!'))
      }
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, req.flash('errors_msg', 'Incorrect password!'))
        }
      })
    })
      .catch(err => done(err, false))
  }))

  // Session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}
