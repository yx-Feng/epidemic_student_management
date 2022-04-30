
module.exports = class leaveForm_mod extends require('./model') {

  // 学生根据id获取假条
  static getLFListById(id, query) {
    return new Promise((resolve, reject) => {
      let sql = ""
      if (query) {
        // 除了获取假条的信息,还要根据counselor_id获取一下辅导员的名字
        sql = "select leaveform.*,counselor.name as 'counselor_name' " +
            "from leaveform,counselor " +
            "where leaveform.s_id='" + id + "' and leaveform.createdTime like '%"+ query +"%' and leaveform.counselor_id=counselor.id"
      } else {
        sql = "select leaveform.*,counselor.name as 'counselor_name' " +
            "from leaveform,counselor " +
            "where leaveform.s_id='" + id + "' and leaveform.counselor_id=counselor.id"
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 新建假条
  static addLF(id,body,createdTime){
    return new Promise((resolve, reject) => {
      let sql1 = "select id from counselor where name='" + body.counselor_name + "'"
      let sql2 = "select max(leaveform.sn) as max_num from leaveform"
      this.query2(sql1, sql2).then(result => {
        let sn = result[1][0]['max_num'] + 1 // 假条序号为当前数据库中序号最大值+1
        let sql3 = "insert into" +
              " leaveform(s_id,start_time,end_time,reason,place,state,counselor_id,createdTime,sn) " +
              "values('" + id + "','" + body.start_time + "','" + body.end_time + "','" + body.reason + "','" + body.place + "','" +  body.state + "','" + result[0][0]['id'] + "','" + createdTime + "'," + sn + ")"
        this.query(sql3).then(result => {
          resolve(result)
        })  
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据假条的序号sn获取假条信息
  static getLFBySn(sn) {
    return new Promise((resolve, reject) => {
      const sql = "select leaveform.*,counselor.name as 'counselor_name' " +
          "from leaveform,counselor " +
          "where leaveform.sn='" + sn + "' and leaveform.counselor_id=counselor.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据假条的序号sn更新假条
  static updateLFBySn(sn,body) {
    return new Promise((resolve, reject) => {
      let sql1 = "update leaveform" +
          " set start_time='"+ body.start_time + "',end_time='" + body.end_time + "',place='" + body.place + "',reason='" + body.reason + "' where sn='" + sn + "'"
      let sql2 = "update counselor" +
      " set name='" + body.counselor_name + "' where id='" + body.counselor_id + "'"
      this.query2(sql1,sql2).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据假条的序号sn删除假条
  static deleteLFBySn(sn){
    return new Promise(((resolve, reject) => {
      let sql = "delete from leaveform where sn='" + sn + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }

  // 根据辅导员id、假条的state、搜索关键词获取假条
  static getDiffLF(id, state, index) {
    return new Promise((resolve, reject) => {
      let sql = ""
      if (index) {
        sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student " +
            "where leaveform.s_id like '%" + index + "%' and leaveform.counselor_id='" + id + "' and state='" + state + "'"
      } else {
        sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student " +
            "where leaveform.counselor_id='" + id + "' and state='" + state + "' and leaveform.s_id=student.id"
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 更新假条的state
  static updateLFState(sn, state) {
    return new Promise((resolve, reject) => {
      const sql = "update leaveform set state='" + state + "' where sn='" + sn + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}