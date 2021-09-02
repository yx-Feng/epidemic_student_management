
module.exports = class profile_dao extends require('../model/leaveForm_mod') {

  // 根据id获取假条信息
  static async getLeaveFormList(req,res) {
    let id = req.params.id
    await this.getLeaveFormListById(id).then(result => {
      if (result.length > 0) {
        console.log(result)
        console.log(req.query)
        result[result.length] = {'status': '200'}
        res.send(result)
      } else {
        res.send([{'status': '404'}])
      }
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }
}