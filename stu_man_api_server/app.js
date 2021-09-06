const express = require('express')
const cors = require('cors')
const accountsRouter = require('./routes/accounts')
const profileRouter = require('./routes/profile')
const leaveFormRouter = require('./routes/leaveForm')
const temFormRouter = require('./routes/temForm')

const app = express()

// 解决跨域问题
app.use(cors())

// 分别解析表单请求体: application/json 和 application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 挂载路由
app.use(accountsRouter)
app.use('/profile', profileRouter)
app.use('/leaveforms', leaveFormRouter)
app.use('/temforms', temFormRouter)

// 在所有中间件之后挂载错误处理中间件
app.use((err, req, res, next) => {
  console.log('错误：', err)
})

// 服务端监听5000端口
app.listen(5000, () => {
  console.log(`Server running at http://localhost:5000/`)
})

module.exports = app
