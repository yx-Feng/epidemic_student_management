<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>假条管理</el-breadcrumb-item>
      <el-breadcrumb-item>审批未通过</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 查询假条的搜索框 -->
        <el-col :span="10">
          <el-input placeholder="根据学生的学号搜索" v-model="queryInfo.query" clearable @clear="getLeaveFormList">
            <template #append>
              <el-button :icon="icon.Search" @click="getLeaveFormList" />
            </template>
          </el-input>
        </el-col>
        <!-- 刷新列表的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="refreshLFList">刷新列表</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="leaveList" border stripe style="width: 100%">
        <el-table-column type="index" :index="setIndex"></el-table-column>
        <!-- 不显示假条在数据库中的序号 -->
        <el-table-column label="序号" prop="sn" v-if="false"></el-table-column>
        <el-table-column label="学号" prop="s_id" width="100"></el-table-column>
        <el-table-column label="姓名" prop="name" width="80"></el-table-column>
        <el-table-column label="请假开始时间" prop="start_time" width="120"></el-table-column>
        <el-table-column label="请假结束时间" prop="end_time" width="120"></el-table-column>
        <el-table-column label="请假原因" prop="reason"></el-table-column>
        <el-table-column label="去向" prop="place"></el-table-column>
        <el-table-column label="联系方式" prop="tel" width="120"></el-table-column>
        <el-table-column label="假条创建时间" prop="createdTime"></el-table-column>
        <el-table-column label="允许" width="100px">
          <template #default="scope">
            <el-switch v-model="scope.row.state_ok" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" v-model:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
export default {
  data () {
    return {
      // 获取假条列表的参数对象(查询的依据)
      queryInfo: {
        query: '', // 搜索框输入的内容
        pagesize: 3, // 每页的数据条数(默认每页显示3条)
        pagenum: 1 // 页号(默认是第一页)
      },
      id: '', // 辅导员的id
      leaveList: [], // 待审批假条列表
      total: 0, // 能获得的待审批假条总数
      switch_state_ok: false, // ok和no两个switch的状态
      switch_state_no: false,
      icon: {
        Search: Search
      }
    }
  },
  created () {
    this.id = window.sessionStorage.getItem('id')
    this.getLeaveFormList()
  },
  methods: {
    // 根据辅导员id获取待审批假条列表
    async getLeaveFormList () {
      try {
        const { data: res } = await this.$http.get('/lf/coun/' + this.id + '/1', {
          params: this.queryInfo
        })
        this.total = res.total
        this.leaveList = res.data
      } catch (err) {
        return this.$message.success('获取假条失败！')
      }
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
    // 监听 switch 开关状态的改变
    async stateChange (leaveFormInfo) {
      try {
        await this.$http.put(
          `lf/${leaveFormInfo.sn}/state/${leaveFormInfo.state_ok}`
        )
      } catch (err) {
        leaveFormInfo.state_ok = !leaveFormInfo.state_ok // 没更新，switch还是保持原来的状态
      }
    },
    // 刷新假条列表
    refreshLFList () {
      this.getLeaveFormList()
      this.$message.success('更新列表成功！')
    },
    // 设置体温表在表格中的序号
    setIndex (index) {
      return index + 1 + this.queryInfo.pagesize * (this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style scoped>
</style>
