const sd = require('silly-datetime')

module.exports = class profile_dao extends require('../model/leaveForm_mod') {

  // 根据id获取假条列表
  static async getLeaveFormList(req,res) {
    // 获取请求url中的Params,也就是我们查询的依据
    let index = req.query.query
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    const id = req.params.id
    await this.getLeaveFormListById(id, index).then(result => {
      // total记录获取到的数据总数
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      result = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<result.length; i++) {
        result[i]['start_time'] = sd.format(result[i]['start_time'], 'YYYY-MM-DD')
        result[i]['end_time'] = sd.format(result[i]['end_time'], 'YYYY-MM-DD')
        result[i]['createdTime'] = sd.format(result[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
        // 将state转成具体的信息
        const state_reflect = { '0': '未审批', '1': '审批未通过', '2': '审批通过'}
        result[i].state = state_reflect[result[i].state]
      }
      // 补充状态、数据总数信息
      result[result.length] = {'status': '200', 'length': total}
      res.send(result)
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 新建假条
  static async addLeaveForm(req,res) {
    let body = req.body
    let id = req.params.id
    let createdTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    await this.createLeaveForm(id,body.start_time,body.end_time,body.reason,body.place,body.state,body.counselor_name,createdTime)
        .then(result => {
          res.send([{'status': '201'}])
        }).catch(err => {
          res.send([{'status': '403'}])
        })
  }

  // 根据用户id和假条的createdTime获取假条信息
  static async getLeaveForm(req,res) {
    let id = req.params.id
    let createdTime = req.params.createdTime
    await this.getLeaveFormById(id, createdTime).then(result => {
      // 将state转成具体的信息
      const state_reflect = { '0': '未审批', '1': '审批未通过', '2': '审批通过'}
      result[0].state = state_reflect[result[0].state]
      result[0]['start_time'] = sd.format(result[0]['start_time'], 'YYYY-MM-DD')
      result[0]['end_time'] = sd.format(result[0]['end_time'], 'YYYY-MM-DD')
      result[0]['createdTime'] = sd.format(result[0]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      result[result.length] = {'status': '200'}
      console.log(result)
      res.send(result)
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 删除单个假条
  static async deleteLeaveForm(req,res) {
    let id = req.params.id
    let createdTime = req.params.createdTime
    await this.deleteLeaveFormById(id, createdTime).then((result) => {
      res.send([{'status': '204'}])
    }).catch(err =>{
      console.log(err)
      res.send([{'status': '403'}])
    })
  }

  // 根据辅导员id和假条的state获取假条
  static async getPendingLeaveForm(req,res) {
    let id = req.params.id
    let state = req.params.state
    let pageNum = Number(req.query.pagenum)
    let pageSize = Number(req.query.pagesize)
    await this.getPendingLF(id, state).then((result) => {
      // total记录获取到的假条总数
      let total = result.length
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      result = result.slice(start, end)
      // 时间戳的格式转换
      for (let i=0;i<result.length; i++) {
        result[i]['start_time'] = sd.format(result[i]['start_time'], 'YYYY-MM-DD')
        result[i]['end_time'] = sd.format(result[i]['end_time'], 'YYYY-MM-DD')
        result[i]['createdTime'] = sd.format(result[i]['createdTime'], 'YYYY-MM-DD HH:mm:ss')
      }
      result[result.length] = {'status': '200', 'length': total}
      res.send(result)
    }).catch(err =>{
      console.log(err)
      res.send([{'status': '403'}])
    })
  }

  // 更新假条的state
  static async updateLeaveFormState(req,res) {
    let id = req.params.s_id
    let isOK = req.params.isOK
    let createTime = req.params.createdTime
    let state
    if (isOK === 'true') {
      state = '2'
    } else {
      state = '1'
    }
    await this.updateLFState(id, createTime, state).then((result) => {
      res.send([{'status': '200'}])
    }).catch(err =>{
      res.send([{'status': '403'}])
    })
  }
}