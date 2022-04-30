const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const account = require('../model/accounts_mod')

module.exports = async (req,res,next) => {
  // 从请求头获取token数据
  let token = req.headers['authorization']
  if(!token) {
    return res.status(401).end()
  }
  try {
    const decodedToken = await verify(token, jwtSecret)
    let id = decodedToken['userId']
    await account.getAccountById(id)
    next()
  } catch(err) {
    return res.status(401).end()
  }
}
