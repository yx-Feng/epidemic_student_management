
module.exports = class profile_dao extends require('../model/profile_mod') {

  // 根据id获取学生个人信息
  static async getStuProfile(req,res) {
    let id = req.params.id
    await this.getStuProfileById(id).then((result) => {
      if (result.length > 0) {
        result[result.length] = {'status': '200'}
        res.send(result)
      } else {
        res.send([{'status': '404'}])
      }
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 根据id更新学生个人信息
  static async updateStuProfile(req,res) {
    let id = req.params.id
    let body = req.body
    await this.updateStuProfileById(id, body).then(() => {
      res.send([{'status': '201'}])
    }).catch(err => {
      res.send([{'status': '403'}])
    })
  }

  // 根据id获取辅导员个人信息
  static async getCounProfile(req,res) {
    let id = req.params.id
    await this.getCounProfileById(id).then((result) => {
      if (result.length > 0) {
        result[result.length] = {'status': '200'}
        res.send(result)
      } else {
        res.send([{'status': '404'}])
      }
    }).catch(err => {
      res.send([{'status': '404'}])
    })
  }

  // 根据id更新辅导员个人信息
  static async updateCounProfile(req,res) {
    let id = req.params.id
    let body = req.body
    await this.updateCounProfileById(id, body).then(() => {
      res.send([{'status': '201'}])
    }).catch(err => {
      res.send([{'status': '403'}])
    })
  }
}