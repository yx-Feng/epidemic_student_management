const express = require('express')
const temForm = require('../dao/temForm_dao')

const router = express.Router()

// 根据id获取体温表
router.get('/:id', function (req, res, next) {
  try {
    temForm.getTemFormList(req,res)
  } catch (err) {
    next(err)
  }
})

// 新建一张体温表
router.post('/:id', function (req, res, next) {
  try {
    temForm.addTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 获取某张体温表的信息
router.get('stu/:id/:createdTime', function (req, res, next) {
  try {
    temForm.getTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据id更新体温表信息
router.put('/:id/:createdTime', function (req, res, next) {
  try {
    temForm.updateTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 删除某张体温表
router.delete('/:id/:createdTime', function (req, res, next) {
  try {
    temForm.deleteTemForm(req,res)
  } catch (err) {
    next(err)
  }
})

// 根据辅导员id获取体温表列表
router.get('/coun/:id/', function (req, res, next) {
  try {
    temForm.getTFListCoun(req,res)
  } catch (err) {
    next(err)
  }
})

module.exports = router