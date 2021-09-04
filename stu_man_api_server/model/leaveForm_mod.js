
module.exports = class profile_mod extends require('./model') {

  // 根据id获取假条列表
  static getLeaveFormListById(id, index) {
    return new Promise((resolve, reject) => {
      // 如果url中有Params，根据index模糊查询, 否则默认全部查询
      let sql
      if (index) {
        // 除了获取假条的信息，还要根据counselor_id获取一下辅导员的名字
        sql = "select leaveform.*,counselor.name as 'counselor_name' " +
            "from leaveform,counselor " +
            "where leaveform.s_id='" + id + "' and leaveform.start_time like '%"+ index +"%' and leaveform.counselor_id=counselor.id"
      } else {
        sql = "select leaveform.*,counselor.name as 'counselor_name' " +
            "from leaveform,counselor " +
            "where leaveform.s_id='" + id + "' and leaveform.counselor_id=counselor.id"
      }
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 新建假条
  static createLeaveForm(id,start_time,end_time,reason,place,state,counselor_name,createdTime){
    return new Promise((resolve, reject) => {
      let sql = "select id" + " from counselor where name='" + counselor_name + "'"
      console.log(sql)
      this.query(sql).then(result_1 => {
        sql = "insert into" +
            " leaveform(s_id,start_time,end_time,reason,place,state,counselor_id,createdTime) " +
            "values('" + id + "','" + start_time + "','" + end_time + "','" + reason + "','" + place + "','" +  state + "','" + result_1[0]['id'] + "','" + createdTime + "')"
        console.log(sql)
        this.query(sql).then(result => {
          resolve(result)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据用户id和假条的createdTime获取某张假条信息
  static getLeaveFormById(s_id, createdTime) {
    return new Promise((resolve, reject) => {
      const sql = "select leaveform.*,counselor.name as 'counselor_name' " +
          "from leaveform,counselor where leaveform.s_id='" + s_id + "' and leaveform.createdTime='" + createdTime + "' and leaveform.counselor_id=counselor.id"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据用户id和假条的createdTime删除假条
  static deleteLeaveFormById(s_id,createdTime){
    return new Promise(((resolve, reject) => {
      let sql = "delete from" + " leaveform where s_id='" + s_id + "' and createdTime='" + createdTime + "'"
      console.log(sql)
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
      // 如果url中有Params，根据index模糊查询, 否则默认全部查询
      let sql
      if (index) {
        sql = sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student where leaveform.s_id like '%" + index + "%' and leaveform.counselor_id='" + id + "' and state='" + state + "' and leaveform.s_id=student.id"
      } else {
        sql = "select leaveform.*,student.name,student.tel" +
            " from leaveform,student where counselor_id='" + id + "' and state='" + state + "' and leaveform.s_id=student.id"
      }
      console.log(sql)
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
          "set state='" + state + "' where s_id='" + s_id + "' and createdTime='" + createTime + "'"
      console.log(sql)
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}