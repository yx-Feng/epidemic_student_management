const express = require('express')
const user = require('../dao/accounts_dao')
const auth = require('../middleware/auth')

const router = express.Router()

// 用户登录请求
router.post('/login', function (req, res, next) {
  try {
    user.login(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取账号列表
router.get('/accounts', auth, function (req, res, next) {
  try {
    user.getAccountList(req,res)
  } catch (err) {
    next(err)
  }
})

// 添加一个账号
router.post('/account', auth, function (req, res, next) {
  try {
    user.addAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取单个账号信息
router.get('/account/:id', auth, function (req, res, next) {
  try {
    user.getAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id更新账号信息
router.put('/account/:id', auth, function (req, res, next) {
  try {
    user.updateAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id删除指定账号
router.delete('/account/:id', auth, function (req, res, next) {
  try {
    user.deleteAccount(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
