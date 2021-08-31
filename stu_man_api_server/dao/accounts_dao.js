
module.exports = class accounts_dao extends require('../model/accounts_mod'){

  // 用户登录反馈的信息处理
  static async login(req,res){
    let body = req.body
    let loginData = await this.loginUser(body.username,body.password,body.type)
    // 用户的登录数据能够在数据库中查到，返回查询到的全部数据，并添加状态码200，否则返回状态码401
    if (loginData[0]){
      loginData[0]['status'] = 200
      res.send(loginData)
    } else {
      res.send([{'status': '401'}])
    }
  }

  // 用户账号列表数据处理
  static async getAccounts(req,res){
    // 获取请求url中的Params,也就是我们查询的依据
    let index = req.param('query')
    let pageNum = Number(req.param('pagenum'))
    let pageSize = Number(req.param('pagesize'))
    let accountList = await this.getAccountList(index)
    // total记录获取到的数据总数
    let total = accountList.length

    // 如果能够获取账号列表，返回并添加状态码200，否则返回状态码404
    if (total > 0){
      let start = pageSize * (pageNum - 1)
      let end = Math.min(start + pageSize, total)
      let newList = accountList.slice(start, end)
      newList[newList.length] = {'length': total, 'status': '200'}
      res.send(newList)
    } else {
      res.send([{'status': '404'}])
    }
  }

  // 添加用户
  static async addAccount(req,res) {
    let body = req.body
    await this.createAccount(body.id,body.password,body.identity).then(() => {
      res.send([{'status': '201'}])
    }).catch(err =>{
      res.send([{'status': '403'}])
    })
  }

  // 获取单个账号
  static async getAccount(req,res) {
    let id = req.params.id
    await this.getAccountById(id).then((result) => {
      if (result.length > 0){
        result[result.length] = {'status': '200'}
        res.send(result)
      } else {
        res.send([{'status': '404'}])
      }
    }).catch(err =>{
      res.send([{'status': '404'}])
    })
  }

  // 更新账号
  static async updateAccount(req,res) {
    let body = req.body
    await this.updateAccountById(req.params.id,body.password,body.identity).then((result) => {
      res.send([{'status': '201'}])
    }).catch(err =>{
      res.send([{'status': '403'}])
    })
  }

  // 删除单个账号
  static async deleteAccount(req,res) {
    await this.deleteAccountById(req.params.id).then((result) => {
      res.send([{'status': '204'}])
    }).catch(err =>{
      console.log(err)
      res.send([{'status': '403'}])
    })
  }
}