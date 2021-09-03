const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '511511',
  port: '3306',
  database: 'stu_man'
})

// 封装一个数据库模型基类
module.exports = class Model {
  static query(sql, params){
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error(err)
          connection.release()
        } else {
          connection.multipleStatements = true   // 让mysql能执行多条sql语句
          // query执行sql语句
          connection.query(sql, params, (err,results)=>{
            if (err){
              reject(err)
              // connection.release()
            } else {
              resolve(results)
            }
            // 结束会话，释放链接
            connection.release()
          })
        }
      })
    })
  }
}
