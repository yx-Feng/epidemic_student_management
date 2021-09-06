const express = require('express')
const leaveForm = require('../dao/leaveForm_dao')
const auth = require('../middleware/auth')

const router = express.Router()

// 学生根据id获取假条
router.get('/:id', auth, function (req, res, next) {
  try {
    leaveForm.getLeaveFormList(req,res)
  } catch (err) {
    next(err)
  }
})

// 新建一张假条
router.post('/:id', auth, function (req, res, next) {
  try {
    leaveForm.addLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据学生id和假条的createdTime获取假条信息
router.get('/:id/:createdTime', auth, function (req, res, next) {
  try {
    leaveForm.getLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据学生id和假条的createdTime更新假条
router.put('/:id/:createdTime', auth, function (req, res, next) {
  try {
    leaveForm.updateLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据学生id和假条的createdTime删除假条
router.delete('/:id/:createdTime', auth, function (req, res, next) {
  try {
    leaveForm.deleteLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id和假条的state获取假条
router.get('/coun/:id/:state', auth, function (req, res, next) {
  try {
    leaveForm.getDiffLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 更新假条的state
router.put('/:id/:createdTime/state/:isOK', auth, function (req, res, next) {
  try {
    leaveForm.updateLeaveFormState(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
