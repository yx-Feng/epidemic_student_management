
module.exports = class accounts_mod extends require('./model'){

  // 用户登录
  static loginUser(id,pwd,identity){
    return new Promise((resolve, reject) => {
      let sql = "select * from user " +
          "where binary id='"+id+"' and pwd='"+pwd+"' and identity='"+identity+"'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 获取账号列表(根据搜索关键字(如果有的话))
  static getAccounts(query){
    return new Promise((resolve, reject) => {
      let sql = ""
      if (query) {
        sql = "select * from user where id like '%"+query+"%'"
      } else {
        sql = "select * from user"
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 添加一个账号
  static createAccount(id,pwd,identity){
    return new Promise((resolve, reject) => {
      let sql = "insert into user(id,pwd,identity) " +
          "values('" + id + "','" + pwd + "','" + identity+ "')"
      this.query(sql).then(result => {
        resolve(result)
        // 除了user表,student或counselor表也要初始化(1表示学生,2表示辅导员)
        if (identity === '1'){
          sql = "insert into student(id,name,sex,class,college,tel) " +
              "values('" + id +"','空','空','空','空','空')"
        } else if(identity == '2') {
          sql = "insert into counselor(id,name,sex,college,tel) " +
              "values('" + id +"','空','空','空','空')"
        }
        this.query(sql)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 获取一个账号信息
  static getAccountById(id){
    return new Promise((resolve, reject) => {
      let sql = "select * from user where id='" + id + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据id更新账号信息
  static updateAccountById(id,pwd){
    return new Promise((resolve, reject) => {
      let sql = "update user set pwd='"+ pwd +"' where id='" + id + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据id删除指定账号
  static deleteAccountById(id){
    return new Promise((resolve, reject) => {
      let sql = "delete from user where id='" + id + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}