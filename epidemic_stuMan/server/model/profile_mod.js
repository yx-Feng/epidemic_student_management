
module.exports = class profile_mod extends require('./model') {

  // 根据id获取学生用户信息(需要从user和student两张表中获取)
  static getStuProfileById(id) {
    return new Promise((resolve, reject) => {
      let sql = "select * from student,user where student.id='" + id + "' and student.id=user.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据id更新学生用户信息(需要更新user和student两张表)
  static updateStuProfileById(id, body){
    return new Promise((resolve, reject) => {
      let sql1 = "update student set name='" + body.name + "',class='" + body.class + "',sex='" + body.sex + "',college='" + body.college + "',tel='" + body.tel + "' where id='" + id + "'"
      let sql2 = "update user set pwd='" + body.pwd + "' where id='" + id + "'"
      this.query2(sql1, sql2).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据id获取辅导员个人信息(需要从user和counselor两张表中获取)
  static getCounProfileById(id){
    return new Promise((resolve, reject) => {
      let sql = "select * from counselor,user where counselor.id='" + id + "' and counselor.id=user.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据id更新辅导员用户信息(需要更新user和counselor两张表)
  static updateCounProfileById(id, body){
    return new Promise((resolve, reject) => {
      let sql1 = "update counselor" +
          " set name='" + body.name + "',sex='" + body.sex + "',college='" + body.college + "',tel='" + body.tel + "'" +
          " where id='" + id + "'"
      let sql2 = "update user" +
      " set pwd='" + body.pwd + "' where id='" + id + "'"
      this.query2(sql1, sql2).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}