
module.exports = class profile_mod extends require('./model') {

  // 根据id获取教条信息
  static getLeaveFormListById(id) {
    return new Promise(((resolve, reject) => {
      let sql = "select * from" + " leaveform where s_id='" + id + "'"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }
}