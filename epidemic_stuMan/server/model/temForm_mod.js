
module.exports = class temForm_mod extends require('./model') {

  // 根据id获取体温表列表
  static getTemFormListById(id, query) {
    return new Promise((resolve, reject) => {
      let sql = ""
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
  static createTemForm(id,temp,fever,counselor_name,createdTime){
    return new Promise((resolve, reject) => {
      let sql1 = "select id from counselor where name='" + counselor_name + "'"
      let sql2 = "select max(temform.sn) as num from temform"
      this.query2(sql1, sql2).then(result => {
        let sn = result[1][0]['num'] + 1 // 体温表序号为当前表中序的号最大值 + 1
        let sql = "insert into" +
            " temform(s_id,temperature,fever,counselor_id,createdTime,sn) " +
            "values('" + id + "','" + temp + "','" + fever  + "','" + result[0][0]['id'] + "','" + createdTime + "'," + sn + ")"
        this.query(sql).then(result => {
          resolve(result)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据体温表的序号sn获取某张体温表信息
  static getTemFormBySn(sn) {
    return new Promise((resolve, reject) => {
      const sql = "select temform.*,counselor.name as 'counselor_name' " +
          "from temform,counselor " +
          "where temform.sn='" + sn + "' and temform.counselor_id=counselor.id"
      this.query(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 更新体温表信息
  static updateTemFormBySn(sn,body) {
    return new Promise((resolve, reject) => {
      let sql1 = "update temform" +
          " set temperature='"+ body.temperature + "',fever='" + body.fever + "' " +
          "where sn='" + sn + "'"
      let sql2 = "update counselor set name='" + body.counselor_name + "' " +
          "where id='" + body.counselor_id + "'"
      this.query2(sql1,sql2).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 根据体温表的sn删除体温表
  static deleteTemFormBySn(sn){
    return new Promise((resolve, reject) => {
      let sql = "delete from temform where sn='" + sn + "'"
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
      let sql = ""
      if (query) {
        if (select === '发热') {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id like '%"+ query +"%' and temform.fever='是'"
        } else {
          sql = "select temform.*,student.name as 's_name' " +
              "from temform,student " +
              "where temform.counselor_id='" + id + "' and temform.s_id like '%"+ query +"%'"
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