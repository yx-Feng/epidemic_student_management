const express = require('express')
const usersRouter = require('./routes/users')
const accountsRouter = require('./routes/accounts')

const app = express()

// 全系统允许跨域处理，放在所有API前面
app.all("*", function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*")
  // 允许的header类型
  res.header("Access-Control-Allow-Headers", "*")
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "*")
  if (req.method.toLowerCase() === 'options')
    res.sendStatus(200)
  else
    next()
})

// 解析表单请求体: application/json
app.use(express.json())
// 解析表单请求体: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// 挂载路由，并且给路由限定了访问前缀
app.use('/users', usersRouter)
app.use('/accounts', accountsRouter)

// // 通常在所有的路由之后配置处理404内容
// app.use((req,res,next) => {
//   res.status(404).send('404 Not Found.')
// })
//
// // 在所有中间件之后挂载错误处理中间件
// app.use((err, req, res, next) => {
//   console.log('错误', err)
// })

// 服务器监听5000端口
app.listen(5000, () => {
  console.log(`Server running at http://localhost:5000/`)
})

module.exports = app
