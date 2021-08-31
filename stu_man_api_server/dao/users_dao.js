
module.exports = class users_dao extends require('../model/users_mod'){

  // 用户登录反馈的信息处理
  static async login(req,res){
    let body = req.body
    let loginData = await this.loginUser(body.username,body.password,body.type)
    // 请求携带的登录数据能够在数据库中查到，就返回查询到的全部数据，并添加状态码200，否则返回状态码401
    if (loginData[0]){
      loginData[0]['status'] = 200
      res.send(loginData)
    } else {
      res.send([{'status': '401'}])
    }
  }
}