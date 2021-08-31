
module.exports = class users_mod extends require('./model'){
  // 数据库登录
  static loginUser(username,password,type){
    type = Number(type)
    return new Promise(((resolve, reject) => {
      let sql = "select * from" + " user where binary id='"+username+"' and password='"+password+"' and identity="+type
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject('查询失败')
      })
    }))
  }
}