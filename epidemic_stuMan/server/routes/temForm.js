const express = require('express')
const temForm = require('../dao/temForm_dao')
const auth = require('../middleware/auth')

const router = express.Router()

// 根据id获取体温表
router.get('/stu/:id', auth, function (req, res, next) {
  try {
    temForm.getTemFormList(req,res)
  } catch (err) {
    next(err)
  }
})

// 新建一张体温表
router.post('/stu/:id', auth, function (req, res, next) {
  try {
    temForm.addTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取某张体温表的信息
router.get('/:sn', function (req, res, next) {
  try {
    temForm.getTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id更新体温表信息
router.put('/:sn', function (req, res, next) {
  try {
    temForm.updateTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 删除某张体温表
router.delete('/:sn', function (req, res, next) {
  try {
    temForm.deleteTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id获取体温表列表
router.get('/coun/:id', auth, function (req, res, next) {
  try {
    temForm.getTFListCoun(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router