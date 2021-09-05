const sd = require('silly-datetime')

module.exports = class temForm_dao extends require('../model/temForm_mod') {

  // 根据id获取体温表列表
  static async getTemFormList(req,res) {
    // 获取请求url中的Params,也就是我们查询的依据
    let index = req.query.query
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getTemFormListById(id, index).then(result => {
      // total记录获取到的数据总数
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      result = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<result.length; i++) {
        result[i]['createdTime'] = sd.format(result[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      result[result.length] = {'status': '200', 'length': total}
      res.send(result)
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 新建一张体温表
  static async addTemForm(req,res) {
    let body = req.body
    let id = req.params.id
    let createdTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    await this.createTemForm(id,body.temperature,body.fever,body.counselor_name,createdTime)
        .then(result => {
          res.send([{'status': '201'}])
        }).catch(err => {
          res.send([{'status': '403'}])
        })
  }

  // 根据用户id和体温表的createdTime获取体温表信息
  static async getTemForm(req,res) {
    let id = req.params.id
    let createdTime = req.params.createdTime
    await this.getTemFormById(id, createdTime).then(result => {
      result[0]['createdTime'] = sd.format(result[0]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      result[result.length] = {'status': '200'}
      res.send(result)
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 更新体温表
  static async updateTemForm(req,res) {
    let body = req.body
    await this.updateTemFormById(req.params.id,body.temperature,body.fever,req.params.createdTime).then(result => {
      res.send([{'status': '201'}])
    }).catch(err => {
      res.send([{'status': '403'}])
    })
  }

  // 删除单张体温表
  static async deleteTemForm(req,res) {
    let id = req.params.id
    let createdTime = req.params.createdTime
    await this.deleteTemFormById(id, createdTime).then(result => {
      res.send([{'status': '204'}])
    }).catch(err => {
      console.log(err)
      res.send([{'status': '403'}])
    })
  }

  // 根据辅导员id获取体温表列表
  static async getTFListCoun(req,res) {
    // 获取请求url中的Params,也就是我们查询的依据
    let index = req.query.query
    let select = req.query.select
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getTFListCounById(id, index, select).then(result => {
      // total记录获取到的数据总数
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      result = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<result.length; i++) {
        result[i]['createdTime'] = sd.format(result[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      result[result.length] = {'status': '200', 'length': total}
      res.send(result)
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }
}