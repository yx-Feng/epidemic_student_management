const express = require('express')
const profile = require('../dao/leaveForm_dao')

const router = express.Router()

// 根据id获取假条信息
router.get('/:id', function (req, res, next) {
  try {
    profile.getLeaveFormList(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
