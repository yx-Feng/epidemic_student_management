
module.exports = class accounts_mod extends require('./model'){
  // 获取用户列表数据
  static getAccountList(index){
    return new Promise(((resolve, reject) => {
      // 如果url中有Params，根据index模糊查询, 否则默认全部查询
      let sql
      if (index) {
        sql = "select * from" + " user where id like '%" + index + "%'"
      } else {
        sql = "select * from" + " user"
      }
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject('账号列表获取失败')
      })
    }))
  }

  // 添加一个账号
  static createAccount(id,password,identity){
    return new Promise(((resolve, reject) => {
      let sql = "insert into " + "user(id,password,identity) values('" + id + "','" + password + "','" + identity+ "')"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }

  // 获取一个账号
  static getAccountById(id){
    return new Promise(((resolve, reject) => {
      let sql = "select * from user where id='" + id + "'"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }

  // 更新账号信息
  static updateAccountById(id,password,identity){
    return new Promise(((resolve, reject) => {
      let sql = "update user" + " set password='"+ password +"',identity='" + identity + "' where id='" + id + "'"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }

  // 删除单个账号信息
  static deleteAccountById(id){
    return new Promise(((resolve, reject) => {
      let sql = "delete from" + " user where id='" + id + "'"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }
}