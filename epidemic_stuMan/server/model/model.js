const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'stu_man'
})

// 封装一个数据库模型基类
module.exports = class Model {
  // 执行一个sql语句
  static query(sql) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release() // 结束会话，释放链接
        } else {
          // query执行sql语句
          connection.query(sql, (err,result)=>{
            if (err){
              reject(err)
            } else {
              resolve(result)
            }  
            connection.release()
          })
        }
      })
    })
  }
  // 执行两个sql语句
  static query2(sql1,sql2) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release()
        } else {
          connection.query(sql1, (err1, result_1) => {
            connection.query(sql2, (err2, result_2) => {
              if (err1) {
                reject(err1)
              } else if (err2) {
                reject(err2)
              } else {
                resolve([result_1, result_2])
              }
            })
            connection.release()
          })
        }
      })
    })
  }
}
