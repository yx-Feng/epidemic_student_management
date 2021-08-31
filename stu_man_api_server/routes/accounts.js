const express = require('express')
const userList = require('../dao/accounts_dao')

const router = express.Router()

// 响应登录请求
router.post('/login', function (req, res, next) {
  try {
    userList.login(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取账号列表
router.get('/accounts', function (req, res, next) {
  try {
    userList.getAccounts(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取单个账号信息
router.get('/accounts/:id', function (req, res, next) {
  try {
    userList.getAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 添加一个账号
router.post('/accounts/', function (req, res, next) {
  try {
    userList.addAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id更新账号信息
router.put('/accounts/:id', function (req, res, next) {
  try {
    userList.updateAccount(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id删除指定账号
router.delete('/accounts/:id', function (req, res, next) {
  try {
    userList.deleteAccount(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
