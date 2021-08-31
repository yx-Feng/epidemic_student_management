const express = require('express')
const user = require('../dao/users_dao')

const router = express.Router()

router.post('/login', function (req, res, next) {
  try {
    user.login(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
