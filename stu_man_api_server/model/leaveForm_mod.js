
module.exports = class leaveForm_mod extends require('./model') {

  // 学生根据id获取假条
  static getLFListById(id, query) {
    return new Promise((resolve, reject) => {
      let sql
      if (query) {
        // 除了获取假条的信息，还要根据counselor_id获取一下辅导员的名字
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
      let sql = "select id" +
          " from counselor where name='" + body.counselor_name + "'"
      this.query(sql).then(result_1 => {
        sql = "select max(leaveform.sn) as max_num" +
            " from leaveform"
        this.query(sql).then(result_2 => {
          // 假条序号为当前数据库中序号最大值+1
          let sn = result_2[0]['max_num'] + 1
          sql = "insert into" +
              " leaveform(s_id,start_time,end_time,reason,place,state,counselor_id,createdTime,sn) " +
              "values('" + id + "','" + body.start_time + "','" + body.end_time + "','" + body.reason + "','" + body.place + "','" +  body.state + "','" + result_1[0]['id'] + "','" + createdTime + "'," + sn + ")"
          this.query(sql).then(result => {
            resolve(result)
          })
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据学生id和假条的createdTime获取假条信息
  static getLFById(s_id, createdTime) {
    return new Promise((resolve, reject) => {
      const sql = "select leaveform.*,counselor.name as 'counselor_name' " +
          "from leaveform,counselor " +
          "where leaveform.s_id='" + s_id + "' and leaveform.createdTime='" + createdTime + "' and leaveform.counselor_id=counselor.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据学生id和假条的createdTime更新假条
  static updateLFById(id,body,createdTime) {
    return new Promise((resolve, reject) => {
      let sql = "update leaveform" +
          " set start_time='"+ body.start_time + "',end_time='" + body.end_time + "',place='" + body.place + "',reason='" + body.reason + "' where s_id='" + id + "' and createdTime='" + createdTime + "'"
      this.query(sql).then(result_1 => {
        sql = "update counselor" +
            " set name='" + body.counselor_name + "' where id='" + body.counselor_id + "'"
        this.query(sql).then(result_2 => {
          resolve(result_2)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据学生id和假条的createdTime删除假条
  static deleteLFById(s_id,createdTime){
    return new Promise(((resolve, reject) => {
      let sql = "delete from" +
          " leaveform where s_id='" + s_id + "' and createdTime='" + createdTime + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    }))
  }

  // 根据辅导员id和假条的state获取假条
  static getDiffLF(id, state, index) {
    return new Promise((resolve, reject) => {
      let sql
      if (index) {
        sql = sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student " +
            "where leaveform.s_id like '%" + index + "%' and leaveform.counselor_id='" + id + "' and state='" + state + "' and leaveform.s_id=student.id"
      } else {
        sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student " +
            "where counselor_id='" + id + "' and state='" + state + "' and leaveform.s_id=student.id"
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 更新假条的state
  static updateLFState(s_id, createTime, state) {
    return new Promise((resolve, reject) => {
      const sql = "update leaveform " +
          "set state='" + state + "' " +
          "where s_id='" + s_id + "' and createdTime='" + createTime + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}