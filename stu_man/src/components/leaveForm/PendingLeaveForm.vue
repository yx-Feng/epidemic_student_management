<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>假条管理</el-breadcrumb-item>
      <el-breadcrumb-item>待审批</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
    <!-- 刷新列表的按钮 -->
      <el-button type="primary" style="float: right;margin-bottom: 15px" @click="refreshLFList">刷新列表</el-button>
      <!-- 用户列表区域 -->
      <el-table :data="leaveList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="学号" prop="s_id" width="100"></el-table-column>
        <el-table-column label="姓名" prop="name" width="80"></el-table-column>
        <el-table-column label="请假开始时间" prop="start_time" width="120"></el-table-column>
        <el-table-column label="请假结束时间" prop="end_time" width="120"></el-table-column>
        <el-table-column label="请假原因" prop="reason"></el-table-column>
        <el-table-column label="去向" prop="place"></el-table-column>
        <el-table-column label="联系方式" prop="tel" width="120"></el-table-column>
        <el-table-column label="假条创建时间" prop="createdTime"></el-table-column>
        <el-table-column label="是否允许" width="100px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state_ok" active-text="OK" @change="stateChangeOk(scope.row)"></el-switch>
            <el-switch v-model="scope.row.state_no" active-text="NO" @change="stateChangeNo(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取假条列表的参数对象(查询的依据)
      queryInfo: {
        // 每页的数据条数(默认每页显示3条)
        pagesize: 3,
        // 页号(默认是第一页)
        pagenum: 1
      },
      // 辅导员的id
      id: '',
      // 待审批假条列表
      leaveList: [],
      // 能获得的待审批假条总数
      total: 0,
      // ok和no两个switch的状态
      switch_state_ok: false,
      switch_state_no: false
    }
  },
  created () {
    this.id = window.sessionStorage.getItem('id')
    this.getLeaveFormList()
  },
  methods: {
    // 根据辅导员id获取待审批假条列表
    async getLeaveFormList () {
      const { data: res } = await this.$http.get('/leaveforms/coun/' + this.id + '/0', {
        params: this.queryInfo
      })
      if (res[res.length - 1].status === '404') {
        return this.$message.success('获取到0张假条！')
      }
      // 这里的total始终是所有能获取到的假条数量
      this.total = res[res.length - 1].length
      res.pop()
      this.leaveList = res
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getLeaveFormList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getLeaveFormList()
    },
    // 监听 ok的 switch 开关状态的改变
    async stateChangeOk (leaveFormInfo) {
      if (leaveFormInfo.state_ok === true && leaveFormInfo.state_no && leaveFormInfo.state_no === true) {
        leaveFormInfo.state_no = false
      }
      // 当两个switch开关都关闭，不去更新假条列表
      if (leaveFormInfo.state_ok && leaveFormInfo.state_no && leaveFormInfo.state_ok === false && leaveFormInfo.state_no === false) return
      const { data: res } = await this.$http.put(
        `leaveforms/${leaveFormInfo.s_id}/${leaveFormInfo.createdTime}/state/${leaveFormInfo.state_ok}`
      )
      if (res[res.length - 1].status !== '200') {
        // 没更新，switch还是保持原来的状态
        leaveFormInfo.state_ok = !leaveFormInfo.state_ok
      }
    },
    // 监听 switch 开关状态的改变
    async stateChangeNo (leaveFormInfo) {
      if (leaveFormInfo.state_no === true && leaveFormInfo.state_ok && leaveFormInfo.state_ok === true) {
        leaveFormInfo.state_ok = false
      }
      // 当两个switch开关都关闭，不去更新假条列表
      if (leaveFormInfo.state_ok && leaveFormInfo.state_no && leaveFormInfo.state_ok === false && leaveFormInfo.state_no === false) return
      const { data: res } = await this.$http.put(
        `leaveforms/${leaveFormInfo.s_id}/${leaveFormInfo.createdTime}/state/${leaveFormInfo.state_ok}`
      )
      if (res[res.length - 1].status !== '200') {
        // 没更新，switch还是保持原来的状态
        leaveFormInfo.state_ok = !leaveFormInfo.state_ok
      }
    },
    // 刷新假条列表
    refreshLFList () {
      this.getLeaveFormList()
      this.$message.success('更新列表成功！')
    }
  }
}
</script>

<style scoped>
</style>
