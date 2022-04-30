const express = require('express')
const profile = require('../dao/profile_dao')
const auth = require('../middleware/auth')

const router = express.Router()

// 根据学生id获取个人信息
router.get('/stu/:id', auth, function (req, res, next) {
  try {
    profile.getStuProfile(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据学生id更新个人信息
router.put('/stu/:id', auth, function (req, res, next) {
  try {
    profile.updateStuProfile(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id获取个人信息
router.get('/coun/:id', auth, function (req, res, next) {
  try {
    profile.getCounProfile(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id更新个人信息
router.put('/coun/:id', auth, function (req, res, next) {
  try {
    profile.updateCounProfile(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
