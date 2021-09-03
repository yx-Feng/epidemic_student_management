const express = require('express')
const leaveForm = require('../dao/leaveForm_dao')

const router = express.Router()

// 根据id获取假条信息
router.get('/:id', function (req, res, next) {
  try {
    leaveForm.getLeaveFormList(req,res)
  } catch (err) {
    next(err)
  }
})

// 新建一张假条
router.post('/:id', function (req, res, next) {
  try {
    leaveForm.addLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取某张假条的信息
router.get('/:id/:createdTime', function (req, res, next) {
  try {
    leaveForm.getLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 删除某张假条
router.delete('/:id/:createdTime', function (req, res, next) {
  try {
    leaveForm.deleteLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id和假条的state获取假条
router.get('/coun/:id/:state', function (req, res, next) {
  try {
    leaveForm.getPendingLeaveForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 更新假条的state
router.put('/:s_id/:createdTime/state/:isOK', function (req, res, next) {
  try {
    leaveForm.updateLeaveFormState(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
