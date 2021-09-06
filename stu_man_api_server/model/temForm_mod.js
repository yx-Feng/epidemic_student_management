
module.exports = class temForm_mod extends require('./model') {

  // 根据id获取体温表列表
  static getTemFormListById(id, query) {
    return new Promise((resolve, reject) => {
      let sql
      if (query) {
        // 除了获取体温表的信息，还要根据counselor_id获取一下辅导员的名字
        sql = "select temform.*,counselor.name as 'counselor_name' " +
            "from temform,counselor " +
            "where temform.s_id='" + id + "' and temform.createdTime like '%"+ query +"%' and temform.counselor_id=counselor.id"
      } else {
        sql = "select temform.*,counselor.name as 'counselor_name' " +
            "from temform,counselor " +
            "where temform.s_id='" + id + "' and temform.counselor_id=counselor.id"
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 新建体温表
  static createTemForm(id,temperature,fever,counselor_name,createdTime){
    return new Promise((resolve, reject) => {
      let sql = "select id" +
          " from counselor where name='" + counselor_name + "'"
      this.query(sql).then(result_1 => {
        sql = "select max(temform.sn) as num" +
            " from temform"
        this.query(sql).then(result_2 => {
          // 体温表序号为当前数据库中的序号最大值 + 1
          let sn = result_2[0]['num'] + 1
          sql = "insert into" +
              " temform(s_id,temperature,fever,counselor_id,createdTime,sn) " +
              "values('" + id + "','" + temperature + "','" + fever  + "','" + result_1[0]['id'] + "','" + createdTime + "'," + sn + ")"
          this.query(sql).then(result => {
            resolve(result)
          })
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据用户id和体温表的createdTime获取某张体温表信息
  static getTemFormById(s_id, createdTime) {
    return new Promise((resolve, reject) => {
      const sql = "select temform.*,counselor.name as 'counselor_name' " +
          "from temform,counselor " +
          "where temform.s_id='" + s_id + "' and temform.createdTime='" + createdTime + "' and temform.counselor_id=counselor.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 更新体温表信息
  static updateTemFormById(id,body,createdTime) {
    return new Promise((resolve, reject) => {
      let sql = "update temform" +
          " set temperature='"+ body.temperature + "',fever='" + body.fever + "' " +
          "where s_id='" + id + "' and createdTime='" + createdTime + "'"
      this.query(sql).then(result_1 => {
        sql = "update counselor" +
            " set name='" + body.counselor_name + "' " +
            "where id='" + body.counselor_id + "'"
        this.query(sql).then(result_2 => {
          resolve(result_2)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据用户id和假条的createdTime删除假条
  static deleteTemFormById(s_id,createdTime){
    return new Promise((resolve, reject) => {
      let sql = "delete " +
          "from temform " +
          "where s_id='" + s_id + "' and createdTime='" + createdTime + "'"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据辅导员id获取体温表列表
  static getTFListCounById(id, query, select) {
    return new Promise((resolve, reject) => {
      let sql
      if (query) {
        if (select === '发热') {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id like '%"+ query +"%' and temform.s_id=student.id and temform.fever='是'"
        } else {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id like '%"+ query +"%' and temform.s_id=student.id"
        }
      } else {
        if (select === '发热') {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id=student.id and temform.fever='是'"
        } else {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id=student.id"
        }
      }
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }
}