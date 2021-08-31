const express = require('express')
const userList = require('../dao/accounts_dao')

const router = express.Router()

// 获取账号列表
router.get('/', function (req, res, next) {
  try {
    userList.getAccounts(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取单个账号信息
router.get('/:id', function (req, res, next) {
  try {
    userList.getAccount(req,res)
  } catch (err) {
    next(err)
  }
})

router.post('/', function (req, res, next) {
  try {
    userList.addAccount(req,res)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', function (req, res, next) {
  try {
    userList.updateAccount(req,res)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', function (req, res, next) {
  try {
    userList.deleteAccount(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
